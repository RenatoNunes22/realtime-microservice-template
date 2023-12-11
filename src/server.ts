// server.ts
import express from 'express'
import http from 'http'
import dotenv from 'dotenv'
import cors from 'cors'
import { consumeMqttData } from './services/mqtt.service'
import { consumeKafkaData } from './services/kafkaConsumer.service'
import { producerKafkaData } from './services/kafkaProducer.service'
import { insertMessageDB } from './services/mongodb.service'
import { Kafka } from 'kafkajs'
import { Server as SocketIOServer } from 'socket.io'

dotenv.config()
const MONGODB_URI = process.env.MONGODB_URI || ''
const DB_NAME = process.env.DB_NAME || ''
const KAKFKA_BROKER = process.env.KAFKA_BROKER_URL || ''
const KAFKA_GROUP = process.env.KAFKA_GROUP || 'group'
const MQTT_TOPIC = process.env.TOPIC
const MQTT_CONFIG = {
  brokerUrl: process.env.MQTT_BROKER_URL || '',
  username: process.env.MQTT_USERNAME || undefined,
  password: process.env.MQTT_PASSWORD || undefined,
  port: Number(process.env.MQTT_PORT),
  reconnectAttempts: parseInt(process.env.MQTT_RECONNECT_ATTEMPTS || '0', 10),
}

const app = express()

const server = http.createServer(app)
const io = new SocketIOServer(server)
app.use(cors())
var value: string = ''

if (MQTT_CONFIG && KAKFKA_BROKER && MQTT_TOPIC) {
  const kafka_topic = MQTT_TOPIC.replace(/\//g, '_')
  const kafka = new Kafka({ brokers: [KAKFKA_BROKER], retry: { retries: 10 } })
  const admin_kafka = kafka.admin()
  admin_kafka.createTopics({
    topics: [
      {
        topic: kafka_topic,
        numPartitions: 1,
        replicationFactor: 1,
      },
    ],
  })

  const producer = kafka.producer()
  producer.connect().then(() => {
    console.log('Broker kafka connected')
  })
  consumeMqttData(MQTT_CONFIG, MQTT_TOPIC, (data) => {
    setTimeout(() => {
      producerKafkaData(producer, kafka_topic, data)
    }, 5000)
  })

  consumeKafkaData(kafka, kafka_topic, KAFKA_GROUP, (data) => {
    insertMessageDB(data, kafka_topic, MONGODB_URI, DB_NAME)
    value = data
  })

  io.on('connection', (socket) => {
    socket.emit(kafka_topic, JSON.parse(value))
  })
}

const PORT = 3000

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
