import { TimerTypes } from "./types"

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

export const initialPlaylist = [
    "pomodoro",
    "shortBreak",
    "pomodoro",
    "shortBreak",
    "pomodoro",
    "shortBreak",
    "pomodoro",
    "longBreak",
]
