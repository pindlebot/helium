
import { useMutation, useApolloClient } from '@apollo/client'
import { CREATE_USER_MUTATION } from '../graphql'

function useCreateUser () {
  const client = useApolloClient()
  const [mutate] = useMutation(CREATE_USER_MUTATION)

  return async (variables) => {
    const { data } = await mutate({ variables })
    // @ts-ignore
    window.localStorage.setItem('token', data.createUser.token)
    await client.resetStore()
  }
}


export default useCreateUser
