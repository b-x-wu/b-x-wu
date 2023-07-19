import { Editor } from '@monaco-editor/react'
import { IsDarkModeContext } from '../layout'
import { useContext } from 'react'

interface FunctionTextInputProps {
  setFunctionText: (functionText: string) => void
}

export default function FunctionTextInput (props: FunctionTextInputProps): JSX.Element {
  const isDarkMode = useContext(IsDarkModeContext)
  return (
    <div className='mx-auto flex h-96 w-full flex-col gap-y-2 lg:w-8/12'>
      <div className='h-full py-2' style={{ backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }}>
        <Editor
          defaultLanguage='javascript'
          defaultValue={'function pixelToMidiNote ({ red, green, blue, x, y }) {\n\treturn {\n\t\tstart: 0,\n\t\tduration: 1,\n\t\tpitch: 70,\n\t\tvelocity: 1,\n\t\ttrack: 0\n\t}\n}\n'}
          theme={isDarkMode ? 'vs-dark' : 'light'}
          onChange={(value) => { props.setFunctionText(value ?? '') }}
          onMount={(editor) => { props.setFunctionText(editor.getValue() ?? '') }}
        />
      </div>
    </div>
  )
}
