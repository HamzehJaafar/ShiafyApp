import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements';

import {useModal} from '../context/ModalContext';
import BottomSheet from '@gorhom/bottom-sheet';
import useFetchData from '../useFetchData';

const MusicItemModal = React.forwardRef((props, ref) => {
  const {songId, title, artist, albumArt} = props;

  const {openModal} = useModal();
  const snapPoints = React.useMemo(() => ['80%'], []); // Adjust as per your needs
  const [isLiked, setIsLiked] = useState(null);
  const {likedSongs, likedSongsLoading, likeSong, unlikeSong} = useFetchData();

  useEffect(() => {
    // Check if the song is liked
    if (!likedSongsLoading) {
      likedSongs?.data.forEach(song => {
        if (song.song.id === songId) {
          setIsLiked(song.id);
        }
      });
    }
  }, [likedSongsLoading, likedSongs, songId]);

  const handlePress = () => {
    dispatch({type: POINT_SONG, playList: musicData, song: songIndex});
    dispatch({type: PROGRESS, progressTime: 0});
  };

  const handleFavorite = () => {
    if (isLiked) {
      unlikeSong(isLiked);
    } else {
      likeSong(songId);
    }
    setIsLiked(!isLiked); // Toggle like state
  };

  const handleAddToPlaylist = () => {
    openModal('AddToPlaylistModal', {
      songId: songId,
      onNewPlaylist: handleCreatePlaylist,
    });
  };

  const handleCreatePlaylist = () => {
    openModal('CreatePlaylistModal', {
      songId: songId,
    });
  };

  return (
    <>
      <View pointerEvents="box-none" style={styles.modal}>
        <BottomSheet
          ref={ref}
          enablePanDownToClose
          index={0}
          handleComponent={null}
          backgroundComponent={() => (
            <View
              style={{
                flex: 1,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              }}
            />
          )}
          snapPoints={snapPoints}>
          <View style={styles.modalContent}>
            <Image source={{uri: albumArt?.url}} style={styles.albumArtModal} />
            <Text style={styles.songTitleModal}>{title}</Text>
            <Text style={styles.artistModal}>
              {artist?.data ? artist?.data[0]?.name : artist[0]?.name}
            </Text>
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
            <TouchableOpacity
              onPress={() => handleAddToPlaylist()}
              style={styles.optionContainer}>
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
        </BottomSheet>
      </View>
    </>
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
