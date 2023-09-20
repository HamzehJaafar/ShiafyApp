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
import {useModal} from '../context/ModalContext';

const BottomPlayer = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const isPlaying = useSelector(state => state.isPlaying);
  const currentSong = useSelector(state => state.currentSong);
  const progressTime = useSelector(state => state.progressTime);
  const totalLength = useSelector(state => state.totalLength);
  const loading = useSelector(state => state.loading);
  const error = useSelector(state => state.error);

  const {openPlayer} = useModal();
  
  if (!currentSong) {
    return null;
  }

  const styles = {
    container: {
      flex: 1,
      backgroundColor: 'rgb(4,4,4)',
      opacity: 0.9,
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      paddingHorizontal: 10,
      marginHorizontal: 3,
      paddingVertical: 10,
      borderRadius: 15, // Added
      overflow: 'hidden', // Added
    },
    progressBar: {
      position: 'absolute',
      top: 0,
      left: 0,
      height: 3,
      backgroundColor: 'rgba(29, 185, 84, 1)',
      borderBottomRightRadius: 10, // Added
      borderBottomLeftRadius: 10, // Added
      width: `${(progressTime / totalLength) * 100}%`,
    },
    albumArt: {
      width: 50,
      height: 50,
      marginRight: 10,
      borderRadius: 40, // Added
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
      <TouchableOpacity onPress={() => openPlayer()} activeOpacity={1}>
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
                  {currentSong.artists[0]?.name}
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

export default React.memo(BottomPlayer);
