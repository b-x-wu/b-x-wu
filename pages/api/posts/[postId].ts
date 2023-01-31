import path from 'path'
import { promises as fs } from 'fs'
import type { NextApiRequest, NextApiResponse } from 'next'
import { Post, ApiFailResponse, Markdown } from '../../../types/types'

// Returns information about a singular blog post specified by postId supplied in the endpoint url
// If no blog post with the given id is found, 404 will be returned
// The given post must have the title and date published metadata available in the markdown
// or else the server will send back a 500 result
export default async function handler(req: NextApiRequest, res: NextApiResponse<Post | ApiFailResponse>) {
    if (req.method !== 'GET') {
        res.status(404).json({ message: "Incorrect method. Must use 'GET'." })
        return
    }

    const { postId } = req.query
    const blogPostDirectory = path.join(process.cwd(), 'blog_posts')
    try {
        const fileContents = await fs.readFile(`${blogPostDirectory}/${postId}.md`, 'utf-8')
        const markdownData = new Markdown(fileContents)

        const requiredMetadataFields = ['title', 'datePublished']
        const missingMetadataFields = markdownData.missingMetadataFields(requiredMetadataFields)
        if (missingMetadataFields.length > 0) {
            res.status(500).json({ message: "Markdown is missing necessary metadata.", data: { postId, missingFields: missingMetadataFields } })
            return
        }

        res.status(200).json({
            postId: postId as string,
            title: markdownData.metadata.title,
            datePublished: new Date(markdownData.metadata.datePublished),
            content: markdownData.content
        })
    } catch (error: any) {
        if (error.errno === -4058) {
            res.status(404).json({ message: "Could not find blog post.", data: { postId } })
            return
        }

        console.error(error)
        res.status(500).json({ message: "Unknwon error.", data: { details: error.toString() } })
    }
}
