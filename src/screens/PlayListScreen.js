import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import MusicItem from '../components/MusicItem';
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';

const PlaylistScreen = ({ route }) => {
  const { music, playlistTitle } = route.params;
  const navigation = useNavigation();

  const [searchTerm, setSearchTerm] = useState('');

  const handleBackButton = () => {
    navigation.goBack();
  };

  const filteredSongs = music.filter(song =>
    song.title?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const coverImage = filteredSongs[0]?.cover || null;

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={handleBackButton} style={styles.backButton}>
        <Icon name="arrow-back" color="#fff" size={28} />
      </TouchableOpacity>
      <View style={styles.header}>
        {coverImage.url && <FastImage source={{uri: coverImage.url}} style={styles.coverImage} />}
        <View style={styles.playlistInfo}>
          <Text style={styles.playlistTitle}>{playlistTitle}</Text>
          <Text style={styles.trackInfo}>
            playlist - {music.length} tracks
          </Text>
        </View>
        <View style={styles.playControls}>
          <TouchableOpacity>
            <Icon
              name={'shuffle'}
              type="material"
              color="#FFFFFF"
              size={20}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.playButton}>
            <Icon name="play-arrow" type="material" color="#121212" size={30} />
          </TouchableOpacity>
        </View>
      </View>
      
    </View>
  );
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredSongs}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => (
          <MusicItem
            id={item.id}
            title={item.title}
            artist={item.artists}
            albumArt={item.cover}
            musicData={music}
            songIndex={index}
          />
        )}
        ListHeaderComponent={renderHeader}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  headerContainer: {
    backgroundColor: '#1b1b1b',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  coverImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  playlistInfo: {
    flex: 1,
  },
  playlistTitle: {
    fontSize: 20,
    color: '#FFF',
    fontWeight: 'bold',
  },
  trackInfo: {
    fontSize: 16,
    color: '#AAA',
    fontWeight: '300',
  },
  playControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playButton: {
    backgroundColor: '#FFF',
    borderRadius: 25,
    marginLeft: 10,
    padding: 5,
  },
});


export default PlaylistScreen;
