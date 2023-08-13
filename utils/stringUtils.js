import Fuse from 'fuse.js';

// Returns a new string consisting of only unicode letters and unicode digits
const getLettersDigits = (str) => {
  const regex = /[^\p{L}\p{N}]+/gu;
  const newString = str.replace(regex, '');
  return newString;
};

// Returns a new string consisting of only unicode letters, unicode digits, and spaces
const getLettersDigitsSpaces = (str) => {
  const regex = /[^\p{L}\p{N}\s]+/gu;
  const newString = str.replace(regex, '');
  return newString;
};

// Returns album string with extraneous terms truncated
const trimMusicString = (str) => {
  const searchTerms = ['deluxe', 'remaster', 'expand', 'edition'];
  let newStr = getLettersDigitsSpaces(str);
  const lowerStr = newStr.toLowerCase();

  searchTerms.forEach(term => {
    const termIndex = lowerStr.indexOf(term);
    if (termIndex > 0) {
      newStr = newStr.slice(0, termIndex);
    }
  });

  // Will return the original string if truncated string length is zero
  newStr = (newStr.length > 0) ? newStr.trim() : str;
  return newStr;
};

// Returns album string with extraneous terms truncated in lower case
const trimMusicStringLower = (str) => {
  const searchTerms = ['deluxe', 'remaster', 'expand', 'edition', 'bonus'];
  let newStr = getLettersDigitsSpaces(str);
  newStr = newStr.toLowerCase();

  searchTerms.forEach(term => {
    const termIndex = newStr.indexOf(term);
    if (termIndex > 0) {
      newStr = newStr.slice(0, termIndex);
    }
  });

  // Will return the original string if truncated string length is zero
  newStr = (newStr.length > 0) ? newStr.trim() : str;
  return newStr;
};

const combineTrackLists = (spotifyTracks, discogsTracks) => {
  const fuseOptions = {
    // isCaseSensitive: false,
    // includeScore: false,
    // shouldSort: true,
    // includeMatches: false,
    // findAllMatches: false,
    // minMatchCharLength: 1,
    // location: 0,
    threshold: 0.2,
    // distance: 100,
    // useExtendedSearch: false,
    // ignoreLocation: false,
    // ignoreFieldNorm: false,
    // fieldNormWeight: 1,

    keys: [
      'name'
    ]
  };

  // Use fuzzy string search to combine track lists
  const fuse = new Fuse(spotifyTracks, fuseOptions);

  const tracks = [];
  for (let i = 0; i < discogsTracks.length; ++i) {
    const results = fuse.search(discogsTracks[i]);
    if (results.length > 0) {
      const bestMatch = results[0];
      tracks.push(bestMatch.item);
    }
  }

  return tracks;
};

export {
  getLettersDigits,
  getLettersDigitsSpaces,
  trimMusicString,
  trimMusicStringLower,
  combineTrackLists
};
