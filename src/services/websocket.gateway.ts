// websocket.consumer.ts

// Importações das bibliotecas WebSocket e HTTP
import * as socketIo from 'socket.io'
import { Server } from 'http'

// Função para consumir dados do WebSocket
export const consumeWebSocketData = (httpServer: Server, onData: (data: string) => void) => {
  // Criação de uma instância do Socket.IO
  const io = socketIo(httpServer)

  // Ao conectar, exibe mensagens no console
  io.on('connection', (socket: { on: (arg0: string, arg1: () => void) => void }) => {
    console.log('Client connected')

    // Ao desconectar, exibe mensagens no console
    socket.on('disconnect', () => {
      console.log('Client disconnected')
    })
  })

  // Ao receber dados, emite para todos os clientes conectados
  onData = (data: string) => {
    io.emit('message', data)
  }
}
