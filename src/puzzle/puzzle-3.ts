
import Puzzle from './puzzle'

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

export abstract class Puzzle3 extends Puzzle {
    abstract solve(): void;

    loadClaims(): Claim[] {
        const lines = this.readLines('./data/3');

        const claims = new Array<Claim>();
        lines.forEach(line => {
            claims.push(new Claim(line));
        })
        return claims;
    }

    countLocations(claims: Claim[]): Map<string, number> {

        let allLocations = new Map<string, number>();
        claims.forEach(claim => {
            const claimLocs = claim.locations();
            claimLocs.forEach(claimLoc => {
                const id = claimLoc.id();
                const previousCount = allLocations.get(id) || 0;
                allLocations.set(id, previousCount + 1);
            });
        })

        return allLocations;
    }
}
