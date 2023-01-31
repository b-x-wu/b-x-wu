import Head from "next/head";
import useSWR from "swr";
import { ApiFailResponse, Post } from "../../types/types";

export default function Home() {
  const { data, error } = useSWR<Post, ApiFailResponse, string>('/api/posts', async (url) => {
    const res = await fetch(url)
    return await res.json()
  })

  if (error) {
    return (
      <div>WE HAVE ERROR</div>
    )
  }

  if (!data) {
    return (
      <div>WE ARE LOADING</div>
    )
  }

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
        <div>
          {JSON.stringify(data)}
        </div>
      </main>
    </>
  )
}