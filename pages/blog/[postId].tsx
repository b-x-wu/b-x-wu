import { type GetStaticPaths, type GetStaticProps, type InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { BASE_URL } from '../../constants'
import { type ApiPaginationResponse, type ApiFailResponse, type Post, type PostMetadata } from '../../types/types'
import Link from 'next/link'

interface MarkdownJSXProps {
  text: string
}

interface BlogPostProps {
  title: string
  datePublished: string
  text: string
}

// TODO: move this to a components folder
function MarkdownJSX ({ text }: MarkdownJSXProps): JSX.Element {
  console.log(text)
  return (
        <ReactMarkdown
            components={{
              h1: ({ children }) => <h1 className="py-2 text-2xl font-bold">{children}</h1>,
              h2: ({ children }) => <h2 className="py-1 text-xl font-semibold">{children}</h2>,
              h3: ({ children }) => <h3 className="py-1 text-lg font-medium">{children}</h3>,
              h4: ({ children }) => <h4 className="py-1 text-lg">{children}</h4>,
              p: ({ children }) => <p>{children}</p>,
              img: ({ src, alt }) => <Image src={src ?? ''} alt={alt ?? ''} width={100} height={100} className="max-h-64 w-full justify-self-center p-3" />,
              ul: ({ children }) => <ul className="list-square pl-4">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal pl-4">{children}</ol>,
              a: ({ href, children }) => <Link href={href ?? '#'} className="text-sky-700 hover:underline" target="_blank" rel="noreferrer noopener">{children}</Link>,
              // Taken from https://github.com/remarkjs/react-markdown#use-custom-components-syntax-highlight
              code: ({ node, inline, className, children, ...props }) => {
                const match = /language-(\w+)/.exec(className ?? '')
                return (inline == null || !inline) && (match != null)
                  ? (
                        <SyntaxHighlighter
                            language={match[1]}
                            PreTag="div"
                        >
                            {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                    )
                  : (
                        <code className={className} {...props}>
                            {children}
                        </code>
                    )
              }
            }}
        >
            {text}
        </ReactMarkdown>
  )
}

export default function BlogPost ({ title, datePublished, text }: InferGetStaticPropsType<typeof getStaticProps>): JSX.Element {
  return (
        <>
            <Head>
                <title>{title + ' | brucexwu'}</title>
                <meta name="description" content={title} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="min-h-screen">
                <div className="m-6 flex flex-col gap-y-2 bg-gray-200 p-6">
                    {MarkdownJSX({ text })}
                </div>
            </main>
        </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/blog?limit=${Number.MAX_SAFE_INTEGER}`)
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
      title: post.metadata.title,
      datePublished: post.metadata.datePublished.toString(),
      text: post.content
    }
  }
}
