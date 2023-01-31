import React from 'react'
import { type GetStaticPaths, type GetStaticProps, type InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { BASE_URL } from '../../constants'
import { type ApiFailResponse, type Post } from '../../types/types'
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
              h1: ({ children }) => <h1 className="text-2xl font-bold py-2">{children}</h1>,
              h2: ({ children }) => <h2 className="text-xl font-semibold py-1">{children}</h2>,
              h3: ({ children }) => <h3 className="text-lg font-medium py-1">{children}</h3>,
              h4: ({ children }) => <h4 className="text-lg py-1">{children}</h4>,
              p: ({ children }) => <p>{children}</p>,
              img: ({ src, alt }) => <Image src={src ?? ''} alt={alt ?? ''} width={100} height={100} className="w-full max-h-64 p-3 justify-self-center" />,
              ul: ({ children }) => <ul className="list-square pl-4">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal pl-4">{children}</ol>,
              a: ({ href, children }) => <Link href={href ?? '#'} className="hover:underline text-sky-700" target={'_blank'} rel={'noreferrer noopener'}>{children}</Link>,
              // Taken from https://github.com/remarkjs/react-markdown#use-custom-components-syntax-highlight
              code: ({ node, inline, className, children, ...props }) => {
                const match = /language-(\w+)/.exec(className ?? '')
                return inline != null && inline && (match != null)
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
            <main className={'min-h-screen'}>
                <div className="flex flex-col gap-y-2 m-6 p-6 bg-gray-200">
                    {MarkdownJSX({ text })}
                </div>
            </main>
        </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/posts`)
    const postDatas: Post[] = await res.json()
    const paths = postDatas.map((postData) => ({ params: { postId: postData.postId } }))
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
  const res = await fetch(`${BASE_URL}/api/posts/${postId}`)

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
      title: post.title,
      datePublished: post.datePublished.toString(),
      text: post.content
    }
  }
}
