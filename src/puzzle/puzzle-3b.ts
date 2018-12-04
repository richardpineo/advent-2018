
import { Puzzle3 } from './puzzle-3'


export default class Puzzle3b extends Puzzle3 {
    constructor() {
        super("3a: Find the one");
    }

    solve() {
        const claims = this.loadClaims();
        const allLocations = this.countLocations(claims);

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
