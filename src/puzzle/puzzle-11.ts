
import Puzzle from './puzzle'

class Grid {
    constructor(public serial: number) {
    }

    powerFor(x: number, y: number, size: number): number {
        if (size === 0) {
            return 0;
        }

        const cachedValue = this.powerForCache.get(this.cacheKey(x, y, size));
        if (cachedValue !== undefined) {
            return cachedValue;
        }

        // Start with a box one smaller
        let power = this.powerFor(x, y, size - 1);

        // Walk around the edges and add those in.

        for (let yOffset = 0; yOffset < size; yOffset++) {
            power += this.powerLevel(x + size - 1, y + yOffset);
        }

        // Don't count the corner twice!!
        for (let xOffset = 0; xOffset < size - 1; xOffset++) {
            power += this.powerLevel(x + xOffset, y + size - 1);
        }

        this.powerForCache.set(this.cacheKey(x, y, size), power);
        return power;
    }
    cacheKey(x: number, y: number, size: number): string {
        return `${x},${y},${size}`;
    }
    powerForCache = new Map<string, number>();

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
// 11b: 232, 251, 12 with power of 119
export default class Puzzle11 extends Puzzle {
    constructor() {
        super("11: Chronal Charge");
    }

    solve() {
        this.runTestCases();
        this.solveA();

        // B is slow to solve.
        // this.solveB();
    }

    solveA() {
        const grid = new Grid(6042);
        const power = this.maxPower(grid, 3);
        console.log(`11a: Max power is ${power.power} at (${power.x}, ${power.y})`);
    }

    solveB() {
        const maxPower = this.maxPowerForSizes(6042);
        console.log(`11b: ${maxPower.x}, ${maxPower.y}, ${maxPower.size} with power of ${maxPower.power}`);
    }

    runTestCases() {
        const grid1 = new Grid(8);
        this.checkValue(grid1, 3, 5, 4);

        const grid2 = new Grid(57);
        this.checkValue(grid2, 122, 79, -5);

        const grid3 = new Grid(39);
        this.checkValue(grid3, 217, 196, 0);

        const grid4 = new Grid(71);
        this.checkValue(grid4, 101, 153, 4);

        const grid5 = new Grid(18);
        this.checkPower(grid5, 3, 33, 45, 29);

        const grid6 = new Grid(42);
        this.checkPower(grid6, 3, 21, 61, 30);

        // The remaining tests are slow...
        return;

        const maxPower1 = new MaxPower(16);
        maxPower1.x = 90;

        maxPower1.y = 269;
        maxPower1.power = 113;
        this.checkMaxPower(18, maxPower1);

        const maxPower2 = new MaxPower(12);
        maxPower2.x = 232;
        maxPower2.y = 251;
        maxPower2.power = 12;
        this.checkMaxPower(42, maxPower2);
    }

    checkValue(grid: Grid, x: number, y: number, expected: number) {
        const value = grid.powerLevel(x, y);
        if (value !== expected) {
            console.log(`(${x},${y}) is wrong! expected ${expected} but was ${value}`);
        }
    }

    checkPower(grid: Grid, squareSize: number, x: number, y: number, expected: number) {
        const power = this.maxPower(grid, squareSize);
        if (power.x != x || power.y != y || power.power != expected) {
            console.log(`Power wrong! Expected ${expected} at (${x}, ${y}) but got ${JSON.stringify(power)} `);
        }
    }

    checkMaxPower(serial: number, maxPower: MaxPower) {
        const found = this.maxPowerForSizes(serial);
        if (found.x !== maxPower.x ||
            found.y !== maxPower.y ||
            found.power !== maxPower.power ||
            found.size !== maxPower.size) {
            console.log(`Max power wrong! Expected ${JSON.stringify(maxPower)} but found ${JSON.stringify(found)} `);
        }
    }

    maxPower(grid: Grid, squareSize: number): MaxPower {
        const maxPower = new MaxPower(squareSize);
        for (let y = 0; y < 300 - squareSize; y++) {
            for (let x = 0; x < 300 - squareSize; x++) {
                const power = grid.powerFor(x, y, squareSize);
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
        const grid = new Grid(serial);
        for (let size = 1; size < 300; size++) {
            console.log(`Size ${size}. Max power is ${maxPower.power} ${maxPower.x},${maxPower.y},${maxPower.size}`);
            const powerForSize = this.maxPower(grid, size);
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
