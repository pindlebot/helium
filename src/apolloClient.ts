import { InMemoryCache, ApolloClient, ApolloLink, HttpLink } from '@apollo/client'
import { IS_LOGGED_IN } from './graphql'

const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT
const ANONYMOUS_TOKEN = process.env.ANONYMOUS_TOKEN

 const httpLink = new HttpLink({
   uri: GRAPHQL_ENDPOINT
 })

const middlewareLink = new ApolloLink((operation, forward) => {
  const token = window.localStorage.getItem('token') || ANONYMOUS_TOKEN 
  operation.setContext({
    headers: {
      authorization: `Bearer ${token}`
    }
  })
  return forward(operation)
})

const cache = new InMemoryCache()

const client = new ApolloClient({
  link: ApolloLink.from([
    middlewareLink,
    httpLink
  ]),
  cache,
  resolvers: {}
})


function writeInitialState () {
  cache.writeQuery({
    query: IS_LOGGED_IN,
    data: {
      isLoggedIn: Boolean(localStorage.getItem('token'))
    }
  })
  return Promise.resolve()
}

writeInitialState()

client.onResetStore(writeInitialState)

export default client
