const unicodeRegex = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g

const findWithRegex = (regex, contentBlock, callback) => {
  const text = contentBlock.getText()
  let matchArr
  let start
  while ((matchArr = regex.exec(text)) !== null) {
    if (matchArr.index === regex.lastIndex) {
      regex.lastIndex++
    }
    start = matchArr.index
    callback(start, start + matchArr[0].length)
  }
}

export default (contentBlock, callback) => {
  findWithRegex(unicodeRegex, contentBlock, callback)
}
