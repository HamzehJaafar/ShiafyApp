export const ADD_SONGS = 'ADD_SONGS';
export const POINT_SONG = 'POINT_SONG';
export const DELETE_SONG = 'DELETE_SONG';
export const CLEAR_SONGS = 'CLEAR_SONGS';
export const NEXT_SONG = 'NEXT_SONG';
export const LAST_SONG = 'LAST_SONG';
export const PAUSE = 'PAUSE';
export const SWITCH_MODE = 'SWITCH_MODE';
export const PROGRESS = 'PROGRESS';
export const SEEK_PROGRESS = 'SEEK_PROGRESS';
export const LOVE = 'LOVE';
export const LOCAL = 'LOCAL';
export const SHUFFLE_MODE = 'SHUFFLE_MODE';
export const CHANGE = 'CHANGE';

export const pause = () => {
  return {
    type: PAUSE,
  };
};

export const pointSong = (playList, song) => {
  return {
    type: POINT_SONG,
    playList: playList,
    song: song,
  };
};
export const nextSong = isFinish => {
  return {
    type: NEXT_SONG,
    isFinish: isFinish,
  };
};
export const change = () => {
  return {
    type: CHANGE,
  };
};
export const lastSong = isFinish => {
  return {
    type: LAST_SONG,
    isFinish: isFinish,
  };
};

export const setLength = time => {
  return {
    type: 'SET_LENGTH',
    time: time,
  };
};
export const progress = time => {
  return {
    type: PROGRESS,
    time: time,
  };
};

export const seekProgress = time => {
  return {
    type: SEEK_PROGRESS,
    time: time,
  };
};

export const switchMode = () => {
  return {
    type: SWITCH_MODE,
  };
};
export const switchShuffle = () => {
  return {
    type: SHUFFLE_MODE,
  };
};
