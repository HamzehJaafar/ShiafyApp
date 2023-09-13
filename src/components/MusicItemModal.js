import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements';
import SwipeUpDownModal from './SwipeUpDownModal';
import AddToPlaylistModal from './AddToPlaylistModal';
import CreatePlaylistModal from './CreatePlaylistModal';
import { SwipeablePanel } from 'rn-swipeable-panel';
import Modal from "react-native-modal";
import { useModal } from '../context/ModalContext';



const MusicItemModal = ({
  
  closeModal,
  handleFavorite,
  isLiked,
  title,
  artist,
  songId,
  albumArt,
}) => {

  const { openModal } = useModal();


  const handleAddToPlaylist = () => {
    openModal('AddToPlaylistModal', {
      songId: songId,
      closeModal,
      onNewPlaylist: handleCreatePlaylist
    });
  };

  const handleCreatePlaylist = () => {
    openModal('CreatePlaylistModal', {
      songId: songId,
      closeModal
    });
  };

  return (
    <>
      <Modal
  isVisible={true}
  onSwipeComplete={closeModal}
        swipeDirection="down"
        style={styles.modal}
        backdropOpacity={0.3}
      >
        <View style={styles.modalContent}>
          <Image source={{ uri: albumArt?.url }} style={styles.albumArtModal} />
          <Text style={styles.songTitleModal}>{title}</Text>
          <Text style={styles.artistModal}>{artist?.data ? artist?.data[0]?.name : artist[0]?.name}</Text>
       <TouchableOpacity
              style={styles.optionContainer}
              onPress={handleFavorite}>
              <Icon
                name="heart"
                type="font-awesome"
                color={isLiked ? 'red' : '#517fa4'}
              />
              <Text style={styles.optionText}>Like Track</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleAddToPlaylist()} style={styles.optionContainer}>
              <Icon name="plus" type="font-awesome" color="#517fa4" />
              <Text style={styles.optionText}>Add to Playlist</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionContainer}>
              <Icon name="list" type="font-awesome" color="#517fa4" />
              <Text style={styles.optionText}>Add to Queue</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionContainer}>
              <Icon name="share" type="font-awesome" color="#517fa4" />
              <Text style={styles.optionText}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionContainer}>
              <Icon name="user" type="font-awesome" color="#517fa4" />
              <Text style={styles.optionText}>View Artist</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionContainer}>
              <Icon name="info" type="font-awesome" color="#517fa4" />
              <Text style={styles.optionText}>View Credits</Text>
            </TouchableOpacity>
          </View>

        </Modal>

    </>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: '#121212',
    borderRadius: 20,
    padding: 10,
    paddingBottom: 30,
    alignItems: 'center',
  },
  albumArtModal: {
    width: 100,
    height: 100,
    marginBottom: 20,
    borderRadius: 100,
  },
  songTitleModal: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 5,
  },
  artistModal: {
    color: '#999',
    marginBottom: 20,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: 10,
    borderBottomColor: '#333',
    borderBottomWidth: 1,
  },
  optionText: {
    color: '#fff',
    marginLeft: 10,
  },
  closeButton: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
    padding: 10,
    marginTop: 10,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default MusicItemModal;
