
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
    constructor(public id: number, public order: number, public minute: number, public state: GuardState) {
    }
}

class GuardActivity {
    constructor(public id: number) {
    }
    public addEvent(guardEvent: GuardEvent) {
        this.guardEvents.push(guardEvent);
    }
    private guardEvents = Array<GuardEvent>();

    public totalMinutes() {
        return 0;
    }
}

export default class Puzzle1a extends Puzzle {
    constructor() {
        super("4a: Sleepy guards");
    }

    solve() {
        const lines = this.readLines('./data/4');

        // [1518-11-01 00:05] xyz abc
        const DateAndActionRegex = `\\[1518-([0-9][0-9])-([0-9][0-9]) [0-9][0-9]:([0-9][0-9])\\] (.+)`;

        let guardEvents = new Array<GuardEvent>();
        lines.forEach(line => {

            const regexEval = new RegExp(DateAndActionRegex);
            const matches = regexEval.exec(line);
            if (matches === null) {
                throw `Invalid: ${line}`;
            }
            if (matches.length !== 5) {
                throw `Line matched expression, but not correctly: ${line}`;
            }
            const month = parseInt(matches[1]);
            const day = parseInt(matches[2]);
            let minutes = parseInt(matches[3]);
            const action = matches[4];
            const order = month * 100 + day;

            const state = textToGuardState(action);
            const guardId = textToGuardId(action);
            if (state === GuardState.Arrived) {
                // Correct the minutes if they came early.
                // The day won't matter since it's only used in ordering.
                minutes = 0;
            }

            guardEvents.push(new GuardEvent(guardId, order, minutes, state));
        })

        // Sort the guard events by order
        guardEvents.sort((a, b) => a.order - b.order);

        // Sum up the minutes per guard
        let minutesPerGuard = new Map<number, number>();
        let totalThisNight = 0;
        let lastGuardId = -1;
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
        minutesPerGuard.forEach((guardId, minutes) => {
            if (minutes > maxMinutes) {
                maxGuardId = guardId;
                maxMinutes = minutes;
            }
        });
        console.log(`Max guard id ${maxGuardId} has ${maxMinutes} minutes awake`);
    }
}
