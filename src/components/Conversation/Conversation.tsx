import React from 'react'
import { createStyles, withStyles } from '@material-ui/styles'

import Notification from './components/Notification'
import Comment from './components/Comment'

const styles = createStyles({
  content: {
    padding: '15px',
    backgroundColor: '#fff',
    width: '100%',
    flexBasis: '75%',
    boxSizing: 'border-box',
    overflowY: 'scroll',
    '&::-webkit-scrollbar': {
      width: 8
    },
    
    '&::-webkit-scrollbar-track': {
      '-webkit-box-shadow': 'inset 0 0 6px #f5f5f5'
    },
    
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#d9d9d9'
    }
  }
})

class Conversation extends React.Component<any, any> {
  listRef: any

  constructor(props) {
    super(props)

    this.listRef = React.createRef(null)

  }
  // const classes = useStyles(props)
  // const { comments, user, typingUsers, onDelete } = props
  // const listRef = React.useRef(null)

  // static propTypes = {
  //   conversation: PropTypes.object,
  //   user: PropTypes.object,
  //   deleteComment: PropTypes.func.isRequired
  // }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    if (
      prevProps.comments.length < this.props.comments.length ||
      prevProps.typingUsers.length < this.props.typingUsers.length      
    ) {
      const list = this.listRef.current;
      return list.scrollHeight - list.scrollTop;
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot !== null) {
      const list = this.listRef.current;
      list.scrollTop = list.scrollHeight - snapshot
    }
  }

  render () {
    const { comments, user, typingUsers, onDelete, classes } = this.props
    return (
      <div className={classes.content} ref={this.listRef}>
        {comments.map(comment => (
          <Comment user={user} comment={comment} key={comment.id} onDelete={onDelete} />
        ))}
        {typingUsers.map(user => (
          <Notification user={user} key={user.id} />
        ))}
      </div>
    )
  }
}

Conversation.defaultProps = {
  comments: [],
  typingUsers: []
}

// @ts-ignore
export default withStyles(styles)(Conversation)
