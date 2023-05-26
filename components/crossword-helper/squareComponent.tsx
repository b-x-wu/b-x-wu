import type React from 'react'
import { SquareValue, squareValueToString } from '../../types/crossword-helper/types'

export interface SquareComponentProps {
  squareValue: SquareValue
  width?: string | number
  height?: string | number
  handleClick?: React.MouseEventHandler<HTMLDivElement>
  isSelected: boolean
  isInSelectedWord: boolean
}

export const SquareComponent = ({ squareValue, width, height, handleClick, isSelected, isInSelectedWord }: SquareComponentProps): JSX.Element => {
  const componentWidth = width == null ? '5em' : (typeof width === 'string' ? width : `${width}px`)
  const componentHeight = height == null ? '5em' : (typeof height === 'string' ? height : `${height}px`)

  const style: React.CSSProperties = {
    width: componentWidth,
    height: componentHeight
  }

  // TODO: this is definitely a comically bad way to do this
  if (isSelected && squareValue === SquareValue.DARK_SQUARE) {
    style.backgroundColor = 'rgb(7 47 73)'
  } else if (isSelected) {
    style.backgroundColor = 'rgb(56 189 248)'
  } else if (isInSelectedWord) {
    style.backgroundColor = 'rgb(186 230 253)'
  } else if (squareValue === SquareValue.DARK_SQUARE) {
    style.backgroundColor = 'rgb(8 47 73)'
  } else {
    style.backgroundColor = 'rgb(243 244 246)'
  }

  return (
        <div
            className="flex items-center justify-center border-2 border-[#000] text-center"
            onClick={handleClick}
        >
            <div>
                {squareValue === SquareValue.DARK_SQUARE ? '' : squareValueToString(squareValue)}
            </div>
        </div>
  )
}
