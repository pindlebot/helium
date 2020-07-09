import React from 'react'
import { IconButton, Avatar } from '@material-ui/core'
import { Close } from '@material-ui/icons'
import clsx from 'clsx'
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'

import { makeStyles } from '@material-ui/styles'

const formatDate = (str) => distanceInWordsToNow(new Date(str))

const useStyles = makeStyles((theme) => ({
  icon: {
    color: '#ddd'
  },
  avatar: {
    width: 30,
    height: 30,
    marginRight: 10
  },
  // avatar: {
  //   marginRight: '10px',
  //   width: '30px',
  //   height: '30px'
  // },
  user: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  comment: {
    display: 'flex',
    marginBottom: '6px'
  },
  actions: {
    width: '20px',
    height: '31px',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  delete: {
    display: 'none'
  },
  commentBodyWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  commentMeta: {
    color: '#8c8c8c',
    fontSize: '10px'
  },
  commentBody: {
    backgroundColor: '#f5f5f5',
    borderRadius: '6px',
    padding: '5px 8px',
    textAlign: 'right'
  },
  p: {
    margin: '0'
  },
  svg: {
    fill: '#ddd',
    display: 'block'
  },
  self: {
    justifyContent: 'flex-end',
    alignItems: 'flex-start'
  },
  self__commentBodyWrapper: {
    alignItems: 'flex-end'
  },
  self__commentBody: {
    backgroundColor: '#286efa',
    color: '#fff'
  },
  content: {
    padding: '15px',
    backgroundColor: '#fff',
    width: '100%',
    flexBasis: '65%',
    boxSizing: 'border-box',
    overflowY: 'scroll'
  }
}))

function Comment(props) {
  const { comment, user, onDelete } = props
  const classes = useStyles(props)

  return (
    <div
      className={clsx(classes.comment, {
        // @ts-ignore
        [classes.self]: comment?.user?.id === user?.id
      })}
    >
      {comment?.user?.id !== user?.id && (
        <div className={classes.user}>
          <Avatar className={classes.avatar}>
            {(comment.user.name || 'UNKNOWN').slice(0, 1)}
          </Avatar>
        </div>
      )}
      <div className={classes.commentBodyWrapper}>
        <div className={classes.commentBody}>
          <div dangerouslySetInnerHTML={{ __html: comment.body }} />
        </div>
        <div className={classes.commentMeta}>
          {formatDate(comment.createdAt)}
        </div>
      </div>
      <div className={classes.actions}>
        <IconButton
          // className={classes.delete}
          onClick={(evt) => onDelete(comment.id)}
          component='span'
          size='small'
        >
          <Close className={classes.icon} fontSize='small' />
        </IconButton>
      </div>
    </div>
  )
}

const areEqual = (prevProps, nextProps) => {
  return true
}


export default React.memo(Comment, areEqual)

