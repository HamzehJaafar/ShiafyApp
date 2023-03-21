import {useDispatch, useSelector} from 'react-redux';
import {playPrevious, playNext, togglePlay} from '../playerFunctions';

const usePlayerControls = () => {
  const dispatch = useDispatch();
  const {playList, currentIndex, isPlaying} = useSelector(state => state);

  const handlePlayPrevious = () => {
    playPrevious(currentIndex, playList, dispatch);
  };

  const handlePlayNext = () => {
    playNext(currentIndex, playList, dispatch);
  };

  const handleTogglePlay = () => {
    togglePlay(isPlaying, dispatch);
  };

  return {
    isPlaying,
    handlePlayPrevious,
    handlePlayNext,
    handleTogglePlay,
  };
};

export default usePlayerControls;
