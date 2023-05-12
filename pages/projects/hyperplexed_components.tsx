import Link from 'next/link'
import { ComponentDisplay } from '../../components/hyperplexed-components/componentDisplay'
import { FancyGradientHoverLinks } from '../../components/hyperplexed-components/fancyGradientHoverLinks'

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
                <ComponentDisplay
                    width={600}
                    height={300}
                    codeText='import React from "react"\n\nexport const Home = ():JSX.Element => {\n\treturn <></>\n}'
                    containerStyle={{ borderWidth: '1px', maxWidth: '100%' }}
                    title='Fancy Gradient Hover Links'
                    titleHref='https://www.youtube.com/watch?v=oJYFRZ4cj2Q'
                    titleStyle={{ fontSize: '1.5rem', lineHeight: '2rem', fontWeight: 'bold', maxWidth: '100%' }}
                >
                    <div className='flex h-full flex-col justify-center bg-[#101020] text-2xl font-bold'>
                        <FancyGradientHoverLinks
                            linkInfos={[
                              {
                                text: 'Video',
                                href: 'https://www.youtube.com/watch?v=oJYFRZ4cj2Q'
                              },
                              {
                                text: 'Channel',
                                href: 'https://www.youtube.com/@Hyperplexed'
                              },
                              {
                                text: 'CodePen',
                                href: 'https://codepen.io/Hyperplexed/pen/wvmvqmx'
                              }
                            ]}
                        />
                    </div>
                </ComponentDisplay>
            </div>
        </div>
  )
}
