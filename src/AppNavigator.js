import React from 'react';
import {
  createBottomTabNavigator,
  BottomTabBar,
} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {Icon} from 'react-native-elements';
import {View} from 'react-native';

import HomeScreen from './screens/HomeScreen';
import PlayerScreen from './screens/PlayerScreen';
import PlaylistScreen from './screens/PlayListScreen';
import BottomPlayer from './components/BottomPlayer';
import NavigationService from './NavigationService';
import LibraryScreen from './screens/LibraryScreen';
import SearchScreen from './screens/SearchScreen';

// Create instances of navigator objects
const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const RootStack = createStackNavigator();

// HomeStack - a Stack Navigator containing HomeScreen and PlaylistScreen
const HomeStackNavigator = ({onSignOut, forYou}) => (
  <HomeStack.Navigator screenOptions={{headerShown: false}}>
    <HomeStack.Screen name="Main">
      {props => <HomeScreen {...props} forYou={forYou} onSignOut={onSignOut} />}
    </HomeStack.Screen>
    <HomeStack.Screen name="Playlist" component={PlaylistScreen} />
  </HomeStack.Navigator>
);

// CustomTabBar - a custom Tab Bar component that includes BottomPlayer
const CustomTabBar = props => (
  <View style={{position: 'absolute', bottom: 0, left: 0, right: 0}}>
    <BottomPlayer />
    <BottomTabBar {...props} />
  </View>
);

// MainTabNavigator - a Tab Navigator containing the main app screens
// MainTabNavigator - a Tab Navigator containing the main app screens
const MainTabNavigator = ({onSignOut, forYou}) => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
    }}
    tabBar={props => <CustomTabBar {...props} />}>
    <Tab.Screen
      name="Home"
      options={{
        tabBarIcon: ({color, size}) => (
          <Icon name="home" type="material" color={color} size={size} />
        ),
        tabBarLabel: () => null,
      }}>
      {props => (
        <HomeStackNavigator {...props} forYou={forYou} onSignOut={onSignOut} />
      )}
    </Tab.Screen>
    <Tab.Screen
      name="Search"
      component={SearchScreen}
      options={{
        tabBarIcon: ({color, size}) => (
          <Icon name="search" type="material" color={color} size={size} />
        ),
        tabBarLabel: () => null,
      }}
    />
    <Tab.Screen
      name="Library"
      component={LibraryScreen}
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
  </Tab.Navigator>
);

// AppNavigator - a Root Stack Navigator for the entire app, with PlayerScreen on top
const AppNavigator = ({onSignOut, forYou}) => {
  const navigationRef = React.useRef();

  React.useEffect(() => {
    NavigationService.setTopLevelNavigator(navigationRef.current);
  }, []);

  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
        presentation: 'modal', // Update here
        cardStyle: {backgroundColor: 'transparent'}, // Change the background color here
      }}>
      <RootStack.Screen name="Main">
        {props => (
          <MainTabNavigator
            options={{headerShown: false}}
            {...props}
            onSignOut={onSignOut}
            forYou={forYou}
          />
        )}
      </RootStack.Screen>
      <RootStack.Screen
        name="Player"
        component={PlayerScreen}
        options={{
          headerShown: true,
          backgroundColor: 'transparent',
          headerBackTitleVisible: false,
          headerBackImage: () => (
            <View style={{paddingLeft: 30, paddingTop: 0}}>
              <Icon
                name="arrow-downward"
                type="material"
                color="black"
                size={30}
              />
            </View>
          ),
        }}
      />
    </RootStack.Navigator>
  );
};

export default AppNavigator;
