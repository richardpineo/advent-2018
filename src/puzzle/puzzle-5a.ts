
import Puzzle from './puzzle'

export default class Puzzle1a extends Puzzle {
    constructor() {
        super("5a: Polymers!");
    }

    solve() {
        let polymer = this.readFile('./data/5');
        while (true) {
            let newPolymer = this.reducePolymer(polymer);
            if (newPolymer.length === 0) {
                break;
            }
            polymer = newPolymer;
        }

        console.log(`5a: Length of polymer is ${polymer.length}`);
    }

    // Returns empty if not reducible.
    private reducePolymer(polymer: string): string {
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
