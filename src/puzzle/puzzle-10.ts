
import Puzzle from './puzzle'

class Position {
    constructor(public x: number, public y: number) {
    }
}


class Velocity {
    constructor(public dx: number, public dy: number) {
    }
}

class Point {
    constructor(public position: Position, public velocity: Velocity) {
    }
}

// 10a:
// 10b:
export default class Puzzle1 extends Puzzle {
    constructor() {
        super("10: Skywriting");
    }

    solve() {
        this.solveA();
        this.solveB();
    }

    solveA() {
        const points = this.loadPoints();
        console.log(`10a: ${points.length}`);
    }

    solveB() {
        console.log(`10b: ${42}`);
    }

    boundingBox(points: Point[]): [Position, Position] {
        let topLeft = new Position(points[0].position.x, points[0].position.y);
        let bottomRight = new Position(points[0].position.x, points[0].position.y);
        return [topLeft, bottomRight];
    }

    loadPoints(): Point[] {
        const points = new Array<Point>();
        const lines = this.readLines('./data/10');
        const regex = /position=<\s*(-?[0-9]+),\s*(\-?[0-9]+)> velocity=<\s*(\-?[0-9]+),\s*(\-?[0-9]+)>/;
        const regexEval = new RegExp(regex);
        lines.forEach(line => {
            const matches = regexEval.exec(line);
            if (matches === null) {
                throw new Error(`Could not load line ${line}`)
            }
            if (matches.length !== 5) {
                throw new Error(`Could not load line 2 ${line}`)
            }

            const position = new Position(parseInt(matches[1]), parseInt(matches[2]));
            const velocity = new Velocity(parseInt(matches[3]), parseInt(matches[4]));
            points.push(new Point(position, velocity));
        })
        return points;
    }

}
