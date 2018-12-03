
import { Puzzle } from './puzzle'
var fs = require('fs');

export default class Puzzle1a implements Puzzle {
    getName(): string {
        return "1a: Calibration";
    }

    solve() {
        const lines: Array<string> = fs.readFileSync('./data/1').toString().split("\n");
        console.log(`Read file, ${lines.length} lines found`);

        let value = 0;
        lines.forEach(v => {
            const num = parseInt(v);
            value += num;
        })

        console.log(`Value is ${value}`);
    }
}
