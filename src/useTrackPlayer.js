import {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import TrackPlayer from 'react-native-track-player';
import {PROGRESS} from './redux/actions';
import {
  Capability,
  AppKilledPlaybackBehavior,
} from 'react-native-track-player';
import {playNext, playPrevious, seek} from './playerFunctions';
import { getSongMetadata } from './helpers/storageHelper';
import RNFS from 'react-native-fs';

export const useTrackPlayer = () => {
  const {currentSong, isPlaying} = useSelector(state => ({
    currentSong: state.currentSong,
    isPlaying: state.isPlaying,
  }));

  const dispatch = useDispatch();

  useEffect(() => {
    setupPlayer();
    trackPlayerRemoteEvents(dispatch);
  }, [dispatch]); // setup player only on mount

  useEffect(() => {
    isPlaying ? TrackPlayer.play() : TrackPlayer.pause();
  }, [isPlaying]);

  useEffect(() => {
    const setupPlayer = async () => {
      try {
        await TrackPlayer.reset();
        if (currentSong) {

          const metadata = await getSongMetadata(currentSong.id);
          const songUrl = metadata && metadata.localPath ? `file://${metadata.localPath}` : currentSong.source.url;

          const fileExists = await RNFS.exists(songUrl);
          console.log(`File exists at ${songUrl}: ${fileExists}`);
          
          await TrackPlayer.add({
            id: currentSong.id,
            url: songUrl,
            title: currentSong.title,
            artwork: currentSong.cover.url,
            artist: currentSong.artists[0]
              ? currentSong?.artists[0]?.name
              : 'unknown',
          }).catch(error => {
            console.error("Error adding track:", error);
          });

          TrackPlayer.play();
          if (currentSong.duration) {
            dispatch({
              type: 'SET_LENGTH',
              totalLength: currentSong.duration,
            });
          } else {
            const duration = await TrackPlayer.getDuration();
            dispatch({type: 'SET_LENGTH', totalLength: duration}); // might be a duplicate ?

          }
        }
      } catch (error) {
        console.error('Error setting up player:', error);
      }
    };

    setupPlayer();

  }, [currentSong, dispatch]);
};

export async function trackPlayerRemoteEvents(dispatch) {
  const events = [
    TrackPlayer.addEventListener('remote-play', () => {
      console.log('remote-play');
      TrackPlayer.play();
    }),
    TrackPlayer.addEventListener('remote-pause', () => {
      console.log('remote-pause');
      TrackPlayer.pause();
    }),
    TrackPlayer.addEventListener('remote-stop', () => {
      console.log('remote-stop');
      TrackPlayer.stop();
    }),
    TrackPlayer.addEventListener('remote-next', () => {
      console.log('remote-next');
      playNext(dispatch);

      // TrackPlayer.skipToNext();
    }),
    TrackPlayer.addEventListener('remote-previous', () => {
      console.log('remote-previous');
      //TrackPlayer.skipToPrevious();
      playPrevious(dispatch);
    }),

    TrackPlayer.addEventListener('remote-seek', value => {
      console.log(value);
      //TrackPlayer.skipToPrevious();
      seek(value.position, dispatch);
    }),
  ];

  return () => {
    events.forEach(e => e.remove());
  };
}

export async function setupPlayer() {
  let isSetup = false;
  try {
    if (!isSetup) {
      await TrackPlayer.setupPlayer();

      await TrackPlayer.updateOptions({
        android: {
          appKilledPlaybackBehavior:
            AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
        },
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.SeekTo,
        ],
        compactCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
        ],
        progressUpdateEventInterval: 2,
      });
    }

    await TrackPlayer.getCurrentTrack();
    isSetup = true;
  } catch {
    isSetup = true;
  } finally {
    return isSetup;
  }
}
