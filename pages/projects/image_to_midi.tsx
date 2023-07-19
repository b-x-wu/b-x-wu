import { useState } from 'react'
import FunctionTextInput from '../../components/image-to-midi/functionTextInput'
import { ImageInput } from '../../components/image-to-midi/imageInput'
import { MidiManager } from '../../components/image-to-midi/midiManager'
import { ConsoleMessageType, type Base64String } from '../../types/image_to_midi'
import { Console } from '../../components/image-to-midi/console'

export default function ImageToMidi (): JSX.Element {
  const [image, setImage] = useState<Base64String | undefined>(undefined)
  const [functionText, setFunctionText] = useState<string | undefined>(undefined)

  return (
    <div className='relative flex flex-col space-y-5'>
      <Console consoleMessage={{ type: ConsoleMessageType.WARNING, message: 'Console test' }} clearConsoleMessage={() => { console.log('clearing console') }} />
      <FunctionTextInput setFunctionText={setFunctionText} />
      <ImageInput setImage={setImage} />
      {image == null || functionText == null ? <></> : <MidiManager image={image} functionText={functionText} />}
    </div>
  )
}
