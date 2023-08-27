import React, {useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Icon} from 'react-native-elements';
import {useSelector, useDispatch} from 'react-redux';
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
    loading,
    error,
  } = useSelector(state => state);

  if (!currentSong) {
    return null;
  }

  const styles = {
    container: {
      flex: 1,
      backgroundColor: 'rgb(4,4,4)',
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
          {loading ? (
            <ActivityIndicator size="large" color="#00ff00" />
          ) : (
            <>
              <Image
                source={{uri: currentSong.cover.url}}
                style={styles.albumArt}
              />
              <View style={styles.songInfo}>
                <Text style={styles.title}>{currentSong.title}</Text>
                <Text style={styles.author}>
                  {currentSong.artists?.data[0]?.name}
                </Text>
              </View>
              {error && <Text>Error loading song</Text>}
              <View style={styles.controls}>
                <Icon
                  name="skip-previous"
                  type="material"
                  color="white"
                  onPress={() => playPrevious(dispatch)}
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
                  onPress={() => playNext(dispatch)}
                />
              </View>
            </>
          )}
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default BottomPlayer;
