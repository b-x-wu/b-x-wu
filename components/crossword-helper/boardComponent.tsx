import type React from 'react'

import { SquareComponent, type SquareComponentProps } from './squareComponent'
import Crossword from '../../types/crossword-helper/crossword'
import { type Square, type WordPosition } from '../../types/crossword-helper/types'
import { useState } from 'react'

interface BoardComponentProps {
  width: number
  height: number
  squares: Square[]
  selectedHorizontalWordPosition: null | WordPosition
  selectedVerticalWordPosition: null | WordPosition
  selectedSquare: null | Square
  handleClickSquare: (square: Square) => React.MouseEventHandler<HTMLDivElement>
  componentWidth: string
}

export const BoardComponent = ({ width, height, squares, selectedHorizontalWordPosition, selectedVerticalWordPosition, selectedSquare, handleClickSquare, componentWidth }: BoardComponentProps): JSX.Element => {
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null)

  //   const containerRef = useRef<HTMLDivElement | null>(null)

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
            width={containerRef == null ? 0 : `calc(${containerRef.clientWidth}px/${width})`}
            height={containerRef == null ? 0 : `calc(${containerRef.clientHeight}px/${width})`}
            handleClick={handleClickSquare(square)}
            isSelected={selectedSquare != null && selectedSquare.position.x === square.position.x && selectedSquare.position.y === square.position.y}
            isInSelectedWord={isInSelectedWord}
        />
      )
    }
  )

  const styles: React.CSSProperties = {
    width: componentWidth,
    gridTemplateRows: `repeat(${height}, minmax(0, 1fr))`,
    gridTemplateColumns: `repeat(${width}, minmax(0, 1fr))`
  }

  return (
        <>
            <div className='mx-auto grid aspect-square' style={styles} ref={newRef => { setContainerRef(newRef) }}>
                {squareComponents}
            </div>
        </>
  )
}
