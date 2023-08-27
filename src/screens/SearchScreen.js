import React, {useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import MusicItem from '../components/MusicItem';
import {useNavigation} from '@react-navigation/native';
import {Icon} from 'react-native-elements';
import {SafeAreaView} from 'react-native-safe-area-context';
import {getSearch} from '../helpers/ApiHelper';

const windowWidth = Dimensions.get('window').width;

const SearchScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  // Our debounce function
  function debounce(fn, delay) {
    let timerId;
    return function (...args) {
      if (timerId) {
        clearTimeout(timerId);
      }
      timerId = setTimeout(() => {
        fn(...args);
        timerId = null;
      }, delay);
    };
  }

  // Trigger the debounced search function whenever searchTerm changes
  useEffect(() => {
    if (searchTerm) {
      debouncedSearch();
    }
  }, [searchTerm, debouncedSearch]);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const results = await getSearch(searchTerm);
      setSearchResults(results.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Create debounced version of search function
  const debouncedSearch = useCallback(debounce(handleSearch, 500), [
    searchTerm,
  ]);

  const renderSearchResults = () => {
    if (isLoading) {
      return <ActivityIndicator size="large" color="#00ff00" />;
    }

    if (error) {
      return <Text style={styles.error}>{error}</Text>;
    }

    if (searchResults.length === 0) {
      if (searchTerm === '') {
        return <Text style={styles.noResults}>You can search</Text>;
      }
      return (
        <Text style={styles.noResults}>
          No results found for "{searchTerm}".
        </Text>
      );
    }

    return (
      <FlatList
        data={searchResults}
        keyExtractor={item => item.id}
        renderItem={({item, index}) => (
          <MusicItem
            id={item.id}
            title={item.title}
            artist={item.artists}
            albumArt={item.cover}
            musicData={searchResults}
            songIndex={index}
          />
        )}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          placeholderTextColor="#aaa"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <TouchableOpacity onPress={handleSearch}>
          <Icon name="search" type="font-awesome" color="#aaa" />
        </TouchableOpacity>
      </View>
      {renderSearchResults()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: '#1e1e1e',
  },
  searchContainer: {
    flexDirection: 'row',
    height: 40,
    width: '90%',
    backgroundColor: '#1b1b1b',
    borderRadius: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 15,
    marginTop: 10,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    textAlign: 'left',
  },
  searchButton: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: '#1db954',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  noResults: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default SearchScreen;
