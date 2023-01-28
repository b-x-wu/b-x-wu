import Head from "next/head";

export default function Home() {
    return (
      <>
        <Head>
          <title>Blog | brucexwu</title>
          <meta name="description" content="Bruce X. Wu's Blog" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={"min-h-screen"}>
          This is the blog homescreen
        </main>
      </>
    )
}