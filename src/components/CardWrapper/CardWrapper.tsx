import React from 'react'
import clsx from 'clsx'
import { Card, Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme: any) => ({
  modal: {
    zIndex: '2147483000',
    position: 'fixed',
    bottom: '100px',
    right: '20px',
    width: '376px',
    minHeight: '250px',
    maxHeight: '704px',
    height: 'calc(100% - 300px)',
    borderRadius: '8px'
  },
  inner: {
    display: 'flex',
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    borderRadius: '5px'
  }
}))

function CardWrapper (props) {
  const classes = useStyles(props)
  return (
    <Card className={classes.modal}>
      <Paper className={classes.inner}>
        {props.children}
      </Paper>
    </Card>
  )
}

export default CardWrapper
