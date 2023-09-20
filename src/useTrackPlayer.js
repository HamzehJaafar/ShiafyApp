import {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import TrackPlayer from 'react-native-track-player';
import {PROGRESS} from './redux/actions';
import {
  Capability,
  AppKilledPlaybackBehavior,
} from 'react-native-track-player';
import {playNext, playPrevious, seek} from './playerFunctions';

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
          await TrackPlayer.add({
            id: currentSong.id,
            url: currentSong.source.url,
            title: currentSong.title,
            artwork: currentSong.cover.url,
            artist: currentSong.artists[0]
              ? currentSong?.artists[0]?.name
              : 'unknown',
          });

          TrackPlayer.play();
          if (currentSong.duration) {
            dispatch({
              type: 'SET_LENGTH',
              totalLength: currentSong.duration,
            });
          }
        }
      } catch (error) {
        console.error('Error setting up player:', error);
      }
    };

    setupPlayer();

    const progressInterval = setInterval(async () => {
      const currentPosition = await TrackPlayer.getPosition();
      dispatch({type: PROGRESS, progressTime: currentPosition});

      const duration = await TrackPlayer.getDuration();
      if (!currentSong?.duration) {
        dispatch({type: 'SET_LENGTH', totalLength: duration}); // might be a duplicate ?
      }
    }, 1000);

    return () => {
      clearInterval(progressInterval);
    };
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
