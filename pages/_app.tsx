import '../styles/globals.css'
import type { AppProps } from 'next/app'
import TimerProvider from "../lib/timer"

export default function App({ Component, pageProps }: AppProps) {
  return <TimerProvider>
    <Component {...pageProps} />
  </TimerProvider>
}
