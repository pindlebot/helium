import mqtt from 'mqtt'
import createPresignedURL from 'aws-sign-mqtt'
import crypto from 'crypto'

const genId = () => crypto.randomBytes(8).toString('hex')

let channel

const connect = (channel) =>
  new Promise((resolve, reject) => channel.on('connect', resolve))

const subscribe = (channel, topic) =>
  new Promise((resolve, reject) =>
    channel.subscribe(topic, () => {
      console.log(`subscribed to topic "${topic}"`)
      resolve()
    })
  )

const msg_types = {
  GQL_CONNECTION_INIT: 'connection_init', // Client -> Server
  GQL_CONNECTION_ACK: 'connection_ack', // Server -> Client
  GQL_CONNECTION_ERROR: 'connection_error', // Server -> Client
  GQL_CONNECTION_TERMINATE: 'connection_terminate', // Client -> Server
  GQL_CONNECTION_KEEP_ALIVE: 'ka', // Server -> Client
  GQL_START: 'start', // Client -> Server
  GQL_DATA: 'data', // Server -> Client
  GQL_ERROR: 'error', // Server -> Client
  GQL_COMPLETE: 'complete', // Server -> Client
  GQL_STOP: 'stop', // Client -> Server
}

const CLIENT_MESSAGE_TYPES = [
  msg_types.GQL_CONNECTION_INIT,
  msg_types.GQL_CONNECTION_TERMINATE,
  msg_types.GQL_START,
  msg_types.GQL_STOP
]

export const handler = async (
  { channelId },
  context,
  callback
) => {
  const topic = `helium/${channelId}`
  let endingInvocation = false
  let timeout
  let executionCheckInterval
  let resolveExecution
  let promise = new Promise((resolve, reject) => {
    resolveExecution = resolve
  })
  console.log('Invoked with data: ', channelId)

  channel = mqtt.connect(createPresignedURL())
  channel.on('error', error => console.log('WebSocket error', error))
  channel.on('offline', () => console.log('WebSocket offline'))

  const end = (topicEndData = {}) => {
    if (!endingInvocation) {
      endingInvocation = true
      clearInterval(executionCheckInterval)
      clearTimeout(timeout)

      channel.unsubscribe(topic, () => {
        channel.publish(topic, JSON.stringify({
          channelId,
          ...topicEndData
        }), {
          qos: 0
        }, () => {
          channel.end(resolveExecution)
        })
      })
    }
  }

  const newTimeout = () =>
    setTimeout(() => {
      console.log('Timing out. No requests received for 30 seconds.')
      end({ inactivity: true })
    }, 30000)

  executionCheckInterval = setInterval(async () => {
    let remaining = context.getRemainingTimeInMillis()
    if (remaining < 5000) {
      console.log('Ran out of execution time.')
      end({ outOfTime: true })
    }
  }, 1000)

  await connect(channel)
  console.log('Connected to AWS IoT broker')
  await subscribe(channel, topic)

  channel.publish(topic, JSON.stringify({ type: msg_types.GQL_CONNECTION_ACK, id: genId() }), {
    qos: 1
  })

  channel.publish(topic, JSON.stringify({ type: msg_types.GQL_CONNECTION_KEEP_ALIVE, id: genId() }), {
    qos: 1
  })

  timeout = newTimeout()

  channel.on('message', async (topic, buffer) => {
    const message = JSON.parse(buffer.toString())
    console.log(message)

    if (CLIENT_MESSAGE_TYPES.includes(message.type)) {
      if (!endingInvocation) {
        clearTimeout(timeout)
        timeout = newTimeout()
      }
    }

    if (message.type === msg_types.GQL_START) {
      const { payload } = message
    }

    if (message.type === msg_types.GQL_CONNECTION_INIT) {
      return channel.publish(topic, JSON.stringify({
        id: genId(),
        type: msg_types.GQL_CONNECTION_ACK
      }))
    }
  })

  await promise.then(() => callback(null))
}
