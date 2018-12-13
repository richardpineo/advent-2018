
import Puzzle from './puzzle'


// 11a:
// 11b:
export default class Puzzle11 extends Puzzle {
    constructor() {
        super("11: Chronal Charge");
    }

    solve() {
        this.runTestCases();
        this.solveA();
        this.solveB();
    }

    solveA() {

    }

    solveB() {
        console.log(`11b: ${42}`);
    }

    runTestCases() {
        const grid1 = this.gridForSerialNumber(8);
        this.checkValue(grid1, 3, 5, 4);

        const grid2 = this.gridForSerialNumber(57);
        this.checkValue(grid2, 122, 79, -5);

        const grid3 = this.gridForSerialNumber(39);
        this.checkValue(grid3, 217, 196, 0);

        const grid4 = this.gridForSerialNumber(71);
        this.checkValue(grid4, 101, 153, 4);
    }

    checkValue(grid: number[], x: number, y: number, expected: number) {
        const value = grid[this.index(x, y)];
        if (value !== expected) {
            console.log(`(${x},${y}) is wrong! expected ${expected} but was ${value}`);
        }
    }

    gridForSerialNumber(serialNumber: number): number[] {
        let powerLevels = Array<number>(90000);
        for (let y = 0; y < 300; y++) {
            for (let x = 0; x < 300; x++) {
                powerLevels[this.index(x, y)] = this.powerLevel(x, y, serialNumber);
            }
        }
        return powerLevels;
    }

    index(x: number, y: number): number {
        return y * 300 + x;
    }

    powerLevel(x: number, y: number, serialNumber: number) {
        const rackId = x + 10;
        let powerLevel = y * rackId;
        powerLevel += serialNumber;
        powerLevel *= rackId;
        powerLevel = Math.floor((powerLevel % 1000) / 100);
        powerLevel -= 5;
        return powerLevel;
    }
}
