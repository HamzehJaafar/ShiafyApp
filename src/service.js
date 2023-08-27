const {default: TrackPlayer} = require('react-native-track-player');

// In your service.js
module.exports = async function () {
  TrackPlayer.addEventListener('remote-play', () => {
    TrackPlayer.play();
  });

  // And all the other remote events...
};
