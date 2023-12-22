# Projeto de mensageria em tempo real

Este projeto representa uma sólida arquitetura orientada a eventos, configurada como um template versátil para o lançamento eficiente de projetos de mensageria. Sua missão essencial é atuar como uma ponte eficaz entre fontes de dados, adotando uma abordagem estruturada para receber eventos de um broker MQTT. A jornada continua com o processamento inteligente dessas mensagens através do robusto Apache Kafka, proporcionando uma camada escalável e distribuída para a gestão eficiente de eventos assíncronos. Inicialmente, o projeto está habilmente configurado para consumir eventos de um tópico específico do broker MQTT, oferecendo uma experiência plug-and-play para projetos iniciais. No entanto, a verdadeira inovação está na facilidade com que este template se expande, permitindo a inclusão de lógicas mais sofisticadas. A arquitetura é flexível e escalonável, adaptando-se sem esforço para incluir a subscrição e o processamento de vários tópicos MQTT, abrindo portas para uma ampla variedade de casos de uso.

## Arquitetura

### Componentes Principais

1. **Broker MQTT:**

   - Ponto central de comunicação, recebendo mensagens de diversas fontes.

2. **Apache Kafka:**

   - Gerenciador de mensagens, garantindo entrega eficaz e processamento assíncrono.

3. **MongoDB:**

   - Banco de dados NoSQL para armazenamento persistente das mensagens.

4. **WebSockets:**

   - Canal bidirecional para transmissão em tempo real das mensagens para o frontend.

5. **TypeScript e Node.js:**
   - Linguagem de programação e ambiente de execução para o desenvolvimento do servidor.

### Fluxo de Funcionamento

1. Mensagens são recebidas pelo broker MQTT.
2. Apache Kafka gerencia e entrega essas mensagens.
3. WebSockets transmitem mensagens em tempo real para o frontend.
4. Mensagens são periodicamente inseridas no MongoDB para persistência.

## Configuração do Ambiente de Desenvolvimento

1. **Instalação de Dependências:**
   ```bash
   npm install
   ```
2. **Instalação do broker:**
   ```
   https://mosquitto.org/
   ```
3. **Instalação do kafka:**
   ```
   https://kafka.apache.org/
   ```
4. **Instalação do mongodb:**
   ```
   https://www.mongodb.com/docs/

   ```
5. **Execução do servidor:**
   ```bash
   npm run dev
   ```

## Personalização do Projeto

### Configuração via Variáveis de Ambiente

O projeto oferece personalização por meio do uso de variáveis de ambiente. Para configurar o projeto conforme suas necessidades específicas, ajuste as seguintes variáveis no arquivo de ambiente, geralmente denominado `.env`:

#### Configuração do Kafka (KAFKA-ENV)

- **`KAFKA_BROKER_URI`**: URI do broker Kafka.
- **`KAFKA_BROKER_GROUP`**: Grupo de consumidores no Kafka.
- **`KAFKA_TOPIC`**: Tópico Kafka para a troca de mensagens.

#### Configuração do MongoDB (MONGODB-ENV)

- **`MONGODB_URI`**: URI de conexão com o MongoDB.
- **`DB_NAME`**: Nome do banco de dados MongoDB.

#### Configuração do MQTT (MQTT-ENV)

- **`MQTT_BROKER_URL`**: URL do broker MQTT.
- **`MQTT_USERNAME`**: Nome de usuário para autenticação MQTT (se aplicável).
- **`MQTT_PASSWORD`**: Senha para autenticação MQTT (se aplicável).
- **`MQTT_PORT`**: Porta para conexão MQTT.
- **`MQTT_TOPIC`**: Tópico MQTT para a troca de mensagens.

Exemplo de arquivo `.env`:

```env
# Configuração do Kafka
KAFKA_BROKER_URI=kafka://localhost:9092
KAFKA_BROKER_GROUP=my-group

# Configuração do MongoDB
MONGODB_URI=mongodb://localhost:27017
DB_NAME=my-database

# Configuração do MQTT
MQTT_BROKER_URL=mqtt://localhost:1883
MQTT_USERNAME=my-username
MQTT_PASSWORD=my-password
MQTT_PORT=1883
TOPIC=my-mqtt-topic

```
