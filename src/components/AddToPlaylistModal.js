// AddToPlaylistModal.js

import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
} from 'react-native';
import SwipeUpDownModal from './SwipeUpDownModal';
import useFetchData from '../useFetchData';
import Checkbox from './Checkbox';
import {addSongToPlaylist, removeSongFromPlaylist} from '../api/playlist';
import {ScrollView} from 'react-native-gesture-handler';
import Modal from 'react-native-modal';

const AddToPlaylistModal = ({
  closeModal,
  onNewPlaylist,
  songId,
}) => {
  const {privatePlaylists, privatePlaylistsLoading, privatePlaylistsError} =
    useFetchData();

  const [selectedPlaylists, setSelectedPlaylists] = useState([]);
  const renderPlaylistItem = ({item: playlist}) => (
    <TouchableOpacity
      key={playlist.id}
      style={styles.playlistItem}
      onPress={() => togglePlaylistSelection(playlist.id)}>
      {playlist.coverPhoto && (
        <Image
          source={{uri: playlist.coverPhoto}}
          style={styles.playlistCoverPhoto}
        />
      )}
      <Text style={styles.playlistName}>{playlist.title}</Text>
      <Checkbox
        isChecked={selectedPlaylists.includes(playlist.id)}
        onToggle={() => togglePlaylistSelection(playlist.id)}
      />
    </TouchableOpacity>
  );

  useEffect(() => {
    const initialSelectedPlaylists = (privatePlaylists || [])
      .filter(playlist =>
        playlist.songs.some(song => song.id === parseInt(songId, 10)),
      ) // Check if any song object has the matching id
      .map(playlist => playlist.id);
    setSelectedPlaylists(initialSelectedPlaylists);
  }, [privatePlaylists, songId]);

  useEffect(() => {
    console.log('AddToPlaylistModal rendered');
  }, []);

  const togglePlaylistSelection = playlistId => {
    setSelectedPlaylists(prevState =>
      prevState.includes(playlistId)
        ? prevState.filter(id => id !== playlistId)
        : [...prevState, playlistId],
    );
  };

  const handleDonePress = async () => {
    const initialSelectedPlaylists = (privatePlaylists || [])
      .filter(playlist =>
        playlist.songs.some(song => song.id === parseInt(songId, 10)),
      )
      .map(playlist => playlist.id);

    for (const playlist of privatePlaylists) {
      const playlistId = playlist.id;

      if (
        selectedPlaylists.includes(playlistId) &&
        !initialSelectedPlaylists.includes(playlistId)
      ) {
        await addSongToPlaylist(playlistId, songId);
      } else if (
        !selectedPlaylists.includes(playlistId) &&
        initialSelectedPlaylists.includes(playlistId)
      ) {
        console.log('Removing song from playlist:', playlistId);
        await removeSongFromPlaylist(playlistId, songId);
      } else {
        console.log('No change for playlist:', playlistId);
      }
    }

    setModalVisible(false);
  };

  const openNewPlaylist = async () => {
    onNewPlaylist();
  };
  if (privatePlaylistsLoading) {
    return <Text>Loading...</Text>;
  }

  if (privatePlaylistsError) {
    return <Text>Error loading playlists</Text>;
  }

  return (
    <Modal
      isVisible={true}
      onSwipeComplete={closeModal}
      swipeDirection="down"
      style={styles.modal}
      backdropOpacity={0.3}>
      <View style={styles.centeredView}>
        <Text style={styles.title}>Add to playlist</Text>
        <TouchableOpacity style={styles.ovalButton} onPress={openNewPlaylist}>
          <Text style={styles.buttonText}>New Playlist</Text>
        </TouchableOpacity>
        <FlatList
          data={privatePlaylists}
          renderItem={renderPlaylistItem}
          keyExtractor={item => item.id.toString()}
          style={{width: '100%'}}
        />
        <TouchableOpacity
          style={[
            styles.doneButton,
            selectedPlaylists.length ? {} : styles.disabledDoneButton,
          ]}
          onPress={selectedPlaylists.length ? handleDonePress : null}
          activeOpacity={0.7}>
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#181818', // dark background similar to Spotify's theme
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    marginTop: 50,
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  ovalButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1DB954', // Spotify green color
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  buttonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  playlistItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    borderBottomColor: '#333',
    borderBottomWidth: 1,
    padding: 15,
  },
  playlistCoverPhoto: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  playlistName: {
    fontSize: 18,
    color: '#FFFFFF',
    flex: 1,
  },
  disabledDoneButton: {
    backgroundColor: '#C7C7C7', // Grey color for disabled button
    shadowOpacity: 0.1, // Reduced shadow for disabled button
  },
  doneButton: {
    marginBottom: 100,
    backgroundColor: '#1DB954', // Spotify green
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignSelf: 'center',
    marginTop: 20,
    elevation: 5, // Shadow for Android
    shadowColor: '#1DB954', // Shadow for iOS
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AddToPlaylistModal;
