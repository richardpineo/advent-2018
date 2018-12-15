
import Puzzle from './puzzle'
import * as _ from 'lodash'
import { release } from 'os';

class Rule {
	constructor(public match: string, public result: boolean) {
	}

	public matches(pattern: string) {
		return this.match === pattern;
	}
}

const InitialState = '##.#.#.##..#....######..#..#...#.#..#.#.#..###.#.#.#..#..###.##.#..#.##.##.#.####..##...##..#..##.#.'

export default class Puzzle12 extends Puzzle {
	constructor() {
		super("4: Potting the eyes and cross-breeding the teens");
	}

	solve() {

		this.solveA();
	}

	private solveA() {
		const rules = this.loadRules();

		let state = InitialState;

		for (let gen = 0; gen < 20; gen++) {
			let newState = this.applyRules(state, rules);
			state = newState;
		}

		let sum = state.split('').reduce((sum, current, index) => {
			return current === '#' ? sum + index : sum;
		}, 0);

		console.log(`12a: ${sum} of potted plants.`);
	}

	private applyRules(state: string, rules: Rule[]) {
		return state;
	}

	private loadRules(): Array<Rule> {
		const lines = this.readLines('./data/12');

		const rules = new Array<Rule>();
		lines.forEach(line => {
			const match = line.slice(0, 5);
			const result = line.slice(10, 1);
			rules.push(new Rule(match, result === '#'));
		})

		return rules;
	}
}
