
import Puzzle from './puzzle'
import * as _ from 'lodash'

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

// 10a: 10242 smallest offset
/*
  ##    #    #  ######   ####   #####   #    #  ######  ######
 #  #   #    #  #       #    #  #    #  #   #   #       #
#    #  #    #  #       #       #    #  #  #    #       #
#    #  #    #  #       #       #    #  # #     #       #
#    #  ######  #####   #       #####   ##      #####   #####
######  #    #  #       #  ###  #  #    ##      #       #
#    #  #    #  #       #    #  #   #   # #     #       #
#    #  #    #  #       #    #  #   #   #  #    #       #
#    #  #    #  #       #   ##  #    #  #   #   #       #
#    #  #    #  #        ### #  #    #  #    #  ######  ######
*/

// 10b: 10243
export default class Puzzle1 extends Puzzle {
    constructor() {
        super("10: Skywriting");
    }

    solve() {
        this.solveA();
        this.solveB();
    }

    solveA() {
        const startingPoints = this.loadPoints();
        let points = startingPoints.slice();
        let smallestBoxOffset = 0;
        let smallestBoundingBoxArea = 99999999999999;
        for (let offset = 0; offset < 100000; offset++) {
            points = this.nextPoints(points);
            const boundingBox = this.boundingBox(points.map(p => p.position));
            const area = this.area(boundingBox);
            if (area < smallestBoundingBoxArea) {
                smallestBoundingBoxArea = area;
                smallestBoxOffset = offset;
            }
            // console.log(`${offset} Bounding box: ${JSON.stringify(boundingBox)}`)
        }

        // 10242
        console.log(`10a: ${smallestBoxOffset} smallest offset`);

        points = startingPoints.slice();
        for (let offset = 0; offset <= smallestBoxOffset; offset++) {
            points = this.nextPoints(points);
        }
        // dump the points
        const finalPositions = points.map(p => p.position);
        const boundingBox = this.boundingBox(points.map(p => p.position));
        for (let y = boundingBox[0].y; y <= boundingBox[1].y; y++) {
            let line = ''
            for (let x = boundingBox[0].x; x <= boundingBox[1].x; x++) {
                line += this.isUsed(finalPositions, x, y) ? '#' : ' ';
            }
            console.log(line);
        }
    }

    solveB() {
        console.log(`10b: ${42}`);
    }

    isUsed(points: Position[], x: number, y: number): boolean {
        return _.some(points, p => {
            return p.x === x && p.y === y;
        })
    }

    nextPoints(points: Point[]): Point[] {
        return points.map(point => {
            return new Point(new Position(
                point.position.x + point.velocity.dx,
                point.position.y + point.velocity.dy), point.velocity);
        })
    }

    area(box: [Position, Position]): number {
        return (box[1].x - box[0].x) * (box[1].y - box[0].y);
    }

    boundingBox(positions: Position[]): [Position, Position] {
        let topLeft = new Position(positions[0].x, positions[0].y);
        let bottomRight = new Position(positions[0].x, positions[0].y);

        for (let i = 1; i < positions.length; i++) {
            const pos = positions[i];
            if (pos.x < topLeft.x) {
                topLeft.x = pos.x;
            }
            if (pos.y < topLeft.y) {
                topLeft.y = pos.y;
            }
            if (pos.x > bottomRight.x) {
                bottomRight.x = pos.x;
            }
            if (pos.y > bottomRight.y) {
                bottomRight.y = pos.y;
            }
        }

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
