/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState, useCallback, useMemo} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  FlatList,
  ImageBackground,
} from 'react-native';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {Icon} from 'react-native-elements';
import {Slider} from '@miblanchard/react-native-slider';
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
import {debounce} from 'lodash';

import {SafeAreaView} from 'react-native-safe-area-context';
import {seek} from '../playerFunctions';
import BottomSheet from '@gorhom/bottom-sheet';
import useSongPlaybackTracker from '../hook/useSongPlaybackTracker';
import {logSongPlay, updateSongPlayViewed} from '../helpers/ApiHelper';
import FastImage from 'react-native-fast-image';
import useFetchData from '../useFetchData';
import TrackPlayer, {
  State,
  useProgress,
} from 'react-native-track-player';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const AnimatedImage = Animated.createAnimatedComponent(ImageBackground);
const PlayerScreen = React.forwardRef((props, ref) => {
  const {position} = useProgress();

  const dispatch = useDispatch();
  const {
    playList,
    currentSong,
    currentIndex,
    isPlaying,
    totalLength,
    shuffleMode,
    playMode,
  } = useSelector(
    state => ({
      playList: state.playList,
      currentSong: state.currentSong,
      currentIndex: state.currentIndex,
      isPlaying: state.isPlaying,
      totalLength: state.totalLength,
      shuffleMode: state.shuffleMode,
      playMode: state.playMode,
    }),
    shallowEqual,
  );

  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['100%'], []); // Adjust the minimized height to 60% or as needed.
  const [historyId, setHistoryId] = useState(null);
  const {logSong} = useFetchData();

  const flatListRef = useRef();
  const [songSwitching, setSongSwitching] = useState(false); // Add songSwitching flag
  const playerOffsetX = useRef(new Animated.Value(0)).current;
  const playerPosition = useRef(new Animated.Value(0)).current;
  const playbackTracker = useSongPlaybackTracker(
    isPlaying,
    position,
    currentSong,
  );



  const [sliderValue, setSliderValue] = useState(position);
  const [isSliding, setIsSliding] = useState(false);

  useEffect(() => {
    // When a song starts playing
    if (!isSliding) {
      setSliderValue(position);
    }
  }, [isSliding, position]);

  const debouncedSeek = useCallback(
    debounce(async value => {
      setIsSliding(true); // Indicate that sliding has started
      await TrackPlayer.seekTo(value[0]);
    }, 0),
    [dispatch],
  );

  useEffect(() => {
    function handlePlaybackState(data) {
      if (data.state === TrackPlayer.STATE_READY) {
        setIsSliding(false);
      }
    }

    const subscription = TrackPlayer.addEventListener(
      'playback-state',
      handlePlaybackState,
    );

    return () => {
      subscription.remove();
    };
  }, []);

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
    // When a song starts playing
    if (isPlaying && !historyId) {
      logSong(1, currentSong.id).then(data => setHistoryId(data.id));
    }
  }, [isPlaying, currentSong, historyId]);

  const hasBeenViewed = useMemo(
    () => playbackTracker.hasBeenViewed,
    [playbackTracker],
  );

  useEffect(() => {
    // After the song has been played for 30 seconds
    if (hasBeenViewed && historyId) {
      updateSongPlayViewed(historyId);
    }
  }, [hasBeenViewed, historyId]);

  useEffect(() => {
    setHistoryId(null);
    setSliderValue(0);
    setIsSliding(false);
  }, [currentSong]);

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

        if (newIndex > currentIndex) {
          dispatch({type: NEXT_SONG});
        } else if (newIndex < currentIndex) {
          dispatch({type: LAST_SONG});
        }
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

  const renderItem = useCallback(({item}) => <PlayerItem item={item} />, []);
  const backgroundOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Step 2: Animate on Song Change
    Animated.sequence([
      // Fade out
      Animated.timing(backgroundOpacity, {
        toValue: 0.9,
        duration: 250,
        useNativeDriver: true,
      }),
      // Fade in
      Animated.timing(backgroundOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentSong]);
  if (!currentSong) {
    return null;
  }

  return (
    <View pointerEvents="box-none" style={[styles.modal]}>
      <BottomSheet
        ref={ref}
        index={0}
        enablePanDownToClose
        snapPoints={['100%']}
        handleComponent={null}>
        <AnimatedImage
          source={{uri: currentSong.cover.url}}
          style={{
            ...styles.container,
           // opacity: backgroundOpacity,
            resizeMode: 'cover',
            overlayColor: 'rgba(0, 0, 0, 0.9)',
          }}
          blurRadius={70}>
          <AnimatedFlatList
            ref={flatListRef}
            horizontal
            pagingEnabled
            pointerEvents={'auto'}
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
            <View style={styles.row}>
              <Text
                style={styles.artist}
                numberOfLines={1}
                ellipsizeMode="tail">
                {currentSong.artists[0]?.name}
              </Text>
            </View>
            <View style={{width: '80%'}}>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={totalLength}
                value={sliderValue}
                minimumTrackTintColor="#1DB954"
                maximumTrackTintColor="#FFFFFF"
                thumbTintColor="#1DB954"
                onSlidingStart={value => setIsSliding(true)}
                onValueChange={value => setSliderValue(value[0])}
                onSlidingComplete={debouncedSeek} // Use the debounced function here
              />
            </View>
            <View style={styles.timeContainer}>
              <Text style={styles.time}>
                {Math.floor(sliderValue / 60)}:
                {(sliderValue % 60).toFixed(0).padStart(2, '0')}
              </Text>
              <Text style={styles.time}>
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
                <Icon
                  name="skip-next"
                  type="material"
                  color="#FFFFFF"
                  size={40}
                />
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
                  type="material"
                  color="#FFFFFF"
                  size={30}
                />
              </TouchableOpacity>
            </View>
          </View>
        </AnimatedImage>
      </BottomSheet>
    </View>
  );
});

const PlayerItem = ({item}) => {
  const screenWidth = Dimensions.get('window').width;
  return (
    <Animated.View style={styles.playerItemContainer}>
      <FastImage source={{uri: item.cover.url}} style={styles.albumArt} />
    </Animated.View>
  );
};

const screenDimension = Dimensions.get('window');
const albumArtSize = screenDimension.width * 0.8;
const commonContentWidth = screenDimension.width * 0.8;

const styles = StyleSheet.create({
  modal: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
    zIndex: 10,
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#121212',
    alignItems: 'stretch',
  },
  albumArt: {
    width: albumArtSize,
    height: albumArtSize,
  },
  title: {
    marginHorizontal: 20,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  artist: {
    fontSize: 16,
    color: '#FFF',
    marginTop: 10,
  },
  time: {
    color: '#fff',
  },
  slider: {
    fontSize: 12,
    marginTop: 20,
    width: commonContentWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    alignItems: 'center',
    width: commonContentWidth,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30,
    width: commonContentWidth,
  },
  body: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 40,
    marginTop: -25,
  },
  playerItemContainer: {
    flex: 2,
    width: screenDimension.width,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default React.memo(PlayerScreen);
