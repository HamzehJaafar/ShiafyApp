import {useMutation, useQuery, useQueryClient} from 'react-query';
import {
  getForYou,
  getLikedSongs,
  getQuranForYou,
  likeSong,
  logSongPlay,
  unlikeSong,
} from './helpers/ApiHelper';
import {fetchPrivatePlaylistsOfUser, getRecentPlaylist} from './api/playlist';
import AsyncStorage from '@react-native-async-storage/async-storage';


const withCache = (key, asyncFn) => async (...args) => {
  try {
    const data = await asyncFn(...args);
    await AsyncStorage.setItem(key, JSON.stringify(data)); // Cache the data
    return data;
  } catch (error) {
    // If there's an error (e.g., no network), try to get the cached data
    const cachedData = await AsyncStorage.getItem(key);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    throw error; // If there's no cached data, throw the error
  }
};



const useFetchData = user => {

  const queryClient = useQueryClient();

  const getCachedForYou = withCache('cachedForYou', getForYou);
  const getCachedQuranForYou = withCache('cachedQuranForYou', getQuranForYou);

  const getCachedLikedSongs = withCache('cachedLikedSongs', getLikedSongs);
  const getCachedPrivatePlaylists = withCache('cachedPrivatePlaylists', fetchPrivatePlaylistsOfUser);
  const getCachedRecentPlaylist = withCache('cachedRecentPlaylist', getRecentPlaylist);


  const {
    data: forYou,
    isLoading: forYouLoading,
    isError: forYouError,
  } = useQuery('getForYou', getCachedForYou, {
    enabled: !!user,
  });


  const {
    data: quranForYou,
    isLoading: quranForYouLoading,
    isError: quranForYouError,
  } = useQuery('getQuranForYou', getCachedQuranForYou, {
    enabled: !!user,
  });


  const {
    data: likedSongs,
    isLoading: likedSongsLoading,
    isError: likedSongsError,
  } = useQuery('getLikedSongs', getCachedLikedSongs, {
    enabled: !!user,
  });

  const likeMutation = useMutation(likeSong, {
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries('getLikedSongs');
    },
    onError: (err, songId, context) => {
      queryClient.setQueryData('getLikedSongs', context.previousLikedSongs);
    },
    onSettled: () => {
      queryClient.invalidateQueries('getLikedSongs');
    },
  });

  const addSongHistory = useMutation(logSongPlay, {
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries('getRecentPlaylist');
    },
    onError: (err, songId, context) => {
      console.log(err)

    },
    onSettled: () => {
      queryClient.invalidateQueries('getRecentPlaylist');
    },
  });

  const unlikeMutation = useMutation(unlikeSong, {
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries('getLikedSongs');
    },
    onError: (err, songId, context) => {
      queryClient.setQueryData('getLikedSongs', context.previousLikedSongs);
    },
    onSettled: () => {
      queryClient.invalidateQueries('getLikedSongs');
    },
  });

  const {
    data: privatePlaylists,
    isLoading: privatePlaylistsLoading,
    isError: privatePlaylistsError,
  } = useQuery('getPrivatePlaylists', getCachedPrivatePlaylists, {
    enabled: !!user,
  });

  const {
    data: recentPlaylist,
    isLoading: recentPlaylistLoading,
    isError: recentPlaylistError,
  } = useQuery('getRecentPlaylist', getCachedRecentPlaylist, {
    enabled: !!user,
  });

   const logSong = async (userId, songId) => {

    try {
      const data = await addSongHistory.mutateAsync({userId, songId});
      return data
    } catch (error) {
      console.error('Error logging song:', error);
      throw error;
    }
  };

  return {
    forYou,
    forYouLoading,
    forYouError,
    quranForYou,
    quranForYouLoading,
    quranForYouError,
    likedSongs,
    likedSongsLoading,
    likedSongsError,
    logSong,
    likeSong: likeMutation.mutate,
    unlikeSong: unlikeMutation.mutate,
    addSongHistory: addSongHistory.mutate,
    privatePlaylists,
    privatePlaylistsLoading,
    privatePlaylistsError,
    recentPlaylist,
    recentPlaylistLoading,
    recentPlaylistError,
  };
};

export default useFetchData;
