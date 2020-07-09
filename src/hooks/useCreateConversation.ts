import { useMutation } from '@apollo/client'
import { CREATE_CONVERSATION_MUTATION, FEED_QUERY } from '../graphql'
import escape from 'lodash.escape'

function useCreateConversation () {
  const [mutate] = useMutation(CREATE_CONVERSATION_MUTATION)

  return variables => mutate({
    variables: variables,
    optimisticResponse: {
      __typename: 'Mutation',
      createConversation: {
        __typename: 'conversation',
        id: '1',
        label: variables.label,
        createdAt: new Date().toISOString(),
        snippet: btoa(escape('Hello'))
      }
    },
    update: (proxy, { data: { createConversation } }) => {
      const data = proxy.readQuery({ query: FEED_QUERY })
      proxy.writeQuery({
        query: FEED_QUERY,
        data: {
          feed: {
            // @ts-ignore
            ...data.feed,
             // @ts-ignore
            conversations: data.feed.conversations.concat([createConversation])
          }
        }
      })
    }
  })
}

export default useCreateConversation
