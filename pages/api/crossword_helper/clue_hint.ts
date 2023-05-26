import type { NextApiRequest, NextApiResponse } from 'next'
import { MongoClient, ServerApiVersion } from 'mongodb'
import { type Clue } from '../../../types/crossword-helper/types'

const MAX_CLUE_HINTS = 10

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
const shuffle = <T,>(array: T[]): T[] => {
  let currentIndex = array.length; let randomIndex

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]]
  }

  return array
}

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

    const findResult = await collection.findOne({ word: req.query.word })
    if (findResult == null) {
      res.json([])
    } else {
      const allClues: Clue[] = findResult.clues
      res.json(shuffle(allClues).slice(0, MAX_CLUE_HINTS))
    }
  } catch (e: any) {
    console.log(e)
    res.status(500).json({ message: 'Error querying database.', error: e.toString() })
  } finally {
    await client.close()
  }
}
