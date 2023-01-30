import path from 'path'
import { promises as fs } from 'fs'
import type { NextApiRequest, NextApiResponse } from 'next'
import { Post, ApiFailResponse, MarkdownData } from '../../..'

// returns an object with the metadata and the text (without the metadata)
function getMarkdownData(fileText: string): MarkdownData {
    const metadataHeaderText = fileText.match(/^---\s([\s\S]*\s)---\s([\s\S]*)$/)

    if (metadataHeaderText === null) {
        return {text: fileText} // no metadata
    }

    const metadataMatch = /(.*): (.*)/g
    const metadata: {[field: string]: string} = {}

    let match
    while ((match = metadataMatch.exec(metadataHeaderText[1])) !== null) {
        metadata[match[1]] = match[2]
    }

    return {
        ...metadata,
        text: metadataHeaderText[2].trim()
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Post | ApiFailResponse>) {
    if (req.method !== 'GET') {
        res.status(404).json({ message: "Incorrect method. Must use 'GET'." })
        return
    }

    const { postId } = req.query
    const blogPostDirectory = path.join(process.cwd(), 'blog_posts')
    try {
        const fileContents = await fs.readFile(`${blogPostDirectory}/${postId}.md`, 'utf-8')
        const markdownData = getMarkdownData(fileContents)

        res.status(200).json({
            id: postId as string,
            title: markdownData['title'], // will be undefined if the field is not defined in metadata
            datePublished: new Date(markdownData['datePublished']),
            text: markdownData.text
        })
    } catch (error: any) {
        if (error.errno === -4058) {
            res.status(404).json({ message: "Could not find blog post.", data: { postId } })
            return
        }

        console.error(error)
        res.status(500).json({ message: "Unknwon error.", data: { details: error.toString() }})
    }

}