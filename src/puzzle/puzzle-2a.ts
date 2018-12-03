
import Puzzle from './puzzle'

export default class Puzzle2a extends Puzzle {
    constructor() {
        super("2a: Checksum");
    }

    solve() {
        const lines = this.readLines('./data/2');
        lines.forEach(v => {
            console.log(v);
        })

        //        console.log(`Value is ${value}`);
    }
}
