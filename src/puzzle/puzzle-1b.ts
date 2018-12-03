
import Puzzle from './puzzle'
var fs = require('fs');

export default class Puzzle1a implements Puzzle {
    getName(): string {
        return "1b: Calibration with frequency";
    }

    solve() {
        const lines: Array<string> = fs.readFileSync('./data/1').toString().split("\n");
        console.log(`Read file, ${lines.length} lines found`);

        let value = 0;
        let count = 0;
        let found = false;
        let frequencies = new Set<number>();
        while (!found) {
            lines.forEach(v => {
                if (!found) {
                    const num = parseInt(v);
                    value += num;

                    count++;
                    console.log(`${count}: number is ${num}, value is ${value}, set has ${frequencies.size} elements`)

                    // Have we seen this before?
                    if (frequencies.has(value)) {
                        found = true;
                    }
                    else {
                        frequencies.add(value);
                    }
                }
            })
        }

        console.log(`Value is ${value}`);
    }
}
