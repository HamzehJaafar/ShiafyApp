// components/MusicCategories.js

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const categories = ['Quran', 'Latmiya', 'Nasheed', 'Dua', 'Podcasts'];

const MusicCategories = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollContainer}>
      {categories.map((category) => (
        <TouchableOpacity
          key={category}
          style={[
            styles.category,
            selectedCategory === category && styles.selectedCategory,
          ]}
          onPress={() => setSelectedCategory(category)}
        >
          <Text
            style={[
              styles.categoryText,
              selectedCategory === category && styles.selectedCategoryText,
            ]}
          >
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingLeft: 10,
  },
  category: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: 'rgba(0,0,0,0.1)',  // Adding a subtle background
    marginLeft: 8,
    elevation: 5,  // For Android shadow
    shadowColor: '#000',  // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  selectedCategory: {
    backgroundColor: '#1DB954',  // Spotify's highlight color
  },
  categoryText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,  // Making the font size larger
  },
  selectedCategoryText: {
    color: 'white',
  },
});

export default MusicCategories;
