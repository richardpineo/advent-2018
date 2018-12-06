
import Puzzle from './puzzle'

import * as _ from 'lodash'

// 2a: Checksum is 7134(246 and 29)
// 2b: kbqwtcvzhmhpoelrnaxydifyb
export default class Puzzle2a extends Puzzle {
    constructor() {
        super("2: Checksum");
    }
    solve() {
        this.solve2a();
        this.solve2b();
    }

    solve2a() {
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

        console.log(`2a: Checksum is ${hasTwice * hasThrice} (${hasTwice} and ${hasThrice})`);
    }

    solve2b() {
        const lines = this.readLines('./data/2');
        for (let i = 0; i < lines.length; i++) {
            for (let j = i; j < lines.length; j++) {
                const found = this.findAndExtractSingleDifference(lines[i], lines[j]);
                if (found.length !== 0) {
                    console.log(`2b: ${found}`);
                }
            }
        }
    }

    // Returns the intersection of the string if it has only 1 character difference or empty otherwise.
    findAndExtractSingleDifference(a: string, b: string): string {
        const diffs = this.findDifferences(a, b);
        if (diffs.length !== 1) {
            return '';
        }
        return a.replace(diffs[0], '');
    }

    findDifferences(a: string, b: string): Array<string> {
        let diffs = new Array<string>();
        for (let i = 0; i < a.length; i++) {
            if (a[i] != b[i]) {
                diffs.push(a[i]);
            }
        }
        return diffs;
    }
}
