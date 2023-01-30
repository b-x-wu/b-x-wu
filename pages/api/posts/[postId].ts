import path from 'path'
import { promises as fs } from 'fs'
import type { NextApiRequest, NextApiResponse } from 'next'
import { Post, ApiFailResponse, Markdown } from '../../../types/types'

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
            id: postId as string,
            title: markdownData.metadata.title, // will be undefined if the field is not defined in metadata
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
