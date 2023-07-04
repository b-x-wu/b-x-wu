import { type NextApiRequest, type NextApiResponse } from 'next'
import sharp from 'sharp'
// import Tone from 'tone'

// interface MidiNoteData {
//   start: number
//   duration: number
//   pitch: Tone.Unit.MidiNote
//   velocity: number
// }

// function rgbaToMidiNoteData (r: number, g: number, b: number, a: number): MidiNoteData {
//   return {
//     start: 0,
//     duration: 0,
//     pitch: Tone.ftom(Tone.MidiClass.A4),
//     velocity: 1
//   }
// }

export default async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.query.url == null) {
    res.status(401).json({ message: 'Request query must contain a url.' })
    return
  }

  const fetchResponse = await fetch(typeof req.query.url === 'string' ? req.query.url : req.query.url.join(''))
  if (fetchResponse.status >= 400) {
    res.status(404).json({ message: 'Unable to retrieve url' })
    return
  }

  const imageStream = fetchResponse.body
  if (imageStream == null) {
    res.status(404).json({ message: 'Unable to retrieve url body' })
    return
  }

  const readableStreamResult = await imageStream.getReader().read()
  if (readableStreamResult == null || readableStreamResult.value == null) {
    res.status(500).json({ message: 'Unable to process url body' })
  }

  const sharpImage = sharp(readableStreamResult?.value)
  const sharpImageMetadata = await sharpImage.metadata()

  console.log(`width: ${sharpImageMetadata.width ?? 'none'}, height: ${sharpImageMetadata.height ?? 'none'}`)

  res.json({ message: 'ok over here' })
}
