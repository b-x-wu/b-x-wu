import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <nav className="mx-auto p-6 bg-gray-100">
          <div className="flex flex-row justify-between items-center flex-wrap">
            {/* The logo */}
            <div className="text-2xl">
              brucexwu
            </div>
            {/* The hidden checkbox to open the menu with the links for smaller screens */}
            <input
              type={"checkbox"}
              className="hidden peer"
              id="nav-hamburger"
            ></input>
            {/* The visible hamburger menu to open the menu for smaller screens */}
            {/* Adapted from https://flowbite.com/docs/components/navbar/#hamburger-menu */}
            <label
              htmlFor="nav-hamburger"
              className="sm:hidden inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg hover:bg-gray-300 peer-checked:outline-none peer-checked:ring-2"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </label>
            {/* The links to other pages */}
            {/* TODO: add the links and hrefs and change to Link components */}
            <div className="hidden peer-checked:flex peer-checked:flex-col peer-checked:basis-full sm:flex sm:flex-row sm:gap-x-4 sm:items-center">
              <div>
                <a>
                  Home
                </a>
              </div>
              <div>
                <a>
                  Blog
                </a>
              </div>
              <div>
                <a>
                  Resume/CV
                </a>
              </div>
            </div>
          </div>
        </nav>
        <Main />
        <NextScript />
        <footer>
          {/* TODO: fix this footer */}
          Contact Me
        </footer>
      </body>
    </Html>
  );
}
