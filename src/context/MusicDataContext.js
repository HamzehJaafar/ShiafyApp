import React, { createContext, useContext, useState } from 'react';

const MusicDataContext = createContext();

export const useMusicData = () => {
  return useContext(MusicDataContext);
};

export const MusicDataProvider = ({ children }) => {
  const [likedSongs, setLikedSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);

  return (
    <MusicDataContext.Provider value={{ likedSongs, setLikedSongs, playlists, setPlaylists }}>
      {children}
    </MusicDataContext.Provider>
  );
};
