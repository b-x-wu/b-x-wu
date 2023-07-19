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
    <div className='relative flex flex-col space-y-5'>
      <Console consoleMessage={consoleMessage} clearConsoleMessage={() => { setConsoleMessage(undefined) }} />
      <FunctionTextInput setFunctionText={setFunctionText} />
      <ImageInput setImage={setImage} setConsoleMessage={setConsoleMessage} />
      {image == null || functionText == null ? <></> : <MidiManager image={image} functionText={functionText} setConsoleMessage={setConsoleMessage} />}
    </div>
  )
}
