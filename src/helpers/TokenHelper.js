// src/helpers.js

import AsyncStorage from '@react-native-async-storage/async-storage';
import {AUTH_TOKEN} from '../constants/api';

export const getToken = async () => {
  try {
    return await AsyncStorage.getItem(AUTH_TOKEN);
  } catch (error) {
    // Error retrieving data
    console.log(error.message);
  }
};

export const setToken = async token => {
  if (token) {
    try {
      await AsyncStorage.setItem(AUTH_TOKEN, token);
    } catch (error) {
      // Error saving data
      console.log(error.message);
    }
  }
};

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(AUTH_TOKEN);
  } catch (error) {
    // Error removing data
    console.log(error.message);
  }
};
