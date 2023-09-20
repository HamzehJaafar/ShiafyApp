import {useMutation, useQuery, useQueryClient} from 'react-query';
import {
  getForYou,
  getLikedSongs,
  likeSong,
  logSongPlay,
  unlikeSong,
} from './helpers/ApiHelper';
import {fetchPrivatePlaylistsOfUser, getRecentPlaylist} from './api/playlist';

const useFetchData = user => {
  const queryClient = useQueryClient();

  const {
    data: forYou,
    isLoading: forYouLoading,
    isError: forYouError,
  } = useQuery('getForYou', getForYou, {
    enabled: !!user,
  });

  const {
    data: likedSongs,
    isLoading: likedSongsLoading,
    isError: likedSongsError,
  } = useQuery('getLikedSongs', getLikedSongs, {
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
  } = useQuery('getPrivatePlaylists', fetchPrivatePlaylistsOfUser, {
    enabled: !!user,
  });

  const {
    data: recentPlaylist,
    isLoading: recentPlaylistLoading,
    isError: recentPlaylistError,
  } = useQuery('getRecentPlaylist', getRecentPlaylist, {
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
