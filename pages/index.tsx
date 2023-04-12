import Head from 'next/head'
import Image from 'next/image'
import FeaturedProject from '../components/featuredProject'
import TypedTextAnimation from '../components/typedTextAnimation'

export default function Home (): JSX.Element {
  const FRAME_RATE = 100

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
              src="/pfp.jpg"
              alt="Picture of me"
              width={1000}
              height={1000}
              className="mx-auto h-64 w-64 rounded-full object-cover ring-4 ring-lighter-blue"
              priority={true}
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
              frameRate={FRAME_RATE}
              tag="span"
            />
            <span className='relative'>
              <TypedTextAnimation
                props={{
                  role: 'img',
                  'aria-label': 'waving hand'
                }}
                tag="span"
                frameRate={FRAME_RATE}
                frames={[
                  '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '👋'
                ]}
              />
              <TypedTextAnimation
                tag="span"
                frameRate={FRAME_RATE}
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
              imagePath="/project_images/usm.png"
              url='https://github.com/ulcnyu/ulc-schedule-maker-v2/tree/polish'
              description='A web app that aggregates tutoring schedules'
            />
            <FeaturedProject
              name="Twit-Scraper"
              imagePath='/project_images/twit_scraper.png'
              url="https://github.com/bruce-x-wu/twit-scraper"
              description='A free, open-source Twitter API alternative'
            />
            <FeaturedProject
              name="Create React Sandbox"
              imagePath='/project_images/create_react_sandbox.gif'
              url="https://www.npmjs.com/package/create-react-sandbox"
              description='A command-line tool to create lightweight React environments'
            />
            <FeaturedProject
              name="Palette Hacker"
              imagePath="/project_images/palette_hacker.gif"
              url="https://github.com/bruce-x-wu/palette-hacker"
              description='A Chrome extension for swapping website color palettes'
            />
            <FeaturedProject
              name="Web Effect Rack"
              imagePath="/project_images/web_effect_rack.png"
              url='https://github.com/bruce-x-wu/web-effect-rack'
              description='A web-based Pure Data effect interface'
            />
            <FeaturedProject
              name="brucexwu.com"
              imagePath="/project_images/brucexwu.png"
              url='/'
              description='This website'
            />
          </div>
        </section>
      </main>
    </>
  )
}
