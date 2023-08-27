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
import {useSelector} from 'react-redux';
import {useQuery} from 'react-query';
import {Icon, Image} from 'react-native-elements';
import PlaylistItem from '../playlist-item';
import ArtistItem from '../components/ArtistItem';
import {getForYou, getSongsByGenre} from '../helpers/ApiHelper';
import SongItem from '../components/SongItem';
import colors from '../utils/colors';
import {SafeAreaView} from 'react-native-safe-area-context';
import {removeToken} from '../helpers/TokenHelper';
const {width, height} = Dimensions.get('window');

const HomeScreen = ({navigation, onSignOut, forYou}) => {
  const {isPlaying} = useSelector(state => state);

  const handleSignOut = async () => {
    onSignOut();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.headerContainer}>
          <Text style={styles.titleHeader}>
            بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </Text>
          <TouchableOpacity onPress={handleSignOut} style={styles.settingsIcon}>
            <Icon name="settings" color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Trending Playlists</Text>
          <FlatList
            horizontal
            data={forYou?.playlists?.data}
            renderItem={({item}) => (
              <PlaylistItem
                onPress={() =>
                  navigation.navigate('Playlist', {
                    music: item.songs.data,
                    playlistTitle: item.title,
                    headerImage: {uri: item.cover.url},
                  })
                }
                source={{uri: item.cover.url}}
                title={item.title}
                followers={item.followers}
              />
            )}
            keyExtractor={item => item.id.toString()}
          />
        </View>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Featured Artists</Text>
          <FlatList
            horizontal
            data={forYou?.artists?.data}
            renderItem={({item}) => (
              <ArtistItem
                source={{uri: item.profile_cover.url}}
                artistName={item.name}
                followers={item.followers}
              />
            )}
            keyExtractor={item => item.id.toString()}
          />
        </View>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Top Sounds</Text>
          <FlatList
            horizontal
            data={forYou?.songs?.data}
            renderItem={({item, index}) => (
              <SongItem
                song={item}
                onPress={song =>
                  navigation.navigate('Player', {
                    musicData: forYou?.songs.data,
                    song: index,
                  })
                }
              />
            )}
            keyExtractor={item => item.id.toString()}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = {
  center: {
    justifyContent: 'center',
    alignItems: 'center',
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
    padding: width * 0.05, // Responsive padding
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
  settingsIcon: {
    padding: 10, // Extra padding for easier touching
  },
  sectionContainer: {
    marginBottom: height * 0.04, // Responsive marginBottom
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
};

export default HomeScreen;
