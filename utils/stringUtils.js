// Returns a new string consisting of only unicode letters and unicode digits
const getLettersDigits = (str) => {
  const regex = /[^\p{L}\p{N}]+/gu
  const newString = str.replace(regex, '')
  return newString
}

// Returns a new string consisting of only unicode letters, unicode digits, and spaces
const getLettersDigitsSpaces = (str) => {
  const regex = /[^\p{L}\p{N}\s]+/gu
  const newString = str.replace(regex, '')
  return newString
}

// Returns album string with extraneous terms truncated
const trimMusicString = (str) => {
  const searchTerms = ['deluxe', 'remaster', 'expand', 'edition']
  let newStr = getLettersDigitsSpaces(str)
  const lowerStr = newStr.toLowerCase()

  searchTerms.forEach(term => {
    const termIndex = lowerStr.indexOf(term)
    if (termIndex > 0) {
      newStr = newStr.slice(0, termIndex)
    }
  })

  // Will return the original string if truncated string length is zero
  newStr = (newStr.length > 0) ? newStr.trim() : str
  return newStr
}

// Returns album string with extraneous terms truncated in lower case
const trimMusicStringLower = (str) => {
  const searchTerms = ['deluxe', 'remaster', 'expand', 'edition']
  let newStr = getLettersDigitsSpaces(str)
  newStr = newStr.toLowerCase()

  searchTerms.forEach(term => {
    const termIndex = newStr.indexOf(term)
    if (termIndex > 0) {
      newStr = newStr.slice(0, termIndex)
    }
  })

  // Will return the original string if truncated string length is zero
  newStr = (newStr.length > 0) ? newStr.trim() : str
  return newStr
}

const combineTrackLists = (spotifyTracks, discogsTracks) => {
  const tracks = []
  const masterTracks = discogsTracks
    .map(track => getLettersDigits(trimMusicStringLower(track)))

  for (let i = 0; i < spotifyTracks.length; ++i) {
    if (masterTracks.length < 1) {
      break
    }

    const trimmedSpotify = getLettersDigits(trimMusicStringLower(spotifyTracks[i].name))
    for (let j = 0; j < masterTracks.length; ++j) {
      if (trimmedSpotify.includes(masterTracks[j])) {
        tracks.push(spotifyTracks[i])
        masterTracks.splice(j, 1)
        j -= 1
        break
      }
    }
  }

  return tracks
}

module.exports = {
  getLettersDigitsSpaces,
  trimMusicString,
  combineTrackLists
}