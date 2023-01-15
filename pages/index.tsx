import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'
import { Status, useTimer } from '../lib/timer'
import { useEffect, useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const { playPause,
    reset,
    skip, now, status, timeRemaining, endTime, timer } = useTimer()

  const onScreenTime = status == Status.Play ? endTime - now : timeRemaining

  const statusIndicator = () => {
    switch (status) {
      case Status.Start:
        return "-- "
      case Status.Play:
        return "⯈"
      case Status.Pause:
        return "❙❙"
      case Status.Stop:
        return "◼"
      case Status.Ended:
        return "✓"
      default:
        return "--"
    }
  }

  const mainButtonText = () => {
    switch (status) {
      case Status.Start:
        return "Start"
      case Status.Play:
        return "Pause"
      case Status.Pause:
        return "Continue"
      case Status.Stop:
        return "Start"
      case Status.Ended:
        return "Next"
      default:
        return "--"
    }
  }


  return (
    <>
      <Head>
        <title>Pomodoro Timer</title>
        <meta name="description" content="This is a pomodoro timer made with Context API" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h2>{timer.name}</h2>
        <h1 className={styles.timer}>{getMinutes(onScreenTime)} : {getSeconds(onScreenTime)}</h1>
        <h2>{statusIndicator()}</h2>
        <div className={styles.buttons}>
          <button className={`${styles.mainButton} ${status == Status.Play && styles.mainButtonNegative}`} onClick={playPause}>{mainButtonText()}</button>
          <div className={styles.secondaryButtons}> <button className={styles.button} onClick={reset} disabled={status == Status.Stop}>Reset</button>
            <button className={styles.button} onClick={skip}>Skip</button></div>

        </div>

      </main>
    </>
  )
}


const minDigits = (numStr: String, digits: Number) => {
  while (numStr.length < digits) {
    numStr = '0' + numStr
  }
  return numStr
}

const getMinutes = (timeStamp: number, digits = 2): String => {
  return minDigits((Math.floor((timeStamp) / 1000 / 60 % 60)).toString(), digits)
}

const getSeconds = (timeStamp: number, digits = 2): String => {
  return minDigits((Math.floor((timeStamp) / 1000 % 60)).toString(), digits)
}