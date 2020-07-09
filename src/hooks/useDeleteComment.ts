
import { useMutation } from '@apollo/client'
import { queries, DELETE_COMMENT_MUTATION } from '../graphql'

function useDeleteComment () {
  const [mutate] = useMutation(DELETE_COMMENT_MUTATION)

  return ({ commentId, conversationId }) => mutate({
    variables: { id: commentId },
    optimisticResponse: {
      __typename: 'Mutation',
      deleteComment: {
        __typename: 'comment',
        id: commentId
      }
    },
    update: (proxy, { data: { deleteComment } }: any) => {
      const data = proxy.readQuery({
        query: queries.CONVERSATION,
        variables: {
          id: conversationId
        }
      })
      proxy.writeQuery({
        query: queries.CONVERSATION,
        variables: {
          id: conversationId
        },
        data: {
          conversation: {
            // @ts-ignore
            ...data.conversation,
            // @ts-ignore
            comments: [...data.conversation.comments].filter((comment) => comment.id !== commentId)
          }
        }
      })
    })
  })
}


export default useDeleteComment
