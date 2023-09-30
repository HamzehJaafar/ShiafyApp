import RNFetchBlob from 'rn-fetch-blob';
import RNFS from 'react-native-fs';


export const downloadSong = async (songUrl, songId, shouldCancel) => {
    const path = `${RNFS.DocumentDirectoryPath}/${songId}.mp3`;
  
    try {
      const response = await fetch(songUrl);
      if (response.status !== 200) {
        throw new Error(`Download failed with status: ${response.status}`);
      }
  
      const blob = await response.blob();
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      
      return new Promise((resolve, reject) => {
        reader.onloadend = async () => {
          if (shouldCancel()) {
            reject(new Error('Download cancelled'));
            return;
          }
          const base64data = reader.result.split(',')[1];
          await RNFS.writeFile(path, base64data, 'base64');
          resolve(path);
        };
        reader.onerror = reject;
      });
      
    } catch (error) {
      console.error('Error downloading song:', error);
      throw error;
    }
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
