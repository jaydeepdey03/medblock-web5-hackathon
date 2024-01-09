import DIDContextProvider from '@/context/Didcontext'
import '@/styles/globals.css'

export default function App({ Component, pageProps }) {

  return (
    <DIDContextProvider>
      <Component {...pageProps} />
    </DIDContextProvider>
  )
}
