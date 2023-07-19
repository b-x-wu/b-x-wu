import { useState } from 'react'
import FunctionTextInput from '../../components/image-to-midi/functionTextInput'
import { ImageInput } from '../../components/image-to-midi/imageInput'
import { MidiManager } from '../../components/image-to-midi/midiManager'
import { type Base64String } from '../../types/image_to_midi'

export default function ImageToMidi (): JSX.Element {
  const [image, setImage] = useState<Base64String | undefined>(undefined)
  const [functionText, setFunctionText] = useState<string | undefined>(undefined)

  return (
    <div className='flex flex-col space-y-5'>
      <FunctionTextInput setFunctionText={setFunctionText} />
      <ImageInput setImage={setImage} />
      {image == null || functionText == null ? <></> : <MidiManager image={image} functionText={functionText} />}
    </div>
  )
}
