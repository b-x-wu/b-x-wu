import Link from 'next/link'
import { Toggle } from './toggle'

interface NavBarProps {
  handleToggleDarkMode: React.MouseEventHandler
  isDarkMode: boolean
}

export default function NavBar ({ handleToggleDarkMode, isDarkMode }: NavBarProps): JSX.Element {
  return (
        <header className="sticky top-0 z-10 h-20 bg-blue text-dim-gray transition-all duration-300 dark:bg-darkest-blue dark:text-light-gray">
          <nav className="mx-auto max-w-6xl p-6">
            <div className="flex flex-row flex-wrap items-center justify-between gap-x-6 sm:h-10">
              {/* The logo */}
              <Link
                href="/"
                className="h-full text-2xl"
              >
                brucexwu
              </Link>
              {/* The hidden checkbox to open the menu with the links for smaller screens */}
              <input
                type="checkbox"
                className="peer sr-only"
                id="nav-hamburger"
              ></input>
              {/* The visible hamburger menu to open the menu for smaller screens */}
              {/* Adapted from https://flowbite.com/docs/components/navbar/#hamburger-menu */}
              <label
                htmlFor="nav-hamburger"
                className={
                  'inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg ' +
                  'sm:hidden ' +
                  'hover:bg-gray-300 ' +
                  'peer-checked:outline-none peer-checked:ring-2'
                }
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="h-6 w-6"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </label>
              {/* The links to other pages */}
              <div className={
                'hidden ' +
                'sm:flex sm:flex-row sm:gap-x-4 sm:items-center ' +
                'sm:peer-checked:flex-row sm:peer-checked:basis-0 sm:flex-grow sm:h-full ' +
                'peer-checked:flex peer-checked:flex-col peer-checked:basis-full '}>
                <div className='hover:underline'>
                  <Link
                    href="/"
                  >
                    Home
                  </Link>
                </div>
                <div className='hover:underline'>
                  <Link
                    href="/blog"
                  >
                    Blog
                  </Link>
                </div>
                <div className='hover:underline'>
                  <Link
                    href="/resume"
                  >
                    Resume/CV
                  </Link>
                </div>
              </div>
              <div className='hidden sm:block'>
                <Toggle
                  handleToggle={handleToggleDarkMode}
                  toggleCondition={isDarkMode}
                  // untoggledSymbol={{ type: 'text', text: 'Light' }}
                  untoggledSymbol={{ type: 'image', src: '/sun.svg', alt: 'Toggle Light Mode' }}
                  toggledSymbol={{ type: 'image', src: '/moon.svg', alt: 'Toggle Dark Mode' }}
                />
              </div>
            </div>
          </nav>
        </header>
  )
}
