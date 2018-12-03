
import { Puzzle } from './puzzle'
var fs = require('fs');

export default class Puzzle1a implements Puzzle {
    getName(): string {
        return "1a";
    }

    solve() {
        console.log('Hello world');
        //        var array = fs.readFileSync('../../data/1a').toString().split("\n");
        //      console.log(`Read file, ${array.length} lines found`);
    }
}
