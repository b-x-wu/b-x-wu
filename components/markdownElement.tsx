import { ReactMarkdown } from 'react-markdown/lib/react-markdown'
import Image from 'next/image'
import Link from 'next/link'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'

interface MarkdownElementProps {
  content: string
}

export default function MarkdownElement ({ content }: MarkdownElementProps): JSX.Element {
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
                  <div className='my-2 flex flex-col'>
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
