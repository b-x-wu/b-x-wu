// https://www.youtube.com/watch?v=zGKNMm4L-r4
// Slider header whose position tracks the user's cursor

import type React from 'react'
import { useRef, useState } from 'react'

interface SuperHeaderSliderProps {
  leftChildren?: React.ReactNode | string // the content to go on the side on top (and gets slid over)
  rightChildren?: React.ReactNode | string // the content to go on the side on bottom
  fullWidth?: string | number // the full width of the component, either as a CSS width or a number of pixels
  fullHeight?: string | number // the full height of the component, either as a CSS width or a number of pixels
  leftBackgroundColor?: string // the background color of the side on top in #RRGGBB format
  rightBackgroundColor?: string // the background color of the side on bottom in #RRGGBB format
}

interface SliderSideProps {
  fullWidth: string
  children: React.ReactNode | string
  zIndex: number
  backgroundColor: string
  width?: number
}

const SliderSide = ({ children, zIndex, backgroundColor, width, fullWidth }: SliderSideProps): JSX.Element => {
  const computedOuterDivStyles: React.CSSProperties = {
    width: width == null ? '100%' : `${width}px`,
    zIndex,
    backgroundColor
  }

  const computedInnerDivStyles: React.CSSProperties = {
    width: `calc(${fullWidth} * 0.8)`,
    marginLeft: `calc(${fullWidth} * 0.1)`,
    marginRight: `calc(${fullWidth} * 0.1)`
  }

  return (
        <div className="absolute grid h-full place-items-center overflow-hidden" style={computedOuterDivStyles}>
            <div style={computedInnerDivStyles}>{children}</div>
        </div>
  )
}

export const SuperHeaderSlider = ({
  leftBackgroundColor = '#264653',
  rightBackgroundColor = '#2a9d8f',
  fullWidth = '100vw',
  fullHeight = '100vh',
  leftChildren,
  rightChildren
}: SuperHeaderSliderProps): JSX.Element => {
  const [leftSideWidth, setLeftSideWidth] = useState<number>(0)
  const divRef = useRef<HTMLDivElement>(null)
  const fullWidthString = divRef.current == null ? (typeof fullWidth === 'string' ? fullWidth : `${fullWidth}px`) : getComputedStyle(divRef.current).width

  const handleHover: React.MouseEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault()
    setLeftSideWidth(event.nativeEvent.offsetX)
  }

  const computedOuterDivStyles: React.CSSProperties = {
    width: typeof fullWidth === 'string' ? fullWidth : `${fullWidth}px`,
    height: typeof fullHeight === 'string' ? fullHeight : `${fullHeight}px`
  }

  return (
        <div ref={divRef} className='relative' style={computedOuterDivStyles} onMouseMove={handleHover}>
            <SliderSide backgroundColor={leftBackgroundColor} zIndex={2} width={leftSideWidth} fullWidth={fullWidthString} >{leftChildren}</SliderSide>
            <SliderSide backgroundColor={rightBackgroundColor} zIndex={0} fullWidth={fullWidthString} >{rightChildren}</SliderSide>
        </div>
  )
}
