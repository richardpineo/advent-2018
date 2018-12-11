
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

// This one was hard. If you use a singly-linked list then it doesn't scale in the way that is needed.
// Instead, we use a doubly-linked list so additions occur in O(1) instead of O(n)

class Node {
    constructor(public value: number, next: Node | undefined, prev: Node | undefined) {
        this.next = next || this;
        this.prev = prev || this;
    }

    public next: Node;
    public prev: Node;

    push(value: number): Node {
        const node = new Node(value, this.next, this);
        this.next.prev = node;
        this.next = node;
        return node;
    }
}

// 9a: The highest score is: 404502
// 9b: The highest score is: 3243916887
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
        const highest = this.solveFor(result);
        console.log(`9a: The highest score is: ${highest}`);
    }

    solveB() {
        const result = this.loadFile();
        result.highestMarble *= 100;
        const highest = this.solveFor(result);
        console.log(`9b: The highest score is: ${highest}`);
    }

    solveFor(result: GameResult) {
        let circle = new Node(0, undefined, undefined);
        const scores = new Scores();

        for (let marble = 1; marble <= result.highestMarble; marble++) {

            if (marble % 23 === 0) {
                const playerNum = marble % result.numPlayers;

                scores.addTo(playerNum, marble);

                circle = circle.prev.prev.prev.prev.prev.prev;

                scores.addTo(playerNum, circle.prev.value);

                circle.prev.prev.next = circle;
                circle.prev = circle.prev.prev;
            }
            else {
                circle = circle.next.push(marble);
            }
        }

        return scores.highest();
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