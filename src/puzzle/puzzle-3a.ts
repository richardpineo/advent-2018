
import Puzzle from './puzzle'
import * as _ from 'lodash'

export class Claim {
    constructor(private line: string) {
        const regexEval = new RegExp(Claim.regex);
        const matches = regexEval.exec(line);
        if (matches === null) {
            throw (`Line does not match expression: ${line}`)
        }
        if (matches.length !== 6) {
            throw (`Matched expression, but not correctly: ${line}`)
        }
        this.id = parseInt(matches[1]);
        this.leftEdge = parseInt(matches[2]);
        this.topEdge = parseInt(matches[3]);
        this.width = parseInt(matches[4]);
        this.height = parseInt(matches[5]);
    }

    locations(): Location[] {
        let locs = new Array<Location>();
        for (let offsetX = 0; offsetX < this.width; offsetX++) {
            for (let offsetY = 0; offsetY < this.height; offsetY++) {
                locs.push(new Location(this.leftEdge + offsetX, this.topEdge + offsetY));
            }
        }
        return locs;
    }

    id: number;
    leftEdge: number;
    topEdge: number;
    width: number;
    height: number;

    // Example: #1334 @ 3,578: 15x23
    private static regex = '#([0-9]+) @ ([0-9]+),([0-9]+): ([0-9]+)x([0-9]+)';
}

export class Location {
    constructor(public left: number, public top: number) { }
    id(): string {
        return `${this.left},${this.top}`;
    }
}

export default class Puzzle3a extends Puzzle {
    constructor() {
        super("3a: Cut the fabric");
    }

    solve() {
        const lines = this.readLines('./data/3');

        let claims = new Array<Claim>();
        lines.forEach(line => {
            claims.push(new Claim(line));
        })

        let allLocations = new Set<string>();
        let dupLocations = new Set<string>();
        claims.forEach(claim => {
            const claimLocs = claim.locations();
            claimLocs.forEach(claimLoc => {
                const id = claimLoc.id();
                if (allLocations.has(id)) {
                    dupLocations.add(id);
                } else {
                    allLocations.add(id);
                }
            });
        })

        console.log(`${dupLocations.size} duplicates found`);
    }
}
