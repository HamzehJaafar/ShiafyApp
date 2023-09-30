import React, { useState, useRef } from 'react';
import { View, PanResponder, Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

const Slider = ({ onValueChange, maximumValue = 100, minimumValue = 0, value = 0 }) => {
    const [sliderValue, setSliderValue] = useState(value);
    const fillRef = useRef(null);
    const thumbRef = useRef(null);
  
    const panResponder = useRef(
      PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (evt, gestureState) => {
          const newValue = ((gestureState.moveX) / width) * (maximumValue - minimumValue) + minimumValue;
          
          if (newValue >= minimumValue && newValue <= maximumValue) {
            const fillWidth = (newValue / maximumValue) * (width - 40);
            fillRef.current.setNativeProps({ style: { width: fillWidth } });
            thumbRef.current.setNativeProps({ style: { left: fillWidth - 10 } });
          }
        },
        onPanResponderRelease: () => {
          onValueChange && onValueChange(sliderValue);
        }
      })
    ).current;
  
    const fillWidth = (sliderValue / maximumValue) * (width - 40);
  
    return (
      <View style={styles.container}>
        <View ref={fillRef} style={[styles.fill, { width: fillWidth }]} />
        <View style={[styles.backgroundFill, { width: width - 40 - fillWidth }]} />
        <View
          ref={thumbRef}
          style={[styles.thumb, { left: fillWidth - 10 }]}
          {...panResponder.panHandlers}
        />
      </View>
    );
  };

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 20,
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    width: width - 40, // subtracting margins or paddings if any
  },
  fill: {
    height: 20,
    backgroundColor: 'blue',
  },
  backgroundFill: {
    height: 20,
    backgroundColor: 'gray',
  },
  thumb: {
    position: 'absolute',
    width: 20,
    height: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'gray',
    elevation: 5, // for shadow on Android
    shadowColor: "#000", // for shadow on iOS
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default Slider;
