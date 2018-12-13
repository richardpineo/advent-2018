
import Puzzle from './puzzle'

class Grid {
    constructor(public size: number, public serial: number) {
    }

    powerFor(x: number, y: number): number {
        return this.powerLevel(x, y) +
            this.powerLevel(x + 1, y) +
            this.powerLevel(x + 2, y) +
            this.powerLevel(x, y + 1) +
            this.powerLevel(x + 1, y + 1) +
            this.powerLevel(x + 2, y + 1) +
            this.powerLevel(x, y + 2) +
            this.powerLevel(x + 1, y + 2) +
            this.powerLevel(x + 2, y + 2);
    }

    powerLevel(x: number, y: number): number {
        const rackId = x + 10;
        let powerLevel = y * rackId;
        powerLevel += this.serial;
        powerLevel *= rackId;
        powerLevel = Math.floor((powerLevel % 1000) / 100);
        powerLevel -= 5;
        return powerLevel;
    }
}

// 11a: Max power is 30 at (21, 61)
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
        const grid = new Grid(300, 6042);
        const power = this.maxPower(grid);
        console.log(`11a: Max power is ${power[2]} at (${power[0]}, ${power[1]})`);
    }

    solveB() {
        console.log(`11b: ${42}`);
    }

    runTestCases() {
        const grid1 = new Grid(300, 8);
        this.checkValue(grid1, 3, 5, 4);

        const grid2 = new Grid(300, 57);
        this.checkValue(grid2, 122, 79, -5);

        const grid3 = new Grid(300, 39);
        this.checkValue(grid3, 217, 196, 0);

        const grid4 = new Grid(300, 71);
        this.checkValue(grid4, 101, 153, 4);

        const grid5 = new Grid(300, 18);
        this.checkPower(grid5, 33, 45, 29);

        const grid6 = new Grid(300, 42);
        this.checkPower(grid6, 21, 61, 30);
    }

    checkValue(grid: Grid, x: number, y: number, expected: number) {
        const value = grid.powerLevel(x, y);
        if (value !== expected) {
            console.log(`(${x},${y}) is wrong! expected ${expected} but was ${value}`);
        }
    }

    checkPower(grid: Grid, x: number, y: number, expected: number) {
        const power = this.maxPower(grid);
        if (power[0] != x || power[1] != y || power[2] != expected) {
            console.log(`Power wrong! Expected ${expected} at (${x}, ${y}) but got ${power.toString()}`);
        }
    }

    // 3 array elements - x,y,power
    maxPower(grid: Grid): number[] {
        let max = [-1, -1, -10];
        for (let y = 0; y < grid.size - 2; y++) {
            for (let x = 0; x < grid.size - 2; x++) {
                const power = grid.powerFor(x, y);
                if (power > max[2]) {
                    max[0] = x;
                    max[1] = y;
                    max[2] = power;
                }
            }
        }
        return max;
    }
}
