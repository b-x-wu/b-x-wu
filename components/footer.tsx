import Link from 'next/link'
import ContactButton from './contactButton'

export default function Footer (): JSX.Element {
  return (
        <footer className="absolute bottom-0 h-36 w-full bg-blue text-dim-gray transition-all duration-300 dark:bg-darkest-blue dark:text-light-gray">
          <div className="mx-auto p-6">
            <div className="text-center">
              Let&apos;s chat!
            </div>
            <div className="mx-auto grid w-64 grid-cols-3 justify-items-center p-4">
              <ContactButton
                platform="Twitter"
                href="https://twitter.com/bruce_x_wu"
                imageSrc="/twitter-logo.svg"
              />
              <ContactButton
                href="https://github.com/bruce-x-wu"
                platform="GitHub"
                imageSrc='/github-logo.svg'
              />
              <ContactButton
                platform="LinkedIn"
                href="https://www.linkedin.com/in/bruce-x-wu/"
                imageSrc="/linkedin-logo.svg"
              />
            </div>
            <p className="text-center text-xs">
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
  )
}
