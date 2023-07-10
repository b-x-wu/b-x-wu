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
      <section className="mx-12 flex flex-col gap-y-4 p-6">
        { /* Introduction */ }
        <div className="relative mx-auto py-4">
          <Image
            src="/pfp.jpg"
            alt="Picture of me"
            width={1000}
            height={1000}
            className="mx-auto h-64 w-64 rounded-full object-cover ring-4 ring-lighter-blue transition-all duration-300 dark:ring-darkest-blue"
            priority={true}
          />
          <div
            role='img'
            aria-label='sunglasses'
            className='absolute top-[80px] left-[83px] hidden text-6xl opacity-0 transition-all duration-300 dark:opacity-100 sm:block'
          >
            😎
          </div>
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
          I&apos;m a software dev. I host all the silly little things I&apos;ve made on this website.
        </h2>
      </section>
      <section className="mx-auto p-6">
        {/* Featured Projects */}
        <h1 className="text-center text-2xl">
          Featured Projects
        </h1>
        <div className="grid grid-cols-1 gap-6 py-6 sm:grid-cols-3">
          <FeaturedProject
            name="Hyperplexed Components"
            imagePath="/project_images/hyperplexed_components.gif"
            url='/projects/hyperplexed_components'
            description='Customizable front-end visual effects with React and Tailwind CSS'
          />
          <FeaturedProject
            name="Crossword Helper"
            imagePath='/project_images/crossword_helper.png'
            url="/projects/crossword_helper"
            description='A web app for streamlined crossword puzzle creation'
          />
          <FeaturedProject
            name="Create React Sandbox"
            imagePath='/project_images/create_react_sandbox.gif'
            url="https://www.npmjs.com/package/create-react-sandbox"
            description='A command-line tool to create lightweight React environments'
          />
          <FeaturedProject
            name="Visual Novel Terminal"
            imagePath="/project_images/vn-terminal.png"
            url="https://bruce-x-wu.itch.io/visual-novel-terminal"
            description='A customizable reskin for the terminal that makes it look like a visual novel.'
          />
          <FeaturedProject
            name="Graphics Engine"
            imagePath="/project_images/graphics_engine.bmp"
            url='https://github.com/bruce-x-wu/graphics-engine'
            description='A 3D graphics renderer built from scratch'
          />
          <FeaturedProject
            name="brucexwu.com"
            imagePath="/project_images/brucexwu.png"
            url='/'
            description='This website'
          />
        </div>
      </section>
    </>
  )
}
