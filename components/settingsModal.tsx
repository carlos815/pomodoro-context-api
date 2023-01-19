import { FormEvent, useEffect, useState } from "react"
import { defaultTimers, useLocalStorageState } from "../lib/localStorage"

import styles from "./settingsModal.module.css"

export const SettingsModal = ({ dialogRef }: { dialogRef: any }) => {
    const { timerSettings, setTimerSettings } = useLocalStorageState()
    const [localTimerSettings, _setLocalTimerSettings] = useState(timerSettings)

    //This is not saved in local state until the user presses teh Save changes button
    const setLocalTimerSettings = (id: string, duration: number) => {
        let updatedLocalTimerSettings = JSON.parse(JSON.stringify(localTimerSettings));
        updatedLocalTimerSettings[id].duration = duration
        _setLocalTimerSettings(updatedLocalTimerSettings)
    }

    const resetValues = () => {
        _setLocalTimerSettings(timerSettings)
        console.log(localTimerSettings)
    }

    useEffect(() => {
        resetValues()
    }, [dialogRef.current?.open])

    const handleSubmit = (e: any) => {
        e.preventDefault()
        setTimerSettings(localTimerSettings)
        dialogRef?.current?.close();
    }

    return <form method="POST" onSubmit={handleSubmit} className={styles.settingsModal} >
        <fieldset className="" >
            <TimerForm label="Pomodoro" id="pomodoro" onChange={setLocalTimerSettings} ms={localTimerSettings.pomodoro.duration} />
            <TimerForm label="Short break" id="shortBreak" onChange={setLocalTimerSettings} ms={localTimerSettings.shortBreak.duration} />
            <TimerForm label="Long break" id="longBreak" onChange={setLocalTimerSettings} ms={localTimerSettings.longBreak.duration} />
        </fieldset>
        <button className={styles.mainButton}>Save changes</button>
    </form>
}

const TimerForm = ({ label, onChange, ms, id }: { label: String, onChange: Function, ms: number, id: String }) => {

    const getMinutesFromMs = (_ms: number) => Math.floor(_ms / 60000)
    const getSecondsFromMs = (_ms: number) => _ms % 60000 / 1000
    const [minutes, setMinutes] = useState(0)
    const [seconds, setSeconds] = useState(0)

    useEffect(() => {
        setMinutes(getMinutesFromMs(ms))
        setSeconds(getSecondsFromMs(ms))
    }, [ms])

    const handleSecondsChange = async (e: FormEvent<HTMLInputElement>) => {
        const value = parseInt(e.currentTarget.value)
        if (value > 59 || value < 0) return
        setSeconds(value)
        onChange(id, value * 1000 + minutes * 60000)
    }

    const handleMinutesChange = async (e: FormEvent<HTMLInputElement>) => {
        const value = parseInt(e.currentTarget.value)
        if (value > 99 || value < 0) return
        setMinutes(value)
        onChange(id, seconds * 1000 + value * 60000)
    }

    return <div className={styles.timerForm}>
        <h2>{label}</h2>
        <div className={styles.inputs}>
            <div className={styles.input}>
                <label htmlFor={`${label} minutes`} >
                    <h3>Minutes</h3>
                </label>
                <input type="number" name="Minutes" id={`${label} minutes`} value={minutes} onChange={handleMinutesChange} />
            </div>
            <div className={styles.input}>
                <label htmlFor={`${label} seconds`} >
                    <h3>Seconds</h3>
                </label>
                <input type="number" name="Seconds" id={`${label} seconds`} value={seconds} onChange={handleSecondsChange} />
            </div>
        </div>
    </div>
}

