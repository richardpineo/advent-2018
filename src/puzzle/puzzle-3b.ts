
import Puzzle from './puzzle'
import { Claim } from './puzzle-3a'
import * as _ from 'lodash'


export default class Puzzle3b extends Puzzle {
    constructor() {
        super("3a: Find the one");
    }

    solve() {
        const lines = this.readLines('./data/3');

        let claims = new Array<Claim>();
        lines.forEach(line => {
            claims.push(new Claim(line));
        })

        let allLocations = new Map<string, number>();
        claims.forEach(claim => {
            const claimLocs = claim.locations();
            claimLocs.forEach(claimLoc => {
                const id = claimLoc.id();
                const previousCount = allLocations.get(id) || 0;
                allLocations.set(id, previousCount + 1);
            });
        })

        claims.forEach(claim => {
            const claimLocs = claim.locations();
            let overlaps = claimLocs.filter(loc => {
                const count = allLocations.get(loc.id());
                return count !== 1;
            });
            if (overlaps.length === 0) {
                console.log(`${claim.id} has no overlaps`);
            }
        })
    }
}
