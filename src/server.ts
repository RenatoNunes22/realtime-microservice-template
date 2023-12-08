import express from 'express'
import http from 'http'
import { consumeMqttData } from './services/mqtt.service'
import { consumeKafkaData } from './services/kafka.service'
import { consumeWebSocketData } from './services/websocket.gateway'
import { storeLastMessage } from './services/mongodb.service'
import dotenv from 'dotenv'

dotenv.config()

const KAFKA_BROKER_URI = process.env.KAFKA_BROKER_URL || ''
const MONGODB_URI = process.env.MONGODB_URL || ''
const MQTT_CONFIG = {
  brokerUrl: process.env.MQTT_BROKER_URL || '',
  username: process.env.MQTT_USERNAME || undefined,
  password: process.env.MQTT_PASSWORD || undefined,
  reconnectAttempts: parseInt(process.env.MQTT_RECONNECT_ATTEMPTS || '0', 10),
}

// Criação da aplicação Express e do servidor HTTP
const app = express()
const server = http.createServer(app)

// Configuração dos WebSockets
consumeWebSocketData(server, async (data) => {
  // Ao receber dados via WebSocket, armazena a última mensagem no MongoDB
  await storeLastMessage(MONGODB_URI, data)
})

// Configuração do MQTT
consumeMqttData(MQTT_CONFIG, 'topic', (data) => {
  // Ao receber dados via MQTT, exibe no console
  console.log(`MQTT Data: ${data}`)
})

// Configuração do Kafka
consumeKafkaData([KAFKA_BROKER_URI], 'topic', (data) => {
  // Ao receber dados via Kafka, exibe no console
  console.log(`Kafka Data: ${data}`)
})

// Porta em que o servidor irá ouvir
const PORT = 3000

// Inicia o servidor HTTP
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
