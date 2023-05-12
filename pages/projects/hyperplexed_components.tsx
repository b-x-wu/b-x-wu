import Link from 'next/link'

export default function HyperplexedComponents (): JSX.Element {
  return (
        <div className="mx-auto flex flex-col items-center gap-y-8">
            <div className='flex w-[60%] flex-col gap-y-10 pt-10 pb-0'>
                <h1 className='w-full text-center text-4xl font-bold'><span className='bg-gradient-to-t from-[#28cdbb] to-[#2576de] bg-clip-text text-transparent'>Hyperplexed</span> Components</h1>
                <p className='leading-loose'>
                    <Link href="https://www.youtube.com/@Hyperplexed" target='_blank' rel="noreferrer" className='font-bold hover:underline'>Hyperplexed</Link>
                    &nbsp;makes incredible YouTube videos detailing the thought process behind replicating <span className='font-bold'>top-tier front-end visual effects</span> from around the web.
                    In order to potentially make these visual effects fit better into future projects (and as some personal practice in front-end design),
                    this project aims to convert these visual effects into <span className='font-bold'>reusable and customizable React components</span> that leverage <Link href='https://www.typescriptlang.org/' target="_blank" rel='noreferrer' className='font-bold hover:underline'>TypeScript</Link>
                    &nbsp;and <Link href='https://tailwindcss.com/' target="_blank" rel='noreferrer' className='font-bold hover:underline'>Tailwind CSS</Link>.
                </p>
            </div>
        </div>
  )
}
