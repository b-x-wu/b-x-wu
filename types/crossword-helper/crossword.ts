import { Orientation, type Square, type SquarePosition, SquareValue, squareValueToString, type Word, type WordPosition } from './types'
import { CrosswordDictionary } from './dictionary'

export default class Crossword {
  readonly width: number
  readonly height: number
  readonly dictionary: CrosswordDictionary
  squareArray: Square[][]
  // TODO: add metadata fields

  constructor (width: number, height: number) {
    this.width = width
    this.height = height
    this.squareArray = []
    this.dictionary = new CrosswordDictionary()

    this.initializeBoard()
    this.initializeDictionary()
  }

  private initializeBoard (): void {
    for (let y = 0; y < this.height; y++) {
      const row: Square[] = []
      for (let x = 0; x < this.width; x++) {
        row.push({
          position: { x, y },
          value: SquareValue.BLANK_SQUARE,
          left: null,
          right: null,
          up: null,
          down: null
        })
      }
      this.squareArray.push(row)
    }

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const currentSquare: Square = this.squareArray[y][x]
        if (x - 1 >= 0) { currentSquare.left = this.squareArray[y][x - 1] }
        if (x + 1 < this.width) { currentSquare.right = this.squareArray[y][x + 1] }
        if (y - 1 >= 0) { currentSquare.up = this.squareArray[y - 1][x] }
        if (y + 1 < this.height) { currentSquare.down = this.squareArray[y + 1][x] }
      }
    }
  }

  private initializeDictionary (): void {
    for (let x = 0; x < this.width; x++) {
      const wordPosition: WordPosition = {
        start: { x, y: 0 },
        end: { x, y: this.height - 1 }
      }
      const word: Word = {
        squareValues: new Array<SquareValue>(this.height).fill(SquareValue.BLANK_SQUARE),
        clue: '',
        length: this.height,
        orientation: Orientation.VERTICAL
      }
      this.dictionary.verticalDictionary.set(wordPosition, word)
    }

    for (let y = 0; y < this.height; y++) {
      const wordPosition: WordPosition = {
        start: { x: 0, y },
        end: { x: this.width - 1, y }
      }
      const word: Word = {
        squareValues: new Array<SquareValue>(this.width).fill(SquareValue.BLANK_SQUARE),
        clue: '',
        length: this.width,
        orientation: Orientation.HORIZONTAL
      }
      this.dictionary.horizontalDictionary.set(wordPosition, word)
    }
  }

  // TODO: change this to be square position based
  private isInBounds (x: number, y: number): boolean {
    return !(x < 0 || x >= this.width || y < 0 || y >= this.height)
  }

  getSquareAt (squarePosition: SquarePosition): Square {
    if (!this.isInBounds(squarePosition.x, squarePosition.y)) {
      throw new Error('Position is out of bounds')
    }

    return this.squareArray[squarePosition.y][squarePosition.x]
  }

  getHorizontalWord (square: Square): null | { word: Word, index: number, position: WordPosition } {
    if (square.value === SquareValue.DARK_SQUARE) { return null }

    let currentSquare: Square = square
    let index: number = 0
    while (currentSquare.left != null) {
      currentSquare = currentSquare.left
      index++
    }
    const startPosition: SquarePosition = currentSquare.position

    currentSquare = square
    while (currentSquare.right != null) {
      currentSquare = currentSquare.right
    }
    const endPosition: SquarePosition = currentSquare.position

    const wordPosition: WordPosition = { start: startPosition, end: endPosition }
    const word = this.dictionary.horizontalDictionary.get(wordPosition)

    if (word == null) {
      console.log(JSON.stringify(wordPosition))
      throw new Error('Cannot find horizontal word at this square')
    }

    return { word, index, position: wordPosition }
  }

  getVerticalWord (square: Square): null | { word: Word, index: number, position: WordPosition } {
    if (square.value === SquareValue.DARK_SQUARE) { return null }

    let currentSquare: Square = square
    let index: number = 0
    while (currentSquare.up != null) {
      currentSquare = currentSquare.up
      index++
    }
    const startPosition: SquarePosition = currentSquare.position

    currentSquare = square
    while (currentSquare.down != null) {
      currentSquare = currentSquare.down
    }
    const endPosition: SquarePosition = currentSquare.position

    const wordPosition: WordPosition = { start: startPosition, end: endPosition }
    const word = this.dictionary.verticalDictionary.get(wordPosition)

    if (word == null) {
      this.printBoard()
      this.printDictionary()
      throw new Error('Cannot find vertical word at this square')
    }

    return { word, index, position: wordPosition }
  }

  private mutateSquareToDark (square: Square): void {
    if (square.value === SquareValue.DARK_SQUARE) {
      throw new Error('Square is already a dark square')
    }

    const horizontalWordData = this.getHorizontalWord(square)
    if (horizontalWordData != null) {
      this.dictionary.horizontalDictionary.delete(horizontalWordData.position)

      if (square.left != null) {
        square.left.right = null
        const newLeftWord: Word = {
          squareValues: horizontalWordData.word.squareValues.slice(0, horizontalWordData.index),
          orientation: Orientation.HORIZONTAL,
          length: horizontalWordData.index,
          clue: horizontalWordData.word.clue
        }
        if (newLeftWord.length > 0) {
          const newLeftPosition: WordPosition = { start: horizontalWordData.position.start, end: square.left.position }
          this.dictionary.horizontalDictionary.set(newLeftPosition, newLeftWord)
        }
      }

      if (square.right != null) {
        square.right.left = null
        const newRightWord: Word = {
          squareValues: horizontalWordData.word.squareValues.slice(horizontalWordData.index + 1),
          orientation: Orientation.HORIZONTAL,
          length: horizontalWordData.word.length - horizontalWordData.index - 1,
          clue: horizontalWordData.word.clue
        }
        if (newRightWord.length > 0) {
          const newRightPosition: WordPosition = { start: square.right.position, end: horizontalWordData.position.end }
          this.dictionary.horizontalDictionary.set(newRightPosition, newRightWord)
        }
      }
    }

    const verticalWordData = this.getVerticalWord(square)
    if (verticalWordData != null) {
      this.dictionary.verticalDictionary.delete(verticalWordData.position)

      if (square.up != null) {
        square.up.down = null
        const newUpWord: Word = {
          squareValues: verticalWordData.word.squareValues.slice(0, verticalWordData.index),
          orientation: Orientation.VERTICAL,
          length: verticalWordData.index,
          clue: verticalWordData.word.clue
        }
        if (newUpWord.length > 0) {
          const newUpPosition: WordPosition = { start: verticalWordData.position.start, end: square.up.position }
          this.dictionary.verticalDictionary.set(newUpPosition, newUpWord)
        }
      }

      if (square.down != null) {
        square.down.up = null
        const newDownWord: Word = {
          squareValues: verticalWordData.word.squareValues.slice(verticalWordData.index + 1),
          orientation: Orientation.VERTICAL,
          length: verticalWordData.word.length - verticalWordData.index - 1,
          clue: verticalWordData.word.clue
        }
        if (newDownWord.length > 0) {
          const newDownPosition: WordPosition = { start: square.down.position, end: verticalWordData.position.end }
          this.dictionary.verticalDictionary.set(newDownPosition, newDownWord)
        }
      }
    }

    square.value = SquareValue.DARK_SQUARE
    square.left = null
    square.right = null
    square.up = null
    square.down = null
  }

  private mutateSquareFromDark (square: Square, newSquareValue: SquareValue): void {
    if (square.value !== SquareValue.DARK_SQUARE) {
      throw new Error('Square is not currently a dark square')
    }

    if (newSquareValue === SquareValue.DARK_SQUARE) {
      throw new Error('New square is not a dark square')
    }

    const newHorizontalWord: Word = {
      squareValues: [newSquareValue],
      length: 1,
      orientation: Orientation.HORIZONTAL,
      clue: ''
      // TODO: what to do with the two old clues. right now they're nixed
    }
    let newHorizontalStartPosition: SquarePosition = square.position
    let newHorizontalEndPosition: SquarePosition = square.position

    const leftSquare = this.isInBounds(square.position.x - 1, square.position.y)
      ? this.getSquareAt({
        x: square.position.x - 1,
        y: square.position.y
      })
      : null

    if (leftSquare != null && leftSquare.value !== SquareValue.DARK_SQUARE) {
      const leftWordData = this.getHorizontalWord(leftSquare)
      if (leftWordData != null) {
        this.dictionary.horizontalDictionary.delete(leftWordData.position)
        newHorizontalStartPosition = leftWordData.position.start
        newHorizontalWord.squareValues.unshift(...leftWordData.word.squareValues)
        newHorizontalWord.length += leftWordData.word.length
      }
      leftSquare.right = square
      square.left = leftSquare
    }

    const rightSquare = this.isInBounds(square.position.x + 1, square.position.y)
      ? this.getSquareAt({
        x: square.position.x + 1,
        y: square.position.y
      })
      : null

    if (rightSquare != null && rightSquare.value !== SquareValue.DARK_SQUARE) {
      const rightWordData = this.getHorizontalWord(rightSquare)
      if (rightWordData != null) {
        this.dictionary.horizontalDictionary.delete(rightWordData.position)
        newHorizontalEndPosition = rightWordData.position.end
        newHorizontalWord.squareValues.push(...rightWordData.word.squareValues)
        newHorizontalWord.length += rightWordData.word.length
      }
      rightSquare.left = square
      square.right = rightSquare
    }

    this.dictionary.horizontalDictionary.set(
      { start: newHorizontalStartPosition, end: newHorizontalEndPosition },
      newHorizontalWord
    )

    const newVerticalWord: Word = {
      squareValues: [newSquareValue],
      length: 1,
      orientation: Orientation.VERTICAL,
      clue: ''
    }
    let newVerticalStartPosition: SquarePosition = square.position
    let newVerticalEndPosition: SquarePosition = square.position

    const upSquare = this.isInBounds(square.position.x, square.position.y - 1)
      ? this.getSquareAt({
        x: square.position.x,
        y: square.position.y - 1
      })
      : null

    if (upSquare != null && upSquare.value !== SquareValue.DARK_SQUARE) {
      const upWordData = this.getVerticalWord(upSquare)
      if (upWordData != null) {
        this.dictionary.verticalDictionary.delete(upWordData.position)
        newVerticalStartPosition = upWordData.position.start
        newVerticalWord.squareValues.unshift(...upWordData.word.squareValues)
        newVerticalWord.length += upWordData.word.length
      }
      upSquare.down = square
      square.up = upSquare
    }

    const downSquare = this.isInBounds(square.position.x, square.position.y + 1)
      ? this.getSquareAt({
        x: square.position.x,
        y: square.position.y + 1
      })
      : null

    if (downSquare != null && downSquare.value !== SquareValue.DARK_SQUARE) {
      const downWordData = this.getVerticalWord(downSquare)
      if (downWordData != null) {
        this.dictionary.verticalDictionary.delete(downWordData.position)
        newVerticalEndPosition = downWordData.position.end
        newVerticalWord.squareValues.push(...downWordData.word.squareValues)
        newVerticalWord.length += downWordData.word.length
      }
      downSquare.up = square
      square.down = downSquare
    }

    this.dictionary.verticalDictionary.set(
      { start: newVerticalStartPosition, end: newVerticalEndPosition },
      newVerticalWord
    )

    square.value = newSquareValue
  }

  private mutateSquareFromAlphabetToAlphabet (square: Square, newSquareValue: SquareValue): void {
    if (square.value === SquareValue.DARK_SQUARE) {
      throw new Error('Square is currently a dark square')
    }

    if (newSquareValue === SquareValue.DARK_SQUARE) {
      throw new Error('New square is a dark square')
    }

    const horizontalWord = this.getHorizontalWord(square)
    if (horizontalWord != null) {
      horizontalWord.word.squareValues[horizontalWord.index] = newSquareValue
    }

    const verticalWord = this.getVerticalWord(square)
    if (verticalWord != null) {
      verticalWord.word.squareValues[verticalWord.index] = newSquareValue
    }

    square.value = newSquareValue
  }

  mutateSquare (square: Square, newSquareValue: SquareValue): void {
    if (square.value !== SquareValue.DARK_SQUARE && newSquareValue === SquareValue.DARK_SQUARE) {
      this.mutateSquareToDark(square)
      return
    }

    if (square.value === SquareValue.DARK_SQUARE && newSquareValue !== SquareValue.DARK_SQUARE) {
      this.mutateSquareFromDark(square, newSquareValue)
      return
    }

    if (square.value !== SquareValue.DARK_SQUARE) {
      this.mutateSquareFromAlphabetToAlphabet(square, newSquareValue)
    }
  }

  mutateSquareAtPosition (squarePosition: SquarePosition, newSquareValue: SquareValue): void {
    this.mutateSquare(this.getSquareAt(squarePosition), newSquareValue)
  }

  printBoard (): void {
    const line: string = '-'.repeat(2 * this.width + 1)
    console.log(line)
    for (let y = 0; y < this.height; y++) {
      console.log(this.squareArray[y].map((square: Square) => `|${squareValueToString(square.value)}`).join('') + '|')
      console.log(line)
    }
  }

  printDictionary (): void {
    console.log('HORIZONTAL\n')
    this.dictionary.horizontalDictionary.print()

    console.log('VERTICAL\n')
    this.dictionary.verticalDictionary.print()
  }

  static wordPositionToSquarePositions (wordPosition: WordPosition): SquarePosition[] {
    if (wordPosition.start.x === wordPosition.end.x) {
      const squarePositions = []
      for (let yPosition = wordPosition.start.y; yPosition <= wordPosition.end.y; yPosition++) {
        squarePositions.push({ x: wordPosition.start.x, y: yPosition })
      }
      return squarePositions
    }

    if (wordPosition.start.y === wordPosition.end.y) {
      const squarePositions = []
      for (let xPosition = wordPosition.start.x; xPosition <= wordPosition.end.x; xPosition++) {
        squarePositions.push({ y: wordPosition.start.y, x: xPosition })
      }
      return squarePositions
    }

    throw new Error('WordPosition start and end do not match x or y dimension.')
  }

  wordPositionToSquares (wordPosition: WordPosition): Square[] {
    const squarePositions = Crossword.wordPositionToSquarePositions(wordPosition)
    return squarePositions.map((squarePosition) => this.getSquareAt(squarePosition))
  }
}
