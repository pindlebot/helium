import React from 'react'
import { CardContent, Grid, TextField, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

import ChatCardHeader from '../../components/ChatCardHeader'
import { useCreateUser } from '../../hooks'

const useStyles = makeStyles((theme) => ({
  content: {
    overflowY: 'scroll'
  },
  input: {}
}))

function LoginView (props) {
  const classes = useStyles(props)
  const createUser = useCreateUser()

  const [userName, setUserName] = React.useState('')

  const onChange = (evt) => {
    setUserName(evt.target.value)
  }

  const onCreateUser = async () => {
    await createUser({ name: userName })
  }

  const onKeyDown = (evt) => {
    if (evt.which === 13) {
      evt.stopPropagation()
      evt.preventDefault()
      onCreateUser()
    }
  }

  return (
    <>
      <ChatCardHeader />
      <CardContent className={classes.content}>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <TextField
              value={userName}
              onChange={onChange}
              onKeyDown={onKeyDown}
              className={classes.input}
              placeholder={'Your name'}
              variant='outlined'
              margin='dense'
            />
          </Grid>
          <Grid item xs={4} container alignItems='center' justify='center'> 
            <Button variant='outlined' onClick={onCreateUser} size='large'>
              Go
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </>
  )
}

export default LoginView
