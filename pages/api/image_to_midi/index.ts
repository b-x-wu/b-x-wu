import { type NextApiRequest, type NextApiResponse } from 'next'
// import sharp from 'sharp'

export default async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.query.url == null) {
    res.status(401).json({ message: 'Request query must contain a url.' })
    return
  }

  const fetchResponse = await fetch(typeof req.query.url === 'string' ? req.query.url : req.query.url.join(''))
  const imageStream = fetchResponse.body
  console.log(imageStream)
  res.json({ message: 'ok over here' })
}
