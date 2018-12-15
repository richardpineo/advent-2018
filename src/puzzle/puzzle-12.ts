
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

// const InitialState = '#..#.#..##......###...###';
const InitialState = '##.#.#.##..#....######..#..#...#.#..#.#.#..###.#.#.#..#..###.##.#..#.##.##.#.####..##...##..#..##.#.'

export default class Puzzle12 extends Puzzle {
	constructor() {
		super("4: Potting the eyes and cross-breeding the teens");
	}

	solve() {

		this.solveA();
	}

	/*
#    0 =  2534 : .....##.#.#.##..#....######..#..#...#.#..#.#.#..###.#.#.#..#..###.##.#..#.##.##.#.####..##...##..#..##.#.........................
#    1 =  2475 : ....#...#.###.##.#..#.#...###.##.#.....##..#..##.#..#.#..##.##.#.##...##.##.##..##.#.###..#.#..##.##....#........................
#    2 =  2448 : .....#...#.#.##...##...#.#.#.##...#...#..##.##....##...##..##..###.#.#..##.##.##...##.####...##..##.#....#.......................
#    3 =  2233 : ......#....###.#.#..#....#.###.#...#...##..##.#..#..#.#..##..##.#..#..##..##.##.#.#..#.#.##.#..##....#....#......................
#    4 =  2136 : .......#..#.#..#..##.#....#.#...#...#.#..##....##.##...##..##....##.##..##..##..#..##..###...##..#....#....#.....................
#    5 =  2339 : ........##...##.##....#......#...#.....##..#..#..##.#.#..##..#..#..##.##..##..##.##..##.###.#..##.#....#....#....................
#    6 =  2238 : .......#..#.#..##.#....#......#...#...#..##.##.##...#..##..##.##.##..##.##..##..##.##..#.#...##....#....#....#...................
#    7 =  2242 : ........##...##....#....#......#...#...##..##.##.#...##..##..##.##.##..##.##..##..##.##...#.#..#....#....#....#..................
#    8 =  2218 : .......#..#.#..#....#....#......#...#.#..##..##...#.#..##..##..##.##.##..##.##..##..##.#.....##.#....#....#....#.................
#    9 =  1995 : ........##...##.#....#....#......#.....##..##..#.....##..##..##..##.##.##..##.##..##....#...#....#....#....#....#................
#   10 =  2040 : .......#..#.#....#....#....#......#...#..##..##.#...#..##..##..##..##.##.##..##.##..#....#...#....#....#....#....#...............
#   11 =  2094 : ........##...#....#....#....#......#...##..##....#...##..##..##..##..##.##.##..##.##.#....#...#....#....#....#....#..............
#   12 =  2031 : .......#..#...#....#....#....#......#.#..##..#....#.#..##..##..##..##..##.##.##..##...#....#...#....#....#....#....#.............
#   13 =  2016 : ........##.#...#....#....#....#........##..##.#......##..##..##..##..##..##.##.##..#...#....#...#....#....#....#....#............
#   14 =  2064 : .......#....#...#....#....#....#......#..##....#....#..##..##..##..##..##..##.##.##.#...#....#...#....#....#....#....#...........
#   15 =  2005 : ........#....#...#....#....#....#......##..#....#....##..##..##..##..##..##..##.##...#...#....#...#....#....#....#....#..........
#   16 =  2059 : .........#....#...#....#....#....#....#..##.#....#..#..##..##..##..##..##..##..##.#...#...#....#...#....#....#....#....#.........
#   17 =  2010 : ..........#....#...#....#....#....#....##....#....##.##..##..##..##..##..##..##....#...#...#....#...#....#....#....#....#........
#   18 =  2027 : ...........#....#...#....#....#....#..#..#....#..#..##.##..##..##..##..##..##..#....#...#...#....#...#....#....#....#....#.......
#   19 =  2231 : ............#....#...#....#....#....##.##.#....##.##..##.##..##..##..##..##..##.#....#...#...#....#...#....#....#....#....#......
#   20 =  2140 : .............#....#...#....#....#..#..##...#..#..##.##..##.##..##..##..##..##....#....#...#...#....#...#....#....#....#....#.....
	*/
	private solveA() {
		const rules = this.loadRules();

		let state = '.....' + InitialState + '........................';
		this.dumpState(0, state);

		for (let gen = 0; gen < 20; gen++) {
			const newState = this.applyRules(state, rules);
			state = newState;

			this.dumpState(gen + 1, state);
		}
	}

	private dumpState(gen: number, state: string) {

		const pad = (num: number) => {
			var s = "        " + num;
			return s.substr(s.length - 5);
		}
		const sum = this.computeSum(state);
		console.log(`#${pad(gen)} = ${pad(sum)} : ${state}`.gray);
	}

	private computeSum(state: string) {
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

		return newState;
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
