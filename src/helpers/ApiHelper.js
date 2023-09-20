const {API, BEARER} = require('../constants/api');
const {getToken} = require('./TokenHelper');

export async function getSongsByGenre(genre) {
  const token = await getToken();
  const response = await fetch(
    `${API}/songs?populate[source][fields][0]=url&populate=artists&populate[cover][fields][0]&filters[genre][$eq]=${genre}`,
    {
      headers: {
        Authorization: `${BEARER} ${token}`,
      },
    },
  );

  const data = await response.json();

  return data.data
    .filter(song => song && song.attributes) // filter out songs with null attributes
    .map(song => {
      const songAttributes = song.attributes;
      const sourceAttributes = songAttributes.source?.data?.attributes;
      const artistsAttributes = songAttributes.artists.data
        .filter(artist => artist && artist.attributes) // filter out artists with null attributes
        .map(artist => artist.attributes);
      const coverAttributes = songAttributes.cover?.data?.attributes;

      return {
        ...songAttributes,
        source: sourceAttributes,
        artists: artistsAttributes,
        cover: coverAttributes,
      };
    });
}

export async function getSearch(query) {
  const token = await getToken();
  const response = await fetch(
    `${API}/songs?populate[source][fields][0]=url&populate=artists&populate[cover][fields][0]=url&filters[$or][0][title][$containsi]=${query}&filters[$or][1][artists][name][$containsi]=${query}`,
    {
      headers: {
        Authorization: `${BEARER} ${token}`,
      },
    },
  );

  const data = await response.json();

  // Use flattenObject function to flatten the data

  return data?.data;
}

export async function getForYou() {
  const token = await getToken();
  const response = await fetch(
    `${API}/foryou?populate[songs][populate][source][fields][0]=url&populate[songs][populate][cover][fields][1]=url&populate[artists][populate][profile_cover][fields][0]=url&populate[playlists][populate][cover][fields][0]=url&populate[playlists][populate][songs][populate][source][fields][0]=url&populate[playlists][populate][songs][populate][cover][fields][0]=url&populate[playlists][populate][songs][populate][artists][fields][0]=*&populate[songs][populate][artists][fields][2]=*`,
    {
      headers: {
        Authorization: `${BEARER} ${token}`,
      },
    },
  );

  const data = await response.json();

  // Use flattenObject function to flatten the data

  return data.data;
}

// Like a song
export async function likeSong(songId) {
  const token = await getToken();
  const response = await fetch(`${API}/likes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${BEARER} ${token}`,
    },
    body: JSON.stringify({
      data: {
        user: 1, // Replace with logged in user's ID
        song: songId,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(response.json());
  }

  return response.json();
}

// Unlike a song
export async function unlikeSong(likeId) {
  const token = await getToken();
  const response = await fetch(`${API}/likes/${likeId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `${BEARER} ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to unlike song');
  }

  return response.json();
}

// Get liked songs for a user
export async function getLikedSongs() {
  const token = await getToken();
  const response = await fetch(
    `${API}/likes?populate[song][populate][source][fields][0]=url&populate[song][populate][cover][fields][1]=url&filters[user][id][$eq]=1&populate[song][populate][artists][fields][0]=name`,
    {
      // Replace with logged in user's ID
      headers: {
        Authorization: `${BEARER} ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error('Failed to get liked songs');
  }

  const data = await response.json();

  // Use flattenData function to flatten the data
  const flattenedData = flattenData(data);

  return flattenedData;
}

function flattenData(data: any) {
  if (!data || typeof data !== 'object') {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(flattenData);
  }

  const result: any = {};

  if (data.hasOwnProperty('id')) {
    result.id = data.id;
  }

  if (data.hasOwnProperty('attributes')) {
    const flattenedAttributes = flattenData(data.attributes);
    for (const key in flattenedAttributes) {
      result[key] = flattenedAttributes[key];
    }
  }

  if (data.hasOwnProperty('data')) {
    if (Array.isArray(data.data)) {
      result.data = data.data.map(flattenData);
    } else {
      const flattenedData = flattenData(data.data);
      for (const key in flattenedData) {
        result[key] = flattenedData[key];
      }
    }
  } else {
    for (const key in data) {
      if (key !== 'id' && key !== 'attributes') {
        result[key] = flattenData(data[key]);
      }
    }
  }

  return result;
}

export async function logSongPlay({userId, songId}, viewed = false) {
  const token = await getToken();

  if (!songId) {
    throw new Error('SongId required');
  }

  const response = await fetch(`${API}/history`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${BEARER} ${token}`,
    },
    body: JSON.stringify({
      user: userId,
      songId: songId,
      playedAt: new Date().toISOString(),
      viewed: viewed,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to log song play');
  }

  return await response.json();
}

export async function updateSongPlayViewed(historyId) {
  const token = await getToken();

  const response = await fetch(`${API}/history/${historyId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${BEARER} ${token}`,
    },
    body: JSON.stringify({
      data: {
        viewed: true,
      },
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to update song view');
  }

  return await response.json();
}
