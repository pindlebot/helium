import React from 'react'
import nodeEmoji from 'node-emoji'
import SentimentSatisfiedIcon from '@material-ui/icons/SentimentSatisfied'
import { makeStyles } from '@material-ui/styles'

const priorityList = [
  'joy',
  'sob',
  'heart',
  'point_right',
  'purple_heart',
  'two_hearts',
  'blush',
  'thinking_face',
  'pray',
  'fire',
  '100',
  'smiling_imp',
  'clap',
  'smile',
  'raised_hands',
  'poop',
  'pizza',
  'kiss',
  'heart_eyes',
  'wink',
  'cold_sweat',
  'scream',
  'innocent',
  'sweat',
  'neutral_face',
  'sunglasses',
  'airplane',
  'musical_note',
  'palm_tree',
  'grimacing',
  'heart_eyes_cat',
  'fist',
  'v',
  'sauropod'
]

const list = priorityList.map((name) => ({
  name,
  emoji: nodeEmoji.emoji[name]
}))

// @ts-ignore
const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative'
  },
  button: {
    cursor: 'pointer'
  },
  tooltip: {
    zIndex: '10000',
    width: '200px',
    height: '200px',
    position: 'absolute',
    transform: 'translate(-200px, -200px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    backgroundColor: '#fff'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    gridTemplateRows: 'repeat(6, 1fr)',
    width: '100%',
    height: '100%'
  },
  cell: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
}))

function EmojiMenu (props) {
  const classes = useStyles(props)
  const { addEmoji } = props
  const [open, setOpen] = React.useState(false)

  const toggleOpen = (evt) => setOpen((x) => !x)

  const onAddEmoji = (name) => {
    addEmoji(name)
    setOpen(true)
  }

  return (
    <div className={classes.root}>
      {open && (
        <div className={classes.tooltip}>
          <div className={classes.grid}>
            {list.map(({ name, emoji }) => (
              <div
                key={name}
                className={classes.cell}
                onClick={(evt) => onAddEmoji(name)}
              >
                {emoji}
              </div>
            ))}
          </div>
        </div>
      )}
      <div onClick={toggleOpen} className={classes.button}>
        <SentimentSatisfiedIcon />
      </div>
    </div>
  )
}

export default EmojiMenu
