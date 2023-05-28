export enum SquareValue {
  DARK_SQUARE = -1,
  BLANK_SQUARE,
  A,
  B,
  C,
  D,
  E,
  F,
  G,
  H,
  I,
  J,
  K,
  L,
  M,
  N,
  O,
  P,
  Q,
  R,
  S,
  T,
  U,
  V,
  W,
  X,
  Y,
  Z
  // TODO: should we include numerical digits here, ie ONE, TWO, etc.
}

export const squareValueToString = (squareValue: SquareValue): string => {
  if (squareValue === SquareValue.DARK_SQUARE) {
    return '█'
  }
  if (squareValue === SquareValue.BLANK_SQUARE) {
    return '_'
  }

  const charCode: number = squareValue + 64
  return String.fromCharCode(charCode)
}

export const stringToSquareValue = (string: string): SquareValue => {
  const charCode = string.charCodeAt(0)
  if (charCode === 32) { return SquareValue.BLANK_SQUARE }
  if (charCode >= 65 && charCode < 91) {
    return charCode - 64
  }
  return SquareValue.DARK_SQUARE
}

export enum Orientation {
  HORIZONTAL,
  VERTICAL
}

export interface SquarePosition {
  x: number
  y: number
}

export interface Square {
  position: SquarePosition
  value: SquareValue
  left: Square | null
  right: Square | null
  up: Square | null
  down: Square | null
}

export interface WordPosition {
  start: SquarePosition
  end: SquarePosition
}

export interface Word {
  squareValues: SquareValue[]
  clue: string
  length: number
  orientation: Orientation
}

export type OrientedDictionaryKey = number

export type Clue = string
export interface WordHint {
  word: string
  clues: Clue[]
}
