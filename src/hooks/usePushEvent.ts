import { useMutation } from '@apollo/client'
import { PUSH_EVENT_MUTATION } from '../graphql'

function usePushEvent() {
  const [mutate] = useMutation(PUSH_EVENT_MUTATION)
  return variables => mutate({ variables })
}

export default usePushEvent
