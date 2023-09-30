import { Event } from 'react-native-track-player';
import { useDispatch } from 'react-redux'; // If you're using redux
import { PROGRESS } from '../redux/actions';

export const PlaybackService = async function() {

    const dispatch = useDispatch(); // Only if you're using redux

    TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
    TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());

    // Listen to playback progress updates
    TrackPlayer.addEventListener(Event.PlaybackProgressUpdated, (data) => {
        const { position } = data;
        console.log("Progress Updated:", position);  // Check if this is getting logged
        dispatch({type: PROGRESS, progressTime: currentPosition});

    });
    
    // ...

};
