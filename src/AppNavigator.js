import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import PlayerScreen from './screens/PlayerScreen';
import NavigationService from './NavigationService';
import {Icon} from 'react-native-elements';
import PlaylistScreen from './screens/PlayListScreen';
import BottomPlayer from './components/BottomPlayer';
import {View} from 'react-native';
import {BottomTabBar} from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        component={HomeScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

const CustomTabBar = props => {
  return (
    <View style={{position: 'absolute', bottom: 0, left: 0, right: 0}}>
      <BottomPlayer />
      <BottomTabBar {...props} />
    </View>
  );
};

function MainTabNavigator({onSignOut}) {
  return (
    <View style={{flex: 1}}>
      <Tab.Navigator tabBar={props => <CustomTabBar {...props} />}>
        <Tab.Screen
          name="MainTab"
          component={HomeStack}
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon name="home" type="material" color={color} size={size} />
            ),
            headerShown: false,
            tabBarLabel: () => null,
          }}
        />
        <Tab.Screen
          name="SearchTab"
          component={HomeStack}
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon name="search" type="material" color={color} size={size} />
            ),
            headerShown: false,
            tabBarLabel: () => null,
          }}
        />
        <Tab.Screen
          name="LibraryTab"
          component={HomeStack}
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon
                name="library-music"
                type="material"
                color={color}
                size={size}
              />
            ),
            tabBarLabel: () => null,
          }}
        />
        <Tab.Screen
          name="PlaylistTab"
          component={PlaylistScreen}
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon
                name="playlist-play"
                type="material"
                color={color}
                size={size}
              />
            ),
            tabBarLabel: () => null,
          }}
        />
      </Tab.Navigator>
    </View>
  );
}

function AppNavigator({navigation, route, onSignOut}) {
  const navigationRef = React.useRef();

  React.useEffect(() => {
    NavigationService.setTopLevelNavigator(navigationRef.current);
  }, []);

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Main">
        {props => <MainTabNavigator {...props} onSignOut={onSignOut} />}
      </Stack.Screen>
      <Stack.Screen name="Playlist" component={PlaylistScreen} />
      <Stack.Screen name="Player" component={PlayerScreen} />
    </Stack.Navigator>
  );
}

export default AppNavigator;
