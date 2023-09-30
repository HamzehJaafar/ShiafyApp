import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, FlatList} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import useFetchData from '../useFetchData';
import {Icon, Image} from 'react-native-elements';
import {SafeAreaView} from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';

const LibraryScreen = () => {
  const navigation = useNavigation();
  const {likedSongs, likedSongsLoading} = useFetchData();
  const {privatePlaylists, privatePlaylistsLoading} = useFetchData();

  let songs = [];
  if (likedSongs) {
    songs = likedSongs?.data.map(item => item.song);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Library</Text>
        <TouchableOpacity onPress={() => {}}>
          <Icon style={styles.settingsIcon} name="settings" color="#bbb" />
        </TouchableOpacity>
      </View>

      <FlatList
        keyExtractor={(item, index) => `${item.id}-${index}`}
        data={[{type: 'likedSongs', data: songs}, ...privatePlaylists]}
        renderItem={({item}) => {
          if (item.type === 'likedSongs') {
            return (
              <TouchableOpacity
                style={styles.section}
                onPress={() => {
                  navigation.navigate('Playlist', {
                    music: item.data,
                    playlistTitle: 'Your Likes',
                  });
                }}>
                <View style={styles.sectionLeft}>
                  <FastImage
                    source={
                      item?.data[0]?.cover?.url
                        ? {uri: item.data[0].cover.url}
                        : require('../../assets/images/companylogo.png')
                    }
                    style={styles.sectionImage}
                  />
                  <View style={styles.sectionTextContainer}>
                    <Text style={styles.sectionTitle}>Liked Tracks</Text>
                    <Text style={styles.sectionSubtitle}>
                      {likedSongsLoading
                        ? 'Loading...'
                        : `${item.data.length} tracks`}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          } else {
            return (
              <TouchableOpacity
                style={styles.section}
                onPress={() => {
                  navigation.navigate('Playlist', {
                    music: item.songs,
                    playlistTitle: item.title,
                  });
                }}>
                <View style={styles.sectionLeft}>
                  <FastImage
                    source={
                      item?.songs[0]?.cover?.url
                        ? {uri: item.songs[0].cover.url}
                        : require('../../assets/images/companylogo.png')
                    }
                    style={styles.sectionImage}
                  />
                  <View style={styles.sectionTextContainer}>
                    <Text style={styles.sectionTitle}>{item.title}</Text>
                    <Text style={styles.sectionSubtitle}>
                      {item.songs.length} tracks - Playlist
                    </Text>
                  </View>
                </View>
                <Icon
                  style={styles.sectionIcon}
                  name="keyboard-arrow-right"
                  color="#bbb"
                />
              </TouchableOpacity>
            );
          }
        }}

      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#222',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  settingsIcon: {
    width: 24,
    height: 24,
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  sectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionImage: {
    width: 70,
    height: 70,
    marginRight: 10,
  },
  sectionTextContainer: {
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#bbb',
  },
  sectionIcon: {
    width: 24,
    height: 24,
  },
});

export default LibraryScreen;
