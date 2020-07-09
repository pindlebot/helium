import React from 'react'
import { makeStyles } from '@material-ui/styles'
import { CardContent, Button } from '@material-ui/core'
import { List, ListItem, ListItemText, Paper } from '@material-ui/core'
import { useQuery } from '@apollo/client'
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'

import ChatCardHeader from '../../components/ChatCardHeader'
import { Stages } from '../../fixtures'
import { FEED_QUERY } from '../../graphql'
import { useCreateConversation } from '../../hooks'

const formatDate = (str) => distanceInWordsToNow(new Date(str))

const useStyles = makeStyles((theme) => ({
  content: {
    overflowY: 'scroll',
    flexGrow:1
  },
  actions: {
    borderTop: '1px solid #ddd',
    marginTop: 15,
    padding: 15
  },
  card: {
    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 15px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px 0px, rgba(48, 71, 236, 0.5) 0px 2px 0px 0px inset'
  },
  conversation: {
    '&:hover': {
      cursor: 'pointer'
    }
  }
}))

function ConversationView(props) {
  const classes = useStyles(props)
  const createConversation = useCreateConversation()
  const feedQuery = useQuery(FEED_QUERY)
  const feed = feedQuery?.data?.feed
  const { history, visible } = props

  const onCreateConversation = async (evt) => {
    const { data } = await createConversation({ label: 'New' })
    onClick(data.createConversation.id)
  }

  const onClick = (id) => {
    history.push(`/chat/${id}`)
  }

  // @ts-ignore
  const conversations = feed?.conversations || []
  return (
    <>
      <ChatCardHeader stage={Stages.HOME} />
      <CardContent className={classes.content}>
        <Paper className={classes.card} elevation={0}>
          <List>
            {conversations.map((item) => {
              return (
                <ListItem
                  key={item.id}
                  button
                  onClick={(evt) => onClick(item.id)}
                  className={classes.conversation}
                >
                  <ListItemText
                    primary={
                      <div
                        dangerouslySetInnerHTML={{
                          __html: item.snippet
                            ? unescape(atob(item.snippet))
                            : 'New'
                        }}
                      />
                    }
                    secondary={formatDate(item.createdAt)}
                    disableTypography
                  />
                </ListItem>
              )
            })}
          </List>

          <div className={classes.actions}>
            <Button
              variant='contained'
              color='primary'
              onClick={onCreateConversation}
            >
              New Conversation
            </Button>
          </div>
        </Paper>
      </CardContent>
    </>
  )
}

ConversationView.defaultProps = {}

export default ConversationView
