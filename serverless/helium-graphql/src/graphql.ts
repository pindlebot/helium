import { ApolloServer, AuthenticationError, gql } from 'apollo-server-lambda'
import AWS from 'aws-sdk'
import get from 'lodash.get'
import client from 'postgres-tools'
import GraphQLJSON from 'graphql-type-json'
import jwt from 'jsonwebtoken'

const typeDefs = gql`
  scalar JSON

  enum EventType {
    TYPING_START
    TYPING_STOP
    TYPING_INACTIVE
    CREATE_COMMENT
    DELETE_COMMENT
  }

  type User {
    id: ID!
    name: String
    token: String
  }

  type Comment {
    id: ID!
    user: User
    body: String
    createdAt: String
  }

  type Conversation {
    id: ID!
    createdAt: String
    label: String
    comments: [Comment]
    users: [User]
    snippet: String
  }

  type Feed {
    conversations: [Conversation]
  }

  type Query {
    conversation(id: ID!): Conversation
    feed: Feed
    user: User
  }

  type Event {
    data: JSON
    type: EventType
    userId: ID!
    conversationId: ID!
  }

  type Mutation {
    createComment(conversationId: ID!, body: String!, userName: String!): Comment
    createConversation(label: String): Conversation
    deleteComment(id: ID!): Comment
    deleteConversation(id: ID!): Conversation
    createUser(name: String): User
    pushEvent(conversationId: ID!, data: JSON!, type: EventType!): Event
    addUserToConversation(conversationId: ID!): Conversation
  }
`

const iotData = new AWS.IotData({ endpoint: process.env.AWS_IOT_HOST })

const { CLIENT_SESSION_SECRET, CLIENT_SESSION_ID } = process.env

function sign (payload) {
  return new Promise((resolve, reject) =>
    jwt.sign(
      payload,
      CLIENT_SESSION_SECRET, {
        expiresIn: 1000 * 60 * 60 * 24,
        audience: CLIENT_SESSION_ID
      },
      (err, token) => {
        if (err) reject(err)
        else resolve(token)
      }
    )
  )
}

const resolvers = {
  JSON: GraphQLJSON,
  Query: {
    conversation: (parent, args, context) => {
      return client.head(`
        SELECT * FROM conversation WHERE id = $1
      `, [args.id], { head: true })
    },
    user: async (parent, args, context) => {
      if (!context.user) {
        throw new AuthenticationError('Unauthorized')
      }

      const data = await client.head(`
        SELECT * FROM users WHERE id = $1
      `, [context.user])

      if (!(data && data.id)) {
        throw new AuthenticationError('User not found')
      }

      return data
    },
    feed: async (parent, args, context) => {
      const conversations = await client.query(`
        SELECT
          *
        FROM
          users_conversation
        JOIN
          conversation ON users_conversation.conversation_id = conversation.id
      `)
      return {
        conversations
      }
    }
  },
  Mutation: {
    createConversation: (parent, args, context) => {
      return client.head(`
        WITH new_conversation AS (
          INSERT INTO conversation(label) VALUES('${args.label}') RETURNING *
        ),
        connection AS (
          INSERT INTO
            users_conversation(user_id, conversation_id)
          SELECT
            '${context.user}',
            (SELECT id FROM new_conversation)
        )
        SELECT * FROM new_conversation
      `)
    },
    pushEvent: async (parent, args, context) => {
      const {
        conversationId,
        data,
        type
      } = args
      const params = {
        topic: `helium/${conversationId}`,
        payload: JSON.stringify({
          __typename: 'event',
          userId: context.user,
          conversationId: conversationId,
          data: data,
          type: type
        }),
        qos: 1
      }

      await new Promise(resolve => iotData.publish(params, resolve))

      return {
        ...args,
        userId: context.user
      }
    },
    addUserToConversation: async (parent, args, context) => {
      await client.head(`
        INSERT INTO users_conversation(user_id, conversation_id) VALUES($1, $2) RETURNING *
      `, [context.user, args.conversationId])
      
      return client.head(`
        SELECT * FROM conversation WHERE id = $1 
      `, [args.conversationId])
    },
    createComment: async (parent, args, context) => {
      const data = await client.head(`
        INSERT INTO comment (user_id, conversation_id, body) VALUES($1, $2, $3) RETURNING *
      `, [context.user, args.conversationId, args.body], { head: true })

      const { userId, conversationId, ...rest } = data
      const params = {
        topic: `helium/${args.conversationId}`,
        payload: JSON.stringify({
          __typename: 'event',
          userId: userId,
          conversationId: conversationId,
          data: {
            createComment: {
              ...rest,
              __typename: 'comment',
              user: {
                id: userId,
                name: args.userName,
                __typename: 'user'
              }
            }
          },
          type: 'CREATE_COMMENT'
        }),
        qos: 1
      }

      await new Promise(resolve => iotData.publish(params, resolve))
      return data
    },
    deleteComment: async (parent, args, context) => {
      const data = await client.head(`
        DELETE FROM comment WHERE id = $1 RETURNING *
      `, [args.id], { head: true })

      const { userId, conversationId, ...rest } = data

      const params = {
        topic: `helium/${data.conversationId}`,
        payload: JSON.stringify({
          __typename: 'event',
          userId: userId,
          conversationId: conversationId,
          data: {
            deleteComment: {
              ...rest,
              __typename: 'comment',
              user: {
                id: userId,
                __typename: 'user'
              }
            }
          },
          type: 'DELETE_COMMENT'
        }),
        qos: 1
      }

      await new Promise(resolve => iotData.publish(params, resolve))

      return data
    },
    deleteConversation: async (parent, args, context) => {
      const data = await client.head(`
        DELETE FROM conversation WHERE id = $1 RETURNING *
      `, [args.id], { head: true })
      return data
    },
    createUser: async (parent, args, context) => {
      const sub = require('crypto').randomBytes(10).toString('hex')
      const token = await sign({
        sub
      })

      return client.head(`
        INSERT INTO users (id, token, name) VALUES ($1, $2, $3) RETURNING *
      `, [sub, token, args.name])
    }
  },
  Comment: {
    user: (parent, args, context) => {
      console.log(parent)
      return client.head(`
        SELECT * FROM users WHERE id = $1
      `, [parent.userId])
    }
  },
  Conversation: {
    comments: (parent, args, context) => {
      return client.query(`
        SELECT * FROM comment WHERE conversation_id = $1
      `, [parent.id])
    },
    users: (parent, args, context) => {
      return client.query(`
        SELECT
          users_conversation.*,
          users.*
        FROM
          users_conversation
        JOIN
          users
        ON
          users.id = users_conversation.user_id
        WHERE
          users_conversation.conversation_id = $1
      `, [parent.id])
    }
  }
}

// const JWS_REGEX = /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/

const context = async (ctx) => {
  ctx.context.callbackWaitsForEmptyEventLoop = false
  let auth = get(ctx, ['event', 'headers', 'Authorization'], null)
  let token = auth && auth.replace(/\s*[Bb]earer\s/, '')
  // if (!token) return ctx
  // if (!JWS_REGEX.test(token)) return ctx
  ctx.user = (token && JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString('utf8')).sub) || ''

  return ctx
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
  playground: {
    endpoint: '/dev/graphql'
  }
})

export const handler = server.createHandler({
  cors: {
    origin: '*',
    credentials: true,
    allowedHeaders: '*'
  }
})
