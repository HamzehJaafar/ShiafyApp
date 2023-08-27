// ArtistItem.js
import React from 'react';
import {View, Text, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import FastImage from 'react-native-fast-image';

export default function ArtistItem(props) {
  return (
    <TouchableWithoutFeedback onPress={props.onPress}>
      <View style={styles.container}>
        <FastImage source={props.source} style={styles.artistImage} />
        <Text style={styles.artistName}>{props.artistName}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    margin: 16,
  },
  artistImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  artistName: {
    marginTop: 8,
    color: 'white',
    fontWeight: '600',
  },
});
