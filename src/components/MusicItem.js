// MusicItem.js

import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';

const MusicItem = ({title, artist, onFavorite, musicData, songIndex}) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('Player', {musicData, song: songIndex});
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.artist}>{artist}</Text>
      </View>
      <TouchableOpacity onPress={onFavorite}>
        <Icon name="heart" type="font-awesome" color="#517fa4" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    backgroundColor: '#121212', // Change the background color to black
    borderBottomColor: '#333', // Change the border color to a darker shade
  },
  textContainer: {
    flexDirection: 'column',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff', // Change text color to white
  },
  artist: {
    fontSize: 12,
    color: '#999',
  },
});

export default MusicItem;
