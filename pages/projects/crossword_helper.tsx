import Link from 'next/link'
import { CrosswordComponent } from '../../components/crossword-helper/crosswordComponent'
import Crossword from '../../types/crossword-helper/crossword'

export default function CrosswordHelper (): JSX.Element {
  const crossword: Crossword = new Crossword(12, 12)

  return (
    <div className='flex flex-col gap-y-12 pb-12'>
      <div className='mx-auto flex w-[60%] flex-col gap-y-10 pt-10 pb-0'>
          <h1 className='w-full text-center text-4xl font-bold'>Crossword Helper</h1>
          <div className='flex flex-col gap-y-4'>
            <p className='leading-loose'>
              Many of the world&apos;s premiere crossword makers are still doing much of their creation by hand, as demonstrated in <Link className='font-bold hover:underline' href="https://www.youtube.com/watch?v=aAqQnXHd7qk" target='_blank' rel="noreferrer">this Wired video</Link>.
              This demo attempts to streamline the process by putting hints for words and clues that fit the crossword&apos;s structure right beside the creator. The dataset used to construct the word and clue hints
              comes from <Link className='font-bold hover:underline' href="https://xd.saul.pw/data/" target='_blank' rel='noreferrer'>Saul Pawnson&apos;s xd project</Link>.
            </p>
            <p className='leading-loose'>
              Bear in mind that this is just a tech demo. The project is still a <span className='italic'>bit</span> buggy. If you&apos;re having issues with the word and clue hints, click off to other squares before returning and trying again.
              If you encounter any problems, submit an issue to <Link href='https://github.com/bruce-x-wu/bruce-x-wu/issues' target='_blank' rel='noreferrer' className='font-bold hover:underline'>this repository on GitHub</Link>.
            </p>
          </div>
      </div>
      <CrosswordComponent crossword={crossword} />
    </div>
  )
}
