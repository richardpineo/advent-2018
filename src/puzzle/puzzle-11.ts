
import Puzzle from './puzzle'

class Grid {
    constructor(public serial: number) {
    }

    powerFor(public size: number, x: number, y: number): number {
        let power = 0;
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                if (x >= 300 || y >= 300) {
                    return -666;
                }
                power += this.powerLevel(x, y);
            }
        }

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

class MaxPower {
    constructor(public size: number) {
    }
    public x = -1;
    public y = -1;
    public power = -999;
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
        console.log(`11a: Max power is ${power.power} at (${power.x}, ${power.y})`);
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

        const maxPower1 = new MaxPower(16);
        maxPower1.x = 90;
        maxPower1.y = 269;
        maxPower1.power = 113;
        this.checkMaxPower(18, maxPower1);
    }

    checkValue(grid: Grid, x: number, y: number, expected: number) {
        const value = grid.powerLevel(x, y);
        if (value !== expected) {
            console.log(`(${x},${y}) is wrong! expected ${expected} but was ${value}`);
        }
    }

    checkPower(grid: Grid, x: number, y: number, expected: number) {
        const power = this.maxPower(grid);
        if (power.x != x || power.y != y || power.power != expected) {
            console.log(`Power wrong! Expected ${expected} at (${x}, ${y}) but got ${power.toString()}`);
        }
    }

    checkMaxPower(serial: number, maxPower: MaxPower) {
        const found = this.maxPowerForSizes(serial);
        if (found.x !== maxPower.x ||
            found.y !== maxPower.y ||
            found.power !== maxPower.power ||
            found.size !== maxPower.size) {
            console.log(`Max power wrong! Expected ${JSON.stringify(maxPower)} but found ${JSON.stringify(found)}`);
        }
    }

    maxPower(grid: Grid): MaxPower {
        const maxPower = new MaxPower(grid.size);
        for (let y = 0; y < grid.size - 2; y++) {
            for (let x = 0; x < grid.size - 2; x++) {
                const power = grid.powerFor(x, y);
                if (power > maxPower.power) {
                    maxPower.x = x;
                    maxPower.y = y;
                    maxPower.power = power;
                }
            }
        }
        return maxPower;
    }

    maxPowerForSizes(serial: number): MaxPower {
        const maxPower = new MaxPower(-1);
        for (let size = 3; size < 300; size++) {
            const powerForSize = this.maxPower(new Grid(size, serial));
            if (powerForSize.power > maxPower.power) {
                maxPower.x = powerForSize.x;
                maxPower.y = powerForSize.y;
                maxPower.power = powerForSize.power;
                maxPower.size = powerForSize.size;
            }
        }
        return maxPower;
    }
}
