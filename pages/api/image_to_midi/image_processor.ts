import { type NextApiRequest, type NextApiResponse } from 'next'
import { type ApiFailResponse } from '../../../types/types'
import sharp from 'sharp'

const MAX_NOTES = 10_000

function generateRandomSequence (maxValue: number): number[] {
  const sequence = [...Array(maxValue).keys()]
  let j: number
  let temp: number
  for (let i = 0; i < maxValue; i++) {
    j = Math.floor(Math.random() * (maxValue - i)) + i
    temp = sequence[j]
    sequence[j] = sequence[i]
    sequence[i] = temp
  }
  return sequence
}

export default async function handler (req: NextApiRequest, res: NextApiResponse<any | ApiFailResponse>): Promise<void> {
  let image: string | undefined
  try {
    image = JSON.parse(req.body).image
  } catch (e) {
    console.log(e)
  }

  if (image == null) {
    res.status(400).json({ message: 'Request body must contain image in Base64 encoding' })
    return
  }

  let sharpImage: sharp.Sharp | undefined
  let sharpImageMetadata: sharp.Metadata | undefined
  try {
    sharpImage = sharp(Buffer.from(image, 'base64'))
    sharpImageMetadata = await sharpImage.metadata()
  } catch (e) {
    console.log(e)
  }

  if (sharpImage == null || sharpImageMetadata == null) {
    res.status(500).json({ message: 'Unable to analyze image', data: { image: req.body.image } })
    return
  }

  if (sharpImageMetadata.width == null || sharpImageMetadata.height == null) {
    res.status(500).json({ message: 'Unable to retrieve image dimensions', data: { image: req.body.image } })
    return
  }

  const rawRedBuffer = await sharpImage.extractChannel('red').raw().toBuffer()
  const rawGreenBuffer = await sharpImage.extractChannel('green').raw().toBuffer()
  const rawBlueBuffer = await sharpImage.extractChannel('blue').raw().toBuffer()
  const rawAlphaBuffer = sharpImageMetadata.hasAlpha != null && sharpImageMetadata.hasAlpha
    ? await sharpImage.extractChannel('alpha').raw().toBuffer()
    : Buffer.from(new Array(sharpImageMetadata.width * sharpImageMetadata.height - 1).fill(1))
  const indexArray = generateRandomSequence(Math.min(sharpImageMetadata.height * sharpImageMetadata.width, MAX_NOTES))

  const redBuffer: Buffer = Buffer.from(indexArray.map<number>((idx) => rawRedBuffer.at(idx) ?? 0))
  const greenBuffer: Buffer = Buffer.from(indexArray.map<number>((idx) => rawGreenBuffer.at(idx) ?? 0))
  const blueBuffer: Buffer = Buffer.from(indexArray.map<number>((idx) => rawBlueBuffer.at(idx) ?? 0))
  const alphaBuffer: Buffer = Buffer.from(indexArray.map<number>((idx) => rawAlphaBuffer.at(idx) ?? 0))
  const indexBuffer: Buffer = Buffer.from(indexArray)

  res.json({
    height: sharpImageMetadata.height,
    width: sharpImageMetadata.width,
    redBuffer: redBuffer.toString('base64'),
    greenBuffer: greenBuffer.toString('base64'),
    blueBuffer: blueBuffer.toString('base64'),
    alphaBuffer: alphaBuffer.toString('base64'),
    indexBuffer: indexBuffer.toString('base64'),
    encodedIndexArray: String.fromCharCode(...indexArray)
  })
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb'
    }
  }
}
