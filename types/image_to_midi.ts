import type Tone from 'tone'

export interface Pixel {
  red: number
  green: number
  blue: number
  alpha?: number
}

export interface MidiNote {
  start: number
  duration: number
  pitch: Tone.Unit.MidiNote
  velocity: number
}

export interface Image {
  height: number
  width: number
  bitmap: Pixel[][]
}
