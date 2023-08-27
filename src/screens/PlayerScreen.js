/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useMemo, useRef, useState, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
  FlatList,
} from 'react-native';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
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
import TrackPlayer from 'react-native-track-player';
import {SafeAreaView} from 'react-native-safe-area-context';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const PlayerScreen = ({route, navigation}) => {
  const dispatch = useDispatch();
  const {
    playList,
    currentSong,
    currentIndex,
    isPlaying,
    progressTime,
    totalLength,
    shuffleMode,
    playMode,
  } = useSelector(state => state, shallowEqual);

  const continuePlayingRef = useRef(false);
  const flatListRef = useRef();
  const [songSwitching, setSongSwitching] = useState(false); // Add songSwitching flag
  const playerOffsetX = useRef(new Animated.Value(0)).current;
  const playerPosition = useRef(new Animated.Value(0)).current;

  const togglePlayback = useCallback(() => dispatch({type: PAUSE}), [dispatch]);
  const fnextSong = useCallback(() => dispatch({type: NEXT_SONG}), [dispatch]);
  const fprevSong = useCallback(() => dispatch({type: LAST_SONG}), [dispatch]);
  const toggleShuffle = useCallback(
    () => dispatch({type: SHUFFLE_MODE}),
    [dispatch],
  );
  const toggleRepeat = useCallback(
    () => dispatch({type: SWITCH_MODE}),
    [dispatch],
  );
  const pan = useRef(new Animated.ValueXY()).current;

  useEffect(() => {
    if (route.params && route.params.continue) {
      continuePlayingRef.current = route.params.continue;
    }

    if (route.params && route.params.musicData) {
      const {musicData, song} = route.params;
      dispatch({type: POINT_SONG, playList: musicData, song});
      dispatch({type: PROGRESS, progressTime: 0}); // Reset progress time when switching songs
    }
  }, [route.params]);

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({
        animated: true,
        index: currentIndex,
      });
    }
  }, [currentIndex]);
  const handleScroll = useCallback(
    event => {
      const newIndex = Math.floor(
        event.nativeEvent.contentOffset.x / screenWidth,
      );
      if (!songSwitching && newIndex !== currentIndex) {
        setSongSwitching(true); // Set songSwitching flag to true
        const diff = Math.abs(newIndex - currentIndex);
        let songSwitched = false;

        dispatch({type: newIndex > currentIndex ? NEXT_SONG : LAST_SONG});
        setTimeout(() => {
          setSongSwitching(false); // Set songSwitching flag to false after the song switch
        }, 500);
      }
    },
    [currentIndex, songSwitching],
  );
  const nextSong = useCallback(() => {
    if (!songSwitching) {
      // Check if songSwitching flag is false
      setSongSwitching(true); // Set songSwitching flag to true
      dispatch({type: NEXT_SONG});
      setTimeout(() => {
        setSongSwitching(false); // Set songSwitching flag to false after the song switch
      }, 500);
    }
  }, [songSwitching]);

  const prevSong = useCallback(() => {
    if (!songSwitching) {
      // Check if songSwitching flag is false
      setSongSwitching(true); // Set songSwitching flag to true
      dispatch({type: LAST_SONG});
      setTimeout(() => {
        setSongSwitching(false); // Set songSwitching flag to false after the song switch
      }, 500);
    }
  }, [songSwitching]);

  const seek = useCallback(
    async value => {
      await TrackPlayer.seekTo(value);
    },
    [dispatch],
  );

  const renderItem = useCallback(({item}) => <PlayerItem item={item} />, []);

  if (!currentSong) {
    return null;
  }

  return (
    <Animated.View
      style={[styles.container, {transform: [{translateY: playerPosition}]}]}>
      <AnimatedFlatList
        ref={flatListRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        overScrollMode="never"
        getItemLayout={(data, index) => ({
          length: screenWidth,
          offset: screenWidth * index,
          index,
        })}
        onMomentumScrollEnd={Animated.event(
          [{nativeEvent: {contentOffset: {x: playerOffsetX}}}],
          {useNativeDriver: true, listener: event => handleScroll(event)},
        )}
        scrollEventThrottle={16}
        data={playList}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={renderItem}
        initialScrollIndex={currentIndex}
      />
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {currentSong.title}
        </Text>
        <Text style={styles.artist} numberOfLines={1} ellipsizeMode="tail">
          {currentSong.artists?.data[0]?.name}
        </Text>
        <Slider
          style={[
            styles.slider,
            {flexDirection: 'row', justifyContent: 'space-between'},
          ]}
          minimumValue={0}
          maximumValue={totalLength}
          value={progressTime}
          minimumTrackTintColor="#1DB954"
          maximumTrackTintColor="#FFFFFF"
          thumbTintColor="#1DB954"
          onSlidingComplete={value =>
            seek(value).then(() =>
              dispatch({type: PROGRESS, progressTime: value}),
            )
          }
        />
        <View style={styles.timeContainer}>
          <Text style={[styles.time, {marginRight: 10}]}>
            {Math.floor(progressTime / 60)}:
            {(progressTime % 60).toFixed(0).padStart(2, '0')}
          </Text>
          <Text style={[styles.time, {marginLeft: 10}]}>
            {Math.floor(totalLength / 60)}:
            {(totalLength % 60).toFixed(0).padStart(2, '0')}
          </Text>
        </View>
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
              name={
                playMode === 'noloop'
                  ? 'repeat-off'
                  : playMode === 'loop'
                  ? 'repeat'
                  : 'repeat-once'
              }
              type="material-community"
              color="#FFFFFF"
              size={30}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

const PlayerItem = ({item}) => {
  const screenWidth = Dimensions.get('window').width;
  return (
    <Animated.View
      style={{
        width: screenWidth,
        paddingHorizontal: screenWidth * 0.1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Image source={{uri: item.cover.url}} style={styles.albumArt} />
    </Animated.View>
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
    width: '100%',
    height: Dimensions.get('window').width * 0.8,
    resizeMode: 'contain',
    marginBottom: -50,
    marginTop: -60,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 10, // Add top margin
  },
  artist: {
    fontSize: 16,
    color: '#FFF',
    marginTop: 5, // Add top margin
  },
  slider: {
    marginTop: 20,
    width: Dimensions.get('window').width * 0.8,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30,
    width: Dimensions.get('window').width * 0.8,
  },
  time: {
    color: '#fff',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    alignItems: 'center',
  },

  body: {
    flex: 1,
    position: 'relative',
    marginBottom: 100,
    justifyContent: 'space-between', // or 'space-between'
  },
});

export default React.memo(PlayerScreen);
