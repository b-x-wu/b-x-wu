import { CrosswordComponent } from '../../components/crossword-helper/crosswordComponent'
import Crossword from '../../types/crossword-helper/crossword'

export default function CrosswordHelper (): JSX.Element {
  const crossword: Crossword = new Crossword(16, 16)

  return (
    <div className='py-12'>
      <CrosswordComponent crossword={crossword} componentWidth='80%' />
    </div>
  )
}
