import Head from 'next/head'
import Image from 'next/image'
import FeaturedProject from '../components/featuredProject'
import TypedTextAnimation from '../components/typedTextAnimation'

export default function Home (): JSX.Element {
  return (
    <>
      <Head>
        <title>brucexwu</title>
        <meta name="description" content="Portfolio site for Bruce X. Wu" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mx-auto max-w-6xl pb-36">
        <section className="mx-12 p-6">
          { /* Introduction */ }
          <div className="mx-auto py-6">
            <Image
              src="/me_grinning.jpg"
              alt="Picture of me"
              width={100}
              height={100}
              className="mx-auto h-48 w-48 rounded-full object-cover xl:h-64 xl:w-64"
            />
          </div>
          <h1 className='text-center text-2xl'>
            <TypedTextAnimation
              frames={[
                'H', 'Hi', 'Hi,', 'Hi, ', 'Hi, I', "Hi, I'", "Hi, I'm", "Hi, I'm ",
                "Hi, I'm B", "Hi, I'm Br", "Hi, I'm Bru", "Hi, I'm Bruc", "Hi, I'm Bruce", "Hi, I'm Bruce!",
                "Hi, I'm Bruce! ", "Hi, I'm Bruce! :", "Hi, I'm Bruce! :w", "Hi, I'm Bruce! :wa", "Hi, I'm Bruce! :wav",
                "Hi, I'm Bruce! :wave", "Hi, I'm Bruce!"
              ]}
              frameRate={75}
              tag="span"
            />
            <TypedTextAnimation
              props={{
                role: 'img',
                'aria-label': 'waving hand'
              }}
              tag="span"
              frameRate={75}
              frames={[
                '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '👋'
              ]}
            />
            <TypedTextAnimation
              tag="span"
              frameRate={75}
              frames={[
                '‸', '‸', '‸', '‸', '‸', '‸', '‸', '‸', '‸', '‸', '‸', '‸', '‸', '‸', '‸', '‸', '‸', '‸', '‸', '‸', ''
              ]}
            />
          </h1>
          <h2 className="text-center text-lg">
            I&apos;m a silly lil guy.
          </h2>
        </section>
        <section className="mx-auto p-6">
          {/* Featured Projects */}
          <h1 className="text-center text-2xl">
            Featured Projects
          </h1>
          <div className="grid grid-cols-1 gap-6 py-6 sm:grid-cols-3">
            <FeaturedProject
              name="Project 1"
              imagePath="/photo_of_me_sweating.jpg"
            />
            <FeaturedProject
              name="Project 2"
              imagePath="/giphy.gif"
            />
            <FeaturedProject
              name="Project 3"
              imagePath="/photo_of_me_sweating.jpg"
            />
            <FeaturedProject
              name="Project 4"
              imagePath="/photo_of_me_sweating.jpg"
            />
            <FeaturedProject
              name="Project 5"
              imagePath="/photo_of_me_sweating.jpg"
            />
            <FeaturedProject
              name="Project 6"
              imagePath="/photo_of_me_sweating.jpg"
            />
          </div>
        </section>
      </main>
    </>
  )
}
