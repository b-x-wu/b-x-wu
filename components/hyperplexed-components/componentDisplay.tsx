/* eslint-disable tailwindcss/no-custom-classname */
import type React from 'react'
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx'

SyntaxHighlighter.registerLanguage('tsx', tsx)

interface ComponentDisplayProps {
  width: string | number
  height: string | number
  children: React.ReactNode
  codeText?: string
  containerStyle?: React.CSSProperties
  title?: string
  titleHref?: string
  titleStyle?: React.CSSProperties
}

export const ComponentDisplay = ({
  width,
  height,
  children,
  containerStyle,
  codeText,
  title,
  titleStyle = {},
  titleHref
}: ComponentDisplayProps): JSX.Element => {
  const widthString = typeof width === 'string' ? width : `${width}px`
  const heightString = typeof height === 'string' ? height : `${height}px`

  const titleNode = title == null
    ? <></>
    : titleHref == null
      ? <h2 style={titleStyle} className={`w-[${widthString}]`}>{title}</h2>
      : <h2 style={titleStyle} className={`w-[${widthString}]`}><a href={titleHref} target="_blank" className="hover:underline" rel="noreferrer">{title}</a></h2>

  return (
        <div className="flex flex-col items-center gap-y-3">
            {
                titleNode ?? <></>
            }
            <div style={{ width: widthString, height: heightString, margin: 0, ...containerStyle }}>
                {children}
            </div>
            {
                codeText == null
                  ? <></>
                  : <SyntaxHighlighter language="tsx" style={materialDark} customStyle={{ width: widthString, height: heightString, margin: 0, ...containerStyle }} wrapLongLines={true}>
                    {codeText}
                </SyntaxHighlighter>
            }
        </div>
  )
}
