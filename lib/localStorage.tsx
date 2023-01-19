import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Status, timerType, TimerTypes } from './timer';

export type LocalStateContextType = {
    timerSettings: TimerTypes,
    setTimerSettings: Function,
    playlist: string[],
    setPlaylist: Function,
    timer: timerType,
    setTimer: Function,
    timeRemaining: number,
    setTimeRemaining: Function,
    status?: Status,
    setStatus: Function,
    endTime: number,
    setEndTime: Function
}
export const defaultTimers: TimerTypes =
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

const initialPlaylist = [
    "pomodoro",
    "shortBreak",
    "pomodoro",
    "shortBreak",
    "pomodoro",
    "shortBreak",
    "pomodoro",
    "longBreak",
]

export const LocalStateContext = createContext<LocalStateContextType>({
    timerSettings: defaultTimers,
    setTimerSettings: () => console.warn("no local state yet"),
    playlist: initialPlaylist,
    setPlaylist: () => console.warn("no local state yet"),
    timer: defaultTimers[initialPlaylist[0]],
    setTimer: () => console.warn("no local state yet"),
    timeRemaining: defaultTimers[initialPlaylist[0]].duration,
    setTimeRemaining: () => console.warn("no local state yet"),
    setStatus: () => console.warn("no local state yet"),
    endTime: 0,
    setEndTime: () => console.warn("no local state yet")
});

export const LocalStorageStateProvider = LocalStateContext.Provider;

export default function LocalStorageProvider({ children }: { children: ReactNode }) {
    const [timerSettingsStored, setTimerSettingsStored] = useLocalStorage("timers", defaultTimers)
    const [timerSettings, _setTimerSettings] = useState<TimerTypes>(defaultTimers)
    const setTimerSettings = (timerSettings: TimerTypes) => {
        setTimerSettingsStored(timerSettings)
        _setTimerSettings(timerSettings)
    }

    const [playlistStored, setPlaylistStored] = useLocalStorage("playlist", initialPlaylist)
    const [playlist, _setPlaylist] = useState<string[]>(initialPlaylist)
    const setPlaylist = (playlist: string[]) => {
        setPlaylistStored(playlist)
        _setPlaylist(playlist)
    }

    const [timerStored, setTimerStored] = useLocalStorage("timer", timerSettings[playlist[0]])
    const [timer, _setTimer] = useState<timerType>(timerSettings[playlist[0]])
    const setTimer = (timer: timerType) => {
        setTimerStored(timer)
        _setTimer(timer)
    }

    const [timeRemainingStored, setTimeRemainingStored] = useLocalStorage("timeRemaining", timer.duration)
    const [timeRemaining, _setTimeRemaining] = useState<number>(timer.duration)
    const setTimeRemaining = (timeRemaining: number) => {
        setTimeRemainingStored(timeRemaining)
        _setTimeRemaining(timeRemaining)
    }

    const [statusStored, setStatusStored] = useLocalStorage("status", Status.Start)
    const [status, _setStatus] = useState<Status>(Status.Start)
    const setStatus = (status: Status) => {
        setStatusStored(status)
        _setStatus(status)
    }

    const [endTimeStored, setEndTimeStored] = useLocalStorage("endTime", 0)
    const [endTime, _setEndTime] = useState<number>(0)
    const setEndTime = (endTime: number) => {
        setEndTimeStored(endTime)
        _setEndTime(endTime)
    }

    //initializing all the variables with their LocalStorage counterparts.
    useEffect(() => {
        _setTimerSettings(timerSettingsStored)
        _setPlaylist(playlistStored)
        _setTimer(timerStored)
        _setTimeRemaining(timeRemainingStored)
        _setStatus(statusStored)
        _setEndTime(endTimeStored)
    }, [])

    return <LocalStorageStateProvider value={
        {
            timerSettings, setTimerSettings, playlist, setPlaylist, timer, setTimer, timeRemaining, setTimeRemaining, status, setStatus, endTime, setEndTime
        }
    }>
        {children}</LocalStorageStateProvider>
}

function useLocalStorageState() {
    const all = useContext(LocalStateContext);
    return all;
}

export { LocalStorageProvider, useLocalStorageState };

//Custom hook to use the localStorage easily
const useLocalStorage = (key: string, initialValue: any) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (err) {
            console.error(err);
            return initialValue;
        }
    });

    const setValue = (value: any) => {
        try {
            const valueToStore =
                value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (err) {
            console.error(err);
        }
    };

    return [storedValue, setValue];
};

export { useLocalStorage };
