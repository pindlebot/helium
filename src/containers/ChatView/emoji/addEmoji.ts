import { Modifier, EditorState } from 'draft-js'
import getSearchText from './getSearchText'
import emojiList from './emojiList'
import convertShortNameToUnicode from './convertShortNameToUnicode'

const Mode = {
  INSERT: 'INSERT',
  REPLACE: 'REPLACE'
}

const addEmoji = (editorState, emojiShortName, mode = Mode.INSERT) => {
  const unicode = emojiList.list[emojiShortName][0]
  const emoji = convertShortNameToUnicode(unicode)
  const contentState = editorState.getCurrentContent()
  const contentStateWithEntity = contentState
    .createEntity('emoji', 'IMMUTABLE', { emojiUnicode: emoji })
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
  const currentSelectionState = editorState.getSelection()

  let emojiAddedContent
  let emojiEndPos = 0
  let blockSize = 0

  switch (mode) {
    case Mode.INSERT: {
      const afterRemovalContentState = Modifier.removeRange(
        contentState,
        currentSelectionState,
        'backward'
      )

      const targetSelection = afterRemovalContentState.getSelectionAfter()

      emojiAddedContent = Modifier.insertText(
        afterRemovalContentState,
        targetSelection,
        emoji,
        null,
        entityKey
      )

      emojiEndPos = targetSelection.getAnchorOffset()
      const blockKey = targetSelection.getAnchorKey()
      blockSize = contentState.getBlockForKey(blockKey).getLength()

      break
    }

    case Mode.REPLACE: {
      const { begin, end } = getSearchText(editorState, currentSelectionState)

      const emojiTextSelection = currentSelectionState.merge({
        anchorOffset: begin,
        focusOffset: end
      })

      emojiAddedContent = Modifier.replaceText(
        contentState,
        emojiTextSelection,
        emoji,
        null,
        entityKey
      )

      emojiEndPos = end
      const blockKey = emojiTextSelection.getAnchorKey()
      blockSize = contentState.getBlockForKey(blockKey).getLength()

      break
    }

    default:
      throw new Error('Unidentified value of "mode"')
  }

  if (emojiEndPos === blockSize) {
    emojiAddedContent = Modifier.insertText(
      emojiAddedContent,
      emojiAddedContent.getSelectionAfter(),
      ' '
    )
  }

  const newEditorState = EditorState.push(
    editorState,
    emojiAddedContent,
    // @ts-ignore
    'insert-emoji'
  )
  return EditorState.forceSelection(newEditorState, emojiAddedContent.getSelectionAfter())
}

export default addEmoji
export { Mode }
