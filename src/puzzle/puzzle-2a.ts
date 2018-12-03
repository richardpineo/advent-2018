
import Puzzle from './puzzle'

import * as _ from 'lodash'

export default class Puzzle2a extends Puzzle {
    constructor() {
        super("2a: Checksum");
    }

    solve() {
        const lines = this.readLines('./data/2');
        let hasTwice = 0;
        let hasThrice = 0;
        lines.forEach(v => {
            let lineHasTwice = false;
            let lineHasThrice = false;
            const grouped = _.groupBy(v);
            for (const letter in grouped) {
                switch (grouped[letter].length) {
                    case 2:
                        lineHasTwice = true;
                        break;
                    case 3:
                        lineHasThrice = true;
                        break;
                }
            }
            hasTwice += (lineHasTwice ? 1 : 0);
            hasThrice += (lineHasThrice ? 1 : 0);
        })

        console.log(`Checksum is ${hasTwice * hasThrice} (${hasTwice} and ${hasThrice})`);
    }
}
