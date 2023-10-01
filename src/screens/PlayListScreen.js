import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useContext,
} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Animated,
  ActivityIndicator,
} from 'react-native';
import {Icon} from 'react-native-elements';
import MusicItem from '../components/MusicItem';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import {deleteSong, cancelCurrentDownload, cancelDownloadController, downloadSong, handleDownloadQueue} from '../helpers/downloadHelper';
import {
  deletePlaylistDownloadStatus,
  deleteSongMetadata,
  getSongMetadata,
  isPlaylistDownloadedcheck,
  markPlaylistAsDownloaded,
  storeSongMetadata,
} from '../helpers/storageHelper';
import {DownloadContext} from '../context/DownloadContext';

const {width} = Dimensions.get('window');
const HEADER_HEIGHT = width * 0.6;

const PlaylistScreen = ({route}) => {
  const {music, playlistTitle} = route.params;
  const navigation = useNavigation();
  const {state, dispatch} = useContext(DownloadContext);

  const scrollY = useRef(new Animated.Value(0)).current;
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadingSongsIndices, setDownloadingSongsIndices] = useState([]);
  const [cancelDownload, setCancelDownload] = useState(false);
  const [isPlaylistDownloaded, setIsPlaylistDownloaded] = useState(false);

  useEffect(() => {
    const activeDownloads = state.downloads.filter(
      download => download.playlistTitle === playlistTitle,
    );
    if (activeDownloads.length > 0) {
      setIsDownloading(true);
      setDownloadingSongsIndices(activeDownloads.map(ad => ad.songIndex));
    } else {
      setIsDownloading(false);
      setDownloadingSongsIndices([]);
    }
  }, [state.downloads]);

  const handleDownload = async () => {
    setIsDownloading(true);
    await handleDownloadQueue(music, playlistTitle, dispatch, setIsDownloading, setCancelDownload);
  };

  useEffect(() => {
    const checkPlaylistStatus = async () => {
      const downloaded = await isPlaylistDownloadedcheck(playlistTitle);
      setIsPlaylistDownloaded(downloaded);
    };
    checkPlaylistStatus();
  }, [music]);

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [HEADER_HEIGHT, 60],
    extrapolate: 'clamp',
  });

  const coverImageOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT - 60],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const titleOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT - 100, HEADER_HEIGHT - 60],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
  });

  const handleBackButton = () => {
    navigation.goBack();
  };

  const deletePlaylist = async () => {
    setIsDownloading(true);
    for (const song of music) {
      await deleteSong(song.id);
      await deleteSongMetadata(song.id);
    }
    await deletePlaylistDownloadStatus(playlistTitle);
    setIsDownloading(false);
  };

  const renderHeader = () => (
    <Animated.View style={[styles.headerContainer, {height: headerHeight}]}>
      <TouchableOpacity onPress={handleBackButton} style={styles.backButton}>
        <Icon name="arrow-back" color="#fff" size={28} />
      </TouchableOpacity>
      <Animated.View style={{opacity: coverImageOpacity}}>
        <FastImage
          source={{uri: music[0]?.cover?.url}}
          style={styles.coverImage}
        />
      </Animated.View>
      <Animated.View
        style={[styles.overlayTextContainer, {opacity: titleOpacity}]}>
        <Text numberOfLines={1} style={styles.overlayText}>
          {playlistTitle}
        </Text>
      </Animated.View>
      <View style={styles.playControls}>
        <TouchableOpacity
          onPress={() => {
            if (isDownloading) {
              cancelCurrentDownload();
              setCancelDownload(true);
              setIsDownloading(false);
            } else if (isPlaylistDownloaded) {
              deletePlaylist();
              setIsPlaylistDownloaded(false);
            } else {
              handleDownload();
              setIsPlaylistDownloaded(true);
            }
          }}
          style={styles.shuffleButton}>
          {isDownloading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : isPlaylistDownloaded ? (
            <Icon name="trash" type="font-awesome" color="#FFFFFF" size={20} />
          ) : (
            <Icon
              name="download"
              type="font-awesome"
              color="#FFFFFF"
              size={20}
            />
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.shuffleButton}>
          <Icon name="shuffle" type="material" color="#FFFFFF" size={20} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.playButton}>
          <Icon name="play-arrow" type="material" color="#121212" size={30} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
  const renderItem = useCallback(
    ({item, index}) => (
      <MusicItem
        id={item.id}
        title={item.title}
        artist={item.artists}
        albumArt={item.cover}
        musicData={music}
        songIndex={index}
      />
    ),
    [music],
  );

  return (
    <SafeAreaView style={styles.container}>
      <AnimatedFlatList
        getItemLayout={(data, index) => ({
          length: 50,
          offset: 50 * index,
          index,
        })}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: false},
        )}
        data={music}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        stickyHeaderIndices={[0]}
        scrollEventThrottle={1}
        initialNumToRender={30}
      />
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  headerContainer: {
    width: width,
    height: HEADER_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1b1b1b',
    padding: 25,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
  },
  coverImage: {
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: 10,
    marginBottom: 15,
  },
  overlayTextContainer: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 10,
  },
  playControls: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: -10,
    right: 15,
    gap: 10,
  },
  playButton: {
    backgroundColor: '#FFF',
    borderRadius: 25,
    marginLeft: 10,
  },
  shuffleButton: {
    marginTop: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
});

export default PlaylistScreen;
