import { useState, useEffect } from 'react'
// import { type Pixel, type MidiNote } from '../../types/image_to_midi'

interface FunctionTextInputProps {
  setFunctionText: (functionText: string) => void
}

export default function FunctionTextInput (props: FunctionTextInputProps): JSX.Element {
  const [currentFormValue, setCurrentFormValue] = useState<string>('')
  const [functionText, setFunctionText] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (functionText == null) return
    try {
      props.setFunctionText(functionText)
    } catch (e) {
      console.log(e)
    }
  }, [functionText])

  return (
    <div className='h-96 w-96 border-2 border-glacier'>
      <textarea className='h-48 w-48 text-darkest-blue' onChange={(event) => { setCurrentFormValue(event.target.value) }} value={currentFormValue}></textarea>
      <button className='h-20 w-20 bg-dark-blue' onClick={() => { setFunctionText(currentFormValue) }}>Submit Function</button>
    </div>
  )
}
