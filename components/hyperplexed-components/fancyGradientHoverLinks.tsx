/* eslint-disable tailwindcss/no-custom-classname */
// https://www.youtube.com/watch?v=oJYFRZ4cj2Q
// Gradient sliding background over links

import Link from 'next/link'
import type React from 'react'
import { useState } from 'react'

interface LinkInfo {
  text: string
  href: string
}

interface FancyGradientHoverLinksProps {
  linkInfos: LinkInfo[] // the text and hrefs for the links
  gradientFrom?: string // the starting color of the gradient
  gradientTo?: string // the ending color of the gradient
  borderColor?: string // the color of the border
  gradientPanDuration?: number // the duration of the hover gradient pan, in ms
  minViaDistance?: string // distance from the left side of the link which the gradient no longer changes stop distance
}

interface FancyGradientHoverLinkProps {
  linkInfo: LinkInfo
  gradientFrom: string
  gradientTo: string
  isBottomLink: boolean
  minViaDistance: string
  gradientPanDuration: number
  borderColor: string
}

const FancyGradientHoverLink = ({
  linkInfo,
  gradientFrom,
  gradientTo,
  isBottomLink,
  minViaDistance,
  gradientPanDuration,
  borderColor
}: FancyGradientHoverLinkProps): JSX.Element => {
  const [mouseXPosition, setMouseXPosition] = useState<number>(0)
  const handleMouseMove: React.MouseEventHandler = (event) => {
    event.preventDefault()
    setMouseXPosition(event.nativeEvent.offsetX)
  }

  const computedLinkStyle: React.CSSProperties = {
    display: 'block',
    borderTopWidth: '1px',
    borderBottomWidth: isBottomLink ? '1px' : '0',
    borderColor,
    position: 'relative',
    padding: '1.5rem'
  }

  const computedGradientStyle: React.CSSProperties = {
    transitionDuration: `${gradientPanDuration}ms`,
    transitionProperty: 'width',
    background: `linear-gradient(to right, #0000 0, ${gradientFrom} max(${minViaDistance}, ${mouseXPosition}px), ${gradientTo} 100%)`
  }

  return (
        <div className='group relative'>
            <div className='absolute left-0 top-0 h-full w-0 bg-gradient-to-r from-transparent group-hover:w-full' style={computedGradientStyle}>
            </div>
            <Link
                onMouseMove={handleMouseMove}
                style={computedLinkStyle}
                href={linkInfo.href}
                target="_blank"
                rel="noreferrer"
            >
                {linkInfo.text}
            </Link>
        </div>
  )
}

export const FancyGradientHoverLinks = ({
  linkInfos,
  gradientFrom = '#3d5afe',
  gradientTo = '#2196f3',
  gradientPanDuration = 600,
  minViaDistance = '80%',
  borderColor = '#ffffff'
}: FancyGradientHoverLinksProps): JSX.Element => {
  const links = linkInfos.map((linkInfo, idx) => <FancyGradientHoverLink
        key={idx}
        linkInfo={linkInfo}
        gradientFrom={gradientFrom}
        gradientTo={gradientTo}
        isBottomLink={idx === linkInfos.length - 1}
        minViaDistance={minViaDistance}
        gradientPanDuration={gradientPanDuration}
        borderColor={borderColor}
    />)

  return (
        <div className="flex flex-col justify-center">
            {links}
        </div>
  )
}
