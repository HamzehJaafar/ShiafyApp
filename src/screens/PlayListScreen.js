// PlaylistScreen.js

import React from 'react';
import {StyleSheet, ScrollView, View} from 'react-native';
import MusicItem from '../components/MusicItem';

const PlaylistScreen = ({route}) => {
  const {music} = route.params;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.list}>
        {music.map((item, key) => (
          <MusicItem
            key={item.id}
            title={item.title}
            artist={item.artist}
            musicData={music}
            songIndex={key}
            onFavorite={() => console.log('Favorite clicked')}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  list: {
    marginTop: 20,
  },
});

export default PlaylistScreen;
