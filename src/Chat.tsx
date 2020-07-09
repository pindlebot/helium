import React from 'react'
import { Card, Popover } from '@material-ui/core'
import { useQuery } from '@apollo/client'
import { useHistory } from 'react-router-dom'
import AppRouter from './AppRouter'
import CommentBubble from './components/CommentBubble'
import {
  USER_QUERY, IS_LOGGED_IN
} from './graphql'
import CloseIcon from './components/CloseIcon'
import useStyles from './styles'

function Chat (props) {
  const history = useHistory()
  const [anchorEl, setAnchorEl] = React.useState(null)
  const classes = useStyles(props)
  const { data } = useQuery(IS_LOGGED_IN)
  const userQuery = useQuery(USER_QUERY, {
    skip: !data?.isLoggedIn
  })

  React.useEffect(() => {
    if (data.isLoggedIn) {
      history.push('/conversations')
    }
  }, [data])

  const onClose = () => setAnchorEl(null)

  const toggleOpen = (evt) => {
    const target = evt.currentTarget
    setAnchorEl(anchorEl => anchorEl ? null : target)
  }

  const user = userQuery?.data?.user
  const open = Boolean(anchorEl)
  return (
    <>
      <Popover
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onClose}
        PaperProps={{
          classes: {
            root: classes.paper
          }
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <Card classes={{ root: classes.card }}>
          <AppRouter
            {...props}
            user={user}
            isLoggedIn={data.isLoggedIn}
          />
        </Card>
      </Popover>
      <div className={classes.chat} onClick={toggleOpen}>
        {open ? <CloseIcon /> : <CommentBubble />}
      </div>
    </>
  )
}

export default Chat
