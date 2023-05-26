import type React from 'react'
import { useEffect, useState } from 'react'
import { type Orientation, type SquarePosition } from '../../types/crossword-helper/types'

interface WordHint {
  word: string
  clues: string[]
}

interface HintComponentProps {
  word: string
  clue: string
  squarePosition: SquarePosition
  orientation: Orientation
  handleWordHintSelect: (squarePosition: SquarePosition, orientation: Orientation, wordString: string) => React.MouseEventHandler<HTMLDivElement>
  handleClueHintSelect: (squarePosition: SquarePosition, orientation: Orientation, wordString: string) => React.MouseEventHandler<HTMLDivElement>
}

export const HintComponent = (props: HintComponentProps): JSX.Element => {
  const [wordHints, setWordHints] = useState<WordHint[]>([])
  const [clueHints, setClueHints] = useState<string[]>([])

  useEffect(() => {
    if (props.word.includes('_')) {
      // still need to finish the word. look for word hints
      fetch(`/api/crossword_helper/word_hint?word=${props.word}`).then(async (res) => {
        return await res.json()
      }).then((data: WordHint[]) => {
        setClueHints([])
        setWordHints(data.map((wordHint) => {
          return {
            word: wordHint.word,
            clues: wordHint.clues
          }
        }))
      }).catch(console.log)
      return
    }

    // word is complete. look only for clues
    if (props.clue === '') {
      fetch(`/api/crossword_helper/clue_hint?word=${props.word}`).then(async (res) => {
        return await res.json()
      }).then((data: string[]) => {
        setWordHints([])
        setClueHints(data)
      }).catch(console.log)
      return
    }

    // word is complete and clue is present. do nothing
    setWordHints([])
    setClueHints([])
  }, [props.word, props.clue])

  const wordHintElements = wordHints.map((wordHint, wordHintIdx) => {
    const clueElements = wordHint.clues.map((clue, clueIdx) => {
      return (
                <div
                    key={clueIdx}
                    className='cursor-pointer border-2 border-darker-blue p-1'
                    onClick={(event) => {
                      props.handleWordHintSelect(props.squarePosition, props.orientation, wordHint.word)(event)
                      props.handleClueHintSelect(props.squarePosition, props.orientation, clue)(event)
                    }}
                >
                    {clue}
                </div>
      )
    })
    return (
            <div className='flex flex-row gap-x-8' key={wordHintIdx}>
                <div className='h-full w-1/6 cursor-pointer' onClick={props.handleWordHintSelect(props.squarePosition, props.orientation, wordHint.word)}>{wordHint.word}</div>
                <div className='h-fit max-h-24 w-full overflow-auto bg-lighter-blue'>
                    {clueElements}
                </div>
            </div>
    )
  })

  const clueHintElements = clueHints.map((clue, clueIdx) => {
    return (
            <div className='cursor-pointer border-2 border-darker-blue p-1' onClick={props.handleClueHintSelect(props.squarePosition, props.orientation, clue)} key={clueIdx}>{clue}</div>
    )
  })

  return (
        <div className='h-fit w-full'>
            {wordHintElements.length === 0
              ? <></>
              : <div className='flex flex-col gap-y-4'>
                    <div className='flex flex-row gap-x-8'>
                        <div className='h-full w-1/6'>Word Hints</div>
                        <div className='h-full w-full'>Clue Hints</div>
                    </div>
                    {wordHintElements}
                </div>
            }
            {clueHintElements.length === 0
              ? <></>
              : <div className='flex flex-col gap-y-4'>
                    <div>Clue Hints</div>
                    <div className='h-fit w-full bg-lighter-blue'>
                        {clueHintElements}
                    </div>
                </div>
            }
        </div>
  )
}
