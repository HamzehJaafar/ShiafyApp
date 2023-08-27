import {useMutation, useQuery, useQueryClient} from 'react-query';
import {
  getForYou,
  getLikedSongs,
  likeSong,
  unlikeSong,
} from './helpers/ApiHelper';

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
  });

  const unlikeMutation = useMutation(unlikeSong, {
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries('getLikedSongs');
    },
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
  };
};

export default useFetchData;
