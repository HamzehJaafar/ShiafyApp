import React, {useEffect, useRef} from 'react';
import {
  createBottomTabNavigator,
  BottomTabBar,
} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {Icon, Text} from 'react-native-elements';
import {View} from 'react-native';

import HomeScreen from './screens/HomeScreen';
import PlayerScreen from './screens/PlayerScreen';
import PlaylistScreen from './screens/PlayListScreen';
import NavigationService from './NavigationService';
import LibraryScreen from './screens/LibraryScreen';
import SearchScreen from './screens/SearchScreen';
import AddToPlaylistModal from './components/AddToPlaylistModal';
import {useModal} from './context/ModalContext';
import BottomPlayer from './components/BottomPlayer';
import {useBottomSheet} from '@gorhom/bottom-sheet';
import {TouchableOpacity} from 'react-native-gesture-handler';

const Tab = createBottomTabNavigator();
const RootStack = createStackNavigator();
const HomeStack = createStackNavigator();
const SearchStack = createStackNavigator();
const LibraryStack = createStackNavigator();

// Home Stack
const HomeStackNavigator = ({onSignOut, forYou}) => (
  <HomeStack.Navigator screenOptions={{headerShown: false}}>
    <HomeStack.Screen name="Main">
      {props => <HomeScreen {...props} forYou={forYou} onSignOut={onSignOut} />}
    </HomeStack.Screen>
    <HomeStack.Screen name="Playlist" component={PlaylistScreen} />
  </HomeStack.Navigator>
);

// Search Stack
const SearchStackNavigator = () => (
  <SearchStack.Navigator screenOptions={{headerShown: false}}>
    <SearchStack.Screen name="SearchMain" component={SearchScreen} />
    <SearchStack.Screen name="Playlist" component={PlaylistScreen} />
  </SearchStack.Navigator>
);

// Library Stack
const LibraryStackNavigator = () => (
  <LibraryStack.Navigator screenOptions={{headerShown: false}}>
    <LibraryStack.Screen name="LibraryMain" component={LibraryScreen} />
    <LibraryStack.Screen name="Playlist" component={PlaylistScreen} />
  </LibraryStack.Navigator>
);
const colors = {
  primary: '#1DB954', // Spotify Green
  secondary: '#121212', // Dark Gray
  white: '#FFFFFF',
  lightGrey: '#B3B3B3',
  darkGrey: '#282828', // Slightly Darker Gray
};
const CustomTabBar = props => {
  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: -1},
        shadowOpacity: 0.8,
        shadowRadius: 15,
        gap: 3,
        elevation: 5,// Adjust padding as needed
      }}>
      <BottomPlayer />
      <View
        style={{
          flexDirection: 'row',
          height: 60,
          alignItems: 'center',
          backgroundColor: colors.darkGrey,
          paddingBottom: 10,
          paddingTop: 10,
          justifyContent: 'space-around',
          
        }}>
        {props.state.routes.map((route, index) => {
          const focused = index === props.state.index;
          const {options} = props.descriptors[route.key];

          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const onPress = () => {
            const event = props.navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!focused && !event.defaultPrevented) {
              props.navigation.navigate(route.name);
            }
          };

          const color = focused ? colors.primary : colors.lightGrey;

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              {options.tabBarIcon && options.tabBarIcon({color, size: 24})}
              <Text style={{color, marginTop: 4}}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const MainTabNavigator = ({onSignOut, forYou}) => {
  const playerSheetRef = useRef(null);
  const {openPlayer} = useModal();

  return (
    <View style={{flex: 1}}>
      <Tab.Navigator
        screenOptions={{headerShown: false}}
        tabBarOptions={{
          activeTintColor: colors.primary,
          inactiveTintColor: colors.lightGrey,
          style: {
            borderTopWidth: 0,
            backgroundColor: 'rgba(18, 18, 18, 0.95)', // Dark with some opacity
            elevation: 5,
          },
          labelStyle: {
            fontSize: 11,
            marginBottom: 5,
          },
        }}
        tabBar={props => <CustomTabBar {...props} />}>
        <Tab.Screen
          name="Home"
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon
                name="home"
                type="material"
                color={color}
                size={size * 1.2}
              />
            ),
            tabBarLabel: 'Home',
          }}>
          {props => (
            <HomeStackNavigator
              {...props}
              forYou={forYou}
              onSignOut={onSignOut}
            />
          )}
        </Tab.Screen>
        <Tab.Screen
          name="Search"
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon
                name="search"
                type="material"
                color={color}
                size={size * 1.2}
              />
            ),
            tabBarLabel: 'Search',
          }}>
          {props => <SearchStackNavigator {...props} />}
        </Tab.Screen>
        <Tab.Screen
          name="Library"
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon
                name="library-music"
                type="material"
                color={color}
                size={size * 1.2}
              />
            ),
            tabBarLabel: 'Library',
          }}>
          {props => <LibraryStackNavigator {...props} />}
        </Tab.Screen>
      </Tab.Navigator>
    </View>
  );
};

const AppNavigator = ({onSignOut, forYou}) => {
  const navigationRef = React.useRef();

  React.useEffect(() => {
    NavigationService.setTopLevelNavigator(navigationRef.current);
  }, []);

  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
        presentation: 'modal',
        cardStyle: {backgroundColor: 'transparent'},
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
    </RootStack.Navigator>
  );
};

export default AppNavigator;
