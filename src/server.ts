// server.ts
import express from 'express'
import http from 'http'
import dotenv from 'dotenv'

import { consumeMqttData } from './services/mqtt.service'
import { consumeKafkaData } from './services/kafkaConsumer.service'
import { producerKafkaData } from './services/kafkaProducer.service'
import { insertMessageDB } from './services/mongodb.service'

dotenv.config()
const MONGODB_URI = process.env.MONGODB_URI || ''
const DB_NAME = process.env.DB_NAME || ''
const KAKFKA_BROKER = process.env.KAFKA_BROKER_URL || ''
const KAFKA_GROUP = process.env.KAFKA_GROUP || 'group'
const KAFKA_TOPIC = process.env.KAFKA_TOPIC || ''
const MQTT_TOPIC = process.env.MQTT_TOPIC || ''
const MQTT_CONFIG = {
  brokerUrl: process.env.MQTT_BROKER_URL || '',
  username: process.env.MQTT_USERNAME || undefined,
  password: process.env.MQTT_PASSWORD || undefined,
  port: Number(process.env.MQTT_PORT),
  reconnectAttempts: parseInt(process.env.MQTT_RECONNECT_ATTEMPTS || '0', 10),
}

const app = express()
const server = http.createServer(app)

if (MQTT_CONFIG) {
  consumeMqttData(MQTT_CONFIG, MQTT_TOPIC, (data) => {
    if (KAKFKA_BROKER) {
      producerKafkaData([KAKFKA_BROKER ?? ''], KAFKA_TOPIC ?? 'topic', data)
    }
  })
}

consumeKafkaData([KAKFKA_BROKER ?? ''], 'bess_pcs', KAFKA_GROUP, (data) => {
  insertMessageDB(data, KAFKA_TOPIC, MONGODB_URI, DB_NAME)
})

const PORT = 3000

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
