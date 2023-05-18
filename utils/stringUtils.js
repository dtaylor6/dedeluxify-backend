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
  searchTerms.forEach(term => {
    const termIndex = newStr.toLowerCase().indexOf(term)
    if (termIndex > 0) {
      newStr = newStr.slice(0, termIndex)
    }
  })

  // Will return the original string if truncated string length is zero
  newStr = (newStr.length > 0) ? newStr.trim() : str
  return newStr
}

module.exports = {
  getLettersDigitsSpaces,
  trimMusicString
}