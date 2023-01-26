import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

interface FeaturedProjectProps {
  name: string;
  description: string;
  imagePath?: string;
  url?: string;
}

function FeaturedProject({name, description, imagePath, url}: FeaturedProjectProps) {
  return (
    <Link
      href={url ?? "#"}
      className="transition-all ease-in-out ring ring-0 duration-300 relative hover:ring-4 h-48 hover:ring group rounded-xl"
    >
      {/* TODO: if we're using gifs, change it so that the gif only starts playing on hover */}
      {imagePath != null ? 
        <Image 
          src={imagePath} 
          width={100} 
          height={100}
          alt={description}
          className="object-cover h-full w-full rounded-xl"
        /> : 
        <></>
      }
      <div className="transition-all ease-in duration-300 bg-gray-100 bg-opacity-90 absolute xl:w-1/3 xl:inset-y-0 xl:inset-x-auto xl:h-full xl:bottom-auto xl:right-0 sm:w-full sm:h-9 sm:bottom-0 sm:inset-x-0 sm:inset-y-auto inset-y-0 right-0 w-1/3 flex items-center justify-center group-hover:w-full group-hover:h-full group-hover:rounded-xl xl:rounded-r-lg xl:rounded-bl-none sm:rounded-tr-none sm:rounded-b-lg rounded-r-lg">
        <div className="px-3">
           <h1 className="text-center align-middle text-lg">{name}</h1>
          <p className="text-center sm:hidden sm:group-hover:block xl:block">{description}</p>
        </div>
      </div>
    </Link>
  )
}

export default function Home() {
  return (
    <>
      <Head>
        <title>Bruce X. Wu</title>
        <meta name="description" content="Portfolio site for Bruce X. Wu" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <nav>

        </nav>
        <section className="mx-12 p-6">
          { /* Introduction */ }
          <div className="mx-auto py-6">
            <Image 
              src={"/me_grinning.jpg"}
              alt={"Picture of me"}
              width={100}
              height={100}
              className="mx-auto object-cover xl:h-64 xl:w-64 h-48 w-48 rounded-full"
            />
          </div>
          <h1 className="text-center text-2xl">
            Hello, I&apos;m B! &#x1F44B;
            {/* IDEA: have this typed out as user enters the site? */}
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-6">
            <FeaturedProject
              name="Project 1"
              description="This is the first project"
              imagePath="/photo_of_me_sweating.jpg"
            />
            <FeaturedProject
              name="Project 2"
              description="This is the second project"
              imagePath="/giphy.gif"
            />
            <FeaturedProject
              name="Project 3"
              description="This is the third project"
              imagePath="/photo_of_me_sweating.jpg"
            />
            <FeaturedProject
              name="Project 4"
              description="This is the fourth project"
              imagePath="/photo_of_me_sweating.jpg"
            />
            <FeaturedProject
              name="Project 5"
              description="This is the fifth project"
              imagePath="/photo_of_me_sweating.jpg"
            />
            <FeaturedProject
              name="Project 6"
              description="This is the sixth project"
              imagePath="/photo_of_me_sweating.jpg"
            />
          </div>
        </section>
      </main>
    </>
  );
}
