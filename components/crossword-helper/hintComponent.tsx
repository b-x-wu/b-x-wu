import type React from 'react'
import { useEffect, useState } from 'react'
import { type Clue, type Orientation, type SquarePosition } from '../../types/crossword-helper/types'

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
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [wordHints, setWordHints] = useState<WordHint[]>([])
  const [clueHints, setClueHints] = useState<string[]>([])

  useEffect(() => {
    setIsLoading(true)
    setWordHints([])
    setClueHints([])
    fetch(`/api/crossword_helper?word=${props.word}&clue=${props.clue}`).then(async (res) => {
      if (res.status >= 400) {
        throw await res.json()
      }
      return await res.json()
    }).then((data: WordHint[] | Clue[]) => {
      setIsLoading(false)
      if (data.length === 0) {
        setWordHints(prev => [])
        setClueHints(prev => [])
        return
      }

      if (typeof data[0] === 'string') {
        // setWordHints(prev => [])
        setClueHints(prev => data as Clue[])
        return
      }

      setWordHints(prev => data as WordHint[])
      // setClueHints(prev => [])
    }).catch((err) => {
      console.log(err)
      setWordHints(prev => [])
      setClueHints(prev => [])
    })
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

  let hintElements: JSX.Element
  if (isLoading) {
    hintElements = <div className='w-full'>Loading...</div>
  } else if (props.word.includes('_')) {
    if (wordHintElements.length === 0) {
      hintElements = <div className='w-full'>No matching words in the database.</div>
    } else {
      hintElements = <div className='flex flex-col gap-y-4'>
                        <div className='hidden flex-row gap-x-8 md:flex xl:hidden'>
                            <div className='h-full w-1/3'>Word Hints</div>
                            <div className='h-full w-full'>Clue Hints</div>
                        </div>
                        {wordHintElements}
                      </div>
    }
  } else if (props.clue === '') {
    if (clueHintElements.length === 0) {
      hintElements = <div className='w-full'>No matching clues in the database.</div>
    } else {
      hintElements = <div className='flex flex-col gap-y-4'>
                        <div>Clue Hints</div>
                        <div className='flex h-fit w-full flex-col gap-0.5 overflow-auto bg-darkest-blue p-0.5 transition-colors duration-300 dark:bg-glacier'>
                            {clueHintElements}
                        </div>
                     </div>
    }
  } else {
    hintElements = <div className='w-full'>All set!</div>
  }

  // const hintElements = isLoading
  //   ? <div className='w-full'>Loading...</div>
  //   : <>
  //       {
  //         wordHintElements.length === 0
  //           ? <></>
  //           : <div className='flex flex-col gap-y-4'>
  //                 <div className='hidden flex-row gap-x-8 md:flex xl:hidden'>
  //                     <div className='h-full w-1/3'>Word Hints</div>
  //                     <div className='h-full w-full'>Clue Hints</div>
  //                 </div>
  //                 {wordHintElements}
  //             </div>
  //       }
  //       {
  //         clueHintElements.length === 0
  //           ? <></>
  //           : <div className='flex flex-col gap-y-4'>
  //                 <div>Clue Hints</div>
  //                 <div className='flex h-fit w-full flex-col gap-0.5 overflow-auto bg-darkest-blue p-0.5 transition-colors duration-300 dark:bg-glacier'>
  //                     {clueHintElements}
  //                 </div>
  //             </div>
  //       }
  //     </>

  return (
        <div className='h-fit w-full'>
            {hintElements}
        </div>
  )
}
