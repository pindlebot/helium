import mqtt from 'mqtt'
import React from 'react'
import { createChannel } from '../../../util'

function Sink (props) {
  const {
    onMessage,
    conversationId,
    setChannel
  } = props

  React.useEffect(() => {
    let channel: mqtt.MqttClient
    createChannel(conversationId)
      .then((chan) => {
        channel = chan
        setChannel(channel)
        channel.on('message', onMessage)
      })
    
    return () => {
      if (channel) channel.removeListener('message', onMessage)
    }
  }, [])
  
  return null
}

export default Sink
