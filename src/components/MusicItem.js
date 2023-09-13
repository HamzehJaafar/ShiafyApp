import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  TouchableHighlight,
  Alert,
} from 'react-native';
import {Icon} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import useFetchData from '../useFetchData';
import MusicItemModal from './MusicItemModal';

import { useDispatch, useSelector } from 'react-redux';
import { POINT_SONG, PROGRESS } from '../redux/actions';
import {useModal} from '../context/ModalContext';

const MusicItem = ({id, title, artist, musicData, songIndex, albumArt}) => {
  const navigation = useNavigation();
  const {likedSongs, likedSongsLoading, likeSong, unlikeSong} = useFetchData();
  const [isLiked, setIsLiked] = useState(null);
  const { currentSong, isPlaying } = useSelector(state => state);
  const dispatch = useDispatch();
  const { openModal, closeModal } = useModal();


  useEffect(() => {
    // Check if the song is liked
    if (!likedSongsLoading) {
      likedSongs?.data.forEach(song => {
        if (song.song.id === id) {
          setIsLiked(song.id);
        }
      });
    }
  }, [likedSongsLoading, likedSongs, id]);

  const handlePress = () => {
    if (currentSong)
    {dispatch({ type: POINT_SONG, playList: musicData, song: songIndex });
    dispatch({ type: PROGRESS, progressTime: 0 });} else {
    navigation.navigate('Player', {musicData, song: songIndex}); }
  };

  const handleFavorite = () => {
    if (isLiked) {
      unlikeSong(isLiked);
    } else {
      likeSong(id);
    }
    setIsLiked(!isLiked); // Toggle like state
  };


  const handleMoreOptions = () => {
    console.log('made it')
    openModal('MusicItemModal', {
      songId: id,
      handleFavorite,
      isLiked,
      title,
      artist,
      albumArt,
      closeModal // Pass the closeModal function as a prop to the modal
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
        <Text style={styles.artist}>{artist?.data[0]?.name}</Text>
      </View>
      <TouchableOpacity style={styles.dots}     hitSlop={{top: 10, bottom: 10, left: 10, right: 10}} //
 onPress={handleMoreOptions}>
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

    paddingLeft: 20,  // Increase this value
    paddingRight: 20, // Add this for symmetry
  },
});

export default MusicItem;
