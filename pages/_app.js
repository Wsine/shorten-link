import { Rubik } from 'next/font/google'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'

const rubik = Rubik({ subsets: ['latin'] })

export const theme = extendTheme({
  useSystemColorMode: true,
  fonts: {
    heading: 'var(--font-rubik)',
    body: 'var(--font-rubik)',
  }
})

export default function App({ Component, pageProps }) {
  return (
    <>
      <style jsx global>
        {`
          :root {
            --font-rubik: ${rubik.style.fontFamily};
          }
        `}
      </style>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </>
  )
}
