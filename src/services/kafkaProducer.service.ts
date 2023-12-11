import { Producer } from 'kafkajs'

export const producerKafkaData = async (
  producer: Producer,
  kafkaTopic: string,
  message: string,
) => {
  try {
    await producer
      .send({
        topic: kafkaTopic,
        messages: [{ value: message }],
      })
      .then((data) => {
        console.log(`Message ${data} sent in topic: ${kafkaTopic}`)
      })
  } catch (error) {
    console.error('rror sending message to Kafka:', error)
  }
}
