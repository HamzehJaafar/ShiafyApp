import React, {Component} from 'react';

import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

import FastImage from 'react-native-fast-image';
const Header = ({message, onDownPress, onQueuePress, onMessagePress}) => (
  <View style={styles.container}>
    <Text onPress={onMessagePress} style={styles.message}>
      {message.toUpperCase()}
    </Text>
  </View>
);

export default Header;

const styles = StyleSheet.create({
  container: {
    height: 72,
    paddingTop: 20,
    paddingLeft: 12,
    paddingRight: 12,
    flexDirection: 'row',
  },
  message: {
    flex: 1,
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.72)',
    fontWeight: 'bold',
    fontSize: 10,
  },
  button: {
    opacity: 0.72,
    height: 20,
    width: 20,
  },
});
