import mqtt from 'mqtt'

export const createChannel = async (id) => {
  const wsEndpoint = process.env.WS_ENDPOINT
  const token = process.env.WS_ENDPOINT_TOKEN
  const { url } = await fetch(`${wsEndpoint}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then((resp) =>
    resp.json()
  )

  const channel = mqtt.connect(url, { resubscribe: false })
  await new Promise((resolve) => channel.on('connect', (data) => resolve(data)))
  await new Promise((resolve) => channel.subscribe(`helium/${id}`, resolve))

  return channel
}