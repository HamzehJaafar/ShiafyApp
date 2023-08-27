import React from 'react';
import {View, Image, Text, TouchableOpacity} from 'react-native';

const SongItem = ({song, onPress}) => (
  <TouchableOpacity onPress={() => onPress(song)}>
    <View style={{flexDirection: 'row', margin: 10}}>
      <Image
        source={{uri: song.cover.url}}
        style={{width: 60, height: 60, marginRight: 10}}
      />
      <View>
        <Text style={{color: 'white', fontSize: 18}}>{song.title}</Text>
        <Text style={{color: 'white', fontSize: 14}}>{song.genre}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

export default SongItem;
