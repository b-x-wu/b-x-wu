import Image from 'next/image'
import type React from 'react'

interface ToggleText {
  type: 'text'
  text: string
}

interface ToggleImage {
  type: 'image'
  src: string
  alt: string
}

type ToggleSymbol = ToggleText | ToggleImage

interface ToggleProps {
  handleToggle: React.MouseEventHandler
  toggleCondition: boolean
  untoggledSymbol?: ToggleSymbol
  toggledSymbol?: ToggleSymbol
}

export const Toggle = ({ handleToggle, toggleCondition, untoggledSymbol, toggledSymbol }: ToggleProps): JSX.Element => {
  const symbolToHTML = (symbol: ToggleSymbol | undefined, conditionMet: boolean): JSX.Element => {
    if (symbol == null) { return <></> }

    if (symbol.type === 'text') {
      return <div className={`font-semibold transition-opacity duration-300 ${conditionMet ? 'opacity-80' : 'opacity-30'}`}>{symbol.text}</div>
    }

    return (
      <Image
        alt={symbol.alt}
        src={symbol.src}
        height={100}
        width={100}
        className=''
      />
    )
  }

  return (
    <div className='flex cursor-pointer gap-x-2' onClick={handleToggle}>
      {symbolToHTML(untoggledSymbol, !toggleCondition)}
      <div className='relative h-6 w-11 rounded-full bg-lighter-blue'>
        <div className={`absolute top-[2px] left-[2px] h-5 w-5 rounded-full transition-all duration-300 ${toggleCondition ? 'translate-x-full bg-blue' : 'bg-light-blue'}`}></div>
      </div>
      {symbolToHTML(toggledSymbol, toggleCondition)}
    </div>
  )
}
