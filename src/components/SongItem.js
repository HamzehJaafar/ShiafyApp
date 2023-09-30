import React from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import FastImage from 'react-native-fast-image';
const {width, height} = Dimensions.get('window');
const SongItem = ({song, onPress, size = 'default'}) => {
  return (
    <TouchableOpacity
      style={
        size === 'small'
          ? styles.smallSongItemContainer
          : styles.songItemContainer
      }
      onPress={() => onPress(song)}>
      <FastImage
        source={{uri: song?.cover?.url}}
        style={size === 'small' ? styles.smallSongImage : styles.songImage}
      />
      <View style={styles.songDetailsContainer}>
        <Text numberOfLines={1} style={styles.songTitle}>{song?.title}</Text>
        <Text numberOfLines={3} ellipsizeMode='tail' style={styles.songGenre}>{song?.genre} - {song?.artists[0]?.name}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  songItemContainer: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    marginHorizontal: width * 0.01,
    overflow: 'hidden'
  },

  songImage: {
    width: 130,
    height: 130,
    borderRadius: 5,
    marginBottom: 10, // Space between image and text
  },

  smallSongItemContainer: {
    width: width * 0.4,
    height: 120,
    marginBottom: 10,
    marginRight: 8,
    borderRadius: 5,
    padding: 7,
  },

  smallSongImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginBottom: 5, // Space between image and text for small item
  },

  songDetailsContainer: {
    width: '100%',
  },
  
  songTitle: {
    fontSize: 16,
    color: 'white',
    marginRight: 10, // Space between title and genre
    maxWidth: (width * 0.4 - 20)  // assuming the width of the song item is width * 0.6, adjust as needed
  },
  
  songGenre: {
    fontSize: 12,
    color: '#B1B1B1',
    maxWidth: (width * 0.4 - 20) , // assuming the width of the song item is width * 0.6, adjust as needed
  },
});
export default SongItem;
