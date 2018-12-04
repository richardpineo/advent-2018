
import Puzzle from './puzzle'
import * as _ from 'lodash'

enum GuardState {
    Arrived = "Arrived",
    Awake = "Awake",
    Asleep = "Asleep",
    ShiftOver = "ShiftOver"
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

function findMaxMinute(counts: number[]) {
    let maxMinute = -1;
    let maxCount = -1;
    for (let i = 0; i < counts.length; i++) {
        if (counts[i] > maxCount) {
            maxCount = counts[i];
            maxMinute = i;
        }
    }
    return maxMinute;
}

// Returns a map from a guard id to an array with 60 elements, each minute indicating the count for that minute.
function calculateGuardCounts(guardEvents: GuardEvent[]): Map<number, Array<number>> {

    let guardCounts = new Map<number, Array<number>>();

    const addToGuardCount = function (guardId: number, minute: number) {
        let guardCount = guardCounts.get(guardId);
        if (guardCount === undefined) {
            guardCount = new Array<number>(60);
            guardCount.fill(0);
            guardCounts.set(guardId, guardCount);
        }
        guardCount[minute]++;
    }

    let beganAt = 9999;
    guardEvents.forEach(guardEvent => {
        switch (guardEvent.state) {
            case GuardState.Arrived:
                beganAt = guardEvent.minute;
                break;
            case GuardState.Awake:
            case GuardState.ShiftOver:
                for (let i = beganAt; i < guardEvent.minute; i++) {
                    addToGuardCount(guardEvent.id, i);
                }
                beganAt = 9999;
                break;
            case GuardState.Asleep:
                beganAt = guardEvent.minute;
                break;
        }
    });
    return guardCounts;
}

export default class Puzzle4 extends Puzzle {
    constructor() {
        super("4: Sleepy guards");
    }

    solve() {
        let guardEvents = this.loadGuardEvents();

        // Fill out all the guard ids.
        this.addMissingGuardIds(guardEvents);

        // Add dummy events at the end of a shift.
        guardEvents = this.addDummyEvents(guardEvents);

        const guardCounts = calculateGuardCounts(guardEvents);

        this.solve4a(guardCounts);
        this.solve4b(guardCounts);
    }

    private solve4a(guardCounts: Map<number, Array<number>>) {

        // Sum up the minutes per guard
        let minutesPerGuard = new Map<number, number>();
        guardCounts.forEach((counts, guardId) => {
            minutesPerGuard.set(guardId, _.sum(counts));
        });

        let maxMinutes = 0;
        let maxGuardId = -1;
        minutesPerGuard.forEach((minutes, guardId) => {
            if (minutes > maxMinutes) {
                maxGuardId = guardId;
                maxMinutes = minutes;
            }
        });

        const maxGuardCount = guardCounts.get(maxGuardId);
        const maxMinute = findMaxMinute(<Array<number>>maxGuardCount);
        const answer = maxGuardId * maxMinute;

        console.log(`4a: ${answer} | ${maxGuardId} x ${maxMinute} | Total of ${maxMinutes} asleep`);
    }

    private solve4b(guardCounts: Map<number, Array<number>>) {
        // Find the highest count
        let maxCount = -1;
        let maxGuardId = -1;
        let maxMinute = -1;
        guardCounts.forEach((counts, guardId) => {
            counts.forEach((count, minute) => {
                if (count > maxCount) {
                    maxGuardId = guardId;
                    maxMinute = minute;
                    maxCount = count;
                }
            });
        });
        const answer = maxMinute * maxGuardId;
        console.log(`4b: ${answer} | ${maxGuardId} x ${maxMinute} | ${maxCount} times asleep`);
    }
    private addDummyEvents(guardEvents: GuardEvent[]): GuardEvent[] {

        let lastGuardArrval = new GuardEvent(-1, 0, 0, 0, 0, GuardState.Asleep);
        // Add in dummy events at the end of the shift.
        let eventsToAdd = new Array<GuardEvent>();
        guardEvents.forEach(guardEvent => {
            if (guardEvent.state === GuardState.Arrived && lastGuardArrval.id !== -1) {
                eventsToAdd.push(new GuardEvent(lastGuardArrval.id, lastGuardArrval.month, lastGuardArrval.day, 0, 60, GuardState.ShiftOver));
            }
            lastGuardArrval = guardEvent;
        });
        // Fix up the last one.
        eventsToAdd.push(new GuardEvent(lastGuardArrval.id, lastGuardArrval.month, lastGuardArrval.day, 0, 60, GuardState.ShiftOver));

        // Add the fake events and sort them.
        guardEvents = guardEvents.concat(eventsToAdd);
        return _.sortBy(guardEvents, ["month", "day", "minute"]);
    }

    private addMissingGuardIds(guardEvents: GuardEvent[]) {
        let lastGuardId = -1;
        guardEvents.forEach(guardEvent => {
            if (guardEvent.state === GuardState.Arrived) {
                lastGuardId = guardEvent.id;
            }
            else {
                guardEvent.id = lastGuardId;
            }
        });
    }

    private loadGuardEvents(): Array<GuardEvent> {
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

            guardEvents.push(new GuardEvent(guardId, month, day, hours, minutes, state));
        })

        guardEvents = _.sortBy(guardEvents, ["month", "day", "minute"]);
        return guardEvents;
    }
}
