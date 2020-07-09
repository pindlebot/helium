import gql from 'graphql-tag'

export const CONVERSATION_QUERY = gql`
  query($id: ID!) {
    conversation(id: $id) {
      id
      label
      createdAt
      snippet
      comments {
        body
        id
        createdAt
        user {
          id
          name
        }
      }
    }
  }
`

export const USER_QUERY = gql`
  query {
    user {
      id
      name
    }
  }
`

export const FEED_QUERY = gql`
  query {
    feed {
      conversations {
        id
        label
        createdAt
        snippet
      }
    }
  }
`

export const CREATE_USER_MUTATION = gql`
  mutation ($name: String) {
    createUser(name: $name) {
      id
      name
      token
    }
  }
`

export const CREATE_COMMENT_MUTATION = gql`
  mutation ($conversationId: ID!, $body: String!, $userName: String!) {
    createComment (conversationId: $conversationId, body: $body, userName: $userName) {
      id
      createdAt
      body
      user {
        id
        name
      }
    }
  }
`

export const DELETE_COMMENT_MUTATION = gql`
  mutation ($id: ID!) {
    deleteComment  (id: $id) {
      id
    }
  }
`

export const PUSH_EVENT_MUTATION = gql`
 mutation ($data: JSON!, $type: EventType!, $conversationId: ID!) {
   pushEvent(data: $data, type: $type, conversationId: $conversationId) {
     data
     type
     userId
     conversationId
   }
 }
`

export const CREATE_CONVERSATION_MUTATION = gql`
  mutation ($label: String) {
    createConversation(label: $label) {
      id
      label
      createdAt
      snippet
    }
  }
`

export const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`

export const queries = {
  CONVERSATION: CONVERSATION_QUERY,
  FEED: FEED_QUERY,
  USER: USER_QUERY
}

export const mutations = {
  CREATE_CONVERSATION: CREATE_CONVERSATION_MUTATION,
  PUSH_EVENT: PUSH_EVENT_MUTATION,
  DELETE_COMMENT: DELETE_COMMENT_MUTATION,
  CREATE_COMMENT: CREATE_COMMENT_MUTATION,
  CREATE_USER: CREATE_USER_MUTATION
}
