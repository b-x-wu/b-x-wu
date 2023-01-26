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
      className={
        "transition-all ease-in-out duration-300 relative group h-48 rounded-xl ring ring-0 " +
        "hover:ring hover:ring-4"
      }
    >
      {/* TODO: if we're using gifs, change it so that the gif only starts playing on hover */}
      {imagePath != null ? 
        <Image 
          src={imagePath} 
          width={100} 
          height={100}
          alt={description}
          className={"object-cover h-full w-full rounded-xl"}
        /> : 
        <></>
      }
      <div className={
        "transition-all ease-in duration-300 bg-gray-100 bg-opacity-80 absolute inset-y-0 right-0 w-1/3 flex items-center justify-center rounded-r-lg backdrop-blur " +
        "sm:w-full sm:h-9 sm:bottom-0 sm:inset-x-0 sm:inset-y-auto sm:rounded-tr-none sm:rounded-b-lg " +
        "xl:w-1/3 xl:inset-y-0 xl:inset-x-auto xl:h-full xl:bottom-auto xl:right-0 xl:rounded-r-lg xl:rounded-bl-none " +
        "group-hover:w-full group-hover:h-full group-hover:rounded-xl"
      }>
        <div className={"px-3"}>
          <h1 className={"text-center align-middle text-lg"}>{name}</h1>
          <p className={"text-center sm:hidden sm:group-hover:block xl:block"}>{description}</p>
        </div>
      </div>
    </Link>
  )
}

export default function Home() {
  return (
    <>
      <Head>
        <title>brucexwu</title>
        <meta name="description" content="Portfolio site for Bruce X. Wu" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={"min-h-screen"}>
        <section className={"mx-12 p-6"}>
          { /* Introduction */ }
          <div className={"mx-auto py-6"}>
            <Image 
              src={"/me_grinning.jpg"}
              alt={"Picture of me"}
              width={100}
              height={100}
              className={"mx-auto object-cover h-48 w-48 rounded-full xl:h-64 xl:w-64"}
            />
          </div>
          <h1 className={"text-center text-2xl"}>
            Hello, I&apos;m B! <span role="img" aria-label="waving hand">&#x1F44B;</span>
            {/* IDEA: have this typed out as user enters the site? */}
          </h1>
          <h2 className={"text-center text-lg"}>
            I&apos;m a silly lil guy.
          </h2>
        </section>
        <section className={"mx-auto p-6"}>
          {/* Featured Projects */}
          <h1 className={"text-center text-2xl"}>
            Featured Projects
          </h1>
          <div className={"grid grid-cols-1 gap-6 py-6 sm:grid-cols-3"}>
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
