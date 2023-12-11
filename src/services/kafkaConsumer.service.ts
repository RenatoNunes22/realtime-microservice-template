import { Kafka, EachMessagePayload } from 'kafkajs'

export const consumeKafkaData = async (
  brokers: string[],
  topic: string,
  group: string,
  onData: (data: string) => void,
) => {
  const kafka = new Kafka({ brokers })

  const consumer = kafka.consumer({ groupId: group })

  const run = async () => {
    await consumer.connect()
    await consumer.subscribe({ topic: topic, fromBeginning: true })

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        if (Buffer.isBuffer(message.value)) {
          let value = message.value.toString()
          onData(value)
        } else {
          console.error('A mensagem não é um buffer.')
        }
      },
    })
  }

  run().catch(console.error)
}
