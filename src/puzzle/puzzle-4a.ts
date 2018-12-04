
import Puzzle from './puzzle'
import * as _ from 'lodash'

enum GuardState {
    Arrived = "Arrived",
    Awake = "Awake",
    Asleep = "Asleep"
}

function textToGuardState(text: string): GuardState {
    switch (text) {
        case 'falls asleep':
            return GuardState.Asleep;
        case 'wakes up':
            return GuardState.Awake;
    }
    if (-1 !== text.indexOf('begins shift')) {
        return GuardState.Arrived;
    }
    throw `Invalid state: ${text}`;
}

function textToGuardId(text: string): number {

    // Guard #10 begins shift
    const BeginsShiftRegex = 'Guard #([0-9]+) begins shift';
    const regexEval = new RegExp(BeginsShiftRegex);
    const matches = regexEval.exec(text);
    if (matches === null) {
        return -1;
    }
    if (matches.length !== 2) {
        throw `Matched expression, but not correctly: ${text}`;
    }

    return parseInt(matches[1]);
}

class GuardEvent {
    constructor(public id: number, public month: number, public day: number,
        public hours: number, public minute: number, public state: GuardState) {
    }
}

function findMaxMinute(guardEventsAll: GuardEvent[], guardId: number) {

    let guardEvents = guardEventsAll.filter(guardEvent => guardEvent.id === guardId);
    guardEvents = _.sortBy(guardEvents, ["month", "day", "minute"]);

    let sleepPerMinute = new Array<number>(60);
    sleepPerMinute.fill(0);
    let beganAt = 0;
    let lastGuardId = -1;
    guardEvents.forEach(guardEvent => {
        const currentGuardId = guardEvent.id === -1 ? lastGuardId : guardEvent.id;
        console.log(JSON.stringify(guardEvent));
        switch (guardEvent.state) {
            case GuardState.Arrived:
                lastGuardId = currentGuardId;
                // Add on the remaining minutes before 1am.
                for (let i = beganAt; i < 60; i++) {
                    sleepPerMinute[i]++;
                }
                beganAt = guardEvent.minute;
                break;
            case GuardState.Asleep:
                for (let i = beganAt; i < guardEvent.minute; i++) {
                    sleepPerMinute[i]++;
                }
                break;
            case GuardState.Awake:
                beganAt = guardEvent.minute;
                break;
        }
    });

    // Hopefully there is one sleep per minute that is larger than the rest.
    let maxMinute = 0;
    let maxMinuteOffset = 0;
    let maxMinuteCount = 0;
    for (let i = 0; i < 60; i++) {
        const thisMinute = sleepPerMinute[i];
        if (thisMinute > maxMinute) {
            maxMinuteCount = 1;
            maxMinute = sleepPerMinute[i];
            maxMinuteOffset = i;
        }
        else if (thisMinute === maxMinute) {
            maxMinuteCount++;
        }
    }
    if (maxMinuteCount !== 1) {
        throw 'More than one found'
    }
    return maxMinuteOffset;
}


export default class Puzzle1a extends Puzzle {
    constructor() {
        super("4a: Sleepy guards");
    }

    solve() {
        const lines = this.readLines('./data/4');

        // [1518-11-01 00:05] xyz abc
        const DateAndActionRegex = `\\[1518-([0-9][0-9])-([0-9][0-9]) ([0-9][0-9]):([0-9][0-9])\\] (.+)`;

        let guardEvents = new Array<GuardEvent>();
        lines.forEach(line => {

            const regexEval = new RegExp(DateAndActionRegex);
            const matches = regexEval.exec(line);
            if (matches === null) {
                throw `Invalid: ${line}`;
            }
            if (matches.length !== 6) {
                throw `Line matched expression, but not correctly: ${line}`;
            }
            const month = parseInt(matches[1]);
            let day = parseInt(matches[2]);
            let hours = parseInt(matches[3]);
            let minutes = parseInt(matches[4]);
            const action = matches[5];

            const state = textToGuardState(action);
            const guardId = textToGuardId(action);

            if (hours === 23 && state === GuardState.Arrived) {
                hours = 0;
                minutes = 0;
                day++;
            }
            if (state === GuardState.Arrived) {
                // Correct the minutes if they came early.
                // The day won't matter since it's only used in ordering.
                minutes = 0;
            }

            guardEvents.push(new GuardEvent(guardId, month, day, hours, minutes, state));
        })

        // Sort the guard events by guardId then date and time
        guardEvents = _.sortBy(guardEvents, ["month", "day", "minute"]);
        let lastGuardId = -1;
        guardEvents.forEach(guardEvent => {
            if (guardEvent.state === GuardState.Arrived) {
                lastGuardId = guardEvent.id;
            }
            else {
                guardEvent.id = lastGuardId;
            }
        });

        // Sum up the minutes per guard
        let minutesPerGuard = new Map<number, number>();
        let totalThisNight = 0;
        lastGuardId = -1;
        let beganAt = -1;
        guardEvents.forEach(guardEvent => {
            switch (guardEvent.state) {
                case GuardState.Arrived:
                    if (lastGuardId !== -1) {
                        // Add on the remaining minutes before 1am.
                        totalThisNight += 60 - beganAt;
                        const previousMinutes = minutesPerGuard.get(lastGuardId) || 0;
                        minutesPerGuard.set(lastGuardId, previousMinutes + totalThisNight);
                    }
                    beganAt = guardEvent.minute;
                    totalThisNight = 0;
                    lastGuardId = guardEvent.id;
                    break;
                case GuardState.Asleep:
                    const awakeFor = guardEvent.minute - beganAt;
                    totalThisNight += awakeFor;
                    break;
                case GuardState.Awake:
                    beganAt = guardEvent.minute;
                    break;
            }
        })

        let maxMinutes = 0;
        let maxGuardId = -1;
        minutesPerGuard.forEach((minutes, guardId) => {
            if (minutes > maxMinutes) {
                maxGuardId = guardId;
                maxMinutes = minutes;
            }
        });

        const maxMinute = findMaxMinute(guardEvents, maxGuardId);
        const answer = maxGuardId * maxMinute;

        console.log(`Answer: ${answer}.  ${maxGuardId} x ${maxMinute}. Total of ${maxMinutes} awake`);
    }
}
