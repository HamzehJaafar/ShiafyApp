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
import BottomSheet from '@gorhom/bottom-sheet';

const CreatePlaylistModal = React.forwardRef((props, ref) => {
  const {closeModal, songId} = props;
  const [playlistName, setPlaylistName] = useState('');
  const snapPoints = React.useMemo(() => ['80%'], []); // Adjust as per your needs
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCreate = async () => {
    if (isProcessing || !playlistName) {
      return; // prevent further action if already processing
    }
    setIsProcessing(true);

    try {
      ref.current.close();
      const playlist = await createPlaylist(playlistName);
      const addSong = await addSongToPlaylist(playlist.id, songId);
    } catch (error) {
      console.error('Error creating playlist:', error);
    } finally {
      setIsProcessing(false); // Reset it back after processing is done
    }
  };

  return (
    <View pointerEvents="box-none" style={styles.modal}>
      <BottomSheet
        ref={ref}
        enablePanDownToClose
        index={0}
        handleComponent={null}
        backgroundComponent={() => (
          <View
            style={{flex: 1, backgroundColor: '#121212', borderRadius: 20}}
          />
        )}
        snapPoints={snapPoints}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Create Playlist</Text>
          <TextInput
            placeholder="My Playlist"
            placeholderTextColor="#888"
            value={playlistName}
            onChangeText={setPlaylistName}
            style={styles.input}
          />
          <TouchableOpacity
            style={[
              styles.doneButton,
              playlistName ? {} : styles.disabledDoneButton,
            ]}
            onPress={playlistName ? handleCreate : null}
            activeOpacity={0.7}>
            <Text style={styles.buttonText}>Create</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    </View>
  );
});

const styles = StyleSheet.create({
  modal: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
    zIndex: 10,
    backgroundColor: 'transparent',
  },
  modalContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#060606',

    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 10,
    paddingBottom: 30,
    alignItems: 'center',
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

  disabledDoneButton: {
    backgroundColor: '#C7C7C7', // Grey color for disabled button
    shadowOpacity: 0.1, // Reduced shadow for disabled button
  },
});

export default CreatePlaylistModal;
