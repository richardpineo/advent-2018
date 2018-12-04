
import { Puzzle3 } from './puzzle-3'

export default class Puzzle3a extends Puzzle3 {
    constructor() {
        super("3a: Cut the fabric");
    }

    solve() {
        const claims = this.loadClaims();
        const allLocations = this.countLocations(claims);

        let dupCount = 0;
        allLocations.forEach(value => {
            if (value > 1) {
                dupCount++;
            }
        });

        console.log(`${dupCount} duplicates found`);
    }
}
