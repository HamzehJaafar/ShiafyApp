import {useMutation, useQuery, useQueryClient} from 'react-query';
import {
  getForYou,
  getLikedSongs,
  likeSong,
  unlikeSong,
} from './helpers/ApiHelper';
import { fetchPrivatePlaylistsOfUser } from './api/playlist';

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

  return {
    forYou,
    forYouLoading,
    forYouError,
    likedSongs,
    likedSongsLoading,
    likedSongsError,
    likeSong: likeMutation.mutate,
    unlikeSong: unlikeMutation.mutate,
    privatePlaylists,
    privatePlaylistsLoading,
    privatePlaylistsError,
  };
};

export default useFetchData;
