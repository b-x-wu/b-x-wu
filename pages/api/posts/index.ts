import path from 'path'
import { promises as fs } from 'fs'
import type { NextApiRequest, NextApiResponse } from 'next'
import { Post, ApiFailResponse } from '../../..'

export default async function handler(req: NextApiRequest, res: NextApiResponse<Post[] | ApiFailResponse>) {
    if (req.method !== 'GET') {
        res.status(404).json({ message: "Incorrect method. Must use 'GET'.", data: { method: req.method } } as ApiFailResponse)
        return
    }

    const { postId } = req.query
    const blogPostDirectory = path.join(process.cwd(), 'blog_posts')
    try {
        const postFiles = await fs.readdir(blogPostDirectory)
        const postDatas: Post[] = postFiles.map((postFile: string) => {
            return {
                id: postFile.split('.')[0],
                title: "",
                datePublished: new Date(),
                text: ""
            }
        })
        res.status(200).json(postDatas)
    } catch (error) {
        res.status(500).json({ message: "Error getting blog posts." })
    }

}