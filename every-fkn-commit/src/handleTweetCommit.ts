import { type MongoClient } from 'mongodb'
import { type Octokit } from 'octokit'
import { type TwitterApiReadWrite } from 'twitter-api-v2'
import { type Commit } from './types'

async function getGithubUserTwitterHandle (octokitClient: Octokit, username: string): Promise<string | null> {
  return (await octokitClient.rest.users.getByUsername({
    username
  })).data.twitter_username ?? null
}

async function commitToTweet (octokitClient: Octokit, commit: Commit): Promise<string> {
  let authorString = ''
  if (commit.author != null) {
    authorString = `by ${commit.author}`
    const twitterHandle = await getGithubUserTwitterHandle(octokitClient, commit.author)
    if (twitterHandle != null) authorString = `${authorString} (@${twitterHandle})`
  }
  let messageString = commit.message

  if (authorString.length === 0) {
    if (messageString.length + 25 > 280) {
      messageString = `${messageString.substring(0, 252)}...`
    }
    return `${messageString}\n\n${commit.url}`
  }

  if (messageString.length + authorString.length + 27 > 280) {
    messageString = `${messageString.substring(0, 250 - authorString.length)}...`
  }
  return `${messageString}\n\n${authorString}\n\n${commit.url}`
}

async function broadcastCommit (twitterClient: TwitterApiReadWrite, octokitClient: Octokit, commit: Commit): Promise<void> {
  const tweet = await commitToTweet(octokitClient, commit)
  if (process.env.NODE_ENV === 'production') {
    await twitterClient.v2.tweet({ text: tweet })
    return
  }
  console.log(tweet)
}

async function popLatestMongoCommit (client: MongoClient): Promise<Commit | null> {
  const freshCommitsCollection = client.db('every-fkn-commit')?.collection<Commit>('fresh-commits')
  const usedCommitsCollection = client.db('every-fkn-commit')?.collection<Commit>('used-commits')
  if (freshCommitsCollection == null || usedCommitsCollection == null) throw new Error('Could not find collection')

  const commit = await freshCommitsCollection.findOneAndDelete({}, {
    sort: {
      date: 'desc'
    }
  })
  if (commit.value == null) return null

  await usedCommitsCollection.updateOne({ sha: commit.value.sha }, { $set: commit.value }, {
    upsert: true
  })
  return commit.value
}

export async function handleTweetCommit (twitterClient: TwitterApiReadWrite, octokitClient: Octokit, mongoClient: MongoClient): Promise<void> {
  try {
    const commit = await popLatestMongoCommit(mongoClient)
    if (commit == null) {
      return
    }
    await broadcastCommit(twitterClient, octokitClient, commit)
  } catch (e: any) {
    console.error(e.toString())
  }
}
