import { Html, Head, Main, NextScript } from 'next/document'
import Link from 'next/link'
import Image from 'next/image'

interface ContactButtonProps {
  platform: string
  href: string
  imageSrc: string
}

function ContactButton ({ platform, href, imageSrc }: ContactButtonProps): JSX.Element {
  return (
    <Link
      href={href}
      aria-label={platform}
      target="_blank"
      rel="noreferrer noopener"
      className="h-6 w-6"
    >
      <Image
        src={imageSrc}
        width={100}
        height={100}
        alt={platform}
        className="h-full w-full object-contain brightness-0"
      />
    </Link>
  )
}

export default function Document (): JSX.Element {
  return (
    <Html lang="en">
      <Head />
      <body>
        <header className="sticky top-0 z-10 bg-gray-100">
          <nav className="mx-auto max-w-6xl p-6">
            <div className="flex flex-row flex-wrap items-center justify-between">
              {/* The logo */}
              <Link
                href="/"
                className="text-3xl"
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
                'sm:peer-checked:flex-row sm:peer-checked:basis-0 ' +
                'peer-checked:flex peer-checked:flex-col peer-checked:basis-full '}>
                <div>
                  <Link
                    href="/"
                  >
                    Home
                  </Link>
                </div>
                <div>
                  <Link
                    href="/blog"
                  >
                    Blog
                  </Link>
                </div>
                <div>
                  <Link
                    href="/resume"
                  >
                    Resume/CV
                  </Link>
                </div>
              </div>
            </div>
          </nav>
        </header>
        <div className='mx-auto max-w-6xl'>
          <Main />
        </div>
        <NextScript />
        <footer className="bottom-0 mt-auto flex h-36 bg-gray-100">
          <div className="m-auto p-6">
            <div className="text-center">
              Let&apos;s chat!
            </div>
            <div className="mx-auto grid w-64 grid-cols-3 justify-items-center p-4">
              <ContactButton
                platform="Twitter"
                href="https://twitter.com/bruce_x_wu"
                imageSrc="https://upload.wikimedia.org/wikipedia/commons/4/4f/Twitter-logo.svg"
              />
              <ContactButton
                platform="GitHub"
                href="https://github.com/bruce-x-wu"
                imageSrc="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg"
              />
              <ContactButton
                platform="LinkedIn"
                href="https://www.linkedin.com/in/bruce-x-wu/"
                imageSrc="https://raw.githubusercontent.com/uditkumar489/Icon-pack/44e9bfd92c879c063dadb83851aef6b347ea0ce8/Social%20media/Die%20cut%20-%20transparent/svg/027-linkedin.svg"
              />
            </div>
            <p className="text-center text-xs opacity-50">
              <Link
                href="mailto:wu.bruce.x@gmail.com"
                aria-label="Email"
                target="_blank"
                rel="noreferrer noopener"
              >
                wu.bruce.x@gmail.com
              </Link> © Bruce Wu. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </Html>
  )
}
