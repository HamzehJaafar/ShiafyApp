import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import MusicItem from '../components/MusicItem';
import {useNavigation} from '@react-navigation/native';
import {Icon} from 'react-native-elements';
import {SafeAreaView} from 'react-native-safe-area-context';

const PlaylistScreen = ({route}) => {
  const {music, playlistTitle} = route.params;
  const navigation = useNavigation();

  const [searchTerm, setSearchTerm] = useState('');

  const handleBackButton = () => {
    navigation.goBack();
  };

  // Filter songs based on search term
  const filteredSongs = music.filter(song =>
    song.title?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const onClickLike = event => {
    console.log(event);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackButton} style={styles.backButton}>
          <Icon name="arrow-back" color="#fff" />
        </TouchableOpacity>
        <Text style={styles.playlistTitle}>{playlistTitle}</Text>
        <View style={styles.searchContainer}>
          <Icon
            name="search"
            type="font-awesome"
            color="#aaa"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor="#aaa"
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>
      </View>
      <FlatList
        data={filteredSongs}
        keyExtractor={item => item.id}
        renderItem={({item, index}) => (
          <MusicItem
            id={item.id}
            title={item.title}
            artist={item.artists}
            albumArt={item.cover}
            musicData={music}
            songIndex={index}
            onFavorite={onClickLike}
          />
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    alignItems: 'center',
    paddingTop: 10,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
  },
  headerImage: {
    width: '100%',
    height: 200,
  },
  playlistTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 10,
  },

  searchContainer: {
    flexDirection: 'row',
    height: 40,
    width: '90%',
    backgroundColor: '#1b1b1b',
    borderRadius: 25,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
});

export default PlaylistScreen;
