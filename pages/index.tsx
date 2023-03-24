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
        <section className="mx-12 flex flex-col gap-y-4 p-6">
          { /* Introduction */ }
          <div className="mx-auto py-4">
            <Image
              src="/me_grinning.jpg"
              alt="Picture of me"
              width={100}
              height={100}
              className="mx-auto h-64 w-64 rounded-full object-cover"
            />
          </div>
          <h1 className='text-center text-4xl'>
            <TypedTextAnimation
              frames={[
                'H', 'Hi', 'Hi,', 'Hi, ', 'Hi, I', "Hi, I'", "Hi, I'm", "Hi, I'm ",
                "Hi, I'm B", "Hi, I'm Br", "Hi, I'm Bru", "Hi, I'm Bruc", "Hi, I'm Bruce", "Hi, I'm Bruce!", "Hi, I'm Bruce!", "Hi, I'm Bruce!",
                "Hi, I'm Bruce!", "Hi, I'm Bruce! ", "Hi, I'm Bruce! :", "Hi, I'm Bruce! :w", "Hi, I'm Bruce! :wa", "Hi, I'm Bruce! :wav",
                "Hi, I'm Bruce! :wave", "Hi, I'm Bruce! :wave:", "Hi, I'm Bruce!"
              ]}
              frameRate={100}
              tag="span"
            />
            <span className='relative'>
              <TypedTextAnimation
                props={{
                  role: 'img',
                  'aria-label': 'waving hand'
                }}
                tag="span"
                frameRate={100}
                frames={[
                  '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '👋'
                ]}
              />
              <TypedTextAnimation
                tag="span"
                frameRate={100}
                frames={[
                  '‸', '‸', '‸', '‸', '‸', '‸', '‸', '‸', '‸', '‸', '‸', '‸', '‸', '‸', '‸', '‸', '‸', '‸', '‸',
                  '‸', '‸', '‸', '‸', '‸', '‸', '‸', '‸', '‸', '‸', '‸', ' ', ' ', ' ', ' ', ' '
                ]}
                className="absolute -right-3 -bottom-1"
                repeat={10}
              />
            </span>
          </h1>
          <h2 className="text-center text-lg">
            I&apos;m a software dev working on data and development accessibility for everyone.
          </h2>
        </section>
        <section className="mx-auto p-6">
          {/* Featured Projects */}
          <h1 className="text-center text-2xl">
            Featured Projects
          </h1>
          <div className="grid grid-cols-1 gap-6 py-6 sm:grid-cols-3">
            <FeaturedProject
              name="ULC Schedule Maker V2"
              imagePath="/photo_of_me_sweating.jpg"
              url='https://github.com/ulcnyu/ulc-schedule-maker-v2/tree/polish'
              description='Schedule consolidation web app'
            />
            <FeaturedProject
              name="Twit-Scraper"
              imagePath='/giphy.gif'
              url="https://github.com/bruce-x-wu/twit-scraper"
              description='Twitter API alternative'
            />
            <FeaturedProject
              name="Create React Sandbox"
              imagePath='/photo_of_me_sweating.jpg'
              url="https://www.npmjs.com/package/create-react-sandbox"
              description='React environment generating CLI tool'
            />
            <FeaturedProject
              name="Palette Hacker"
              imagePath="/photo_of_me_sweating.jpg"
              url="https://github.com/bruce-x-wu/palette-hacker"
              description='Color swapping Chrome extension'
            />
            <FeaturedProject
              name="Web Effect Rack"
              imagePath="/photo_of_me_sweating.jpg"
              url='https://github.com/bruce-x-wu/web-effect-rack'
              description='Web based Pure Data effect interface'
            />
            <FeaturedProject
              name="brucexwu.com"
              imagePath="/photo_of_me_sweating.jpg"
              url='/'
              description='This website'
            />
          </div>
        </section>
      </main>
    </>
  )
}
