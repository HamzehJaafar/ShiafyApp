import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Icon } from 'react-native-elements';
import { useDispatch } from 'react-redux';
import { POINT_SONG, PROGRESS } from '../redux/actions';
import { useModal } from '../context/ModalContext';
import { getSongMetadata } from '../helpers/storageHelper';
import { DownloadContext } from '../context/DownloadContext';

const MusicItem = ({
  id,
  title,
  artist,
  musicData,
  songIndex,
  albumArt,
}) => {
  const dispatch = useDispatch();
  const { openModal } = useModal();
  const { state } = useContext(DownloadContext);

  const [isDownloaded, setIsDownloaded] = useState(false);

  useEffect(() => {
    const checkDownloaded = async () => {
      const metadata = await getSongMetadata(id);
      setIsDownloaded(!!metadata);
    };
    checkDownloaded();
  }, [id]);

  const handlePress = async () => {
    dispatch({ type: POINT_SONG, playList: musicData, song: songIndex });
    dispatch({ type: PROGRESS, progressTime: 0 });
  };

  const handleMoreOptions = () => {
    openModal('MusicItemModal', {
      songId: id,
      title,
      artist,
      albumArt,
    });
  };

  const isSongDownloading = state.downloads.some(download => download.id === id);

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
        <View style={styles.artistContainer}>
          {isDownloaded && (
            <Icon name={'done'} type="material" color="green" size={20} />
          )}
          {isSongDownloading && (
            <ActivityIndicator color="green" size="small" />
          )}
          <Text style={styles.artist}>{artist ? artist[0].name : null}</Text>
        </View>
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
    flexDirection: 'row',
    gap: 20,
    paddingLeft: 25,
    paddingRight: 25,
  },
  artistContainer: {
    paddingTop: 10,
    flexDirection: 'row',
    gap: 5,
  },
});

export default React.memo(MusicItem);
