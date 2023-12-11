import { Kafka } from 'kafkajs'

export const producerKafkaData = async (brokers: string[], kafkaTopic: string, message: string) => {
  const kafka = new Kafka({ brokers })
  const producer = kafka.producer()
  var connected = false

  producer.connect().then(() => {
    console.log('Conectado ao broker Kafka')
  })

  producer.on(producer.events.DISCONNECT, async (e) => {
    console.error(`O produtor foi desconectado do Kafka. Motivo: ${e}`)
  })

  producer.on(producer.events.CONNECT, () => {
    connected = true
    console.log('Produtor conectado ao Kafka')

    setTimeout(() => {
      if (connected) {
        consumeAndPublish()
      } else {
        console.log('O produtor está desconectado. Aguardando reconexão...')
      }
    }, 5000)
  })

  const consumeAndPublish = async () => {
    try {
      await producer.send({
        topic: kafkaTopic,
        messages: [{ value: message }],
      })
    } catch (error) {
      console.error('Erro ao enviar mensagem para o Kafka:', error)
    }
  }
}
