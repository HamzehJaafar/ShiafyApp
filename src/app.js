// MainPage.js
import React, {useContext} from 'react';
import {configureStore} from '@reduxjs/toolkit';
import {Provider} from 'react-redux';
import rootReducer from './redux/reducers';
import {MenuProvider} from 'react-native-popup-menu';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AppNavigator from './AppNavigator';
import {
  Platform,
  InteractionManager,
  ActivityIndicator,
  View,
} from 'react-native';
import {NetworkProvider} from 'react-native-offline';
import AuthProvider from './context/AuthProvider'; // import the AuthProvider
import {AuthContext} from './context/AuthContext'; // import AuthContext
import {useTrackPlayer} from './useTrackPlayer';
import SignInScreen from './login/SignInScreen';
import SignUpScreen from './login/SignUpSceren';
import {removeToken} from './helpers/TokenHelper';
import {LogBox} from 'react-native';
import {QueryClient, QueryClientProvider} from 'react-query'; // import react-query hooks
import useFetchData from './useFetchData';
import SplashScreen from './screens/SplashScreen';

LogBox.ignoreLogs([
  'Sending `playback-state` with no listeners registered',
  'Sending `playback-track-changed` with no listeners registered',
  'Sending `playback-metadata-received` with no listeners registered',
]);

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});
const queryClient = new QueryClient();

const Stack = createNativeStackNavigator();

function TopLevelNavigator() {
  const {user, isLoading, setUser} = useContext(AuthContext); // get user and setUser from AuthContext
  const {forYou, songsLoading, forYouLoading} = useFetchData(user);
  useTrackPlayer();
  const onLoginSuccess = () => {
    setUser(true);
  };

  const onSignOut = () => {
    removeToken();
    setUser(null);
  };

  if (isLoading || songsLoading || forYouLoading) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {user ? (
        <Stack.Screen
          name="AppNavigator"
          screenOptions={{
            headerShown: false,
          }}>
          {props => (
            <AppNavigator {...props} forYou={forYou} onSignOut={onSignOut} />
          )}
        </Stack.Screen>
      ) : (
        <>
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

function MainPage({t}) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <MenuProvider>
          <NetworkProvider>
            <AuthProvider>
              <NavigationContainer>
                <TopLevelNavigator />
              </NavigationContainer>
            </AuthProvider>
          </NetworkProvider>
        </MenuProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default MainPage;
