import { type GetStaticPaths, type GetStaticProps, type InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import { BASE_URL } from '../../constants'
import { type ApiPaginationResponse, type ApiFailResponse, type Post, type PostMetadata } from '../../types/types'
import MarkdownElement from '../../components/markdownElement'
import MarkdownTableOfContents from '../../components/markdownTableOfContents'

interface BlogPostProps {
  postId: string
  title: string
  datePublished: string
  content: string
  description: string | null
}

export default function BlogPost ({ postId, title, datePublished, content, description }: InferGetStaticPropsType<typeof getStaticProps>): JSX.Element {
  return (
        <>
            <Head>
                <title>{title + ' | brucexwu'}</title>
                <meta name="description" content={title} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="pb-36">
              <div className='flex flex-col'>
                <div className='flex h-72 min-h-fit items-center justify-center bg-blue text-center'>
                  <div className='m-6 flex flex-col gap-y-6'>
                    <h1 className='text-6xl font-bold'>{title}</h1>
                    <div className='flex flex-col gap-y-2'>
                      { description != null ? <h2 className='opacity-70'>{description}</h2> : <></> }
                      <h2 className='opacity-70'>Published on {(new Date(datePublished)).toLocaleDateString()}</h2>
                    </div>
                  </div>
                </div>
                <div className='mx-auto max-w-6xl'>
                  <div className="my-6 max-w-[calc(100vw_-_1.5rem)] lg:flex lg:flex-row">
                    <div className="mx-6 flex flex-col gap-y-4 rounded-lg bg-lighter-blue p-6 lg:ml-6 lg:mr-3 lg:flex lg:basis-3/4">
                        {MarkdownElement({ content })}
                    </div>
                    <div className='sticky top-24 mr-6 ml-3 hidden h-fit rounded-lg bg-lighter-blue p-6 lg:block lg:basis-1/4'>
                      <h1 className='text-lg font-medium'>Table of Contents</h1>
                      {MarkdownTableOfContents({ content, postId })}
                    </div>
                  </div>
                </div>
              </div>
            </main>
        </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/blog`)
    const paginationResponse: ApiPaginationResponse<PostMetadata> = await res.json()
    const paths = paginationResponse.results.map((postMetadata) => ({ params: { postId: postMetadata.postId } }))
    return {
      paths,
      fallback: false
    }
  } catch {
    return {
      paths: [],
      fallback: false
    }
  }
}

export const getStaticProps: GetStaticProps<BlogPostProps> = async ({ params }) => {
  if (params == null) {
    return {
      redirect: {
        permanent: false,
        destination: BASE_URL + '/blog'
      }
    }
  }

  if (params.postId == null) {
    return {
      redirect: {
        permanent: false,
        destination: BASE_URL + '/blog'
      }
    }
  }

  const postId: string = Array.isArray(params.postId) ? params.postId[0] : params.postId
  const res = await fetch(`${BASE_URL}/api/blog/${postId}`)

  if (res.status >= 500) {
    const error: ApiFailResponse = await res.json()
    console.log(error)
    return {
      redirect: {
        permanent: false,
        destination: BASE_URL + '/blog'
      }
    }
  }

  const post: Post = await res.json()

  return {
    props: {
      postId,
      title: post.metadata.title,
      datePublished: post.metadata.datePublished.toString(),
      content: post.content,
      description: post.metadata.description ?? null
    }
  }
}
