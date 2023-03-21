import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity, Image, SafeAreaView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Icon} from 'react-native-elements';
import {useSelector, useDispatch} from 'react-redux';
import TrackPlayer from 'react-native-track-player';
import {playPrevious, playNext, togglePlay} from '../playerFunctions';

const BottomPlayer = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {
    playList,
    currentSong,
    isPlaying,
    currentIndex,
    progressTime,
    totalLength,
  } = useSelector(state => state);

  if (!currentSong) {
    return null;
  }

  const styles = {
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    progressBar: {
      position: 'absolute',
      top: 0,
      left: 0,
      height: 3,
      backgroundColor: 'rgba(29, 185, 84, 1)',
      width: `${(progressTime / totalLength) * 100}%`,
    },
    albumArt: {
      width: 50,
      height: 50,
      marginRight: 10,
    },
    songInfo: {
      flex: 1,
    },
    title: {
      color: 'white',
      fontSize: 16,
    },
    author: {
      color: 'white',
      fontSize: 14,
      opacity: 0.7,
    },
    controls: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  };

  return (
    <SafeAreaView>
      <TouchableOpacity
        onPress={() => navigation.navigate('Player', {continue: true})}>
        <View style={styles.container}>
          <View style={styles.progressBar} />
          <Image
            source={{uri: currentSong.albumArtUrl}}
            style={styles.albumArt}
          />
          <View style={styles.songInfo}>
            <Text style={styles.title}>{currentSong.title}</Text>
            <Text style={styles.author}>{currentSong.artist}</Text>
          </View>
          <View style={styles.controls}>
            <Icon
              name="skip-previous"
              type="material"
              color="white"
              onPress={() => playPrevious(currentIndex, playList, dispatch)}
            />
            <Icon
              name={isPlaying ? 'pause' : 'play-arrow'}
              type="material"
              color="white"
              onPress={() => togglePlay(isPlaying, dispatch)}
            />
            <Icon
              name="skip-next"
              type="material"
              color="white"
              onPress={() => playNext(currentIndex, playList, dispatch)}
            />
          </View>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default BottomPlayer;
