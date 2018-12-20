
import Puzzle from './puzzle'

import * as _ from 'lodash'

// 20a:
// 20b:
export default class Puzzle20 extends Puzzle {
	constructor() {
		super("20: Maps");
	}

	private enableVerbose = true;

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
			console.log();
		})
	}

	solveA(file: string) {
		const key = this.readFile(file);
		if (key[0] != '^' || key[key.length - 1] !== '$') {
			throw `Invalid regex: ${key}`;
		}
		console.log(`20a: Regex: ${_.truncate(key)}`.gray);

		// Generate all the paths that comprise the map
		const paths = this.generatePaths(key);
		this.verbose(`20a: ${paths.length} paths generated`);

		this.enableVerbose = paths.length < 20;
		this.verbose('Paths: ' + paths.join('\n'));

		const numDoors = this.findMostDoors();
		console.log(`20a: Furthest room requires passing ${numDoors} doors`.white);
	}

	verbose(line: string) {
		if (this.enableVerbose) {
			console.log(line.gray);
		}
	}

	generatePaths(key: string): string[] {
		const letters = key.split('').slice(1);
		letters.pop();

		const tokens = this.tokenize(letters);
		this.verbose('Tokens: ' + tokens.join(' '));
		return tokens;
	}

	tokenize(letters: string[]): string[] {
		let tokens = new Array<string>();

		for (let i = 0; i < letters.length; i++) {
			const letter = letters[i];
			switch (letter) {
				case 'N':
				case 'S':
				case 'E':
				case 'W':
					const word = this.readWord(letters, i);
					tokens.push(word);
					i += word.length - 1;
					break;
				case '|':
				case '(':
				case ')':
					tokens.push(letters[i]);
					break;
				default:
					throw `Invalid letter ${letters[i]}`;
			}
		}

		return tokens;
	}

	readWord(letters: string[], index: number): string {
		let word = '';
		for (let i = index; i < letters.length; i++) {
			const letter = letters[i];
			switch (letter) {
				case 'N':
				case 'S':
				case 'E':
				case 'W':
					word += letter;
					break;
				default:
					return word;
			}
		}
		return word;
	}

	findMostDoors() {
		return 42;
	}
}
