import { Consumer, Kafka, EachMessagePayload } from 'kafkajs'

// Função para consumir dados do Kafka
export const consumeKafkaData = async (
  brokers: string[],
  topic: string,
  onData: (data: string) => void,
) => {
  // Criação de uma instância do Kafka
  const kafka = new Kafka({ brokers })

  // Criação de um consumidor
  const consumer = kafka.consumer({ groupId: 'group' })

  // Conexão ao Kafka
  await consumer.connect()

  // Subscrição ao tópico especificado
  await consumer.subscribe({ topic, fromBeginning: true })

  // Ao receber mensagem, chama a função onData
  await consumer.run({
    eachMessage: async ({ message }: EachMessagePayload) => {
      if (message.value) onData(message.value.toString())
    },
  })
}
