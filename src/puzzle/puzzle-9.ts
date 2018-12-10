
import Puzzle from './puzzle'

class GameResult {
    constructor(public numPlayers: number, public highestMarble: number) {
    }
}

class Scores {
    private scores = new Map<number, number>();

    addTo(playerNum: number, value: number) {
        this.scores.set(playerNum, value + (this.scores.get(playerNum) || 0));
    }

    get(playerNum: number) {
        return this.scores.get(playerNum);
    }

    highest() {
        let highest = 0;
        this.scores.forEach(s => {
            if (s > highest) {
                highest = s;
            }
        });
        return highest;
    }
}

// 9a: The highest score is: 404502
// 9b:
export default class Puzzle9 extends Puzzle {
    constructor() {
        super("9: Marble Games");
    }

    solve() {
        this.solveA();
        this.solveB();
    }

    solveA() {
        const result = this.loadFile();

        // Allocate an array for the numbe of points
        const circle = new Array<number>();
        const scores = new Scores();

        circle.push(0);
        let activePosition = 0;

        for (let marble = 1; marble <= result.highestMarble; marble++) {

            if (marble % 23 === 0) {
                const playerNum = marble % result.numPlayers;
                scores.addTo(playerNum, marble);

                for (let seven = 0; seven < 7; seven++) {
                    activePosition = this.nextCounterClockwise(circle, activePosition);
                }
                scores.addTo(playerNum, circle[activePosition]);
                circle.splice(activePosition, 1);
            }
            else {
                const clockwise1 = this.nextClockwise(circle, activePosition);
                const clockwise2 = this.nextClockwise(circle, clockwise1);
                activePosition = this.findNewPosition(clockwise1, clockwise2);
                this.shiftRemaining(circle, activePosition);
                if (activePosition === circle.length) {
                    circle.push(marble);
                }
                else {
                    circle[activePosition] = marble;
                }
            }

            // console.log(circle.join(' '));
        }

        console.log(`9a: The highest score is: ${scores.highest()}`);
    }

    solveB() {
    }

    shiftRemaining(circle: Array<number>, newPosition: number) {
        if (newPosition >= circle.length) {
            return;
        }
        circle.splice(newPosition, 0, -1);
    }

    findNewPosition(clockwise1: number, clockwise2: number): number {
        if (clockwise2 === 0) {
            return clockwise1 + 1;
        }
        return clockwise2;
    }

    nextClockwise(circle: Array<number>, activePosition: number): number {
        const newPosition = activePosition + 1;
        if (newPosition >= circle.length) {
            return 0;
        }
        return newPosition;
    }

    nextCounterClockwise(circle: Array<number>, activePosition: number): number {
        const newPosition = activePosition - 1;
        if (newPosition < 0) {
            return circle.length - 1;
        }
        return newPosition;
    }

    loadFile(): GameResult {
        // 10 players; last marble is worth 1618 points
        const text = this.readFile('./data/9');
        const regex = "([0-9]+) players; last marble is worth ([0-9]+) points"
        const regexEval = new RegExp(regex);
        const matches = regexEval.exec(text);
        if (matches === null) {
            throw "Invalid file";
        }
        if (matches.length !== 3) {
            throw `Matched expression, but not correctly: ${text}`;
        }

        return new GameResult(parseInt(matches[1]), parseInt(matches[2]));
    }
}