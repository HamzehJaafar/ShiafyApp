import React from 'react';
import {View, Text, StyleSheet, TouchableWithoutFeedback, Dimensions} from 'react-native';
import FastImage from 'react-native-fast-image';
const {width, height} = Dimensions.get('window');

export default function ArtistItem({artist, onPress}) {
  console.log(artist)
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <FastImage source={{uri:artist?.profile_cover?.url}} style={styles.artistImage} />
        </View>
        <Text numberOfLines={2} style={styles.songTitle}>{artist.name}</Text>

      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    margin: 20,
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 60,
    elevation: 5, // for Android shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4, // for iOS shadow
    marginBottom: 10,
  },
  artistImage: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  artistName: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  artistDetails: {
    color: '#B1B1B1',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginTop: 5,
  },
  songTitle: {
    fontSize: 12,
    color: 'white',
    marginRight: 10, // Space between title and genre
    maxWidth: 110  // assuming the width of the song item is width * 0.6, adjust as needed
  },
  
});
