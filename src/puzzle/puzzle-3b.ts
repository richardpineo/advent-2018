
import Puzzle from './puzzle'
import { Claim, countLocations } from './puzzle-3a'


export default class Puzzle3b extends Puzzle {
    constructor() {
        super("3a: Find the one");
    }

    solve() {
        const lines = this.readLines('./data/3');

        const claims = new Array<Claim>();
        lines.forEach(line => {
            claims.push(new Claim(line));
        })

        let allLocations = countLocations(claims);

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
