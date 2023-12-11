import { connect, MqttClient } from 'mqtt'

interface MqttConfig {
  brokerUrl: string
  username?: string
  password?: string
  port?: number
  reconnectAttempts?: number
}

export const consumeMqttData = (
  config: MqttConfig,
  topic: string,
  onData: (data: string) => void,
) => {
  const { brokerUrl, username, password, port } = config

  if (!brokerUrl) {
    throw new Error('MqttConfig must have a valid brokerUrl.')
  }

  let client: MqttClient

  client = connect(brokerUrl, {
    username: username,
    password: password,
    port: port,
    protocol: 'ssl',
    rejectUnauthorized: false,
    reconnectPeriod: 1000,
    clean: true,
  })

  client.on('connect', () => {
    console.log('Connected')
    client.subscribe(topic)
  })

  client.on('message', (_, message) => {
    onData(message.toString())
  })

  client.on('error', (error) => {
    console.error('MQTT Connection Error:', error)
    client.end()
  })
}
