
import Puzzle from './puzzle'

import * as _ from 'lodash'
import { isBuffer } from 'util';

enum OptionType {
	Word,
	Branch,
	Series
}

class Option {
	protected constructor(public type: OptionType) {
	}
}

class OptionWord extends Option {
	constructor(public word: string) {
		super(OptionType.Word);
	}
}

class OptionBranch extends Option {
	constructor(public options: Array<Option>) {
		super(OptionType.Branch);
	}
}

class OptionSeries extends Option {
	constructor(public series: Array<Option>) {
		super(OptionType.Series);
	}
}

class State {
	constructor(public index: number) {
	}
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
			//'./data/20-ex1',
			'./data/20-ex1b',
			//			'./data/20-ex2',
			//'./data/20-ex3',
			//'./data/20-ex4',
			//'./data/20-ex5',
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
		const letters = key.split('');

		let tokens = this.tokenize(letters);
		this.verbose('Tokens: ' + tokens.join(' '));

		tokens = tokens.slice(1);
		let option = this.loadSeries(tokens, new State(0));

		// simplify series
		option = this.simplifySeries(option);

		this.dumpPath(option);

		// flatten them
		//		return this.generateFlatPaths(path);
		return tokens;
	}

	simplifySeries(option: Option): Option {
		switch (option.type) {
			case OptionType.Word:
				break;
			case OptionType.Branch:
				(<OptionBranch>option).options = (<OptionBranch>option).options.map(o => this.simplifySeries(o));
				break;
			case OptionType.Series: {
				let series = (<OptionSeries>option).series;
				if (series.length == 1 && series[0].type === OptionType.Word) {
					return series[0];
				}
				(<OptionSeries>option).series = series.map(o => this.simplifySeries(o));
				break;
			}
		}
		return option;
	}


	/*
		generateFlatPaths(path: Path): string[] {
			let flatPaths = new Array<string>();

			path.steps.forEach(path => {
				if (typeof path === 'string') {
					flatPaths.push(path);
				}
				else {
					let subPaths = this.generateFlatPaths(path);
					let newFlatPaths = new Array<string>();
					subPaths.forEach(sp => {
						flatPaths.forEach(fp => {
							newFlatPaths.push(fp + sp);
						})
					})
					flatPaths = newFlatPaths;
				}
			})

			return flatPaths;
		}
	*/

	dumpPath(option: Option, connector = '') {
		if (!this.enableVerbose) {
			return;
		}

		switch (option.type) {
			case OptionType.Word:
				this.verbose(`${connector}:  ${(<OptionWord>option).word}`);
				break;
			case OptionType.Branch:
				console.group("");
				(<OptionBranch>option).options.forEach(opt => {
					this.dumpPath(opt, '|');
				})
				console.groupEnd();
				break;
			case OptionType.Series:
				console.group("");
				(<OptionSeries>option).series.forEach(opt => {
					this.dumpPath(opt, '&');
				})
				console.groupEnd();
				break;
		}
	}

	// Reads from the current index to the closing token.
	loadSeries(tokens: string[], state: State): Option {
		let optionSeries = new OptionSeries([]);
		for (let i = state.index; i < tokens.length; i++) {
			const token = tokens[i];

			switch (token) {
				case '(': {
					// load the interior
					let nextState = new State(i + 1);
					let branch = this.loadBranch(tokens, nextState);
					optionSeries.series.push(branch);
					i = nextState.index;
					break;
				}

				case ')':
				case '$':
					return optionSeries;

				default:
					optionSeries.series.push(new OptionWord(token));
					break;
			}
		}
		throw new Error('unexpected series end');
	}

	loadBranch(tokens: string[], state: State): Option {
		let branch = new OptionBranch([])
		for (let i = state.index; i < tokens.length; i++) {
			const token = tokens[i];

			switch (token) {
				case '|': {
					// load the next one
					let nextState = new State(i + 1);
					let series = this.loadSeries(tokens, nextState);
					branch.options.push(series);
					i = nextState.index;
					break;
				}
				case '(': {
					// load the interior
					let nextState = new State(i + 1);
					let newBranch = this.loadBranch(tokens, nextState);
					branch.options.push(newBranch);
					i = nextState.index;
					break;
				}

				case ')':
					// If the previous on was | then add a blank word
					if (tokens[i - 1] == '|') {
						branch.options.push(new OptionWord(''));
					}
					// branch complete
					state.index = i;
					return branch;

				default:
					branch.options.push(new OptionWord(token));
					break;
			}
		}
		throw new Error('unexpected branch end');
	}

	/*

		loadOption(tokens: string[], state: State): Option {
			for (let i = state.index; i < tokens.length; i++) {
				const token = tokens[i];

				switch (token) {
					case '^':
						// Starting point
						let options = new OptionSeries([]);
						let nextState = new State(i + 1);
						while (nextState.index < tokens.length) {
							const inner = this.loadOption(tokens, nextState);
							options.series.push(inner);
						}
						break;

					case '$':
						// End it
						return state.currentSeries;

					case '|': {
						if (state.isSeries) {
							throw "expected to be loading branch but found series";
						}
						// load the next one
						let nextState = new State(i + 1, false);
						const inner = this.loadOption(tokens, nextState);
						state.currentBranch.options.push(inner);
						i = nextState.index;
						break;
					}
					case '(': {
						// load the interior
						let nextState = new State(i + 1, false);
						const inner = this.loadOption(tokens, nextState);
						state.currentBranch = new OptionBranch([inner]);
						state.isSeries = false;
						i = nextState.index;
						break;
					}
					case ')':
						// branch complete
						state.index = i + 1;
						return state.currentBranch;
					default:
						return new OptionWord(token);
				}
			}
			return state.isSeries ? state.currentSeries : state.currentBranch;
		}
	*/
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
				case '$':
				case '^':
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
