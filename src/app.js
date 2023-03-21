import React, {useEffect, useState} from 'react';
import {configureStore} from '@reduxjs/toolkit';
import {Provider} from 'react-redux';
import rootReducer from './redux/reducers';
import {MenuProvider} from 'react-native-popup-menu';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AppNavigator from './AppNavigator';
import LoginContainer from './FirebaseLogin/LoginContainer';
import {Platform, InteractionManager} from 'react-native';
import {NetworkProvider} from 'react-native-offline';
import {getUserFromId} from './FirebaseLogin/api/FirebaseApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

const store = configureStore({
  reducer: rootReducer,
});

const Stack = createNativeStackNavigator();
function TopLevelNavigator() {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const checkUserAuthState = async () => {
      try {
        const uid = await AsyncStorage.getItem('user');
        if (uid) {
          setUser(uid);
        }
        setInitializing(false);
      } catch (error) {
        console.error('Error fetching user data from AsyncStorage:', error);
      }
    };
    checkUserAuthState();
  }, []);

  const onLoginSuccess = () => {
    setUser(true);
  };

  const onSignOut = () => {
    setUser(null);
  };

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {user ? (
        <>
          <Stack.Screen name="AppNavigator">
            {props => <AppNavigator {...props} onSignOut={onSignOut} />}
          </Stack.Screen>
        </>
      ) : (
        <Stack.Screen name="Login">
          {props => (
            <LoginContainer {...props} onLoginSuccess={onLoginSuccess} />
          )}
        </Stack.Screen>
      )}
    </Stack.Navigator>
  );
}

function MainPage({t}) {
  return (
    <Provider store={store}>
      <MenuProvider>
        <NetworkProvider>
          <NavigationContainer>
            <TopLevelNavigator />
          </NavigationContainer>
        </NetworkProvider>
      </MenuProvider>
    </Provider>
  );
}

export default MainPage;
