import { type NextApiRequest, type NextApiResponse } from 'next'
import sharp from 'sharp'
import type Tone from 'tone'
import { type ApiFailResponse } from '../../../types/types'
import { type Pixel, type Image } from '../../../types/image_to_midi'

interface MidiNoteData {
  start: number
  duration: number
  pitch: Tone.Unit.MidiNote
  velocity: number
}

function rgbaToMidiNoteData (r: number, g: number, b: number, a: number): MidiNoteData {
  return {
    start: 0,
    duration: 0,
    pitch: 1,
    velocity: 1
  }
}

export default async function handler (req: NextApiRequest, res: NextApiResponse<Image | ApiFailResponse>): Promise<void> {
  if (req.query.url == null) {
    res.status(401).json({ message: 'Request query must contain a url.' })
    return
  }

  const fetchResponse = await fetch(typeof req.query.url === 'string' ? req.query.url : req.query.url.join(''))
  if (fetchResponse.status >= 400) {
    res.status(404).json({ message: 'Unable to retrieve url' })
    return
  }

  const sharpImage = sharp(await fetchResponse.arrayBuffer())
  const sharpImageMetadata = await sharpImage.metadata()

  if (sharpImageMetadata.width == null || sharpImageMetadata.height == null) {
    res.status(500).json({ message: 'Unable to retrieve image dimensions' })
    return
  }

  const bitmap: Pixel[][] = []
  const rawRedBuffer = await sharpImage.extractChannel('red').raw().toBuffer()
  const rawGreenBuffer = await sharpImage.extractChannel('green').raw().toBuffer()
  const rawBlueBuffer = await sharpImage.extractChannel('blue').raw().toBuffer()

  let red: number | undefined
  let green: number | undefined
  let blue: number | undefined

  for (let y = 0; y < sharpImageMetadata.height; y++) {
    const bitmapRow: Pixel[] = []
    for (let x = 0; x < sharpImageMetadata.width; x++) {
      // red = rawBuffer.at(y * sharpImageMetadata.width + x)
      // green = rawBuffer.at(y * sharpImageMetadata.width + x + 1)
      // blue = rawBuffer.at(y * sharpImageMetadata.width + x + 2)
      red = rawRedBuffer.at(y * sharpImageMetadata.width + x)
      green = rawGreenBuffer.at(y * sharpImageMetadata.width + x)
      blue = rawBlueBuffer.at(y * sharpImageMetadata.width + x)

      if (red == null || green == null || blue == null) {
        console.log('r || g || b == null')
        continue
      }

      bitmapRow.push({ red, green, blue })
    }
    bitmap.push(bitmapRow)
  } // TODO: catch has alpha case

  res.json({ width: sharpImageMetadata.width, height: sharpImageMetadata.height, bitmap })
}
