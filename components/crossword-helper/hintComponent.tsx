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
  }, [props.word, props.clue, props.squarePosition])

  const wordHintElements = wordHints.map((wordHint, wordHintIdx) => {
    const clueElements = wordHint.clues.map((clue, clueIdx) => {
      return (
                <div
                    key={clueIdx}
                    className='cursor-pointer bg-lighter-blue p-2 text-darkest-blue transition-colors duration-300 hover:underline dark:bg-darkest-blue dark:text-glacier'
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
            <div className='flex flex-col gap-x-8 gap-y-2 md:flex-row xl:flex-col' key={wordHintIdx}>
                <div className='h-full w-full cursor-pointer overflow-hidden truncate hover:underline md:w-1/3 xl:w-full' onClick={props.handleWordHintSelect(props.squarePosition, props.orientation, wordHint.word)}>{wordHint.word}</div>
                <div className='flex h-fit max-h-36 w-full flex-col gap-0.5 overflow-auto bg-darkest-blue p-0.5 transition-colors duration-300 dark:bg-glacier'>
                    {clueElements}
                </div>
            </div>
    )
  })

  const clueHintElements = clueHints.map((clue, clueIdx) => {
    return (
            <div className='cursor-pointer bg-lighter-blue p-2 text-darkest-blue transition-colors duration-300 hover:underline dark:bg-darkest-blue dark:text-glacier' onClick={props.handleClueHintSelect(props.squarePosition, props.orientation, clue)} key={clueIdx}>{clue}</div>
    )
  })

  return (
        <div className='h-fit w-full'>
            {wordHintElements.length === 0
              ? <></>
              : <div className='flex flex-col gap-y-4'>
                    <div className='hidden flex-row gap-x-8 md:flex xl:hidden'>
                        <div className='h-full w-1/3'>Word Hints</div>
                        <div className='h-full w-full'>Clue Hints</div>
                    </div>
                    {wordHintElements}
                </div>
            }
            {clueHintElements.length === 0
              ? <></>
              : <div className='flex flex-col gap-y-4'>
                    <div>Clue Hints</div>
                    <div className='flex h-fit w-full flex-col gap-0.5 overflow-auto bg-darkest-blue p-0.5 transition-colors duration-300 dark:bg-glacier'>
                        {clueHintElements}
                    </div>
                </div>
            }
        </div>
  )
}
