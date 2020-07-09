import { useMutation } from '@apollo/client'
import { CONVERSATION_QUERY, CREATE_COMMENT_MUTATION } from '../graphql'


function useCreateComment () {
  const [mutate] = useMutation(CREATE_COMMENT_MUTATION)
  
  return ({ user, ...rest }) => mutate({
    variables: { 
      ...rest,
      userName: user.name
    },
    optimisticResponse: {
      __typename: 'Mutation',
      createComment: {
        __typename: 'comment',
        id: '1',
        body: rest.body,
        createdAt: new Date().toISOString(),
        user: {
          __typename: 'user',
          id: user?.id,
          name: user?.name
        }
      }
    },
    update: (proxy, { data: { createComment } }: any) => {
      const data = proxy.readQuery({
        query: CONVERSATION_QUERY,
        variables: {
          id: rest.conversationId
        }
      })
      proxy.writeQuery({
        query: CONVERSATION_QUERY,
        variables: {
          id: rest.conversationId
        },
        data: {
          conversation: {
            // @ts-ignore
            ...data.conversation,
            snippet: createComment.body,
            // @ts-ignore
            comments: [...data.conversation.comments].concat([createComment])
          }
        }
      })
    })
  })
}

export default useCreateComment

