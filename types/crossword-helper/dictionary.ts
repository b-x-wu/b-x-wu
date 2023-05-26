import { Orientation, type Word, type WordPosition, type OrientedDictionaryKey, type SquareValue, squareValueToString } from './types'

export class OrientedDictionary {
  readonly orientation: Orientation
  readonly map: Map<OrientedDictionaryKey, Word>

  constructor (orientation: Orientation) {
    this.orientation = orientation
    this.map = new Map<OrientedDictionaryKey, Word>()
  }

  static wordPositionToOrientedDictionaryKey (wordPosition: WordPosition): OrientedDictionaryKey {
    // this implies that the max size of a board is
    // 2^13 by 2^13 which seems perfectly fine to me
    return wordPosition.start.x * Math.pow(2, 13 * 3) + wordPosition.start.y * Math.pow(2, 13 * 2) + wordPosition.end.x * Math.pow(2, 13) + wordPosition.end.y
  }

  static orientedDictionaryKeyToWordPosition (key: OrientedDictionaryKey): WordPosition {
    const startX = Math.floor(key / Math.pow(2, 13 * 3))
    key -= startX * Math.pow(2, 13 * 3)
    const startY = Math.floor(key / Math.pow(2, 13 * 2))
    key -= startY * Math.pow(2, 13 * 2)
    const endX = Math.floor(key / Math.pow(2, 13))
    key -= endX * Math.pow(2, 13)
    const endY = key
    return {
      start: {
        x: startX,
        y: startY
      },
      end: {
        x: endX,
        y: endY
      }
    }
  }

  delete (wordPosition: WordPosition): boolean {
    const key = OrientedDictionary.wordPositionToOrientedDictionaryKey(wordPosition)
    return this.map.delete(key)
  }

  get (wordPosition: WordPosition): Word | undefined {
    const key = OrientedDictionary.wordPositionToOrientedDictionaryKey(wordPosition)
    return this.map.get(key)
  }

  set (wordPosition: WordPosition, word: Word): void {
    const key = OrientedDictionary.wordPositionToOrientedDictionaryKey(wordPosition)
    this.map.set(key, word)
  }

  setClue (wordPosition: WordPosition, clue: string): void {
    const word: Word | undefined = this.get(wordPosition)
    if (word == null) {
      throw new Error(`No word found in this position. wordPosition: ${JSON.stringify(wordPosition)}`)
    }
    word.clue = clue
  }

  forEach (callback: (word: Word, wordPosition: WordPosition) => void): void {
    this.map.forEach((word: Word, key: number) => {
      callback(word, OrientedDictionary.orientedDictionaryKeyToWordPosition(key))
    })
  }

  getSortedEntries (): Array<[OrientedDictionaryKey, Word]> {
    return [...this.map.entries()].sort(([key1], [key2]) => key1 - key2)
  }

  /**
     * Get the words in the dictionary in sorted order
     * @returns the words in the dictionary in order of starting positions
     */
  getSortedWords (): Word[] {
    return this.getSortedEntries().map(([key, word]) => word)
  }

  print (): void {
    this.getSortedEntries().forEach(([key, word]) => {
      const wordPosition = OrientedDictionary.orientedDictionaryKeyToWordPosition(key)
      const wordText: string = word.squareValues.map((squareValue: SquareValue) => squareValueToString(squareValue)).join('')
      console.log(`\t(${wordPosition.start.x}, ${wordPosition.start.y}) to (${wordPosition.end.x}, ${wordPosition.end.y})`)
      console.log(`\tkey: ${key}`)
      console.log(`\t${wordText.trim() === '' ? '[No word]' : wordText}`)
      console.log(`\t${word.clue === '' ? '[No clue]' : word.clue}`)
      console.log()
    })
  }
}

export class CrosswordDictionary {
  readonly horizontalDictionary: OrientedDictionary
  readonly verticalDictionary: OrientedDictionary

  constructor () {
    this.horizontalDictionary = new OrientedDictionary(Orientation.HORIZONTAL)
    this.verticalDictionary = new OrientedDictionary(Orientation.VERTICAL)
  }
}
