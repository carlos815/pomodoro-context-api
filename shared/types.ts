export enum Status {
    Pause = "pause",
    Play = "play",
    Ended = "ended",
    Start = "start" //The timer hasn't started yet
}

export interface TimerTypes {
    [key: string]: timerType;
}

export type timerType = {
    name: String,
    duration: number,
}