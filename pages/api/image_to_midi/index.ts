import { type NextApiRequest, type NextApiResponse } from 'next'
import sharp from 'sharp'
import type * as Tone from 'tone'
import { Midi } from '@tonejs/midi'
import { type ApiFailResponse } from '../../../types/types'
import { type MidiNote } from '../../../types/image_to_midi'

const MAX_NOTES = 10_000

function generateRandomSequence (maxValue: number, maxSize: number): number[] {
  const sequence = [...Array(maxValue + 1).keys()]
  let j: number
  let temp: number
  for (let i = 0; i < Math.min(maxValue - 1, maxSize); i++) {
    j = Math.floor(Math.random() * (maxValue - i)) + i
    temp = sequence[j]
    sequence[j] = sequence[i]
    sequence[i] = temp
  }
  if (maxSize <= maxValue) return sequence.slice(0, maxSize)
  return sequence
}

// TODO: add in x, y, width, height as an option
// TODO: add in track as a midinote option
function rgbaToMidiNoteData (r: number, g: number, b: number, a: number): MidiNote | undefined {
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

  const lerpToBearableMidiNote = (alpha: number): Tone.Unit.MidiNote => {
    return Math.floor(40 + alpha * (100 - 40)) as Tone.Unit.MidiNote
    // return Math.max(40, Math.min(70, Math.floor(alpha))) as Tone.Unit.MidiNote
  }

  return {
    start: Math.random() * 100,
    duration: saturation * 15,
    pitch: lerpToBearableMidiNote(lightness),
    velocity: a
  }
}

export default async function handler (req: NextApiRequest, res: NextApiResponse<Buffer | ApiFailResponse>): Promise<void> {
  req.body = JSON.parse(req.body)
  if (req.body.image == null) {
    res.status(400).json({ message: 'Request must include base64 encoded image' })
    return
  }

  let sharpImage: sharp.Sharp | undefined
  let sharpImageMetadata: sharp.Metadata | undefined
  try {
    sharpImage = sharp(Buffer.from(req.body.image, 'base64'))
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

  const midi = new Midi()
  const track = midi.addTrack()

  const rawRedBuffer = await sharpImage.extractChannel('red').raw().toBuffer()
  const rawGreenBuffer = await sharpImage.extractChannel('green').raw().toBuffer()
  const rawBlueBuffer = await sharpImage.extractChannel('blue').raw().toBuffer()
  const rawAlphaBuffer = sharpImageMetadata.hasAlpha != null && sharpImageMetadata.hasAlpha
    ? await sharpImage.extractChannel('alpha').raw().toBuffer()
    : Buffer.from(new Array(sharpImageMetadata.width * sharpImageMetadata.height - 1).fill(1))

  let red: number | undefined; let green: number | undefined; let blue: number | undefined; let alpha: number | undefined
  let midiNoteData: MidiNote | undefined

  generateRandomSequence(sharpImageMetadata.height * sharpImageMetadata.width - 1, MAX_NOTES).forEach((idx, progress) => {
    red = rawRedBuffer.at(idx); green = rawGreenBuffer.at(idx); blue = rawBlueBuffer.at(idx); alpha = rawAlphaBuffer.at(idx)

    if (red == null || green == null || blue == null || alpha == null) return

    midiNoteData = rgbaToMidiNoteData(red, green, blue, alpha)
    if (midiNoteData != null && midiNoteData.duration > 0) {
      track.addNote({
        midi: midiNoteData.pitch,
        time: midiNoteData.start,
        duration: midiNoteData.duration,
        velocity: midiNoteData.velocity
      })
    }
    // TODO: add a progress response
  })

  try {
    const midiBuffer = Buffer.from(midi.toArray())
    res.setHeader('Content-Type', 'audio/sp-midi')
    res.send(midiBuffer)
  } catch (e: any) {
    console.log(e.toString())
    res.status(500).json({ message: 'Error encoding midi buffer.', data: e })
  }
}
