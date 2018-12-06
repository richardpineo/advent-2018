
import Puzzle from './puzzle'

// 3a: 116920 duplicates found
// 3b: 382 has no overlaps

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

export default class Puzzle3 extends Puzzle {
    constructor() {
        super("3: Cut the fabric");
    }

    solve(): void {
        this.solve3a();
        this.solve3b();
    }

    solve3a() {
        const claims = this.loadClaims();
        const allLocations = this.countLocations(claims);

        let dupCount = 0;
        allLocations.forEach(value => {
            if (value > 1) {
                dupCount++;
            }
        });

        console.log(`3a: ${dupCount} duplicates found`);
    }

    solve3b() {
        const claims = this.loadClaims();
        const allLocations = this.countLocations(claims);

        claims.forEach(claim => {
            const claimLocs = claim.locations();
            let overlaps = claimLocs.filter(loc => {
                const count = allLocations.get(loc.id());
                return count !== 1;
            });
            if (overlaps.length === 0) {
                console.log(`3b: ${claim.id} has no overlaps`);
            }
        })
    }

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
