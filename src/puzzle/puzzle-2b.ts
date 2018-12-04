
import Puzzle from './puzzle'

import * as _ from 'lodash'

export default class Puzzle2b extends Puzzle {
    constructor() {
        super("2b: Box identification");
    }

    solve() {
        const lines = this.readLines('./data/2');
        for (let i = 0; i < lines.length; i++) {
            for (let j = i; j < lines.length; j++) {
                const found = this.findAndExtractSingleDifference(lines[i], lines[j]);
                if (found.length !== 0) {
                    console.log(`Found: ${found}`);
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
