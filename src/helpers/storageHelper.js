import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeSongMetadata = async (songId, metadata) => {
  await AsyncStorage.setItem(`song-${songId}`, JSON.stringify(metadata));
};

export const deleteSongMetadata = async (songId) => {
  await AsyncStorage.removeItem(`song-${songId}`);
};

export const getSongMetadata = async (songId) => {
  const metadata = await AsyncStorage.getItem(`song-${songId}`);
  return JSON.parse(metadata);
};

export const getAllDownloadedSongs = async () => {
  const keys = await AsyncStorage.getAllKeys();
  const songKeys = keys.filter(key => key.startsWith('song-'));
  const songs = await Promise.all(songKeys.map(key => AsyncStorage.getItem(key)));
  return songs.map(song => JSON.parse(song));
};

export const markPlaylistAsDownloaded = async (playlistTitle) => {
  await AsyncStorage.setItem(`playlist-${playlistTitle}`, 'downloaded');
};

export const isPlaylistDownloadedcheck = async (playlistTitle) => {
  const status = await AsyncStorage.getItem(`playlist-${playlistTitle}`);
  return status === 'downloaded';
};

export const deletePlaylistDownloadStatus = async (playlistTitle) => {
  await AsyncStorage.removeItem(`playlist-${playlistTitle}`);
};
