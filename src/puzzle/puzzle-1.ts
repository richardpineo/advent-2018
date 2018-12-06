
import Puzzle from './puzzle'

// 1a: 561
// 1b: 563
export default class Puzzle1 extends Puzzle {
    constructor() {
        super("1: Calibration");
    }

    solve() {
        this.solve1a();
        this.solve1b();
    }

    solve1a() {
        const lines = this.readLines('./data/1');

        let value = 0;
        lines.forEach(v => {
            const num = parseInt(v);
            value += num;
        })

        console.log(`1a: ${value}`);
    }

    solve1b() {
        const lines = this.readLines('./data/1');
        const value = this.findDuplicate(lines);
        console.log(`1b: ${value}`);
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
