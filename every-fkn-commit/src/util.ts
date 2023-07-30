import { type MongoClient } from 'mongodb'
import { type Octokit } from 'octokit'
import { handleNewestCommit } from './handleNewestCommit'

export async function sleep (ms: number): Promise<void> {
  await new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export async function loadFreshCommits (mongoClient: MongoClient, octokitClient: Octokit): Promise<void> {
  await handleNewestCommit(octokitClient, mongoClient, 'l')
  await sleep(2000)
  await handleNewestCommit(octokitClient, mongoClient, 'm')
  await sleep(2000)
  await handleNewestCommit(octokitClient, mongoClient, 'n')
  await sleep(2000)
  await handleNewestCommit(octokitClient, mongoClient, 'o')
  await sleep(2000)
  await handleNewestCommit(octokitClient, mongoClient, 'p')
  await sleep(2000)
}
