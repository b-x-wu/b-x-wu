import type Tone from 'tone'

export interface Pixel {
  red: number
  green: number
  blue: number
  alpha: number
  x: number
  y: number
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
