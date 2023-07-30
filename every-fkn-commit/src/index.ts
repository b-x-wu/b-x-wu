import { Octokit } from 'octokit'
import { MongoClient, ServerApiVersion } from 'mongodb'
import * as dotenv from 'dotenv'
import { TwitterApi } from 'twitter-api-v2'
import { schedule } from 'node-cron'
import { handleNewestCommit } from './handleNewestCommit'
import { handleTweetCommit } from './handleTweetCommit'
dotenv.config()

async function main (): Promise<void> {
  const uri = `mongodb+srv://${process.env.DB_USER ?? 'user'}:${process.env.DB_PASSWORD ?? 'pass'}@cluster0.cftdtes.mongodb.net/?retryWrites=true&w=majority`
  const mongoClient = await new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true
    }
  }).connect()
  const octokitClient = new Octokit({})
  const twitterClient = (new TwitterApi({
    appKey: process.env.TWITTER_API_KEY ?? '',
    appSecret: process.env.TWITTER_API_KEY_SECRET ?? '',
    accessToken: process.env.TWITTER_ACCESS_TOKEN ?? '',
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET ?? ''
  })).readWrite

  const handleTweetCommitTask = schedule('29,59 * * * *', () => {
    void (async () => {
      await handleTweetCommit(twitterClient, octokitClient, mongoClient)
    })()
  })

  const handleNewestCommitTask = schedule('*/20 * * * * *', () => {
    void (async () => {
      await handleNewestCommit(octokitClient, mongoClient, 'fuck')
    })()
  })

  console.log('Starting tasks.')
  handleTweetCommitTask.start()
  handleNewestCommitTask.start()

  process.on('SIGINT', () => {
    void mongoClient.close()
    handleNewestCommitTask.stop()
    handleTweetCommitTask.stop()
  })

  process.on('SIGTERM', () => {
    void mongoClient.close()
    handleNewestCommitTask.stop()
    handleTweetCommitTask.stop()
  })
}

main().catch(console.error)
