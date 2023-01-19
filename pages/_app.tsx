import '../styles/globals.css'
import type { AppProps } from 'next/app'
import TimerProvider from "../lib/timer"
import { useEffect } from 'react'
import LocalStorageProvider from '../lib/localStorage'

export default function App({ Component, pageProps }: AppProps) {
  return <LocalStorageProvider>
    <TimerProvider>
      <Component {...pageProps} />
    </TimerProvider>
  </LocalStorageProvider>
}
