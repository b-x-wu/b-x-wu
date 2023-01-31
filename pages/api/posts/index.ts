import path from 'path'
import { promises as fs } from 'fs'
import type { NextApiRequest, NextApiResponse } from 'next'
import { type Post, type ApiFailResponse, type ApiPaginationResponse, Markdown, type PaginationLinks } from '../../../types/types'

// Returns a paginated array of blog post metadata including the postId, title, date published, description, and cover image (if applicable)
// Note that the post content will not be returned, but will be present in the response as an empty string
// The endpoint optionally supports query parameters defining the limit of the number of responses and the start of the responses
// ie /api/posts?start=0&limit=10
// if no start query parameter is supplied, it will be assumed to be zero
// if no limit query parameter is supplied, it will be assumed to be ten
// the response will contain information about the endpoints to call for the next or previous page in the links field,
// the specified limit, the start, and the actual number of results returned, as well as the actual posts
export default async function handler (req: NextApiRequest, res: NextApiResponse<ApiPaginationResponse<Post> | ApiFailResponse>): Promise<void> {
  if (req.method !== 'GET') {
    res.status(404).json({ message: "Incorrect method. Must use 'GET'.", data: { method: req.method } })
    return
  }

  const limit = req.query.limit == null ? 10 : (Array.isArray(req.query.limit) ? parseInt(req.query.limit[0]) : parseInt(req.query.limit))
  const start = req.query.start == null ? 0 : (Array.isArray(req.query.start) ? parseInt(req.query.start[0]) : parseInt(req.query.start))

  const blogPostDirectory = path.join(process.cwd(), 'blog_posts')
  try {
    const postFileNames = await fs.readdir(blogPostDirectory)
    const returnedFileNames = postFileNames.slice(parseInt(start?.toString() ?? '0'), parseInt(start?.toString() ?? '0') + parseInt(limit?.toString() ?? '10'))
    const returnedPostPromises: Array<Promise<Post>> = returnedFileNames.map(async (returnedFileName) => {
      const fileContents = await fs.readFile(`${blogPostDirectory}/${returnedFileName}`, 'utf-8')
      const markdown = new Markdown(fileContents)
      return {
        postId: returnedFileName.split('.')[0],
        title: markdown.metadata.title,
        datePublished: new Date(markdown.metadata.datePublished),
        content: '', // the content doesn't need to be sent, only some metadata
        description: markdown.metadata.description,
        coverImageSrc: markdown.metadata.coverImageSrc
      }
    })
    const returnedPosts: Post[] = await Promise.all(returnedPostPromises)
    const links: PaginationLinks = { prev: undefined, next: undefined }
    if (start > 0) {
      links.prev = `/api/posts?start=${Math.max(0, start - limit)}&limit=${limit}`
    }
    if (start + limit < postFileNames.length) {
      links.next = `/api/posts?start=${Math.min(postFileNames.length - 1, start + limit)}&limit=${limit}`
    }

    res.status(200).json({
      links,
      limit,
      start,
      size: returnedPosts.length,
      results: returnedPosts
    })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ message: 'Error getting blog posts.', data: { details: error.toString() } })
  }
}
