import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import SwipeUpDownModal from './SwipeUpDownModal';
import {addSongToPlaylist, createPlaylist} from '../api/playlist';
import Modal from 'react-native-modal';

const CreatePlaylistModal = ({closeModal, songId}) => {
  const [playlistName, setPlaylistName] = useState('');

  const handleCreate = async () => {
    const playlist = await createPlaylist(playlistName);
    console.log(playlist);

    const addSong = await addSongToPlaylist(playlist.id, songId);

    console.log(addSong);
    setModalVisible(false);
  };

  return (
    <Modal  isVisible={true}
    onSwipeComplete={closeModal}
    swipeDirection="down"
    style={styles.modal}
    backdropOpacity={0.3}>
      <View style={styles.modalView}>
        <Text style={styles.title}>Create Playlist</Text>
        <TextInput
          placeholder="My Playlist"
          placeholderTextColor="#888"
          value={playlistName}
          onChangeText={setPlaylistName}
          style={styles.input}
        />
        <TouchableOpacity
          style={styles.doneButton}
          onPress={handleCreate}
          activeOpacity={0.7}>
          <Text style={styles.buttonText}>Create</Text>
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
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    paddingHorizontal: 20,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 25,
    alignSelf: 'flex-start', // aligns to the left
  },
  input: {
    backgroundColor: '#2a2a2a',
    color: '#fff',
    borderRadius: 10,
    width: '100%',
    height: 50,
    paddingHorizontal: 15,
    fontSize: 18,
    marginBottom: 20,
    borderColor: '#444',
    borderWidth: 1,
  },
  doneButton: {
    backgroundColor: '#2196F3',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 40,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default CreatePlaylistModal;
