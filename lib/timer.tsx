import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import useAudio from "./useAudio"
import { displayNotification, requestNotificationPermission } from "./notifications"
import { useLocalStorageState } from './localStorage';
import { Status, timerType } from '../shared/types';

export type LocalStateContextType = {
    playPause: Function,
    reset: Function,
    skip: Function,
    now: number,
}

export const LocalStateContext = createContext<LocalStateContextType>({
    playPause: () => console.warn("no local state yet"),
    reset: () => console.warn("no local state yet"),
    skip: () => console.warn("no local state yet"),
    now: 0,
});

export const LocalStateProvider = LocalStateContext.Provider;

export default function TimerProvider({ children }: { children: ReactNode }) {

    const [now, setNow] = useState(0)
    const { timerSettings, playlist, setPlaylist, timer, setTimer, timeRemaining, setTimeRemaining, status, setStatus, endTime, setEndTime } = useLocalStorageState()

    const { playAudio: playAlarm, stopAudio: stopAlarm, audio } = useAudio(
        "/alarm.ogg"
    );

    const playPause = () => {
        requestNotificationPermission()
        switch (status) {
            case Status.Play:
                setStatus(Status.Pause)
                setTimeRemaining(endTime - now)
                break
            case Status.Pause:
                setStatus(Status.Play)
                setEndTime(timeRemaining + now)
                break
            case (Status.Start):
                setEndTime(timeRemaining + now)
                setStatus(Status.Play)
                break
            case Status.Ended:
                skip()
                break
            default:
                console.error("Play status not recognized")
        }
    }

    const reset = () => {
        setStatus(Status.Start)
        setTimeRemaining(timer.duration)
    }

    const ended = () => {
        playAlarm()
        setStatus(Status.Ended)
        displayNotification(`${timer.name} ended.`, { body: "You are doing great!" })
        setTimeRemaining(0)
    }

    const skip = () => {
        //Sending the first item in the playlist to the last spot 
        const _playlist = playlist;
        const _firstItem = _playlist[0]
        _playlist.shift()
        _playlist.push(_firstItem)
        const newTimer = timerSettings[_playlist[0]]
        setPlaylist(_playlist)
        setUpNewTimer(newTimer)
    }

    const setUpNewTimer = (newTimer: timerType) => {
        setTimer(newTimer)
        setTimeRemaining(newTimer.duration)
        setStatus(Status.Start)
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setNow(Date.now())
        }, 250)
        return () => clearInterval(interval)
    }, [])


    useEffect(() => {
        //This stops the alarm when you click anywhere or change to the tab with the timer
        if (audio) {
            document.addEventListener('visibilitychange', function () {
                if (document.visibilityState === 'visible') {
                    stopAlarm()
                }
            })
            document.addEventListener('click', function () {
                stopAlarm()
            })
        }
    }, [audio])

    useEffect(() => {
        //This is a listener of sorts. When it notices that the timer reaches zero, it sends the ended function which sounds the alarm
        if (status == Status.Play && (endTime - now) < 0) {
            ended()
        }
    }, [now])

    return <LocalStateProvider value={
        {
            playPause,
            reset,
            skip,
            now,
        }
    }>
        {children}</LocalStateProvider>
}

function useTimer() {
    const all = useContext(LocalStateContext);
    return all;
}

export { TimerProvider, useTimer };
