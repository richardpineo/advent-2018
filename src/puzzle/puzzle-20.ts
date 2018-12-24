
import Puzzle from './puzzle'

import * as _ from 'lodash'

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

class Endpoint {
	constructor(public doors: number, public x: number, public y: number) {
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
			'./data/20-ex1',
			'./data/20-ex1b',
			'./data/20-ex1c',
			'./data/20-ex2',
			'./data/20-ex3',
			'./data/20-ex4',
			// './data/20-ex5',
			// './data/20'
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
		this.verbose('Paths:\n' + paths.join('\n'));

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
		this.dumpPath(option);

		// flatten them
		const flattenedPaths = this.generateFlatPaths(option);
		return _.uniq(flattenedPaths);
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

	combinePaths(paths: string[], newPaths: string[]): string[] {
		const combinedPaths = new Array<string>();
		paths.forEach(fp => {
			newPaths.forEach(ip => {
				combinedPaths.push(fp + ip);
			})
		})
		return combinedPaths;
	}

	generateFlatPaths(path: Option): string[] {

		switch (path.type) {
			case OptionType.Word:
				return [(<OptionWord>(path)).word];
			case OptionType.Series: {
				const series = <OptionSeries>(path);
				let flatPaths = new Array<string>();
				flatPaths.push('');
				series.series.forEach(option => {
					const innerPaths = this.generateFlatPaths(option);
					flatPaths = this.combinePaths(flatPaths, innerPaths);
				})
				return flatPaths;
			}
			case OptionType.Branch: {
				const branch = <OptionBranch>(path);
				let flatPaths = new Array<string>();
				branch.options.forEach(option => {
					const innerPaths = this.generateFlatPaths(option);
					flatPaths = flatPaths.concat(innerPaths);
				})
				return flatPaths;
			}
		}
	}

	indent(depth: number): string {
		let s = '';
		for (let i = 0; i < depth; i++) {
			s += ' ';
		}
		return s;
	}

	dumpPath(option: Option, connector = '', depth = 0) {
		if (!this.enableVerbose) {
			return;
		}

		switch (option.type) {
			case OptionType.Word:
				this.verbose(`${this.indent(depth)}${(<OptionWord>option).word} ${connector}`);
				break;
			case OptionType.Branch:
				(<OptionBranch>option).options.forEach(opt => {
					this.dumpPath(opt, '|', depth + 1);
				})
				break;
			case OptionType.Series:
				(<OptionSeries>option).series.forEach(opt => {
					this.dumpPath(opt, '&', depth);
				})
				break;
		}
	}

	// Reads from the current index to the closing token.
	loadSeries(tokens: string[], state: State): Option {
		// console.log(`load series ${state.index}`);

		let optionSeries = new OptionSeries([]);
		for (let i = state.index; i < tokens.length; i++) {
			const token = tokens[i];
			// console.log(`${i} series token ${token}`);

			switch (token) {
				case '(': {
					// load the interior
					let nextState = new State(i + 1);
					let branch = this.loadBranch(tokens, nextState);
					// console.log(`${nextState.index} loaded branch`);
					optionSeries.series.push(branch);
					// this.dumpPath(branch);
					i = nextState.index;
					break;
				}

				case ')':
				case '$':
					state.index = i - 1;
					return this.simplifySeries(optionSeries);

				default:
					optionSeries.series.push(new OptionWord(token));
					break;
			}
		}
		throw new Error('unexpected series end');
	}

	loadBranch(tokens: string[], state: State): Option {
		// console.log(`load branch ${state.index}`);

		let branch = new OptionBranch([])
		for (let i = state.index; i < tokens.length; i++) {
			const token = tokens[i];
			// console.log(`${i} branch token ${token}`);

			switch (token) {
				case '|': {
					// load the next one
					let nextState = new State(i + 1);
					let series = this.loadSeries(tokens, nextState);
					series = this.simplifySeries(series);
					// console.log(`${nextState.index} loaded series`);
					branch.options.push(series);
					// this.dumpPath(series);
					i = nextState.index;
					break;
				}
				case '(': {
					// load the interior
					let nextState = new State(i + 1);
					let newBranch = this.loadBranch(tokens, nextState);
					// console.log(`${nextState.index} loaded branch 2`);
					// this.dumpPath(newBranch);

					branch.options.push(newBranch);
					i = nextState.index;
					break;
				}

				case '$':
				case ')':
					// If the previous on was | then add a blank word
					if (tokens[i - 1] == '|') {
						branch.options.push(new OptionWord(''));
					}
					// branch complete
					state.index = i;
					// this.dumpPath(branch);
					return branch;

				default:
					branch.options.push(new OptionWord(token));
					break;
			}
		}
		throw new Error('unexpected branch end');
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
