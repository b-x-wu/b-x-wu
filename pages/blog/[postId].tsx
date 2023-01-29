import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next"
import Head from "next/head"

interface MarkdownJSXProps {
    text: string
}

interface BlogPostProps {
    title: string
    datePublished: string
    text: string
}

// TODO: this is in three places
type PostData = {
    id: string
    title: string
    datePublished: Date
    description?: string
    text: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

function MarkdownJSX({ text }: MarkdownJSXProps) {
    return (
        <>
            Markdown to JSX: {text}
        </>
    )
}

export default function BlogPost({ title, datePublished, text }: InferGetStaticPropsType<typeof getStaticProps>) {
    return (
        <>
            <Head>
                <title>{title as string + ' | brucexwu'}</title>
                {/* TODO: in the end this probably won't be the same as the id in the url */}
                <meta name="description" content={title as string} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="preload" href={"/api/blog_post?postId=" + title} as="fetch" crossOrigin="anonymous"></link>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={"min-h-screen"}>
                {MarkdownJSX({ text: title as string })}
            </main>
        </>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    try {
        // TODO: move this to a constants file
        const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_BASE_URL : 'http://localhost:3000'
        const res = await fetch(BASE_URL + '/api/posts')
        const postDatas: PostData[] = await res.json()
        const paths = postDatas.map((postData) => ({ params: { postId: postData.id } }))
        return {
            paths: paths,
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
        return { props: { title: "", datePublished: "", text: "" }}
    }

    const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_BASE_URL : 'http://localhost:3000'
    const res = await fetch(BASE_URL + '/api/posts/' + params.postId)
    const postData: PostData = await res.json()
    
    return {
        props: {
            title: postData.title,
            datePublished: (postData.datePublished).toString(),
            text: postData.text
        }
    }
}
