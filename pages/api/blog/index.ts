import type { NextApiRequest, NextApiResponse } from 'next'
import { Markdown, type ApiFailResponse, type ApiPaginationResponse, type PostMetadata, type PaginationLinks } from '../../../types/types'

export default async function handler (req: NextApiRequest, res: NextApiResponse<ApiPaginationResponse<PostMetadata> | ApiFailResponse>): Promise<void> {
  if (req.method !== 'GET') {
    res.status(404).json({ message: "Incorrect method. Must use 'GET'.", data: { method: req.method } })
    return
  }

  const limit: number | undefined = req.query.limit == null ? undefined : (Array.isArray(req.query.limit) ? parseInt(req.query.limit[0]) : parseInt(req.query.limit))
  const start: number = req.query.start == null ? 0 : (Array.isArray(req.query.start) ? parseInt(req.query.start[0]) : parseInt(req.query.start))

  const blogPostDirectoryUrl = 'https://api.github.com/repos/bruce-x-wu/bruce-x-wu/contents/blog_posts'
  try {
    const directoryFetchResponse = await fetch(blogPostDirectoryUrl, {
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })
    if (!directoryFetchResponse.ok) {
      if (directoryFetchResponse.status === 404) {
        res.status(200).json({
          links: {},
          limit: 0,
          start: 0,
          size: 0,
          results: []
        })
        return
      }
      throw new Error('Error fetching directory information.')
    }
    const directoryFetchResponseData: any[] = await directoryFetchResponse.json()
    const postMetadataPromises: Array<Promise<PostMetadata>> = directoryFetchResponseData.map(async (fileData) => {
      const fileFetchResponse = await fetch(fileData.download_url)
      const fileContents = await fileFetchResponse.text()
      const markdown = new Markdown(fileContents)
      const postIdMatch = fileData.download_url.match(/https:\/\/raw\.githubusercontent\.com\/bruce-x-wu\/bruce-x-wu\/main\/blog_posts\/(.*?)\.md/)
      if (postIdMatch == null) { throw new Error(`Could not find post id from url: ${fileData.download_url as string}`) }
      const postId = postIdMatch[1]

      return {
        postId,
        title: markdown.metadata.title,
        datePublished: new Date(markdown.metadata.datePublished),
        description: markdown.metadata.description,
        coverImageSrc: markdown.metadata.coverImageSrc,
        isPublished: markdown.metadata.isPublished === 'true'
      }
    })

    const publishedPostMetadatas: PostMetadata[] = (await Promise.allSettled(postMetadataPromises))
      .filter((resolveRejected) => resolveRejected.status === 'fulfilled')
      .map((promiseSettledResult) => (promiseSettledResult as PromiseFulfilledResult<PostMetadata>).value)
      .filter((metadata) => metadata.isPublished == null || metadata.isPublished)
      .sort((metadata1, metadata2) => metadata2.datePublished.valueOf() - metadata1.datePublished.valueOf())
    const returnedPostMetadatas = publishedPostMetadatas.slice(start, limit == null ? publishedPostMetadatas.length : start + limit)

    const links: PaginationLinks = { prev: undefined, next: undefined }
    if (start > 0) {
      if (limit == null) {
        links.prev = '/api/blog?start=0'
      } else {
        links.prev = `/api/blog?start=${Math.max(0, start - limit)}&limit=${limit}`
      }
    }
    if (limit != null && start + limit < publishedPostMetadatas.length) {
      links.next = `/api/blog?start=${Math.min(publishedPostMetadatas.length - 1, start + limit)}&limit=${limit}`
    }

    res.status(200).json({
      links,
      limit,
      start,
      size: returnedPostMetadatas.length,
      results: returnedPostMetadatas
    })

    // hotfix for prod
    // // TODO: fix this
    // res.status(200).json({
    //   links: {},
    //   limit: 0,
    //   start: 0,
    //   size: 0,
    //   results: []
    // })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ message: 'Error getting blog posts.', data: { details: error.toString() } })
  }
}
