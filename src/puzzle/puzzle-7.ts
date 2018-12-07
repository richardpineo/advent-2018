
import Puzzle from './puzzle'

class Step {
    constructor(public first: string, public next: string) {
    }
}

// 7a: PFKQWJSVUXEMNIHGTYDOZACRLB
// 7b:
export default class Puzzle7 extends Puzzle {
    constructor() {
        super("7: Dangerous Coordinates");
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
        console.log(`7b: ${42}`);
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
