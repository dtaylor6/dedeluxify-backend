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

const combineTrackLists = (spotifyTracks, discogsTracks) => {
  const tracks = []
  const masterArray = discogsTracks.map(track => trimMusicString(track))

  // tracks.forEach(track => {
  //   discogsTracks
  // })

  return tracks
}

module.exports = {
  getLettersDigitsSpaces,
  trimMusicString,
  combineTrackLists
}