import React from 'react'
import { Editor, EditorState, DraftHandleValue } from 'draft-js'
import { ChevronLeft } from '@material-ui/icons'
import { CardContent, Toolbar, IconButton } from '@material-ui/core'
import { useDebounce } from 'react-use'

import Conversation from '../../components/Conversation'
import ChatCardHeader from '../../components/ChatCardHeader'
import customBlockRenderMap from './blockRenderMap'
import toHtml from './convert'
import { CONVERSATION_QUERY, USER_QUERY } from '../../graphql'
import { MessageTypes, Stages } from '../../fixtures'
import decorator from './emoji/decorator'
import EmojiMenu from './emoji/components/EmojiMenu'
import addEmoji from './emoji/addEmoji'
import useStyles from './styles'
import 'draft-js/dist/Draft.css'
import { useApolloClient, useQuery } from '@apollo/client'
import { useCreateComment, usePushEvent, useDeleteComment } from '../../hooks'
import Sink from './components/Sink'

function ChatView (props) {
  const client = useApolloClient()
  const { history, match } = props
  const classes = useStyles(props)
  const [typingUsers, setTypingUsers] = React.useState([])
  const [typingEvent, setTypingEvent] = React.useState(null)
  const [editorState, setEditorState] = React.useState(EditorState.createEmpty(decorator))
  const [focused, setFocused] = React.useState(false)
  const timerRef = React.useRef(null)
  const editorRef = React.useRef(null)
  const channelRef = React.useRef(null)
  const conversationQuery = useQuery(CONVERSATION_QUERY, {
    skip: !match.params.id,
    variables: { id: match.params.id }
  })
  const userQuery = useQuery(USER_QUERY)
  const user = userQuery?.data?.user
  const conversation = conversationQuery?.data?.conversation

  const createComment = useCreateComment()
  const pushEvent = usePushEvent()
  const deleteComment = useDeleteComment()

  const onDeleteComment = (commentId) => {
    deleteComment({
      commentId,
      conversationId: conversation.id
    })
  }

  const readConversation = () => {
    const data = client.readQuery({
      query: CONVERSATION_QUERY,
      variables: {
        id: conversation.id
      }
    })
    return data
  }

  const writeComment = (data) => {
    return client.writeQuery({
      query: CONVERSATION_QUERY,
      variables: {
        id: data.conversation.id
      },
      data: data
    })
  }

  const onMessage = (topic, buffer) => {
    if (topic !== `helium/${conversation.id}`) return
    const message = JSON.parse(buffer.toString())
    console.log(message)
    if (message.userId === user.id) return
    const data = readConversation()

    switch (message.type) {
      case MessageTypes.CREATE_COMMENT:
        writeComment({
          conversation: {
            ...data.conversation,
            comments: [...data.conversation.comments].concat([
              message.data.createComment
            ])
          }
        })
        break
      case MessageTypes.DELETE_COMMENT:
        writeComment({
          conversation: {
            ...data.conversation,
            comments: [...data.conversation.comments].filter(
              ({ id }) => id !== message.data.createComment.id
            )
          }
        })
        break
      case MessageTypes.TYPING_START:
        setTypingUsers(
          typingUsers.concat(
            typingUsers.includes(message.data.user.id)
              ? []
              : [{ ...message.data.user, active: true }]
          )
        )
        break
      case MessageTypes.TYPING_INACTIVE:
        setTypingUsers(
          typingUsers.filter(user => user.id !== message.data.user.id)
          .concat([{ ...message.data.user, active: false }])
        )
        break
      case MessageTypes.TYPING_STOP:
        setTypingUsers(
          typingUsers.filter(
            (user) => user.id !== message.data.user.id
          )
        )
        break
    }
  }

  const handleReturn = (evt: React.KeyboardEvent<{}>, state: EditorState): DraftHandleValue => {
    evt.preventDefault()

    const currentContent = editorState.getCurrentContent()
    let html = toHtml(currentContent)
    const emptyState = EditorState.createEmpty()
    const nextEditorState = EditorState.push(
      editorState,
      emptyState.getCurrentContent(),
      'insert-fragment'
    )
    setEditorState(nextEditorState)
    setTypingEvent(MessageTypes.TYPING_STOP)

    createComment({
      user,
      conversationId: conversation.id,
      body: btoa(escape(html))
    })

    return 'handled' as DraftHandleValue
  }

  useDebounce(() => {
    if (!MessageTypes[typingEvent]) return
    pushEvent({
      data: {
        user: user
      },
      conversationId: conversation.id,
      type: typingEvent
    })

    if (typingEvent === MessageTypes.TYPING_START) {
      timerRef.current = setTimeout(() => {
        if (focused) {
          setFocused(false)
          setTypingEvent(MessageTypes.TYPING_INACTIVE)
        }
      }, 10 * 1000)
    }
  }, 1000, [typingEvent])

  const onChange = (state) => {
    if (timerRef.current) clearTimeout(timerRef.current)

    setEditorState(state)
  }

  const onAddEmoji = (name: string) => {
    const nextEditorState = addEmoji(editorState, name)
    setEditorState(nextEditorState)
  }

  const onBlur = (evt) => {
    setFocused(false)
    setTypingEvent(MessageTypes.TYPING_STOP)
  }

  const onFocus = (evt) => {
    setFocused(true)
    setTypingEvent(MessageTypes.TYPING_START)
  }

  const comments = React.useMemo(() => {
    return (conversation?.comments || [])
      .map(comment => ({
        ...comment,
        body: unescape(atob(comment.body))
      }))
  }, [conversation])

  const setChannel = (channel) => {
    console.log(channel)
    channelRef.current = channel
  }

  return (
    <>
      {conversation?.id && (
        <Sink key={conversation.id} conversationId={conversation.id} setChannel={setChannel} onMessage={onMessage} />
      )}
      <ChatCardHeader stage={Stages.CHAT}>
        <IconButton
          onClick={(evt) => history.push('/conversations')}
          className={classes.chevron}
        >
          <ChevronLeft className={classes.chevron} />
        </IconButton>
      </ChatCardHeader>
      <CardContent classes={{ root: classes.content }}>
      <Conversation
        user={user}
        onDelete={onDeleteComment}
        typingUsers={typingUsers}
        comments={comments}
      />
      <div className={classes.footer}>
        <Editor
          editorState={editorState}
          onChange={onChange}
          blockRenderMap={customBlockRenderMap}
          ref={editorRef}
          handleReturn={handleReturn}
          onBlur={onBlur}
          onFocus={onFocus}
        />
        <Toolbar className={classes.toolbar}>
          <EmojiMenu addEmoji={onAddEmoji} />
        </Toolbar>
      </div>
      </CardContent>
    </>
  )
}

// @ts-ignore
export default ChatView
