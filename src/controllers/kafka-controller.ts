// kafka.controller.ts
import { Request, Response } from 'express'
import { createKafkaService } from '../services/kafka.service'

export const kafkaController = async (req: Request, res: Response) => {
  const brokers = ['your-kafka-broker']
  const topic = 'example-topic'

  const { produceMessage, consumeData } = createKafkaService(brokers)

  try {
    await produceMessage(topic, 'Hello, Kafka!')

    await consumeData(topic, (data) => {
      res.status(200).json({ message: 'Successfully consumed Kafka data', data })
    })
  } catch (error) {
    console.error('Error interacting with Kafka:', error.message)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
