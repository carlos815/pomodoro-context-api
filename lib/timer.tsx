import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export enum Status {
    Pause = "pause",
    Play = "play",
    Stop = "stop",
    Ended = "ended",
    Start = "start" //The timer hasn't started yet
}


type timerType = {
    name: String,
    duration: number,
}

interface TimerTypes {
    [key: string]: timerType;
}

const timers: TimerTypes =
{
    pomodoro: {
        name: "Pomodoro",
        duration: 1500000
    },
    longBreak: {
        name: "Long break",
        duration: 600000
    },
    shortBreak: {
        name: "Short break",
        duration: 300000
    }
}



export type LocalStateContextType = {
    playPause: Function,
    reset: Function,
    skip: Function,
    now: number,
    status: Status,
    timeRemaining: number,
    endTime: number,
    timer: timerType
}

export const LocalStateContext = createContext<LocalStateContextType>({
    playPause: () => console.warn("no local state yet"),
    reset: () => console.warn("no local state yet"),
    skip: () => console.warn("no local state yet"),
    now: 0,
    status: Status.Start,
    timeRemaining: timers.pomodoro.duration,
    endTime: 0,
    timer: timers.pomodoro
});

export const LocalStateProvider = LocalStateContext.Provider;



export default function TimerProvider({ children }: { children: ReactNode }) {

    const [endTime, setEndTime] = useState(0)
    const [timeRemaining, setTimeRemaining] = useState(timers.pomodoro.duration)
    const [timer, setTimer] = useState(timers.pomodoro)
    const [now, setNow] = useState(0)
    const [status, setStatus] = useState<Status>(Status.Start)
    const [playlist, setPlaylist] = useState<timerType[]>([
        timers.pomodoro,
        timers.shortBreak,
        timers.pomodoro,
        timers.shortBreak,
        timers.pomodoro,
        timers.shortBreak,
        timers.pomodoro,
        timers.longBreak,
    ])
    //TODO: Localstorage. Use effect ot check if there's something in local storage,

    const playPause = () => {
        switch (status) {
            case Status.Play:
                setStatus(Status.Pause)
                setTimeRemaining(endTime - now)
                break
            case Status.Pause:
                setStatus(Status.Play)
                setEndTime(timeRemaining + now)
                break
            case (Status.Stop):
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
        setStatus(Status.Ended)
        setTimeRemaining(0)
    }

    const skip = () => {
        const _playlist = playlist;
        const _firstItem = _playlist[0]
        _playlist.shift()
        _playlist.push(_firstItem)
        const newTimer = _playlist[0]
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
            status,
            timeRemaining,
            endTime,
            timer
        }
    }>
        {children}</LocalStateProvider>
}

function useTimer() {
    const all = useContext(LocalStateContext);
    return all;
}

export { TimerProvider, useTimer };
