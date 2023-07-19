import { ConsoleMessageType, type ConsoleMessage } from '../../types/image_to_midi'
import Image from 'next/image'

interface ConsoleProps {
  consoleMessage: ConsoleMessage | undefined
  clearConsoleMessage: () => void
}

export function Console (props: ConsoleProps): JSX.Element {
  if (props.consoleMessage == null) return <></>
  if (props.consoleMessage.type === ConsoleMessageType.ERROR) {
    return (
      <div className='absolute top-0 right-0 z-10 flex w-full flex-row items-center gap-x-3 bg-[#F33]/70 p-4 text-[#FFF]'>
        <Image src='/error-icon.svg' width={10} height={10} className='h-5 w-5 invert' alt='Error Icon' />
        <div className='grow'>{props.consoleMessage.message}</div>
        <Image onClick={props.clearConsoleMessage} src='/x-icon.svg' alt='Clear Message' aria-label='Clear Message' width={10} height={10} className='h-3 w-3 cursor-pointer invert' />
      </div>
    )
  }
  return (
    <div className='absolute top-0 right-0 z-10 flex w-full flex-row items-center gap-x-3 bg-[#FC0]/70 p-4 text-[#FFF]'>
      <Image src='/warning-icon.svg' width={10} height={10} className='h-5 w-5 invert' alt='Warning Icon' />
      <div className='grow'>{props.consoleMessage.message}</div>
      <Image onClick={props.clearConsoleMessage} src='/x-icon.svg' alt='Clear Message' aria-label='Clear Message' width={10} height={10} className='h-3 w-3 cursor-pointer invert' />
    </div>
  )
}
