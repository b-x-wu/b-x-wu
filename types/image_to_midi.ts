import type Tone from 'tone'
import { type NonCustomOscillatorType } from 'tone/build/esm/source/oscillator/OscillatorInterface'

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
  if (o.track != null) midiNoteKeys.push('track')
  if (JSON.stringify(Object.keys(o).sort()) !== JSON.stringify(midiNoteKeys.sort())) return false
  for (const key of midiNoteKeys) {
    if (typeof o[key] !== 'number') return false
  }
  return true
}

export enum WaveformTrack {
  SINE,
  TRIANGLE,
  SQUARE,
  SAWTOOTH,
}

export const waveformTrackToOscillatorType = new Map<WaveformTrack, NonCustomOscillatorType>([
  [WaveformTrack.SINE, 'sine'],
  [WaveformTrack.TRIANGLE, 'triangle'],
  [WaveformTrack.SQUARE, 'square'],
  [WaveformTrack.SAWTOOTH, 'sawtooth']
])

export interface MidiNote {
  start: number
  duration: number
  pitch: Tone.Unit.MidiNote
  velocity: number
  track?: WaveformTrack
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

export enum ConsoleMessageType {
  WARNING, ERROR
}
export interface ConsoleMessage {
  type: ConsoleMessageType
  message: string
}
