
import Puzzle from './puzzle'

export default class Puzzle1a extends Puzzle {
    constructor() {
        super("1a: Calibration");
    }

    solve() {
        const lines = this.readLines('./data/1');

        let value = 0;
        lines.forEach(v => {
            const num = parseInt(v);
            value += num;
        })

        console.log(`Value is ${value}`);
    }
}
