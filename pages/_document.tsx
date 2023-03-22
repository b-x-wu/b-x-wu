import { Html, Head, Main, NextScript } from 'next/document'
import NavBar from '../components/navBar'
import Footer from '../components/footer'

export default function Document (): JSX.Element {
  return (
    <Html lang="en">
      <Head />
      <body className='relative min-h-screen bg-light-blue'>
        <NavBar />
        <Main />
        <Footer />
        <NextScript />
      </body>
    </Html>
  )
}
