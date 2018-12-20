
import Puzzle from './puzzle'

import * as _ from 'lodash'

class Path {
	options = new Array<Path | string>();
}

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
			//	'./data/20'
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
		this.enableVerbose = key.length < 200;

		// Generate all the paths that comprise the map
		const paths = this.flattenPaths(key);
		this.verbose(`20a: ${paths.length} paths generated`);

		this.verbose('Paths: ' + paths.join('\n'));

		const numDoors = this.findMostDoors();
		console.log(`20a: Furthest room requires passing ${numDoors} doors`.white);
	}

	verbose(line: string) {
		if (this.enableVerbose) {
			console.log(line.gray);
		}
	}

	flattenPaths(key: string): string[] {
		const letters = key.split('').slice(1);
		letters.pop();

		const tokens = this.tokenize(letters);
		this.verbose('Tokens: ' + tokens.join(' '));

		const path = this.generatePath(tokens);
		this.dumpPath(path);
		// flatten them

		return [];
	}

	dumpPath(path: Path, depth = 0) {
		if (!this.enableVerbose) {
			return;
		}

		path.options.forEach(option => {
			if (typeof option === 'string') {
				this.verbose(`${depth}:  ${option}`);
			}
			else {
				this.dumpPath(option, depth + 1);
			}
		})
	}

	generatePath(tokens: string[], state: { index: number } = { index: 0 }): Path {
		const path = new Path();

		for (let i = state.index; i < tokens.length; i++) {
			const token = tokens[i];
			switch (token) {
				case '|':
					// Don't do anything
					break;
				case '(':
					let newState = { index: i + 1 };
					const nested = this.generatePath(tokens, newState);
					path.options.push(nested);
					i = newState.index;
					break;
				case ')':
					state.index = i;
					return path;
				default:
					// must be a word
					path.options.push(token);
					break;
			}
		}
		state.index = tokens.length;
		return path;
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
