// https://www.youtube.com/watch?v=yu0Cm4BqQv0
// Griadient background pan and star text effect

import type React from 'react'
import { useEffect, useRef, useState } from 'react'

interface MagicalTextProps {
  children?: React.ReactNode // the text with the background
  gradientFrom?: string // the starting color of the linear gradient
  gradientTo?: string // the ending color of the linear gradient
  starCount?: number // the number of stars to use
  backgroundPanDuration?: number // duration of the gradient background pan in ms. for values <= 0, the gradient does not pan
  starScaleDuration?: number // duration of the star scaling in ms. for values <= 0, the star does not change size
  starRotateDuration?: number // duration the star rotation in ms. for values <= 0, the star does not rotate
  starAppearanceInterval?: number // the number of milliseconds between concurent renders of a star
  starColor?: string // the color of the star. by default the same as gradientFrom
}

interface StarPosition {
  top: number
  left: number
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_number_between_two_values
// returns random integer no less than min and strictly less than max
const getRandomArbitrary = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min) + min)
}

interface StarProps {
  isAnimatedInitial: boolean
  timingOffset: number
  rotateDuration: number
  scaleDuration: number
  color: string
  appearanceInterval: number
}

const Star = (props: StarProps): JSX.Element => {
  const [isAnimated, setIsAnimated] = useState<boolean>(props.isAnimatedInitial)
  const [position, setPosition] = useState<StarPosition>({ top: 0, left: 0 })

  const animate = (): void => {
    const newPosition: StarPosition = { top: getRandomArbitrary(-40, 80), left: getRandomArbitrary(-10, 100) }
    setPosition(newPosition)
    setIsAnimated(false)
  }

  const isInitialRender = useRef<boolean>(true)
  const spanRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    setTimeout(() => {
      animate()

      setInterval(() => {
        animate()
      }, props.appearanceInterval)
    }, props.timingOffset)
  }, [])

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false
      return
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    spanRef.current?.offsetHeight

    setIsAnimated(true)
  }, [position])

  const computedSpanStyle: React.CSSProperties = isAnimated
    ? {
        top: `${position.top}%`,
        left: `${position.left}%`,
        fill: props.color,
        animationName: 'magicalText-scale',
        animationDuration: `${props.scaleDuration}ms`,
        animationTimingFunction: 'ease',
        animationFillMode: 'forwards'
      }
    : {
        display: 'none'
      }

  const computedSvgStyle: React.CSSProperties = {
    animationName: 'magicalText-rotate',
    animationDuration: `${props.rotateDuration}ms`,
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite'
  }

  return (
        <span ref={spanRef} className="absolute block h-6 w-6 opacity-70" style={computedSpanStyle}>
            <svg viewBox="0 0 512 512" style={computedSvgStyle}>
                <path d="M512 255.1c0 11.34-7.406 20.86-18.44 23.64l-171.3 42.78l-42.78 171.1C276.7 504.6 267.2 512 255.9 512s-20.84-7.406-23.62-18.44l-42.66-171.2L18.47 279.6C7.406 276.8 0 267.3 0 255.1c0-11.34 7.406-20.83 18.44-23.61l171.2-42.78l42.78-171.1C235.2 7.406 244.7 0 256 0s20.84 7.406 23.62 18.44l42.78 171.2l171.2 42.78C504.6 235.2 512 244.6 512 255.1z" />
            </svg>
        </span>
  )
}

export const MagicalText = ({
  children,
  gradientFrom = '#7b1fa2',
  gradientTo = '#f48fb1',
  starCount = 3,
  backgroundPanDuration = 3000,
  starScaleDuration = 700,
  starRotateDuration = 1000,
  starAppearanceInterval = 1000,
  starColor
}: MagicalTextProps): JSX.Element => {
  const starSvgSpans = [...Array(starCount).keys()].map((_, idx) => {
    return (
            <Star
                key={idx}
                isAnimatedInitial={idx === 0}
                timingOffset={idx * (starAppearanceInterval / starCount)}
                rotateDuration={starRotateDuration}
                scaleDuration={starScaleDuration}
                color={starColor == null ? gradientFrom : starColor}
                appearanceInterval={starAppearanceInterval}
            />
    )
  })

  const computedStyle: React.CSSProperties = {
    background: `linear-gradient(to right, ${gradientFrom} 0, ${gradientTo} 50%, ${gradientFrom} 100%)`,
    WebkitBackgroundClip: 'text',
    backgroundSize: '200%',
    animationName: 'magicalText-background-pan',
    animationDuration: `${backgroundPanDuration}ms`,
    animationIterationCount: 'infinite',
    animationTimingFunction: 'linear'
  }

  return (
        <>
            <span className='relative inline-block'>
                {starSvgSpans}
                <span
                    className='text-[#0000]'
                    style={computedStyle}
                >
                    {children}
                </span>
            </span>
        </>
  )
}
