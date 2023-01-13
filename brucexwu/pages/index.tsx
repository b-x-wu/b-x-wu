import Head from "next/head";
import Image from "next/image";

interface FeaturedProjectProps {
  name: string;
  description: string;
  imagePath?: string;
}

function FeaturedProject({name, description, imagePath}: FeaturedProjectProps) {
  return (
    <div className="relative border h-48">
      {imagePath != null ? 
        <Image 
          src={imagePath} 
          width={100} 
          height={100}
          alt={description}
          className="object-cover h-full w-full"
        /> : 
        <></>
      }
      <div className="bg-gray-100 bg-opacity-90 absolute xl:w-1/3 xl:inset-y-0 xl:inset-x-auto xl:h-full xl:bottom-auto xl:right-0 md:w-full md:bottom-0 md:inset-x-0 md:inset-y-auto inset-y-0 right-0 w-1/3">
        <h1 className="text-center">{name}</h1>
        <p className="text-center">{description}</p>
      </div>
    </div>
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
        <section className="mx-auto p-6">
          { /* Introduction */ }
          <div className="mx-auto">
            <Image 
              src={"/photo_of_me_sweating.jpg"}
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
            I&apos;m a silly l&apos;il guy.
          </h2>
        </section>
        <section className="mx-auto p-6">
          {/* Featured Projects */}
          <h1 className="text-center text-2xl">
            Featured Projects
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6">
            <FeaturedProject
              name="Project 1"
              description="This is the first project"
              imagePath="/photo_of_me_sweating.jpg"
            />
            <FeaturedProject
              name="Project 2"
              description="This is the second project"
              imagePath="/photo_of_me_sweating.jpg"
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
