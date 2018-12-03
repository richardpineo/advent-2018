
import Puzzle from './puzzle'

export default class Puzzle1a extends Puzzle {
    constructor() {
        super("1a: Calibration with frequency");
    }

    solve() {
        const lines = this.readLines('./data/1');
        const value = this.findDuplicate(lines);
        console.log(`Value is ${value}`);
    }

    private findDuplicate(lines: Array<string>): number {
        let value = 0;
        const valuesSeen = new Set<number>();
        while (true) {
            for (let line of lines) {
                const num = parseInt(line);
                value += num;

                // Have we seen this before?
                if (valuesSeen.has(value)) {
                    return value;
                }

                valuesSeen.add(value);
            }
        }
    }
}
