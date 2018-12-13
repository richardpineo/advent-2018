
import Puzzle from './puzzle'

// 11a:
// 11b:
export default class Puzzle11 extends Puzzle {
    constructor() {
        super("11: Chronal Charge");
    }

    solve() {
        this.solveA();
        this.solveB();
    }

    solveA() {
        const input = 6042;

        console.log(`11a: ${input}`);
    }

    solveB() {
        console.log(`11b: ${42}`);
    }
}
