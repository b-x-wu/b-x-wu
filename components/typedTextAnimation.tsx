import React, { type ReactElement, useEffect, useState } from 'react'

interface TypedTextAnimationProps {
  frames: string[]
  frameRate: number
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'span' | 'p'
  props?: Record<string, string | undefined>
  className?: string | undefined
  repeat?: number
  children?: ReactElement[]
}

export default function TypedTextAnimation ({ frames, frameRate, tag, props, className, repeat, children }: TypedTextAnimationProps): JSX.Element {
  const [textIndex, setTextIndex] = useState(0)
  const element = React.createElement(tag ?? 'div', { className, ...props }, frames[textIndex], children)

  useEffect(() => {
    const timer = setTimeout(() => {
      const nextTextIndex = textIndex + 1
      if (nextTextIndex < frames.length) {
        setTextIndex(nextTextIndex)
      } else if (nextTextIndex === frames.length && repeat != null) {
        setTextIndex(frames.length - repeat)
      }
    }, frameRate)
    return () => { clearTimeout(timer) }
  }, [textIndex])
  return element
}
