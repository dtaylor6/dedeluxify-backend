import axios from 'axios';

import { DISCOGS_CLIENT_ID, DISCOGS_SECRET } from './config.js';
import { trimMusicString } from './stringUtils.js';
import { getAlbumInfo } from './spotifyUtils.js';

const discogs_client_id = DISCOGS_CLIENT_ID;
const discogs_secret = DISCOGS_SECRET;

const REQUEST_HEADERS = {
  'Authorization': `Discogs key=${discogs_client_id}, secret=${discogs_secret}`,
  'User-Agent': 'Dedeluxify/1.0'
};

// Queries Discogs for master based on Spotify album info and returns the tracks.
// May return an empty array in the case of empty Discogs query results.
export const getOriginalAlbumTracks = async (albumId, token) => {
  try {
    const originalTracks = [];

    const albumInfo = await getAlbumInfo(albumId, token);
    const queryResults = await queryMasters(albumInfo);

    if (queryResults.length > 0) {
      // TODO: add function to parse this to ensure relevant master
      const masterId = queryResults[0].master_id;
      const masterTracks = await getMasterTracks(masterId);
      masterTracks.forEach(track => originalTracks.push(track));
    }

    return Promise.resolve(originalTracks);
  }
  catch(error) {
    return Promise.reject(error);
  }
};

// Searches Discogs database for masters based on album info and returns query results
const queryMasters = async (albumInfo) => {
  try {
    const queryResults = [];
    const artist = albumInfo.artists[0].name;
    const album = trimMusicString(albumInfo.name);

    const discogsResponse = await axios
      .get(
        'https://api.discogs.com/database/search', {
          params: {
            q: `${artist}, ${album}`,
            type: 'master'
          },
          headers: REQUEST_HEADERS
        }
      );

    discogsResponse.data.results.forEach(result => queryResults.push(result));
    return Promise.resolve(queryResults);
  }
  catch(error) {
    return Promise.reject(error);
  }
};

// Gets the original album tracks from Discogs database with Discogs master id
const getMasterTracks = async (masterId) => {
  try {
    if (!masterId) {
      throw new Error(`Discogs master id is falsy: ${masterId}`);
    }

    const tracks = [];
    const discogsResponse = await axios
      .get(
        `https://api.discogs.com/masters/${masterId}`, {
          headers: REQUEST_HEADERS
        }
      );

    discogsResponse.data.tracklist.forEach(track => tracks.push(track.title));
    return Promise.resolve(tracks);
  }
  catch(error) {
    return Promise.reject(error);
  }
};
