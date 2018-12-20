
import Puzzle from './puzzle'

import * as _ from 'lodash'

// 20a:
// 20b:
export default class Puzzle20 extends Puzzle {
    constructor() {
        super("20: Maps");
	}

    solve() {
		const allFiles = [
			'./data/20-ex1',
			'./data/20-ex2',
			'./data/20-ex3',
			'./data/20-ex4',
			'./data/20-ex5',
			'./data/20'
		]
		allFiles.forEach(f => {
			this.solveA(f);
		})
    }

    solveA(file: string) {
		const key = this.readFile(file);

		const numDoors = this.findMostDoors();


		console.log(`20a: Regex: ${_.truncate(key)}`.gray);
		console.log(`20a: Furthest room requires passing ${numDoors} doors`.white);
    }

	findMostDoors() {
		return 42;
	}
}
