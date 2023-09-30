import React, {useRef} from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  Animated,
} from 'react-native';
import {Icon} from 'react-native-elements';
import PlaylistItem from '../../playlist-item';
import SongItem from '../../components/SongItem';
import ArtistItem from '../../components/ArtistItem';
import colors from '../../utils/colors';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';
import {POINT_SONG} from '../../redux/actions';
import useFetchData from '../../useFetchData';
const {width, height} = Dimensions.get('window');
const HEADER_HEIGHT = width * 0.2;
const CategoryScreen = ({route, navigation}) => {
  const {categoryName, forYouData} = route.params;

  const {quranForYou, quranForYouLoading, quranForYoutError} = useFetchData();
  const scrollY = useRef(new Animated.Value(0)).current;

  const imageHeight = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [200, HEADER_HEIGHT],
    extrapolate: 'clamp',
  });
  // Image scale effect
  const imageScale = scrollY.interpolate({
    inputRange: [-150, 0],
    outputRange: [1.5, 1],
    extrapolateRight: 'clamp',
  });

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [1, 0.3],
    extrapolate: 'clamp',
  });

  const dispatch = useDispatch();

  const navigateToPlaylist = (songs, title) => {
    navigation.navigate('Playlist', {
      music: songs,
      playlistTitle: title,
    });
  };

  const renderData = item => {
    if (item.artists) {
      return (
        <>
          <Text style={styles.sectionTitle}>{item.title}</Text>
          <FlatList
            horizontal
            data={item.artists}
            renderItem={({item: artist}) => <ArtistItem artist={artist} />}
            keyExtractor={artist => `${artist.id}`}
          />
        </>
      );
    } else if (item.playlists) {
      return (
        <>
          <Text style={styles.sectionTitle}>{item.title}</Text>
          <FlatList
            horizontal
            data={item.playlists}
            renderItem={({item: playlist}) => (
              <PlaylistItem
                onPress={() =>
                  navigateToPlaylist(playlist.songs, playlist.title)
                }
                source={{uri: playlist?.songs[0].cover?.url}}
                title={playlist.title}
                followers={playlist.followers}
              />
            )}
            keyExtractor={playlist => `${playlist.id}`}
          />
        </>
      );
    } else if (item.songs) {
      return (
        <>
          <Text
            onPress={() => navigateToPlaylist(item.songs, item.title)}
            style={styles.sectionTitle}>
            {item.title}
          </Text>

          <FlatList
            horizontal
            data={item.songs}
            renderItem={({item: songItem, index}) => (
              <SongItem
                song={songItem}
                key={index}
                onPress={() =>
                  dispatch({
                    type: POINT_SONG,
                    playList: item.songs,
                    song: index,
                  })
                }
              />
            )}
            keyExtractor={(songItem, index) => `${songItem.id}-${index}`}
          />
        </>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[styles.headerImageContainer, {height: imageHeight}]}>
        <Animated.Image
          source={{uri: quranForYou?.cover.url}}
          blurRadius={3}
          style={[
            styles.headerImage,
            {
              transform: [{scale: imageScale}],
              opacity: imageOpacity,
            },
          ]}
        />
        <View style={styles.overlayTextContainer}>
          <Text style={[styles.overlayText, styles.titleHeaderBottomRight]}>
            {categoryName}
          </Text>
        </View>
      </Animated.View>

      <Animated.ScrollView
        style={[styles.scrollView]} // Add paddingTop
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: false},
        )}>
        {!quranForYouLoading
          ? quranForYou.data.map((dataItem, index) => (
              <View key={index} style={styles.sectionContainer}>
                {renderData(dataItem)}
              </View>
            ))
          : null}
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  titleHeaderBottomRight: {
    position: 'absolute',
    bottom: 10,
    left: 10,
  },

  headerImageContainer: {
    width: '100%',
    backgroundColor: 'gray',
    overflow: 'hidden',
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlayTextContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 10,
  },

  container: {
    flex: 1,
    backgroundColor: colors.secondary,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: width * 0.05,
  },
  titleHeader: {
    color: colors.primary,
    fontSize: width * 0.08,
    fontFamily: 'Avenir Next',
  },
  sideIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingRight: 15,
  },
  scrollView: {
    marginBottom: 70,
  },
  sectionContainer: {
    padding: width * 0.05,
  },
  sectionTitle: {
    color: colors.white,
    fontSize: width * 0.05,
    marginBottom: height * 0.01,
    fontFamily: 'Avenir Next',
  },
});

export default CategoryScreen;
