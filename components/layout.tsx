import NavBar from './navBar'
import Footer from './footer'
import { useState } from 'react'

interface LayoutProps {
  children: JSX.Element | JSX.Element[]
}

export default function Layout ({ children }: LayoutProps): JSX.Element {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false) // TODO: set to media default

  return (
    <>
      <body className={`relative min-h-screen bg-light-blue ${isDarkMode ? 'dark' : ''}`}>
        <NavBar handleToggleDarkMode={(event) => { setIsDarkMode(!isDarkMode) }} isDarkMode={isDarkMode} />
        <main>{children}</main>
        <Footer />
      </body>
    </>
  )
}
