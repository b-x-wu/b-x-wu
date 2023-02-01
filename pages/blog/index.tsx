import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { type Dispatch, type SetStateAction, useState } from 'react'
import useSWR from 'swr'
import { type PostMetadata, type ApiFailResponse, type ApiPaginationResponse, type PaginationLinks } from '../../types/types'

const LIMIT = 1
interface PaginationControlsProps {
  links: PaginationLinks
  setEndpoint: Dispatch<SetStateAction<string>>
}

function BlogPostPreview (postMetadata: PostMetadata): JSX.Element {
  return (
    <>
      <Link
        href={`/blog/${postMetadata.postId}`}
        // className='m-6'
      >
        <h1>{postMetadata.title}</h1>
        <h2>{postMetadata.datePublished.toString()}</h2>
        {postMetadata.description == null ? <></> : <p>{postMetadata.description}</p>}
      </Link>
    </>
  )
}

function PaginationControls ({ links, setEndpoint }: PaginationControlsProps): JSX.Element {
  const nextButton = links.next != null
    ? <button
        onClick={() => { setEndpoint(links.next ?? '') }}
        className='rounded-lg bg-gray-200 py-1 pl-2 transition-all duration-300 hover:ring-2'
      >
        <span className='hidden sm:inline'>Next</span>
        <Image
          src='https://upload.wikimedia.org/wikipedia/commons/9/9e/Map_arrow_black_e.svg'
          width={100}
          height={100}
          alt='Next Arrow'
          className='ml-1 mb-0.5 inline h-6 w-auto'
        />
      </button>
    : <div></div>
  const prevButton = links.prev != null
    ? <button
        onClick={() => { setEndpoint(links.prev ?? '') }}
        className='rounded-lg bg-gray-200 py-1 pr-2 transition-all duration-300 hover:ring-2'
      >
        <Image
          src='https://upload.wikimedia.org/wikipedia/commons/5/58/Map_arrow_black_w.svg'
          width={100}
          height={100}
          alt='Previous Arrow'
          className='mr-1 mb-0.5 inline h-6 w-auto'
        />
        <span className='hidden sm:inline'>Prev</span>
      </button>
    : <div></div>
  return (
    <div className='flex flex-row justify-between'>
      {prevButton}
      {nextButton}
    </div>
  )
}

export default function Home (): JSX.Element {
  const [endpoint, setEndpoint] = useState(`/api/blog?start=0&limit=${LIMIT}`)
  const { data, error } = useSWR<ApiPaginationResponse<PostMetadata>, ApiFailResponse, string>(endpoint, async (url) => {
    const res = await fetch(url)
    if (res.status >= 400) {
      throw await res.json()
    }
    return await res.json()
  })

  if (error != null) {
    return (
      <>
        <div>WE HAVE ERROR</div>
        <div>{JSON.stringify(error)}</div>
      </>
    )
  }

  if (data == null) {
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
      <main className="min-h-screen p-6">
        This is the blog homescreen
        <div className='flex flex-col gap-y-4'>
          {data.results.map((postMetadata: PostMetadata) => BlogPostPreview(postMetadata))}
          <PaginationControls
            links={data.links}
            setEndpoint={setEndpoint}
          />
        </div>

      </main>
    </>
  )
}
