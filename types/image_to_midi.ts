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

export interface MidiNote {
  start: number
  duration: number
  pitch: number
  velocity: number
  track?: number
}

export interface Image {
  width: number
  height: number
  encodedRedBuffer: string
  encodedGreenBuffer: string
  encodedBlueBuffer: string
  encodedAlphaBuffer: string
  encodedIndexArray: string
}

export type Base64String = string

export enum ConsoleMessageType {
  WARNING, ERROR
}
export interface ConsoleMessage {
  type: ConsoleMessageType
  message: string
}
