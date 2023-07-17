import type Tone from 'tone'

export interface Pixel {
  red: number
  green: number
  blue: number
  alpha: number
  x: number
  y: number
}

export function isMidiNote (o: any): boolean {
  const midiNoteKeys = ['start', 'duration', 'pitch', 'velocity']
  if (JSON.stringify(Object.keys(o).sort()) !== JSON.stringify(midiNoteKeys.sort())) return false
  for (const key of midiNoteKeys) {
    if (typeof o[key] !== 'number') return false
  }
  // if (o.pitch < 0 || o.pitch > 127) return false
  // if (o.velocity < 0 || o.velocity > 1) return false
  // if (o.start < 0) return false
  return true
}

export interface MidiNote {
  start: number
  duration: number
  pitch: Tone.Unit.MidiNote
  velocity: number
}

export interface Image {
  width: number
  height: number
  redBuffer: Buffer
  greenBuffer: Buffer
  blueBuffer: Buffer
  indexBuffer?: Buffer
}

export type Base64String = string
