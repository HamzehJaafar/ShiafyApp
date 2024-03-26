import RNFetchBlob from 'rn-fetch-blob';
import RNFS from 'react-native-fs';
import { storeSongMetadata, getSongMetadata } from './storageHelper';

let cancelDownloadController;

export const downloadSong = async (songUrl, songId) => {
    const path = `${RNFS.DocumentDirectoryPath}/${songId}.mp3`;

    try {
        cancelDownloadController = RNFetchBlob.config({
            path,
            overwrite: true,
        })
        .fetch('GET', songUrl);

        let response = await cancelDownloadController;
        if (response.info().status !== 200) {
            throw new Error(`Download failed with status: ${response.info().status}`);
        }

        return path;
    } catch (error) {
        console.error('Error downloading song:', error);
        throw error;
    }
};

export const cancelCurrentDownload = () => {
    if (cancelDownloadController) {
        cancelDownloadController.cancel();
    }
};

export const handleDownloadQueue = async (music, playlistTitle, dispatch, setIsDownloading, setCancelDownload) => {
  let downloadedSongs = [];

  for (let i = 0; i < music.length; i++) {
    const song = music[i];
    const metadata = await getSongMetadata(song.id);
    if (!metadata) {
      dispatch({
        type: 'START_DOWNLOAD',
        payload: { id: playlistTitle, songIndex: i },
      });
      try {
        const localPath = await downloadSong(song.source.url, song.id);
        downloadedSongs.push(song.id);

        if (setCancelDownload && setCancelDownload()) {
          for (let songId of downloadedSongs) {
            await deleteSong(songId);
            await deleteSongMetadata(songId);
          }
          dispatch({ type: 'STOP_DOWNLOAD', payload: { playlistTitle } });
          setCancelDownload && setCancelDownload(false);
          break;
        }
        await storeSongMetadata(song.id, { ...song, localPath });
      } catch (error) {
        console.error('Download error for song:', song.id);
      }
    }
  }
  setIsDownloading && setIsDownloading(false);
};

export const deleteSong = async songId => {
    const path = `${RNFS.DocumentDirectoryPath}/${songId}.mp3`;
    const exists = await RNFS.exists(path);
    if (exists) {
        try {
            await RNFS.unlink(path);
        } catch (error) {
            console.error('Error deleting song:', error);
        }
    }
};

export { cancelDownloadController };
