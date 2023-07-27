import { type KeyBuffer, TweetIterable } from './tweetIterable'
import { TwitterApi, type TwitterApiTokens, type TwitterApiReadWrite } from 'twitter-api-v2'
import * as dotenv from 'dotenv'
import { Binary, MongoClient, ServerApiVersion } from 'mongodb'
dotenv.config()

const getMostRecentKeyBuffer = async (client: MongoClient): Promise<Buffer | null> => {
  const collection = client.db('every-tweet')?.collection<KeyBuffer>('keybuffers')
  if (collection == null) return null

  const document = await collection.findOne()
  if (document == null) return null

  return Buffer.from(document.data.buffer)
}

const setMostRecentTweetIterable = async (client: MongoClient, newKeyBuffer: Buffer): Promise<void> => {
  const collection = client.db('every-tweet')?.collection<KeyBuffer>('keybuffers')
  if (collection == null) throw new Error('Collection not found')

  await collection.findOneAndReplace({}, { data: new Binary(newKeyBuffer) }, {
    upsert: true
  })
}

const tweetMessage = async (client: TwitterApiReadWrite, message: string): Promise<void> => {
  await client.v2.tweet({ text: message })
}

const sleep = async (ms: number): Promise<void> => {
  await new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

const main = async (): Promise<void> => {
  const tokens: TwitterApiTokens = {
    appKey: process.env.EVERY_TWEET_API_KEY ?? '',
    appSecret: process.env.EVERY_TWEET_API_KEY_SECRET ?? '',
    accessToken: process.env.EVERY_TWEET_ACCESS_TOKEN ?? '',
    accessSecret: process.env.EVERY_TWEET_ACCESS_TOKEN_SECRET ?? ''
  }
  const twitterClient = (new TwitterApi(tokens)).readWrite

  const uri = `mongodb+srv://${process.env.DB_USER ?? 'user'}:${process.env.DB_PASSWORD ?? 'pass'}@cluster0.cftdtes.mongodb.net/?retryWrites=true&w=majority`
  const mongoClient = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true
    }
  })
  await mongoClient.connect()

  const mostRecentKeyBuffer = await getMostRecentKeyBuffer(mongoClient)
  const tweetIterable = new TweetIterable(mostRecentKeyBuffer ?? undefined)

  let running = true
  const onProcessEnd = (): void => {
    void (async () => {
      await mongoClient.close()
      running = false
    })()
  }
  process.on('SIGINT', onProcessEnd)
  process.on('SIGTERM', onProcessEnd)

  for (const tweet of tweetIterable) {
    if (!running) break
    while (true) {
      try {
        if (!running) break
        if (process.env.NODE_ENV === 'production') {
          await tweetMessage(twitterClient, tweet)
        } else {
          console.log(`New tweet: ${tweet}`)
        }
        try {
          await setMostRecentTweetIterable(mongoClient, tweetIterable.keyBuffer)
        } catch (e: any) {
          console.error(`Most recent tweet not saved: ${e.toString() as string}`)
        }
        await sleep(1800000)
        break
      } catch (err: any) {
        console.error(err.toString())
        await sleep(1800000)
      }
    }
  }
}

main().catch((err) => { console.error(err.toString()) })
