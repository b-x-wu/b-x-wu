import NavBar from './navBar'
import Footer from './footer'
// import { useState } from 'react'
import useDarkMode from '@fisch0920/use-dark-mode'

interface LayoutProps {
  children: JSX.Element | JSX.Element[]
}

export default function Layout ({ children }: LayoutProps): JSX.Element {
  const darkMode = useDarkMode(false, {
    classNameDark: 'dark',
    classNameLight: 'light'
  })

  return (
    <div>
      <div className='relative min-h-screen bg-light-blue transition-all duration-300 dark:bg-darker-blue dark:text-light-gray'>
        <NavBar handleToggleDarkMode={(event) => { darkMode.toggle() }} isDarkMode={darkMode.value} />
        <main className="mx-auto max-w-6xl pb-36">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  )
}
