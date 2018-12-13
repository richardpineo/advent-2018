
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

        const grid5 = this.gridForSerialNumber(18);
        this.checkPower(grid5, 33, 45, 29);

        const grid6 = this.gridForSerialNumber(42);
        this.checkPower(grid6, 21, 61, 30);
    }

    checkValue(grid: number[], x: number, y: number, expected: number) {
        const value = grid[this.index(x, y)];
        if (value !== expected) {
            console.log(`(${x},${y}) is wrong! expected ${expected} but was ${value}`);
        }
    }

    checkPower(grid: number[], x: number, y: number, expected: number) {
        const power = this.maxPower(grid);
        if (power[0] != x || power[1] != y || power[2] != expected) {
            console.log(`Power wrong! Expected ${expected} at (${x}, ${y}) but got ${power.toString()}`);
        }
    }

    // 3 array elements - x,y,power
    maxPower(grid: number[]): number[] {
        let max = [-1, -1, -10];
        for (let y = 0; y < 298; y++) {
            for (let x = 0; x < 298; x++) {
                const power = this.powerFor(grid, x, y);
                if (power > max[2]) {
                    max[0] = x;
                    max[1] = y;
                    max[2] = power;
                }
            }
        }
        return max;
    }

    powerFor(grid: number[], x: number, y: number): number {
        return grid[this.index(x, y)] +
            grid[this.index(x + 1, y)] +
            grid[this.index(x + 2, y)] +
            grid[this.index(x, y + 1)] +
            grid[this.index(x + 1, y + 1)] +
            grid[this.index(x + 2, y + 1)] +
            grid[this.index(x, y + 2)] +
            grid[this.index(x + 1, y + 2)] +
            grid[this.index(x + 2, y + 2)];
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
