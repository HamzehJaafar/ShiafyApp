import React, {useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useQuery} from 'react-query';
import {Icon, Image} from 'react-native-elements';
import PlaylistItem from '../playlist-item';
import ArtistItem from '../components/ArtistItem';
import {getForYou, getSongsByGenre} from '../helpers/ApiHelper';
import SongItem from '../components/SongItem';
import colors from '../utils/colors';
import {SafeAreaView} from 'react-native-safe-area-context';
import {removeToken} from '../helpers/TokenHelper';
import Carousel from 'react-native-reanimated-carousel';
import MusicCategories from '../components/MusicCategories';
import useFetchData from '../useFetchData';
import {POINT_SONG} from '../redux/actions';
import FastImage from 'react-native-fast-image';
const {width, height} = Dimensions.get('window');

const HomeScreen = ({navigation, onSignOut, forYou}) => {
  const {currentSong} = useSelector(state => state);
  const {recentPlaylist, recentPlaylistLoading, recentPlaylistError} =
    useFetchData();

  const handleSignOut = async () => {
    onSignOut();
  };
  const dispatch = useDispatch();

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.headerContainer, styles.addPadding]}>
        <Text style={styles.titleHeader}>
          بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
        </Text>
        <View style={styles.sideIcons}>
          <Icon name="notifications" color="white" />
          <Icon name="history" color="white" />
          <TouchableOpacity onPress={handleSignOut} style={styles.settingsIcon}>
            <Icon name="settings" color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={currentSong ? styles.scrollView : null}>
        <Carousel
          loop
          width={width}
          height={width / 1.5}
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 0.9,
            parallaxScrollingOffset: 80,
          }}
          itemWidth={width * 0.8}
          spacing={16}
          data={forYou?.playlists}
          renderItem={({item}) => (
            <View style={styles.carouselCard}>
              {item?.cover?.url ? (
                <FastImage
                  source={{uri: item.cover.url}}
                  style={styles.carouselImage}
                />
              ) : null}
              <Text style={styles.carouselTitle}>{item.title}</Text>
            </View>
          )}
        />
        <MusicCategories />

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Trending Playlists</Text>
          <FlatList
            horizontal
            data={forYou?.playlists}
            renderItem={({item}) => (
              <PlaylistItem
                onPress={() =>
                  navigation.navigate('Playlist', {
                    music: item.songs,
                    playlistTitle: item.title,
                    headerImage: {uri: item.cover.url},
                  })
                }
                source={{uri: item.cover.url}}
                title={item.title}
                followers={item.followers}
              />
            )}
            keyExtractor={(item, index) => `${item.id}-${index}`}
          />
        </View>
        {!recentPlaylistLoading ? (
          <>
            <View style={styles.sectionContainer}>
              <Text
                onPress={() =>
                  navigation.navigate('Playlist', {
                    music: recentPlaylist,
                    playlistTitle: 'Recent History',
                  })
                }
                style={styles.sectionTitle}>
                Recently Played
              </Text>
              <FlatList
                horizontal
                data={recentPlaylist}
                renderItem={({item, index}) => (
                  <SongItem
                    size="default" // or "small"
                    song={item}
                    key={index}
                    onPress={song =>
                      dispatch({
                        type: POINT_SONG,
                        playList: recentPlaylist,
                        song: index,
                      })
                    }
                  />
                )}
                keyExtractor={(item, index) => `${item.id}-${index}`}
              />
            </View>
          </>
        ) : null}

        {!recentPlaylistLoading ? (
          <>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Top Played</Text>
              <FlatList
                horizontal
                data={recentPlaylist}
                renderItem={({item, index}) => (
                  <SongItem
                    size="default" // or "small"
                    song={item}
                    key={index}
                    onPress={song =>
                      dispatch({
                        type: POINT_SONG,
                        playList: recentPlaylist,
                        song: index,
                      })
                    }
                  />
                )}
                keyExtractor={(item, index) => `${item.id}-${index}`}
              />
            </View>
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = {
  sideIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingRight: 15,
  },
  addPadding: {
    paddingHorizontal: width * 0.05, // Responsive padding
  },
  scrollView: {
    marginBottom: 70,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0, // Remove padding or adjust as needed
  },
  containerLoading: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#000',
  },

  logo: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginBottom: 20,
  },
  container: {
    flex: 1,
    backgroundColor: colors.secondary,
    marginBottom: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height * 0.02, // Responsive marginBottom
  },
  titleHeader: {
    color: colors.primary,
    fontSize: width * 0.05, // Responsive fontSize
    fontFamily: 'Avenir Next', // Custom font
  },
  sectionContainer: {
    padding: width * 0.05, // Responsive padding
  },
  sectionTitle: {
    color: colors.white,
    fontSize: width * 0.05, // Responsive fontSize
    marginBottom: height * 0.01, // Responsive marginBottom
    fontFamily: 'Avenir Next', // Custom font
  },
  error: {
    color: colors.lightGrey,
    fontSize: width * 0.04, // Responsive fontSize
  },
  carouselCard: {
    flex: 1,
    justifyContent: 'center',
    borderRadius: 15,
    overflow: 'hidden',
  },

  carouselImage: {
    width: '100%',
    height: '100%',
  },
  carouselTitle: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    color: colors.primary,
    fontSize: width * 0.04,
    fontFamily: 'Avenir Next',
  },
};

export default HomeScreen;
