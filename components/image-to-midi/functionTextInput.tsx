import { Editor } from '@monaco-editor/react'

interface FunctionTextInputProps {
  setFunctionText: (functionText: string) => void
}

export default function FunctionTextInput (props: FunctionTextInputProps): JSX.Element {
  return (
    <div className='mx-auto flex w-full flex-col gap-y-2'>
      <div className='h-96 bg-[#1e1e1e] py-2'>
        <Editor
          defaultLanguage='javascript'
          defaultValue={'function pixelToMidiNote ({ red, green, blue, x, y }) {\n\treturn {\n\t\tstart: 0,\n\t\tduration: 1,\n\t\tpitch: 70,\n\t\tvelocity: 1,\n\t\ttrack: 0\n\t}\n}\n'}
          theme='vs-dark'
          onChange={(value) => { props.setFunctionText(value ?? '') }}
          onMount={(editor) => { props.setFunctionText(editor.getValue() ?? '') }}
        />
      </div>
    </div>
  )
}
