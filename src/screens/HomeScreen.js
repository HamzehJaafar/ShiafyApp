import React, {Component} from 'react';
import {View, Text, ScrollView} from 'react-native';

import PlaylistItem from '../playlist-item';
import {connect} from 'react-redux';
import {pause} from '../redux/actions';
import {NetworkConsumer} from 'react-native-offline';
import {Icon} from 'react-native-elements';
import {Trans} from 'react-i18next';
import {signOutUser} from '../FirebaseLogin/api/FirebaseApi';
import {getMusic} from '../FirebaseLogin/api/FirebaseApi';
export class HomeScreen extends Component {
  static navigationOptions = {title: 'Home', header: {visible: false}};

  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.currentSong === this.props.currentSong) {
      return false;
    }
    return true;
  }
  UNSAFE_componentWillMount() {
    if (this.props.isPlaying) {
      this.props.dispatch(pause());
    }
  }

  handleSignOut = async () => {
    await signOutUser();
    this.props.onSignOut();
  };

  getSongs = async () => {
    let music = await getMusic('latmiya', 'arabic');
    this.props.navigation.navigate('Playlist', {music});
  };

  render() {
    const {...props} = this.props;
    const {navigate} = this.props.navigation;
    return (
      <View style={styles.container}>
        <NetworkConsumer>
          {({isConnected}) =>
            isConnected ? (
              <ScrollView>
                <View style={styles.pad}>
                  <View style={styles.headerContainer}>
                    <View style={styles.center}>
                      <Text style={styles.titleHeader}>Categories</Text>
                    </View>
                    <View style={styles.right}>
                      <Icon
                        name="settings"
                        color="white"
                        onPress={this.handleSignOut}
                      />
                    </View>
                  </View>
                  <View style={styles.center}>
                    <PlaylistItem
                      onPress={this.getSongs}
                      source={require('../../assets/images/1.jpg')}
                      followers={12333}
                      title={'Latmiya'}
                    />
                    <PlaylistItem
                      onPress={() => navigate('Nasheed')}
                      source={require('../../assets/images/nasheedMoqawama.jpeg')}
                      followers={12333}
                      title={'Nasheed'}
                    />
                  </View>

                  <View style={styles.center}>
                    <PlaylistItem
                      onPress={() => navigate('Quran')}
                      source={require('../../assets/images/4.jpg')}
                      followers={1234434343433434434333}
                      title={'Quran'}
                    />
                    <PlaylistItem
                      onPress={() => navigate('Dua')}
                      source={require('../../assets/images/2.jpg')}
                      followers={12334233}
                      title={'Dua'}
                    />
                  </View>
                </View>
                <View style={styles.pad} />
                <Text style={styles.title}>Recommended for you...</Text>

                <View style={styles.center}>
                  <PlaylistItem
                    onPress={() => navigate('Podcast')}
                    source={require('../../assets/images/qaed.jpg')}
                    followers={12333}
                    title={'Podcasts'}
                  />
                  <PlaylistItem
                    source={require('../../assets/images/5.jpg')}
                    followers={12334233}
                    title={'Trending'}
                  />
                </View>
              </ScrollView>
            ) : (
              <View>
                <Text style={styles.title}>Currently in offline mode.</Text>
                <Text style={styles.title}>
                  Please connect to the internet for browsing,
                </Text>
                <Text style={styles.title}>
                  or head over to Library for offline music.
                </Text>
              </View>
            )
          }
        </NetworkConsumer>
      </View>
    );
  }
}

const styles = {
  container: {
    flexGrow: 1,
    backgroundColor: 'rgb(4,4,4)',
    justifyContent: 'space-around',
  },
  pad: {
    marginTop: 15,
  },
  title: {
    alignSelf: 'center',
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  titleHeader: {
    alignSelf: 'center',
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    paddingLeft: 40,
  },
  center: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  right: {
    paddingRight: 20,
  },
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
  },
};
function mapStateToProps(state) {
  const {currentSong, isPlaying, playList, currentIndex} = state;

  return {
    currentSong,
    isPlaying,
    playList,
    currentIndex,
  };
}

export default connect(mapStateToProps)(HomeScreen);
