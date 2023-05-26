import type React from 'react'

import { SquareComponent, type SquareComponentProps } from './squareComponent'
import Crossword from '../../types/crossword-helper/crossword'
import { type Square, type WordPosition } from '../../types/crossword-helper/types'

interface BoardComponentProps {
  width: number
  height: number
  squares: Square[]
  selectedHorizontalWordPosition: null | WordPosition
  selectedVerticalWordPosition: null | WordPosition
  selectedSquare: null | Square
  handleClickSquare: (square: Square) => React.MouseEventHandler<HTMLDivElement>
}

export const BoardComponent = ({ width, height, squares, selectedHorizontalWordPosition, selectedVerticalWordPosition, selectedSquare, handleClickSquare }: BoardComponentProps): JSX.Element => {
  const squarePositionsInSelectedHorizontalWord = selectedHorizontalWordPosition == null ? [] : Crossword.wordPositionToSquarePositions(selectedHorizontalWordPosition)
  const squarePositionsInSelectedVerticalWord = selectedVerticalWordPosition == null ? [] : Crossword.wordPositionToSquarePositions(selectedVerticalWordPosition)
  const squarePositionsInSelectedWords = [...squarePositionsInSelectedHorizontalWord, ...squarePositionsInSelectedVerticalWord]

  const squareComponents: Array<React.ReactElement<SquareComponentProps, any>> = squares.map(
    (square) => {
      const isInSelectedWord: boolean = squarePositionsInSelectedWords.reduce<boolean>((prev, cur) => {
        return prev || (cur.x === square.position.x && cur.y === square.position.y)
      }, false)
      return (
        <SquareComponent
            key={(square.position.x << 13) + square.position.y}
            squareValue={square.value}
            handleClick={handleClickSquare(square)}
            isSelected={selectedSquare != null && selectedSquare.position.x === square.position.x && selectedSquare.position.y === square.position.y}
            isInSelectedWord={isInSelectedWord}
        />
      )
    }
  )

  const styles: React.CSSProperties = {
    height: 'min(70vh, 80vw)',
    gridTemplateRows: `repeat(${height}, minmax(0, 1fr))`,
    gridTemplateColumns: `repeat(${width}, minmax(0, 1fr))`
  }

  return (
        <>
            <div className='mx-auto grid aspect-square gap-0.5 bg-darkest-blue p-0.5 transition-colors duration-300' style={styles} >
                {squareComponents}
            </div>
        </>
  )
}
