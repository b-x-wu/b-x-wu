import { type NextApiRequest, type NextApiResponse } from 'next'
import sharp from 'sharp'
import type Tone from 'tone'
import { type ApiFailResponse } from '../../../types/types'
import { type MidiNote } from '../../../types/image_to_midi'

function rgbaToMidiNoteData (r: number, g: number, b: number, a: number): MidiNote {
  // calculate normalized hsl
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const chroma = max - min

  let hue: number = 0
  if (chroma === 0) hue = 0
  else {
    switch (max) {
      case r:
        hue = ((g - b) / chroma)
        break
      case g:
        hue = (b - r) / chroma + 2
        break
      case b:
        hue = (r - g) / chroma + 4
        break
    }
    hue = ((hue + 6) % 6) / 6
  }
  if (hue < 0) { console.log(hue) }

  const lightness = 0.5 * (max + min)
  const saturation = lightness === 1 || lightness === 0 ? 0 : chroma / (1 - Math.abs(2 * lightness - 1))

  const clampToMidiNote = (value: number): Tone.Unit.MidiNote => {
    return Math.max(0, Math.min(127, Math.floor(value))) as Tone.Unit.MidiNote
  }

  return {
    start: hue * 300,
    duration: Math.max(saturation, Number.MIN_VALUE),
    pitch: clampToMidiNote(lightness * 127),
    velocity: a
  }
}

export default async function handler (req: NextApiRequest, res: NextApiResponse<MidiNote[] | ApiFailResponse>): Promise<void> {
  if (req.query.url == null) {
    res.status(401).json({ message: 'Request query must contain a url.' })
    return
  }

  const fetchResponse = await fetch(typeof req.query.url === 'string' ? req.query.url : req.query.url.join(''))
  if (fetchResponse.status >= 400) {
    res.status(404).json({ message: 'Unable to retrieve url' })
    return
  }

  const sharpImage = sharp(await fetchResponse.arrayBuffer()) // TODO: should this be try/catch-ed?
  const sharpImageMetadata = await sharpImage.metadata()

  if (sharpImageMetadata.width == null || sharpImageMetadata.height == null) {
    res.status(500).json({ message: 'Unable to retrieve image dimensions' })
    return
  }

  const midiNoteDatas: MidiNote[] = []
  const rawRedBuffer = await sharpImage.extractChannel('red').raw().toBuffer()
  const rawGreenBuffer = await sharpImage.extractChannel('green').raw().toBuffer()
  const rawBlueBuffer = await sharpImage.extractChannel('blue').raw().toBuffer()
  const rawAlphaBuffer = sharpImageMetadata.hasAlpha != null && sharpImageMetadata.hasAlpha
    ? await sharpImage.extractChannel('alpha').raw().toBuffer()
    : Buffer.from(new Array(sharpImageMetadata.width * sharpImageMetadata.height).fill(1))

  let red: number | undefined
  let green: number | undefined
  let blue: number | undefined
  let alpha: number | undefined
  let idx: number

  for (let y = 0; y < sharpImageMetadata.height; y++) {
    for (let x = 0; x < sharpImageMetadata.width; x++) {
      idx = y * sharpImageMetadata.width + x
      red = rawRedBuffer.at(idx)
      green = rawGreenBuffer.at(idx)
      blue = rawBlueBuffer.at(idx)
      alpha = rawAlphaBuffer.at(idx)

      if (red == null || green == null || blue == null || alpha == null) {
        console.log('r || g || b || alpha == null')
        continue
      }

      midiNoteDatas.push(rgbaToMidiNoteData(red, green, blue, alpha))
    }
  }

  res.json(midiNoteDatas)
}
