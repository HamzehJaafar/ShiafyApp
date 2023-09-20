const {API, BEARER} = require('../constants/api');
const {getToken} = require('../helpers/TokenHelper');

// 1. Create a playlist with title and user
export async function createPlaylist(title) {
  const token = await getToken();
  
  const response = await fetch(`${API}/playlists/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${BEARER} ${token}`,
    },
    body: JSON.stringify({
      title: title,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create playlist');
  }

  return await response.json();
}

// 2. Add a song to the playlist given songId and playlistId
export async function removeSongFromPlaylist(playlistId, songId) {
  const token = await getToken();
  
  const response = await fetch(`${API}/playlists/${playlistId}/remove-song`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${BEARER} ${token}`,
    },
    body: JSON.stringify({
      songId,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to remove song to playlist');
  }

  return await response.json();
}

export async function addSongToPlaylist(playlistId, songId) {
  const token = await getToken();
  
  const response = await fetch(`${API}/playlists/${playlistId}/add-song`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${BEARER} ${token}`,
    },
    body: JSON.stringify({
      songId,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to add song to playlist');
  }

  return await response.json();
}


// 3. Fetch all private playlists of the user
export async function fetchPrivatePlaylistsOfUser() {
  const token = await getToken();

  const response = await fetch(`${API}/playlists/private`, {
    headers: {
      Authorization: `${BEARER} ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch private playlists');
  }

  return await response.json();
}

// 4. Fetch public playlists
export async function fetchPublicPlaylists() {
  const token = await getToken();
  
  const response = await fetch(`${API}/playlists/public`, {
    headers: {
      Authorization: `${BEARER} ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch public playlists');
  }

  return await response.json();
}


// 4. Fetch public playlists
export async function getRecentPlaylist() {
  const token = await getToken();
  
  const response = await fetch(`${API}/history/recent`, {
    headers: {
      Authorization: `${BEARER} ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch public playlists');
  }

  return await response.json();
}
