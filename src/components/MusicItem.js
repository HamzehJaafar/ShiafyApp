import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Icon} from 'react-native-elements';

import {useDispatch, } from 'react-redux';
import {POINT_SONG, PROGRESS} from '../redux/actions';
import {useModal} from '../context/ModalContext';

const MusicItem = ({id, title, artist, musicData, songIndex, albumArt}) => {
  const dispatch = useDispatch();
  const {openModal, closeModal} = useModal();

  const handlePress = () => {
    dispatch({type: POINT_SONG, playList: musicData, song: songIndex});
    dispatch({type: PROGRESS, progressTime: 0});
  };
  const handleMoreOptions = () => {
    openModal('MusicItemModal', {
      songId: id,
      title,
      artist,
      albumArt,
      closeModal, // Pass the closeModal function as a prop to the modal
    });
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      {albumArt && (
        <View style={styles.albumArtContainer}>
          <Image source={albumArt} style={styles.albumArt} />
        </View>
      )}
      
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {title}
        </Text>
        <Text style={styles.artist}>{artist[0]?.name}</Text>
      </View>
      <TouchableOpacity style={styles.dots} onPress={handleMoreOptions}>
        <Icon name="ellipsis-v" type="font-awesome" color="#517fa4" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomColor: '#333',
    backgroundColor: '#121212',
  },
  albumArt: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    paddingRight: 20,
    color: '#FFF',
  },
  artist: {
    paddingRight: 20,
    fontSize: 14,
    color: '#999',
  },
  dots: {
    paddingLeft: 25,
    paddingRight: 25,
  },
});

export default MusicItem;
