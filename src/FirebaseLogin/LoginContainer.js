import React, {Component} from 'react';

import {View, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import FirebaseLogin from '.';
//import {checkInternetConnection} from 'react-native-offline';
import {w, h, totalSize} from './api/Dimensions';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';

const companyLogo = require('./assets/companylogo.png');
function LoginContainer({onLoginSuccess}) {
  return (
    <View>
      <FirebaseLogin login={onLoginSuccess} />
    </View>
  );
}
export default LoginContainer;

const styles = {
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#020D00',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: w(70),
    height: h(40),
    marginBottom: h(2),
  },
};
