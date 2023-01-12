import Head from "next/head";
import Image from "next/image";

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
        <section className="mx-auto px-6">
          {/* Introduction and About me */}
          <div className="mx-auto">
            <Image 
              src={"/photo_of_me_sweating.jpg"}
              alt={"Picture of me"}
              width={100}
              height={100}
              className="mx-auto object-cover md:h-48 md:w-48 h-32 w-32 rounded-full"
            />
          </div>
          <h1 className="text-center text-2xl">
            Hello, I&apos;m B! &#x1F44B;
            {/* IDEA: have this typed out as user enters the site? */}
          </h1> 
        </section>
        <section>
          {/* Featured Projects */}
        </section>
        <footer>

        </footer>
      </main>
    </>
  );
}
