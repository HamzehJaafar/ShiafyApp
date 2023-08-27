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

const MusicItem = ({id, title, artist, musicData, songIndex, albumArt}) => {
  const navigation = useNavigation();
  const {likedSongs, likedSongsLoading, likeSong, unlikeSong} = useFetchData();
  const [isLiked, setIsLiked] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

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
    navigation.navigate('Player', {musicData, song: songIndex});
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
    setModalVisible(!modalVisible);
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
      <TouchableOpacity style={styles.dots} onPress={handleMoreOptions}>
        <Icon name="ellipsis-v" type="font-awesome" color="#517fa4" />
      </TouchableOpacity>
      <MusicItemModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        handleFavorite={handleFavorite}
        isLiked={isLiked}
        title={title}
        artist={artist}
        albumArt={albumArt}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    backgroundColor: '#121212',
    borderBottomColor: '#333',
  },
  albumArtContainer: {
    marginRight: 10,
  },
  albumArt: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  artist: {
    fontSize: 12,
    color: '#999',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  albumArtModal: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  songTitleModal: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  artistModal: {
    fontSize: 16,
    marginBottom: 20,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  optionText: {
    marginLeft: 10,
    fontSize: 16,
  },
  dots: {
    paddingLeft: 10,
    paddingRight: 10,
  },
});
export default MusicItem;
