import type { NextApiRequest, NextApiResponse } from 'next'
import { MongoClient, ServerApiVersion } from 'mongodb'
import { type WordHint } from '../../../types/crossword-helper/types'

const MAX_WORD_HINTS = 10

const uri = `mongodb+srv://${process.env.DB_USER ?? 'user'}:${process.env.DB_PASSWORD ?? 'pass'}@cluster0.cftdtes.mongodb.net/?retryWrites=true&w=majority`
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

export default async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method !== 'GET') {
    res.status(404).json({ message: "Incorrect method. Must use 'GET'.", data: { method: req.method } })
    return
  }

  if (req.query.word == null) {
    res.status(404).json({ message: 'Must provide word.' })
    return
  }

  if (typeof req.query.word !== 'string') {
    req.query.word = req.query.word.join('')
  }

  const wordMatch: RegExp = RegExp(`^${req.query.word.replaceAll('_', '\\w')}$`)

  try {
    await client.connect()
    const db = client.db('crossword-helper')
    if (db == null) {
      throw new Error('Database not found.')
    }

    const collection = db.collection('wordhints')
    if (collection == null) {
      throw new Error('Collection not found.')
    }

    const cursor = collection.aggregate([
      { $match: { word: { $regex: wordMatch } } },
      { $sample: { size: MAX_WORD_HINTS } }
    ])

    const cursorArray = await cursor.toArray()
    const wordHints = cursorArray.map<WordHint>((doc) => {
      return {
        word: doc.word,
        clues: doc.clues
      }
    })
    res.json(wordHints)
  } catch (e: any) {
    console.log(e)
    res.status(500).json({ message: 'Error querying database.', error: e.toString() })
  } finally {
    await client.close()
  }
}
