import TrackPlayer from 'react-native-track-player';
import {PROGRESS} from './redux/actions';

export const togglePlay = (isPlaying, dispatch) => {
  dispatch({type: 'PAUSE'});
};

export const playPrevious = async dispatch => {
  // Implement play previous functionality here

  dispatch({type: 'LAST_SONG'});
};

export const playNext = async dispatch => {
  dispatch({type: 'NEXT_SONG'});
};

export const seek = async (value, dispatch) => {
  await TrackPlayer.seekTo(value);
};
