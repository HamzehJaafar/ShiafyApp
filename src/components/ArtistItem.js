import React from 'react';
import {View, Text, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import FastImage from 'react-native-fast-image';

export default function ArtistItem(props) {
  return (
    <TouchableWithoutFeedback onPress={props.onPress}>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <FastImage source={props.source} style={styles.artistImage} />
        </View>
        <Text style={styles.artistName}>{props.artistName}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    margin: 20,
  },
  imageContainer: {
    width: 120,
    height: 120,
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
});
