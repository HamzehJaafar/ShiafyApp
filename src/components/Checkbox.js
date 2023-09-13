import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';

const Checkbox = ({ isChecked, onToggle }) => {
  const [scaleAnim] = useState(new Animated.Value(isChecked ? 1 : 0.5));

  const animateScale = () => {
    Animated.timing(scaleAnim, {
      toValue: isChecked ? 1 : 0.5,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  if (isChecked !== scaleAnim._value) {
    animateScale();
  }

  return (
    <TouchableOpacity onPress={onToggle} style={styles.checkboxContainer}>
      <View style={styles.checkbox}>
        <Animated.View
          style={[
            styles.checked,
            {
              transform: [{ scale: scaleAnim }],
              opacity: isChecked ? 1 : 0,
            },
          ]}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkboxContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 32,
    height: 32,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#1DB954', // Spotify green
    borderRadius: 3, // Rounded corners
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    width: 14,
    height: 14,
    backgroundColor: '#1DB954', // Spotify green
    borderRadius: 2, // Keeping consistency
  },
});

export default Checkbox;
