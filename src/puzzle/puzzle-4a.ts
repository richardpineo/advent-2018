
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
            const minutes = parseInt(matches[3]);
            const action = matches[4];
            const order = month * 100 + day;

            const state = textToGuardState(action);
            const guardId = textToGuardId(action);

            guardEvents.push(new GuardEvent(guardId, order, minutes, state));
        })

        // Sort the guard events by order
        guardEvents.sort((a, b) => a.order - b.order);


        console.log(`${guardEvents.length} events found`);
    }
}
