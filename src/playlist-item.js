/**
 * Created by ggoma on 12/22/16.
 */
import React from 'react';
import {View, Text, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import FastImage from 'react-native-fast-image';
import D from './utils/dimensions';

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export default props => {
  return (
    <TouchableWithoutFeedback onPress={props.onPress}>
      <View style={styles.container}>
        <FastImage
          source={props.source}
          style={[
            styles.album,
            props.circle ? {borderRadius: (D.width * 4.2) / 10 / 2} : {},
          ]}
        />

        <Text style={styles.text}>{props.title}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 8,
    marginLeft: 12,
  },

  album: {
    width: (D.width * 4.2) / 12,
    height: (D.width * 4.2) / 16,
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
  },

  img: {
    flex: 1,
    height: null,
    width: null,
  },

  text: {
    //fontSize: 10,
    color: 'white',
    fontWeight: '600',
    alignSelf: 'center',
    marginTop: 8,
  },

  followers: {
    fontSize: 8,
    color: 'gray',
    alignSelf: 'center',
    fontWeight: '600',
    marginTop: 4,
  },
});
