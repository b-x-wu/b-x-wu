import Head from "next/head";
import { Dispatch, SetStateAction, useState } from "react";
import useSWR from "swr";
import { ApiFailResponse, ApiPaginationResponse, PaginationLinks, Post } from "../../types/types";

interface PaginationControlsProps {
  links: PaginationLinks
  setEndpoint: Dispatch<SetStateAction<string>>
}

function PaginationControls({ links, setEndpoint }: PaginationControlsProps) {
  const nextButton = links.next != null ? <button onClick={() => setEndpoint(links.next ?? '')}>Next</button> : <></>
  const prevButton = links.prev != null ? <button onClick={() => setEndpoint(links.prev ?? '')}>Prev</button> : <></>
  return (
    <>
      {nextButton}
      {prevButton}
    </>
  )
}

export default function Home() {
  const LIMIT = 1
  const [endpoint, setEndpoint] = useState(`/api/posts?start=0&limit=${LIMIT}`)
  const { data, error } = useSWR<ApiPaginationResponse<Post>, ApiFailResponse, string>(endpoint, async (url) => {
    const res = await fetch(url)
    if (res.status >= 400) {
      throw await res.json()
    }
    return await res.json()
  })

  if (error) {
    return (
      <>
        <div>WE HAVE ERROR</div>
        <div>{JSON.stringify(error)}</div>
      </>
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
        <PaginationControls
          links={data.links}
          setEndpoint={setEndpoint}
        />
      </main>
    </>
  )
}