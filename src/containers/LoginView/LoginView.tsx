import React from 'react'
import { CardContent, Grid, TextField, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

import ChatCardHeader from '../../components/ChatCardHeader'
import { useApolloClient } from '@apollo/client'
import { useCreateUser } from '../../hooks'

const useStyles = makeStyles((theme) => ({
  // content: {
  //   // @ts-ignore
  //   padding: theme.spacing(2),
  //   backgroundColor: '#fff',
  //   width: '100%',
  //   flexBasis: '80%',
  //   boxSizing: 'border-box',
  //   overflowY: 'scroll'
  // },
  content: {
    overflowY: 'scroll'
  },
  input: {}
}))

function LoginView (props) {
  const client = useApolloClient()
  const classes = useStyles(props)
  const createUser = useCreateUser()

  const { history } = props
  const [userName, setUserName] = React.useState('')

  const onChange = (evt) => {
    setUserName(evt.target.value)
  }

  const onCreateUser = async () => {
    await createUser({ name: userName })
    // await client.resetStore()
    // history.push('/conversations')
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
