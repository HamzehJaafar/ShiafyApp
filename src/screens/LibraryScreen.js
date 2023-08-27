import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import useFetchData from '../useFetchData';
import {Icon, Image} from 'react-native-elements';
import {SafeAreaView} from 'react-native-safe-area-context';

const LibraryScreen = () => {
  const navigation = useNavigation();
  const {likedSongs, likedSongsLoading} = useFetchData();

  let songs = [];
  if (likedSongs?.data) {
    songs = likedSongs?.data.map(item => item.song);
  }

  console.log('songs', songs);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Library</Text>
        <TouchableOpacity onPress={() => {}}>
          <Icon style={styles.settingsIcon} name="settings" color="#bbb" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.section}
        onPress={() => {
          navigation.navigate('Playlist', {
            music: songs,
            playlistTitle: 'Your Likes',
          });
        }}>
        <View style={styles.sectionLeft}>
          <Image
            source={require('../../assets/images/companylogo.png')}
            style={styles.sectionImage}
          />
          <View style={styles.sectionTextContainer}>
            <Text style={styles.sectionTitle}>Likes</Text>
            <Text style={styles.sectionSubtitle}>
              {likedSongsLoading
                ? 'Loading...'
                : `${likedSongs.data.length} songs`}
            </Text>
          </View>
        </View>
        <Icon
          style={styles.sectionIcon}
          name="keyboard-arrow-right"
          color="#bbb"
        />
      </TouchableOpacity>
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
    backgroundColor: '#333',
    marginBottom: 10,
  },
  sectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionImage: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  sectionTextContainer: {
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#bbb',
  },
  sectionIcon: {
    width: 24,
    height: 24,
  },
});

export default LibraryScreen;
