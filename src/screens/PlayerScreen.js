import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  AppState,
  PanResponder,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Icon} from 'react-native-elements';
import Slider from '@react-native-community/slider';

import {
  PAUSE,
  NEXT_SONG,
  LAST_SONG,
  SEEK_PROGRESS,
  POINT_SONG,
  SWITCH_MODE,
  SHUFFLE_MODE,
  PROGRESS,
} from '../redux/actions';
import TrackPlayer, {
  useTrackPlayerEvents,
  TrackPlayerEvents,
} from 'react-native-track-player';

const screenWidth = Dimensions.get('window').width;

const PlayerScreen = ({route, navigation}) => {
  const dispatch = useDispatch();
  const {
    playList,
    currentSong,
    isPlaying,
    progressTime,
    totalLength,
    shuffleMode,
    playMode,
  } = useSelector(state => state);
  const [seekValue, setSeekValue] = useState(progressTime);

  const continuePlayingRef = useRef(false);
  const isPlayerInitialized = useRef(false);
  const [currentPosition, setCurrentPosition] = useState(0);

  useEffect(() => {
    if (route.params && route.params.continue) {
      continuePlayingRef.current = route.params.continue;
    }

    if (route.params && route.params.musicData) {
      const {musicData, song} = route.params;
      dispatch({type: POINT_SONG, playList: musicData, song});
    }
  }, [route.params]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dx > 50) {
        prevSong();
      } else if (gestureState.dx < -50) {
        nextSong();
      } else if (gestureState.dy > 50) {
        navigation.goBack();
      }
    },
  });

  useEffect(() => {
    async function setupPlayer() {
      console.log('setup player');
      await TrackPlayer.setupPlayer();
      isPlayerInitialized.current = true;
    }
    setupPlayer();
  }, []);

  useEffect(() => {
    const setupPlayer = async () => {
      try {
        if (!continuePlayingRef.current) {
          await TrackPlayer.reset();
        }

        if (currentSong) {
          await TrackPlayer.add({
            id: currentSong.id,
            url: currentSong.audioUrl,
            title: currentSong.title,
            artist: currentSong.artist,
            artwork: currentSong.albumArtUrl,
          });

          if (!continuePlayingRef.current) {
            TrackPlayer.play();
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
      dispatch({type: 'SET_LENGTH', totalLength: duration});
    }, 1000);

    return () => {
      clearInterval(progressInterval);
      continuePlayingRef.current = false;
    };
  }, [currentSong]);

  useEffect(() => {
    isPlaying ? TrackPlayer.play() : TrackPlayer.pause();
  }, [isPlaying]);

  const togglePlayback = () => {
    dispatch({type: PAUSE});
  };

  const nextSong = () => {
    dispatch({type: NEXT_SONG});
  };

  const prevSong = () => {
    dispatch({type: LAST_SONG});
  };

  const seek = async value => {
    dispatch({type: PROGRESS, progressTime: value});
    await TrackPlayer.seekTo(value);
  };

  const toggleShuffle = () => {
    dispatch({type: SHUFFLE_MODE});
  };

  const toggleRepeat = () => {
    dispatch({type: SWITCH_MODE});
  };

  if (!currentSong) {
    return null;
  }

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <Image source={{uri: currentSong.albumArtUrl}} style={styles.albumArt} />
      <Text style={styles.title}>{currentSong.title}</Text>
      <Text style={styles.artist}>{currentSong.artist}</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={totalLength}
        value={progressTime}
        minimumTrackTintColor="#1DB954"
        maximumTrackTintColor="#FFFFFF"
        thumbTintColor="#1DB954"
        onValueChange={value => seek(value)}
      />
      <View style={styles.buttons}>
        <TouchableOpacity onPress={toggleShuffle}>
          <Icon
            name={shuffleMode ? 'shuffle' : 'shuffle-disabled'}
            type="material-community"
            color="#FFFFFF"
            size={30}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={prevSong}>
          <Icon
            name="skip-previous"
            type="material"
            color="#FFFFFF"
            size={40}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={togglePlayback}>
          <Icon
            name={isPlaying ? 'pause' : 'play-arrow'}
            type="material"
            color="#FFFFFF"
            size={50}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={nextSong}>
          <Icon name="skip-next" type="material" color="#FFFFFF" size={40} />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleRepeat}>
          <Icon
            name={playMode === 'loop' ? 'repeat' : 'repeat-disabled'}
            type="material-community"
            color="#FFFFFF"
            size={30}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.time}>
        {Math.floor(progressTime / 60)}:
        {(progressTime % 60).toFixed(0).padStart(2, '0')} /{' '}
        {Math.floor(totalLength / 60)}:
        {(totalLength % 60).toFixed(0).padStart(2, '0')}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#121212',
  },
  albumArt: {
    width: screenWidth * 0.8,
    height: screenWidth * 0.8,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 10,
  },
  artist: {
    fontSize: 16,
    color: '#FFF',
    marginTop: 5,
  },
  slider: {
    width: screenWidth * 0.8,
    marginTop: 20,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    width: screenWidth * 0.8,
  },
  time: {
    paddingTop: 20,
    color: '#fff',
  },
});

export default PlayerScreen;
