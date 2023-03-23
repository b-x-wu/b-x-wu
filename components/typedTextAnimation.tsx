import React, { useEffect, useState } from 'react'

interface TypedTextAnimationProps {
  frames: string[]
  frameRate: number
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'span' | 'p'
  props?: Record<string, string | undefined>
  className?: string | undefined
  repeat?: boolean
}

export default function TypedTextAnimation ({ frames, frameRate, tag, props, className, repeat }: TypedTextAnimationProps): JSX.Element {
  const [textIndex, setTextIndex] = useState(0)
  const element = React.createElement(tag ?? 'div', { className, ...props }, frames[textIndex])

  useEffect(() => {
    const timer = setTimeout(() => {
      let nextTextIndex = textIndex + 1
      if (repeat != null && repeat) { nextTextIndex = nextTextIndex % frames.length }
      if (nextTextIndex < frames.length) {
        setTextIndex(nextTextIndex)
      }
    }, frameRate)
    return () => { clearTimeout(timer) }
  }, [textIndex])
  return element
}
