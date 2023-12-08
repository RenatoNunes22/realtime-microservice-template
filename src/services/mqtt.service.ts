import * as mqtt from 'mqtt'

interface MqttConfig {
  brokerUrl: string
  username?: string
  password?: string
  reconnectAttempts?: number
}
// Função para consumir dados do broker MQTT
export const consumeMqttData = (
  config: MqttConfig,
  topic: string,
  onData: (data: string) => void,
) => {
  const { brokerUrl, username, password, reconnectAttempts } = config

  if (!brokerUrl) {
    throw new Error('MqttConfig must have a valid brokerUrl.')
  }

  // Conexão ao broker MQTT
  const client = mqtt.connect(brokerUrl, {
    username,
    password,
    reconnectPeriod: reconnectAttempts ? 1000 * 60 * 2 : undefined,
    protocol: 'ssl',
    rejectUnauthorized: false,
  })

  // Ao se conectar, subscreve ao tópico especificado
  client.on('connect', () => {
    client.subscribe(topic)
  })

  // Ao receber mensagem, chama a função onData
  client.on('message', (_, message) => {
    onData(message.toString())
  })

  client.on('error', (error) => {
    console.error('MQTT Connection Error:', error.message)
    client.end() // Encerra a conexão para evitar comportamento inesperado
  })
}
