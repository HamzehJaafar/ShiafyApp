import TrackPlayer from 'react-native-track-player';

export const togglePlay = (isPlaying, dispatch) => {
  if (isPlaying) {
    dispatch({type: 'PAUSE'});
    TrackPlayer.pause();
  } else {
    dispatch({type: 'PAUSE'});
    TrackPlayer.play();
  }

  TrackPlayer.pause();
};

export const playPrevious = async (currentIndex, playList, dispatch) => {
  // Implement play previous functionality here
  if (playList.length === 0) {
    return;
  }
  const newIndex = (currentIndex - 1 + playList.length) % playList.length;
  const newSong = playList[newIndex];
  await TrackPlayer.reset();
  await TrackPlayer.add({
    id: newSong.id,
    url: newSong.audioUrl,
    title: newSong.title,
    artist: newSong.artist,
    artwork: newSong.albumArtUrl,
  });
  TrackPlayer.play();
  dispatch({type: 'LAST_SONG'});
};

export const playNext = async (currentIndex, playList, dispatch) => {
  // Implement play next functionality here
  if (playList.length === 0) {
    return;
  }
  const newIndex = (currentIndex + 1) % playList.length;
  const newSong = playList[newIndex];
  await TrackPlayer.reset();
  await TrackPlayer.add({
    id: newSong.id,
    url: newSong.audioUrl,
    title: newSong.title,
    artist: newSong.artist,
    artwork: newSong.albumArtUrl,
  });
  TrackPlayer.play();
  dispatch({type: 'NEXT_SONG'});
};
