import React from 'react'
import { makeStyles } from '@material-ui/styles'
import { CardHeader, Avatar, IconButton, Toolbar } from '@material-ui/core'
import { MoreVert } from '@material-ui/icons'

const useStyles = makeStyles((theme) => ({
  title: {
    color: '#fff',
    fontSize: '20px',
    padding: '10px'
  },
  root: {
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    backgroundClip: 'border-box',
    // @ts-ignore
    background: theme.palette.primary.main
  },
  iconButton: {
    color: '#fff'
  },
  action: {
    margin: 0
  }
}))

function ChatCardHeader (props) {
  const { children } = props
  const classes = useStyles(props)

  const renderAction = () => (
    <Toolbar disableGutters>
      {children}
      <IconButton className={classes.iconButton}>
        <MoreVert />
      </IconButton>
    </Toolbar>
  )
  return ( 
    <CardHeader
      avatar={(<Avatar />)}
      action={renderAction()}
      title={'MenuBar Chat'}
      classes={{
        title: classes.title,
        root: classes.root,
        action: classes.action
      }}
    />
  )
}

export default ChatCardHeader
