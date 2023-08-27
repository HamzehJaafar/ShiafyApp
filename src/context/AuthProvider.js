// context/AuthProvider.js
import React, {useState, useEffect} from 'react';
import {AuthContext} from './AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AUTH_TOKEN} from '../constants/api'; // import AUTH_TOKEN

const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem(AUTH_TOKEN); // get the token
      if (token) {
        setUser(true); // if there's a token, we consider the user as logged in
      }
      setIsLoading(false);
    };
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{user, setUser, isLoading}}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
