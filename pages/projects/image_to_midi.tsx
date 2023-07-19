import { useState } from 'react'
import FunctionTextInput from '../../components/image-to-midi/functionTextInput'
import { ImageInput } from '../../components/image-to-midi/imageInput'
import { MidiManager } from '../../components/image-to-midi/midiManager'
import { type Base64String, type ConsoleMessage } from '../../types/image_to_midi'
import { Console } from '../../components/image-to-midi/console'

export default function ImageToMidi (): JSX.Element {
  const [image, setImage] = useState<Base64String | undefined>(undefined)
  const [functionText, setFunctionText] = useState<string | undefined>(undefined)
  const [consoleMessage, setConsoleMessage] = useState<ConsoleMessage | undefined>(undefined)

  return (
    <div className='mx-auto flex flex-col gap-y-12 p-12'>
      <div className='flex flex-col space-y-12'>
        <Console consoleMessage={consoleMessage} clearConsoleMessage={() => { setConsoleMessage(undefined) }} />
        <div className='flex flex-col space-y-12 lg:flex-row lg:space-x-8 lg:space-y-0'>
          <FunctionTextInput setFunctionText={setFunctionText} />
          <ImageInput setImage={setImage} setConsoleMessage={setConsoleMessage} />
        </div>
        {image == null || functionText == null ? <></> : <MidiManager image={image} functionText={functionText} setConsoleMessage={setConsoleMessage} />}
      </div>
    </div>
  )
}
