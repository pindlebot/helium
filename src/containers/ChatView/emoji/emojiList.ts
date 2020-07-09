import nodeEmoji from 'node-emoji'

function convertToUnicode (input) {
  if (input.length === 1) {
    return input.charCodeAt(0)
  }
  let comp = (
    (input.charCodeAt(0) - 0xD800) * 0x400 + (input.charCodeAt(1) - 0xDC00) + 0x10000
  )
  if (comp < 0) {
    return input.charCodeAt(0);
  }
  return comp
}

const list = Object.keys(nodeEmoji.emoji)
  .reduce((a, c) => {
    a[c] = [convertToUnicode(nodeEmoji.emoji[c]).toString(16)]
    return a
  }, {})

export default {
  list
}
