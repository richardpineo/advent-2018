
import Puzzle from './puzzle'

import * as _ from 'lodash'
import { Stack } from 'stack-typescript';

enum PartType {
	Simple,
	Option,
	Path
}

abstract class PathPart {
	constructor( public type: PartType ) {

	}
	// length of the thing, including parenthesis.
	abstract length(): number;
}

class PathPartSimple extends PathPart {
	constructor(public path: string) {
		super(PartType.Simple);
	}
	length() {
		return this.path.length;
	}
}

class PathPartOption extends PathPart {
	constructor() {
		super(PartType.Option);
	}

	parts = new Array<PathPart>();

	length() {
		let length = 2 + this.parts.length - 1;
		this.parts.forEach(p => length += p.length());
		return length;
	}
}

class Path extends PathPart {
	constructor() {
		super(PartType.Path);
	}

	parts = new Array<PathPart>();

	length() {
		let length = 0;
		this.parts.forEach(p => length += p.length());
		return length;
	}
}

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
			console.log();
		})
    }

    solveA(file: string) {
		const key = this.readFile(file);
		if( key[0] != '^' || key[key.length-1] !== '$') {
			throw `Invalid regex: ${key}`;
		}
		console.log(`20a: Regex: ${_.truncate(key)}`.gray);

		// Generate all the paths that comprise the map
		const paths = this.generatePaths(key);
		console.log(`20a: ${paths.length} paths generated`.gray);

		const numDoors = this.findMostDoors();
		console.log(`20a: Furthest room requires passing ${numDoors} doors`.white);
    }

	generatePaths(key: string): string[] {
		const letters = key.split('');
		let path = new Path();

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
					i += word.length;
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
		for(let i=index; i<letters.length; i++) {
			const letter = letters[i];
			switch(letter) {
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

	parsePath(letters: string[]) {
		let pathStack = new Stack<PathPart>();
		pathStack.push(new Path());

		for(let i=0; i<letters.length; i++) {
			switch (letters[i]) {
				case 'N':
				case 'S':
				case 'E':
				case 'W':
					switch (pathStack.top.type) {
						case PartType.Simple:
							(<PathPartSimple>pathStack.top).path += letters[i];
							break;
						case PartType.Option:
							(<PathPartSimple>pathStack.top).addLetter(letters[i]);

						}
					if ( === PartType.Simple) {
					}
					else {

					}
					currentWord += letters[i];
					break;
				case '|':
					currentOption.parts.push(new PathPartSimple(currentWord));
					currentWord = '';
					break;
				case '(':
					if(depth === 0) {
						const part = currentWord === '' ? currentOption : new PathPartSimple(currentWord);
						path.parts.push(part);

					}
					else {

					}
					depth++;
					break;
				case ')':
					currentOption.parts.push(new PathPartSimple(currentWord));
					break;
				case '$':
					break;
			}
		}
		return paths;
	}

	findMostDoors() {
		return 42;
	}
}
