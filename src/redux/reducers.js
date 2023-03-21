/* eslint-disable no-fallthrough */
import {
  ADD_SONG,
  ADD_SONGS,
  POINT_SONG,
  DELETE_SONG,
  CLEAR_SONGS,
  NEXT_SONG,
  LAST_SONG,
  PAUSE,
  SWITCH_MODE,
  SHUFFLE_MODE,
  PROGRESS,
  SEEK_PROGRESS,
  CHANGE,
  LOCAL,
} from './actions';
const LOOP_MODE = 'loop';
const ONE_MODE = 'oneloop';
const NOLOOP_MODE = 'noloop';

export default function (state, action) {
  if (!state) {
    state = {
      playList: [],
      currentIndex: 0,
      currentSong: null,
      progressTime: 0,
      shuffleMode: false,
      playMode: 'noloop',
      isPlaying: false,
      isChanging: false,
      totalLength: 1,
    };
  }
  switch (action.type) {
    case PAUSE:
      return {
        ...state,
        isPlaying: !state.isPlaying,
      };
    case SHUFFLE_MODE:
      return {
        ...state,
        shuffleMode: !state.shuffleMode,
      };
    case POINT_SONG:
      return {
        ...state,
        playList: action.playList,
        currentSong: action.playList[action.song],
        currentIndex: action.song,
        isPlaying: true,
      };

    case NEXT_SONG:
      if (state.playList.length === 1) {
        return {
          ...state,
          isPlaying: action.isFinish ? false : state.isPlaying,
        };
      }
      if (state.shuffleMode) {
        let randomIndex = parseInt(Math.random() * state.playList.length);
        return {
          ...state,
          isChanging: true,
          progressTime: 0,
          currentSong: state.playList[randomIndex],
          currentIndex: randomIndex,
          isPlaying: true,
        };
        break;
      }
      switch (state.playMode) {
        case ONE_MODE:
          return {
            ...state,
            isChanging: true,
            progressTime: 0,
            currentSong: state.playList[state.currentIndex],
            currentIndex: state.currentIndex,
            isPlaying: true,
          };
          break;
        case NOLOOP_MODE:
          if (state.currentIndex + 1 >= state.playList.length) {
            return {
              ...state,
              isChanging: true,
              progressTime: 0,
              isPlaying: action.isFinish ? false : state.isPlaying,
            };
          } else {
            return {
              ...state,
              isChanging: true,
              progressTime: 0,
              currentSong: state.playList[state.currentIndex + 1],
              currentIndex: state.currentIndex + 1,
              isPlaying: true,
            };
          }
        case LOOP_MODE:
          if (state.currentIndex + 1 >= state.playList.length) {
            return {
              ...state,
              isChanging: true,
              progressTime: 0,
              currentSong: state.playList[0],
              currentIndex: 0,
              isPlaying: true,
            };
          } else {
            return {
              ...state,
              isChanging: true,
              progressTime: 0,
              currentSong: state.playList[state.currentIndex + 1],
              currentIndex: state.currentIndex + 1,
              isPlaying: true,
            };
          }
      }
    case LAST_SONG:
      if (state.progressTime > 15) {
        return {...state, progressTime: 0};
      }
      if (state.playList.length === 1) {
        return {...state, progressTime: 0};
      }
      if (state.currentIndex - 1 < 0) {
        return {...state, progressTime: 0};
      }
      return {
        ...state,
        progressTime: 0,
        currentSong: state.playList[state.currentIndex - 1],
        currentIndex: state.currentIndex - 1,
        isPlaying: true,
      };
    case 'SET_LENGTH':
      return {
        ...state,
        totalLength: action.totalLength,
      };
    case PROGRESS: {
      return {
        ...state,
        progressTime: action.progressTime,
      };
    }
    case SWITCH_MODE:
      return {
        ...state,
        playMode: getPlayMode(state.playMode),
      };
    case CHANGE:
      return {
        ...state,
        isChanging: false,
      };
    case SEEK_PROGRESS: {
      return {
        ...state,
        progressTime: Math.floor(action.time),
      };
    }
    default:
      return state;
  }
}

function getPlayMode(mode) {
  switch (mode) {
    case LOOP_MODE:
      return ONE_MODE;
    case ONE_MODE:
      return NOLOOP_MODE;
    case NOLOOP_MODE:
      return LOOP_MODE;
  }
}
