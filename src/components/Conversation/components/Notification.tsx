import React from 'react'
import clsx from 'clsx'
import { Avatar } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

import MoreHoriz from '../../MoreHorizIcon'

const useStyles = makeStyles(theme => ({
  commentBodyWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  avatar: {
    marginRight: '10px',
    width: '30px',
    height: '30px'
  },
  comment: {
    display: 'flex',
    marginBottom: '6px'
  },
  commentBody: {
    backgroundColor: '#f5f5f5',
    borderRadius: '6px',
    padding: '5px 8px',
    textAlign: 'right'
  },
  active: {}
}))

function Notification (props) {
  const { user } = props
  const classes = useStyles(props)

  return (
    <div
      className={clsx(classes.comment)}
    >
      <Avatar className={classes.avatar}>{(user.name || 'UNKNOWN').slice(0, 3)}</Avatar>
      <div className={classes.commentBodyWrapper}>
        <div className={clsx(classes.commentBody, { [classes.active]: user.active })}>
          <MoreHoriz />
        </div>
      </div>
    </div>
  )
}

export default Notification
