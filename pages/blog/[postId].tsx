import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next"
import Head from "next/head"
import { BASE_URL } from "../../constants"
import { Post } from "../.."

interface MarkdownJSXProps {
    text: string
}

interface BlogPostProps {
    title: string
    datePublished: string
    text: string
}

// TODO: move this to a components folder
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
                <title>{title + ' | brucexwu'}</title>
                <meta name="description" content={title} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={"min-h-screen"}>
                {MarkdownJSX({ text: title })}
            </main>
        </>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    try {
        const res = await fetch(BASE_URL + '/api/posts')
        const postDatas: Post[] = await res.json()
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

    const res = await fetch(BASE_URL + '/api/posts/' + params.postId)
    const postData: Post = await res.json()
    
    return {
        props: {
            title: postData.title,
            datePublished: (postData.datePublished).toString(),
            text: postData.text
        }
    }
}
