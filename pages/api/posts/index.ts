import path from 'path'
import { promises as fs } from 'fs'
import type { NextApiRequest, NextApiResponse } from 'next'

// TODO: this is in two places
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

export default async function handler(req: NextApiRequest, res: NextApiResponse<PostData[] | ErrorData>) {
    if (req.method !== 'GET') {
        res.status(404).json({ message: "Incorrect method. Must use 'GET'." })
        return
    }

    const { postId } = req.query
    const blogPostDirectory = path.join(process.cwd(), 'blog_posts')
    try {
        const postFiles = await fs.readdir(blogPostDirectory)
        const postDatas: PostData[] = postFiles.map((postFile: string) => {
            return {
                id: postFile.split('.')[0],
                title: "",
                datePublished: new Date(),
                text: ""
            }
        })
        res.status(200).json(postDatas)
    } catch {
        res.status(404).json({ message: "Could not find blog post: " + postId })
    }

}