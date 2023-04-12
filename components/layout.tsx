import NavBar from './navBar'
import Footer from './footer'
import { useEffect, useState } from 'react'

interface LayoutProps {
  children: JSX.Element | JSX.Element[]
}

export default function Layout ({ children }: LayoutProps): JSX.Element {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false) // TODO: set to media default

  useEffect(() => {
    setIsDarkMode(false)
  }, [])

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className='relative min-h-screen bg-light-blue'>
        <NavBar handleToggleDarkMode={(event) => { setIsDarkMode(!isDarkMode) }} isDarkMode={isDarkMode} />
        <main className="mx-auto max-w-6xl pb-36">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  )
}
