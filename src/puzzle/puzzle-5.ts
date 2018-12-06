
import Puzzle from './puzzle'
import * as _ from 'lodash'

// 5a: Length of polymer is 10598
// 5b: Best letter is j with length 5312
export default class Puzzle1a extends Puzzle {
    constructor() {
        super("5a: Polymers!");
    }

    solve() {
        const polymer = this.readFile('./data/5');

        this.solve5a(polymer);
        this.solve5b(polymer);
    }

    private solve5a(polymer: string) {
        polymer = this.reducePolymer(polymer);
        console.log(`5a: Length of polymer is ${polymer.length}`);
    }

    private solve5b(polymer: string) {
        const alphabet = 'abcdefghijklmnopqrstuvwxyz';
        let bestLength = 99999;
        let bestLetter = '';
        for (let i = 0; i < 26; i++) {
            const letter = alphabet[i];
            // console.log('Processing ' + letter);
            const replaceRegEx = new RegExp(`[${letter}${letter.toUpperCase()}]`, 'g');
            const newPolymer = polymer.replace(replaceRegEx, '');
            const reduced = this.reducePolymer(newPolymer);
            if (reduced.length < bestLength) {
                bestLength = reduced.length;
                bestLetter = letter;
            }
        }

        console.log(`5b: Best letter is ${bestLetter} with length ${bestLength}`);
    }

    // Returns empty if not reducible.
    private reducePolymer(polymer: string): string {
        while (true) {
            let newPolymer = this.reduceOnce(polymer);
            if (newPolymer.length === 0) {
                break;
            }
            polymer = newPolymer;
        }

        return polymer;
    }

    private reduceOnce(polymer: string): string {
        for (let i = 0; i < polymer.length - 1; i++) {
            const a = polymer[i];
            const b = polymer[i + 1];
            if (this.isReducible(a, b)) {
                // Take 'em both out.
                polymer = polymer.replace(a + b, '');
                polymer = polymer.replace(b + a, '');
                return polymer;
            }
        }
        return '';
    }

    private isReducible(a: string, b: string): boolean {
        if (a === b) {
            return false;
        }
        if (a.toLowerCase() === b.toLowerCase()) {
            return true;
        }
        return false;
    }
}
