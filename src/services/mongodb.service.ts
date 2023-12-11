import { MongoClient } from 'mongodb'

export const insertMessageDB = async (
  data: string,
  COLLECTION_NAME: string,
  MONGODB_URI: string,
  DB_NAME: string,
): Promise<void> => {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()

    const db = client.db(DB_NAME)
    const collection = db.collection(COLLECTION_NAME)
    const lastMessage = await collection
      .aggregate([
        {
          $sort: {
            createdAt: -1,
          },
        },
        {
          $limit: 1,
        },
        {
          $project: {
            _id: 0,
            data: 0,
          },
        },
      ])
      .toArray()

    const countResult = await collection
      .aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
          },
        },
      ])
      .toArray()

    if (countResult.length === 0 || timeDifference(lastMessage[0].createdAt)) {
      const now = new Date().setMilliseconds(0)
      const createdAt = new Date(now).toISOString()
      const message = JSON.parse(data).Data
      await collection.insertOne({ ...message, createdAt })
      console.log('Message entered into the database')
    }
  } finally {
    await client.close()
  }
}

const timeDifference = (oldDate: string): boolean => {
  if (oldDate) {
    const now = new Date().getMinutes()
    const oldTime = new Date(oldDate).getMinutes() || 0
    const differenceInMS = now - oldTime
    return differenceInMS >= 1 ? true : false
  } else {
    return false
  }
}
