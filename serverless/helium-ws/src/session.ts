import createPresignedURL from 'aws-sign-mqtt'

export const handler = async (event, context, callback) => {
  console.log(JSON.stringify(event))
  const url = createPresignedURL()
  const channelId = event.pathParameters.id

  callback(null, {
    statusCode: 200,
    body: JSON.stringify({
      url,
      channelId,
      conversationId: channelId
    }),
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  })
}
