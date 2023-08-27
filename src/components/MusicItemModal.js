import React, {useRef} from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements';
import SwipeUpDownModal from './SwipeUpDownModal';

const MusicItemModal = ({
  modalVisible,
  setModalVisible,
  handleFavorite,
  isLiked,
  title,
  artist,
  albumArt,
}) => {
  return (
    <SwipeUpDownModal
      modalVisible={modalVisible}
      onClose={() => setModalVisible(false)}
      ContentModal={
        <View style={styles.centeredView}>
          <View style={[styles.modalView]}>
            <Image source={albumArt} style={styles.albumArtModal} />
            <Text style={styles.songTitleModal}>{title}</Text>
            <Text style={styles.artistModal}>{artist?.data[0]?.name}</Text>
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
            <TouchableOpacity style={styles.optionContainer}>
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
        </View>
      }
    />
  );
};
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: '#121212',
    borderRadius: 20,
    padding: 10,
    paddingBottom: 30,
    width: '90%',
    height: '75%',
    alignItems: 'center',
  },
  albumArtModal: {
    width: 200,
    height: 200,
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
