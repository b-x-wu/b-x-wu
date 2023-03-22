import { type Node } from 'unist'
import { type Plugin, type Transformer, type Processor } from 'unified'
import rehypeSlug from 'rehype-slug'
import rehypeToc from 'rehype-toc'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'

interface MarkdownTableOfContentsProps {
  content: string
  postId: string
}

interface HtmlNode extends Node {
  type: 'element'
  tagName: string
  properties?: Record<string, string | undefined>
  children?: Node[]
}

export default function MarkdownTableOfContents ({ content, postId }: MarkdownTableOfContentsProps): JSX.Element {
  const extractPlugin: Plugin = (processor: Processor): Transformer => {
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
