import type React from 'react'
import { SquareValue, squareValueToString } from '../../types/crossword-helper/types'

export interface SquareComponentProps {
  squareValue: SquareValue
  handleClick?: React.MouseEventHandler<HTMLDivElement>
  isSelected: boolean
  isInSelectedWord: boolean
}

export const SquareComponent = ({ squareValue, handleClick, isSelected, isInSelectedWord }: SquareComponentProps): JSX.Element => {
  const style: React.CSSProperties = {}

  // TODO: this is definitely a comically bad way to do this
  if (isSelected && squareValue === SquareValue.DARK_SQUARE) {
    style.backgroundColor = 'rgb(7 47 73)'
  } else if (isSelected) {
    style.backgroundColor = 'rgb(56 189 248)'
  } else if (isInSelectedWord) {
    style.backgroundColor = 'rgb(186 230 253)'
  } else if (squareValue === SquareValue.DARK_SQUARE) {
    style.backgroundColor = 'rgb(8 47 73)'
  }

  return (
        <div
            className="flex h-full w-full items-center justify-center bg-glacier text-center text-xs text-darkest-blue md:text-base"
            onClick={handleClick}
            style={style}
        >
            <div>
                {squareValue === SquareValue.DARK_SQUARE ? '' : squareValueToString(squareValue)}
            </div>
        </div>
  )
}
