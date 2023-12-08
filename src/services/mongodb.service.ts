import { MongoClient } from 'mongodb'

export const storeLastMessage = async (MONGODB_URI: string, message: string) => {
  if (!MONGODB_URI) {
    throw new Error('MongoDB URL is not defined.')
  }

  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()

    const db = client.db()
    const messengerCollection = db.collection('messenger')
    const timestamp = new Date().toISOString()

    await messengerCollection.insertOne({
      message,
      createdAt: timestamp,
    })
    console.log(`Message stored in MongoDB: ${message}`)
  } catch (error) {
    console.error('MongoDB Connection Error:', error)
  } finally {
    await client.close()
  }
}
