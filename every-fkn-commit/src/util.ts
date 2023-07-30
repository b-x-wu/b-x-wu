import { MongoClient } from "mongodb"
import { Octokit } from "octokit"
import { handleNewestCommit } from "./handleNewestCommit"

export async function sleep (ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export async function loadFreshCommits (mongoClient: MongoClient, octokitClient: Octokit) {
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
