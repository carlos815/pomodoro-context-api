import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'
import { ChangeEvent, ChangeEventHandler, FormEvent, useEffect, useRef, useState } from 'react'
import GearIcon from "../public/gear.svg"
import BaseModal from '../components/baseModal'
import { requestNotificationPermission } from '../lib/notifications'
import { SettingsModal } from '../components/settingsModal'
import { useLocalStorageState } from '../lib/localStorage'
import { useTimer } from '../lib/timer'
import { Status } from '../shared/types'
const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const { playPause,
    reset,
    skip, now, } = useTimer()

  const { status, timeRemaining, endTime, timer } = useLocalStorageState()

  const onScreenTime = status == Status.Play ? endTime - now : timeRemaining

  const statusIndicator = () => {
    switch (status) {
      case Status.Start:
        return "-- "
      case Status.Play:
        return "⯈"
      case Status.Pause:
        return "❙❙"
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
      case Status.Ended:
        return "Next"
      default:
        return "--"
    }
  }

  const settingsDialogRef = useRef<null | HTMLDialogElement>()

  useEffect(() => {
    settingsDialogRef?.current?.addEventListener('mousedown', function (event) {
      var rect = settingsDialogRef?.current?.getBoundingClientRect();
      if (rect) {
        var isInDialog = (rect.top <= event.clientY && event.clientY <= rect.top + rect.height
          && rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
        if (!isInDialog) {
          settingsDialogRef?.current?.close();
        }
      }
    });
  }, [])


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
        <h1 className={`${styles.timer} ${status == Status.Ended && styles.blinking}`}>{getMinutes(onScreenTime)} : {getSeconds(onScreenTime)}</h1>
        <h2>{statusIndicator()}</h2>
        <div className={styles.buttons}>
          <button className={`${styles.mainButton} ${status == Status.Play && styles.mainButtonNegative}`} onClick={() => { playPause() }}>{mainButtonText()}</button>
          <div className={styles.secondaryButtons}> <button className={styles.button} onClick={() => { reset() }} disabled={status == Status.Start}>Reset</button>
            <button className={styles.button} onClick={() => { skip() }}>Skip</button></div>
        </div>
        <button className={styles.settingsButton} onClick={() => settingsDialogRef.current?.showModal()
        } >
          <GearIcon />
        </button>
      </main>
      <BaseModal dialogRef={settingsDialogRef} title='Settings'>
        <SettingsModal dialogRef={settingsDialogRef} />
      </BaseModal>
    </>
  )
}

function LabeledInput({
  htmlFor,
  label,
  name,
  placeholder,
  value,
  onChange,
  type = "text",
}: {
  name: string,
  value: string,
  onChange: ChangeEventHandler<HTMLInputElement>,
  htmlFor?: string,
  label?: string,
  placeholder?: string,
  type?: string
}) {
  return <label htmlFor={htmlFor ?? name} className="">
    <div className="">{label ?? name}</div>
    <input
      type={type ?? "text"}
      name={name}
      placeholder={placeholder ?? label ?? name}
      autoComplete={name ?? name}
      value={value}
      onChange={onChange}
      className="" />
  </label>
}


const minDigits = (numStr: String, digits: Number) => {
  while (numStr.length < digits) {
    numStr = '0' + numStr
  }
  return numStr
}

const getMinutes = (timeStamp: number, digits = 2): String => {
  return minDigits((Math.floor((timeStamp) / 1000 / 60 % 99)).toString(), digits)
}

const getSeconds = (timeStamp: number, digits = 2): String => {
  return minDigits((Math.floor((timeStamp) / 1000 % 60)).toString(), digits)
}