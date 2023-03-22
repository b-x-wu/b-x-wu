import path from 'path'
import { promises as fs } from 'fs'
import type { NextApiRequest, NextApiResponse } from 'next'
import { type ApiFailResponse, type ApiPaginationResponse, Markdown, type PaginationLinks, type PostMetadata } from '../../../types/types'

export default async function handler (req: NextApiRequest, res: NextApiResponse<ApiPaginationResponse<PostMetadata> | ApiFailResponse>): Promise<void> {
  if (req.method !== 'GET') {
    res.status(404).json({ message: "Incorrect method. Must use 'GET'.", data: { method: req.method } })
    return
  }

  const limit: number | undefined = req.query.limit == null ? undefined : (Array.isArray(req.query.limit) ? parseInt(req.query.limit[0]) : parseInt(req.query.limit))
  const start: number = req.query.start == null ? 0 : (Array.isArray(req.query.start) ? parseInt(req.query.start[0]) : parseInt(req.query.start))

  const blogPostDirectory = path.join(process.cwd(), 'blog_posts')
  try {
    const postFileNames = await fs.readdir(blogPostDirectory)
    const postMetadataPromises: Array<Promise<PostMetadata>> = postFileNames.map(async (postFileName) => {
      const fileContents = await fs.readFile(`${blogPostDirectory}/${postFileName}`, 'utf-8')
      const markdown = new Markdown(fileContents)

      return {
        postId: postFileName.split('.')[0],
        title: markdown.metadata.title,
        datePublished: new Date(markdown.metadata.datePublished),
        description: markdown.metadata.description,
        coverImageSrc: markdown.metadata.coverImageSrc,
        isPublished: markdown.metadata.isPublished === 'true'
      }
    })

    const publishedPostMetadatas: PostMetadata[] = (await Promise.all(postMetadataPromises))
      .filter((metadata) => metadata.isPublished == null || metadata.isPublished)
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
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ message: 'Error getting blog posts.', data: { details: error.toString() } })
  }
}
