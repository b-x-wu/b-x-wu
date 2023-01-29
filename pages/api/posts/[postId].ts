import path from 'path'
import { promises as fs } from 'fs'
import type { NextApiRequest, NextApiResponse } from 'next'

type PostData = {
    id: string
    title: string
    datePublished: Date
    description?: string
    text: string
}

type ErrorData = {
    message: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<PostData | ErrorData>) {
    if (req.method !== 'GET') {
        res.status(404).json({ message: "Incorrect method. Must use 'GET'." })
        return
    }

    const { postId } = req.query
    const blogPostDirectory = path.join(process.cwd(), 'blog_posts')
    try {
        const fileContents = await fs.readFile(`${blogPostDirectory}/${postId}.md`, 'utf-8')
        res.status(200).json({
            // TODO: fix these
            id: postId as string,
            title: 'Title: ' + (postId as string) + '(this is from the api)',
            datePublished: new Date(),
            text: fileContents
        })
    } catch {
        res.status(404).json({ message: "Could not find blog post: " + postId })
    }

}