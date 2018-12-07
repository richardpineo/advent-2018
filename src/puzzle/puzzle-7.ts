
import Puzzle from './puzzle'
import * as _ from 'lodash'

class Step {
    constructor(public first: string, public next: string) {
    }
}

class Processing {
    constructor(public action: string, public start: number) {
        this.effort = (this.action[0].charCodeAt(0) - "A".charCodeAt(0)) + 1 + 60;
    }

    private effort: number;

    complete(elapsed: number): boolean {
        return (elapsed - this.start) >= this.effort;
    }
}

// 7a: PFKQWJSVUXEMNIHGTYDOZACRLB
// 7b: 864 elapsed: PQWFKJSVXUYEMZDNIHTAGOCRLB
export default class Puzzle7 extends Puzzle {
    constructor() {
        super("7: The Whole");
    }

    solve() {
        this.solve7a();
        this.solve7b();
    }

    solve7a() {
        let steps = this.loadSteps();
        let remaining = new Set<string>();
        steps.forEach(step => {
            remaining.add(step.first);
            remaining.add(step.next);
        })

        let actions = new Array<string>();
        while (remaining.size) {
            // Find any available steps
            let available = Array.from(this.avilableSteps(steps, remaining, new Set(actions)));
            available.sort();
            const stepToTake = available[0];
            actions.push(stepToTake);
            remaining.delete(stepToTake);
        }
        console.log(`7a: ${actions.join('')}`);
    }

    solve7b() {
        let steps = this.loadSteps();
        let remaining = new Set<string>();
        steps.forEach(step => {
            remaining.add(step.first);
            remaining.add(step.next);
        })

        // console.log('Elapsed   W1 W2 W3 W4 W5   Done');

        let processing = new Array<Processing>();
        let actions = new Array<string>();
        let elapsed = 0;
        const NumberOfWorkers = 5;
        while (remaining.size > 0 || processing.length > 0) {

            const parts = _.partition(processing, (p => p.complete(elapsed)));
            const completed = parts[0];
            processing = parts[1];

            // If anything completed, log it.
            completed.forEach(c => {
                actions.push(c.action);
            });

            // Find any available steps
            const available: Array<string> = Array.from(this.avilableSteps(steps, remaining, new Set(actions)));
            available.forEach(stepToTake => {
                if (processing.length < NumberOfWorkers) {
                    processing.push(new Processing(stepToTake, elapsed));
                    remaining.delete(stepToTake);
                }
            })

            /*
            // Log what is going on
            const formatProc = (index: number): string => {
                return index >= processing.length ? '.' : processing[index].action;
            }
            console.log(`${this.pad(elapsed, 3)}       ${formatProc(0)}  ${formatProc(1)}  ${formatProc(2)}  ${formatProc(3)}  ${formatProc(4)}    ${actions.join('')}`);
            */

            elapsed++;
        }
        console.log(`7b: ${elapsed - 1} elapsed: ${actions.join('')}`);
    }


    pad(num: number, size: number): string {
        var s = "000" + num;
        return s.substr(s.length - size);
    }

    avilableSteps(steps: Step[], remaining: Set<string>, completed: Set<string>): Set<string> {
        let available = new Set<string>();
        remaining.forEach(possible => {
            let needed = new Set<string>();
            steps.forEach(step => {
                if (step.next === possible) {
                    needed.add(step.first);
                }
            });
            if (this.areAllNeededDone(needed, completed)) {
                available.add(possible);
            }
        })
        return available;
    }

    areAllNeededDone(needed: Set<string>, completed: Set<string>) {
        let neededDone = true;
        needed.forEach(need => {
            if (!completed.has(need)) {
                neededDone = false;
            }
        })
        return neededDone;
    }

    loadSteps(): Step[] {
        const instructions = new Array<Step>();
        const lines = this.readLines('./data/7');
        const regex = 'Step ([A-Z]) must be finished before step ([A-Z]) can begin.';
        const regexEval = new RegExp(regex);
        lines.forEach((line, index) => {
            const matches = regexEval.exec(line);
            if (matches === null) {
                return -1;
            }
            if (matches.length !== 3) {
                throw `Matched expression, but not correctly: ${line}`;
            }
            const p = new Step(matches[1], matches[2]);
            instructions.push(p);
        })
        return instructions;
    }
}
