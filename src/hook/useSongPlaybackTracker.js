import { useState, useEffect } from 'react';


const useSongPlaybackTracker = (isPlaying, progressTime, currentSong) => {
    const [initialProgress, setInitialProgress] = useState(null);
    const [lastProgress, setLastProgress] = useState(null);
    const [accumulatedProgress, setAccumulatedProgress] = useState(0);
    const [hasBeenViewed, setHasBeenViewed] = useState(false);
  
    useEffect(() => {
      // Reset when a new song starts
      setHasBeenViewed(false);
      setInitialProgress(null);
      setLastProgress(null);
      setAccumulatedProgress(0);
    }, [currentSong]);
  
    useEffect(() => {
      // Song started playing
      if (isPlaying && initialProgress === null) {
        setInitialProgress(progressTime);
      }
  
      if (lastProgress !== null && isPlaying) {
        const playbackIncrement = progressTime - lastProgress;
  
        // If playbackIncrement is negative or too large, it's likely a skip.
        if (playbackIncrement >= 0 && playbackIncrement < 5) {
          setAccumulatedProgress(prev => prev + playbackIncrement);
        }
      }
  
      setLastProgress(progressTime);
  
      // Mark song as viewed if accumulated playback is more than 30 seconds
      if (accumulatedProgress >= 10 && !hasBeenViewed) {
        setHasBeenViewed(true);
        // TODO: Call your API to log this as a view.
      }
    }, [isPlaying, progressTime]);
  
    return { hasBeenViewed };
  };

export default useSongPlaybackTracker;
