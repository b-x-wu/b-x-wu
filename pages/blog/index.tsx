import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { type Dispatch, type SetStateAction, useState } from 'react'
import useSWR from 'swr'
import { type PostMetadata, type ApiFailResponse, type ApiPaginationResponse, type PaginationLinks } from '../../types/types'

const LIMIT = 10
interface PaginationControlsProps {
  links: PaginationLinks
  setEndpoint: Dispatch<SetStateAction<string>>
}

function BlogPostPreview (postMetadata: PostMetadata): JSX.Element {
  return (
    <div key={postMetadata.postId}>
      <Link
        href={`/blog/${postMetadata.postId}`}
        className='group flex flex-row justify-between rounded-lg bg-lighter-blue ring-4 ring-lighter-blue transition-all duration-300'
      >
        <div className={`flex basis-full flex-col gap-y-2 p-6 ${postMetadata.coverImageSrc != null ? 'sm:basis-3/4' : ''}`}>
          <h1 className='text-xl font-semibold underline decoration-lighter-blue group-hover:decoration-dim-gray'>{postMetadata.title}</h1>
          <h3 className='text-sm font-light'>{`Published on ${(new Date(postMetadata.datePublished)).toDateString()}`}</h3>
          {postMetadata.description == null ? <></> : <p className='text-ellipsis'>{postMetadata.description}</p>}
          <div>
            Read more
            <span className='opacity-0 transition-opacity duration-100 ease-linear group-hover:opacity-100'>.</span>
            <span className='opacity-0 transition-opacity duration-200 ease-linear group-hover:opacity-100'>.</span>
            <span className='opacity-0 transition-opacity duration-300 ease-linear group-hover:opacity-100'>.</span>
          </div>
        </div>
        {
          postMetadata.coverImageSrc != null
            ? <Image
                src={postMetadata.coverImageSrc}
                height={100}
                width={100}
                alt={`Cover image for ${postMetadata.title} blog post`}
                className='hidden sm:block sm:basis-1/4 sm:rounded-r-lg sm:object-cover'
              />
            : <div></div>
        }
      </Link>
    </div>
  )
}

function PaginationControls ({ links, setEndpoint }: PaginationControlsProps): JSX.Element {
  const nextButton = links.next != null
    ? <button
      onClick={() => { setEndpoint(links.next ?? '') }}
      className='rounded-lg bg-lighter-blue py-1 pl-2'
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
      className='rounded-lg bg-lighter-blue py-1 pr-2'
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
      <main className="p-6 pb-36">
        <div className='flex flex-col gap-y-8'>
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
