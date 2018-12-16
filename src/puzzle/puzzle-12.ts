
import Puzzle from './puzzle'
import * as _ from 'lodash'

class Rule {
	constructor(public match: string, public result: boolean) {
	}

	public matches(pattern: string) {
		return this.match === pattern;
	}
}

// const InitialState = '#..#.#..##......###...###';
const InitialState = '##.#.#.##..#....######..#..#...#.#..#.#.#..###.#.#.#..#..###.##.#..#.##.##.#.####..##...##..#..##.#.'

export default class Puzzle12 extends Puzzle {
	constructor() {
		super("12: Potting the eyes and cross-breeding the teens");
	}

	solve() {
		this.solveA();
		this.solveB();
	}

	// #20 =  2140 : .............#....#...#....#....#..#..##...#..#..##.##..##.##..##..##..##..##....#....#...#...#....#...#....#....#....#....#.....
	private solveA() {
		const state = this.solveGen(20);
		console.log(`100 -> ${this.computeSum(state)}`);
	}

	// #20b: 1900000000384
	private solveB() {
		// 1900000000270 too low
		// 2199999999408 too high
		const gen = 50000000000;
		const fast = this.fastSum(gen);
		console.log(`${gen}: ${fast}`);
	}

	private solveGen(numGenerations: number) {
		const rules = this.loadRules();

		let state = '.....' + InitialState + '..';

		for (let gen = 0; gen < numGenerations; gen++) {
			state = state + '..';
			this.dumpState(gen, state);
			const newState = this.applyRules(state, rules);
			state = newState;
		}

		this.dumpState(numGenerations, state);
		return state;
	}

	private dumpState(gen: number, state: string) {

		const pad = (num: number) => {
			var s = "        " + num;
			return s.substr(s.length - 5);
		}
		const sum = this.computeSum(state);
		// (`${pad(gen)} = ${pad(sum)} : ${state}`.gray);
		const fast = this.fastSum(gen);
		if (gen > 140) {
			if (fast !== sum) {
				//		console.log(`${gen} => ${sum} | ${gen}* 44-592=${fast}`.red);
			}
			// console.log(`${gen},${sum}`);
		}
		if ((gen % 1000) === 0) {
			console.log(`${gen} => ${sum} | ${gen}* 44-592=${fast}`.gray);
		}
	}

	// To figure out the fastSum, I uncommented the console log at 72 and pasted the output into excel
	// Finding the best-fit line gave this equation.
	private fastSum(gen: number): number {
		return gen * 38 + 384;
		// y = 38x + 384
	}

	private computeSum(state: string): number {
		const offset = 5;
		let sum = 0;
		for (let index = 0; index < state.length; index++) {
			if (state[index] === '#') {
				sum += (index - offset);
			}
		}
		return sum;
	}

	private applyRules(state: string, rules: Rule[]) {
		let newState = '';
		let match;
		state.split('').forEach((plant, index) => {
			match = this.getMatchString(state, index - 2, index + 2);

			// apply all the rules to the match and add to the new state
			const matched = this.findAndApplyRule(rules, match);
			newState += matched ? '#' : '.';
		});

		let toChop = _.takeRightWhile(newState, (c, index, array) => {
			return index > 2 && array[index - 2] === '.'
		});

		return newState.slice(0, newState.length - toChop.length) + '..';
	}

	private findAndApplyRule(rules: Rule[], match: string): boolean {
		for (let i = 0; i < rules.length; i++) {
			let applied = this.applyRule(rules[i], match);
			if (applied !== undefined) {
				return applied;
			}
		}
		// console.log(`Rule not found for ${match}`.red);
		return false;
	}

	private applyRule(rule: Rule, match: string): boolean | undefined {
		if (rule.matches(match)) {
			return rule.result;
		}
		return undefined;
	}

	private getMatchString(state: string, start: number, end: number) {
		let match = '';
		for (let i = start; i <= end; i++) {
			if (i < 0) {
				match += '.';
			}
			else if (i >= state.length) {
				match += '.';
			}
			else {
				match += state[i];
			}
		}
		return match;
	}

	private loadRules(): Array<Rule> {
		const lines = this.readLines('./data/12');

		const rules = new Array<Rule>();
		lines.forEach(line => {
			const match = line.slice(0, 5);
			const result = line.slice(9, 10);
			rules.push(new Rule(match, result === '#'));
		})

		return rules;
	}
}
