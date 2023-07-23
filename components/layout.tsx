import NavBar from './navBar'
import Footer from './footer'
import useDarkMode from '@fisch0920/use-dark-mode'
import { Titan_One, Share_Tech_Mono } from '@next/font/google'
import { createContext } from 'react'

const titanOne = Titan_One({
  subsets: ['latin'],
  variable: '--font-titan-one',
  weight: '400'
})

const shareTechMono = Share_Tech_Mono({
  subsets: ['latin'],
  variable: '--font-share-tech-mono',
  weight: '400'
})
interface LayoutProps {
  children: JSX.Element | JSX.Element[]
}

export const IsDarkModeContext = createContext<boolean>(false)

export default function Layout ({ children }: LayoutProps): JSX.Element {
  const darkMode = useDarkMode(false, {
    classNameDark: 'dark',
    classNameLight: 'light'
  })

  return (
    <IsDarkModeContext.Provider value={darkMode.value}>
      <div className={`${titanOne.variable} ${shareTechMono.variable}`}>
        <div className='relative min-h-screen bg-light-blue transition-all duration-300 dark:bg-darker-blue dark:text-light-gray'>
          <NavBar handleToggleDarkMode={(event) => { darkMode.toggle() }} isDarkMode={darkMode.value} />
          <main className="mx-auto max-w-6xl pb-36">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </IsDarkModeContext.Provider>
  )
}
