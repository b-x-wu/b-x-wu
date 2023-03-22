import { type GetStaticPaths, type GetStaticProps, type InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { BASE_URL } from '../../constants'
import { type ApiPaginationResponse, type ApiFailResponse, type Post, type PostMetadata } from '../../types/types'
import Link from 'next/link'
import { type Node } from 'unist'
import { type Plugin, type Transformer, type Processor } from 'unified'
import rehypeSlug from 'rehype-slug'
import rehypeToc from 'rehype-toc'

interface MarkdownJSXProps {
  content: string
}

interface MarkdownTableOfContentsProps {
  content: string
  postId: string
}

interface BlogPostProps {
  postId: string
  title: string
  datePublished: string
  content: string
  description: string | null
}
interface HtmlNode extends Node {
  type: 'element'
  tagName: string
  properties?: Record<string, string | undefined>
  children?: Node[]
}

// TODO: move this to a components folder
function MarkdownJSX ({ content }: MarkdownJSXProps): JSX.Element {
  return (
        <ReactMarkdown
            components={{
              h1: ({ children }) => <h1 className="py-2 text-2xl font-bold">{children}</h1>,
              h2: ({ children }) => <h2 className="py-1 text-xl font-semibold">{children}</h2>,
              h3: ({ children }) => <h3 className="py-1 text-lg font-medium">{children}</h3>,
              h4: ({ children }) => <h4 className="py-1 text-lg">{children}</h4>,
              p: ({ children }) => <p>{children}</p>,
              img: ({ src, alt }) => <Image src={src ?? ''} alt={alt ?? ''} width={100} height={100} className="max-h-64 w-full justify-self-center p-3" />,
              ul: ({ children }) => <ul className="list-square pl-12">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal pl-12">{children}</ol>,
              a: ({ href, children }) => <Link href={href ?? '#'} className="text-dark-blue hover:underline" target="_blank" rel="noreferrer noopener">{children}</Link>,
              // FIXME: SyntaxHighlighter is slow in dev. Hopefully it's faster in prod? Yet to see.
              code: ({ node, inline, className, children, ...props }) => {
                const match = /language-(\w+)/.exec(className ?? '')
                return (inline == null || !inline) && (match != null)
                  ? (
                    <div className='flex-col'>
                      <div className='flex flex-row justify-between'>
                        <div></div>
                        <div className='rounded-t-md bg-glacier px-4 py-2 text-sm'>
                          {match[1]}
                        </div>
                      </div>
                      <div className='rounded-md bg-glacier'>
                          <SyntaxHighlighter
                              language={match[1]}
                              PreTag="div"
                              customStyle={{
                                margin: '0',
                                backgroundColor: '#00000000'
                              }}
                          >
                              {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        </div>
                      </div>
                    )
                  : (
                      <code className={className} {...props}>
                          {children}
                      </code>
                    )
              }
            }}
        >
            {content}
        </ReactMarkdown>
  )
}

function MarkdownTableOfContents ({ content, postId }: MarkdownTableOfContentsProps): JSX.Element {
  const extractPlugin: Plugin<any[], Node, Node> = (processor: Processor): Transformer => {
    const traverseTree = (node: Node): Node | null => {
      const parent = node as HtmlNode
      if (parent.properties?.className?.includes('toc') != null) {
        return parent
      }

      if (parent.children == null) { return null }

      for (const child of parent.children) {
        const foundNode = traverseTree(child)
        if (foundNode != null) { return foundNode }
      }

      return null
    }

    const transformer: Transformer<Node, Node> = (node: Node): Node => {
      const foundNode = traverseTree(node)
      if (foundNode == null) { return node }
      foundNode.type = 'root'
      return foundNode
    }
    return transformer
  }

  return <ReactMarkdown
      rehypePlugins={[rehypeSlug, [rehypeToc, {
        cssClasses: {
          listItem: 'my-2',
          link: 'hover:underline'
        }
      }], extractPlugin]}
    >
      {content}
    </ReactMarkdown>
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
                    <div className="mx-6 rounded-lg bg-lighter-blue p-6 lg:ml-6 lg:mr-3 lg:flex lg:basis-3/4 lg:flex-col lg:gap-y-2">
                        {MarkdownJSX({ content })}
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
