
import Puzzle from './puzzle'
import * as _ from 'lodash'

class State {
	constructor(public regs: number[]) {
	}
	dup(): State {
		return new State(Array.from(this.regs));
	}
	same(s: State): boolean {
		for (let i = 0; i < 4; i++) {
			if (this.regs[i] != s.regs[i]) {
				return false;
			}
		}
		return true;
	}
}

class Instruction {
	constructor(public opcode: number, public inputA: number, public inputB: number, public output: number) {
	}
}

class TestCase {
	constructor(public before: State, public command: Instruction, public after: State) {
	}
}

type OperatorFunction = (state: State, inputA: number, inputB: number) => number;

// 16a: 592 / 812 match 3 or more
// 16b: 557 is in register 0
export default class Puzzle16 extends Puzzle {
	constructor() {
		super("16: Watch programming");
		this.operators = this.defineOperators();
		if (this.operators.length != 16) {
			throw new Error("bad opcodes");
		}
	}

	operators: OperatorFunction[];

	defineOperators(): OperatorFunction[] {
		const addr = (state: State, inputA: number, inputB: number): number => state.regs[inputA] + state.regs[inputB];
		const addi = (state: State, inputA: number, inputB: number): number => state.regs[inputA] + inputB;

		const mulr = (state: State, inputA: number, inputB: number): number => state.regs[inputA] * state.regs[inputB];
		const muli = (state: State, inputA: number, inputB: number): number => state.regs[inputA] * inputB;

		const banr = (state: State, inputA: number, inputB: number): number => state.regs[inputA] & state.regs[inputB];
		const bani = (state: State, inputA: number, inputB: number): number => state.regs[inputA] & inputB;

		const borr = (state: State, inputA: number, inputB: number): number => state.regs[inputA] | state.regs[inputB];
		const bori = (state: State, inputA: number, inputB: number): number => state.regs[inputA] | inputB;

		const setr = (state: State, inputA: number, inputB: number): number => state.regs[inputA];
		const seti = (state: State, inputA: number, inputB: number): number => inputA;

		const gtir = (state: State, inputA: number, inputB: number): number => inputA > state.regs[inputB] ? 1 : 0;
		const gtii = (state: State, inputA: number, inputB: number): number => state.regs[inputA] > inputB ? 1 : 0;
		const gtrr = (state: State, inputA: number, inputB: number): number => state.regs[inputA] > state.regs[inputB] ? 1 : 0;

		const etir = (state: State, inputA: number, inputB: number): number => inputA === state.regs[inputB] ? 1 : 0;
		const etii = (state: State, inputA: number, inputB: number): number => state.regs[inputA] === inputB ? 1 : 0;
		const etrr = (state: State, inputA: number, inputB: number): number => state.regs[inputA] === state.regs[inputB] ? 1 : 0;

		return [addr, addi, mulr, muli, banr, bani, borr, bori, setr, seti, gtir, gtii, gtrr, etir, etii, etrr];
	}

	solve() {
		this.solveA();
		this.solveB();
	}

	solveA() {
		const cases = this.loadCases();

		let matchThree = 0;
		cases.forEach(c => {
			let count = 0;
			this.operators.forEach(oper => {
				const after = c.before.dup();
				after.regs[c.command.output] = oper(c.before, c.command.inputA, c.command.inputB);
				if (after.same(c.after)) {
					count++;
				}
			});
			if (count >= 3) {
				matchThree++;
			}
		});
		console.log(`16a: ${matchThree} / ${cases.length} match 3 or more`);
	}

	solveB() {
		const order = this.findOrder();

		// Load the program
		const instructions = this.loadProgram();

		// run it.
		const regs = new State([0, 0, 0, 0]);
		instructions.forEach(instruction => {
			const cmd = order[instruction.opcode];
			const output = this.operators[cmd](regs, instruction.inputA, instruction.inputB);
			regs.regs[instruction.output] = output;
		})
		console.log(`16b: ${regs.regs[0]} is in register 0`);
	}

	findOrder(): number[] {
		const cases = this.loadCases();

		// Each opcode can be any of the commands 0..15
		const possible = new Array<Set<number>>();
		for (let pos = 0; pos < 16; pos++) {
			let posThis = new Set<number>();
			for (let i = 0; i < 16; i++) {
				posThis.add(i);
			}
			possible.push(posThis);
		}

		// For each case, determine which are valid for each opcode.
		cases.forEach(c => {
			let casePossible = new Set<number>();
			this.operators.forEach((oper, index) => {
				const after = c.before.dup();
				after.regs[c.command.output] = oper(c.before, c.command.inputA, c.command.inputB);
				if (after.same(c.after)) {
					casePossible.add(index);
				}
			});
			// Remove all of the non-matching opcodes for this case
			let oldPossibleSet = possible[c.command.opcode];
			let oldPossible = Array.from(oldPossibleSet.values());
			let newPossible = oldPossible.filter(x => casePossible.has(x));
			possible[c.command.opcode] = new Set(newPossible);
		});
		/*
		possible.forEach((p, index) => {
			console.log(`[${index}]: ${Array.from(p.values()).join(' ')}`);
		});
		*/

		let done = false;
		while (!done) {
			possible.forEach((p, index) => {
				if (p.size === 1) {
					const value = Array.from(p.values())[0];
					// remove from all other possibilities.
					possible.forEach((p2, index2) => {
						if (index2 !== index) {
							if (p2.has(value)) {
								p2.delete(value);
							}
						}
					})
				}
			})
			done = _.every(possible, p => p.size === 1);
		}
		const order = new Array<number>();
		possible.forEach((p) => {
			const value = Array.from(p.values())[0];
			order.push(value);
		});
		return order;
	}

	loadProgram(): Instruction[] {
		const lines = this.readLines('./data/16b');
		const regexCommand = "([0-9]+) ([0-9]+) ([0-9]+) ([0-9]+)";
		const regexEvalCommand = new RegExp(regexCommand);
		const instructions = new Array<Instruction>();
		for (let i = 0; i < lines.length; i++) {
			const matchesCommand = regexEvalCommand.exec(lines[i]);
			if (!matchesCommand || matchesCommand.length !== 5) {
				throw new Error("Can't read command");
			}
			instructions.push(new Instruction(parseInt(matchesCommand[1]),
				parseInt(matchesCommand[2]),
				parseInt(matchesCommand[3]),
				parseInt(matchesCommand[4])));
		}
		return instructions;
	}

	loadCases(): TestCase[] {

		const lines = this.readLines('./data/16a');

		let cases = new Array<TestCase>();

		const regexBefore = "Before: \\[([0-9]), ([0-9]), ([0-9]), ([0-9])\\]";
		const regexCommand = "([0-9]+) ([0-9]+) ([0-9]+) ([0-9]+)";
		const regexAfter = "After:  \\[([0-9]), ([0-9]), ([0-9]), ([0-9])\\]";

		const regexEvalBefore = new RegExp(regexBefore);
		const regexEvalCommand = new RegExp(regexCommand);
		const regexEvalAfter = new RegExp(regexAfter);

		// groups of 4
		for (let i = 0; i < lines.length; i += 4) {
			const matchesBefore = regexEvalBefore.exec(lines[i]);
			const matchesCommand = regexEvalCommand.exec(lines[i + 1]);
			const matchesAfter = regexEvalAfter.exec(lines[i + 2]);

			if (!matchesBefore || matchesBefore.length !== 5 ||
				!matchesCommand || matchesCommand.length !== 5 ||
				!matchesAfter || matchesAfter.length !== 5) {
				throw new Error(`Invalid input: ${lines[i]} ${lines[i + 1]} ${lines[i + 2]}`);
			}

			cases.push(new TestCase(
				new State([
					parseInt(matchesBefore[1]),
					parseInt(matchesBefore[2]),
					parseInt(matchesBefore[3]),
					parseInt(matchesBefore[4])
				]),
				new Instruction(
					parseInt(matchesCommand[1]),
					parseInt(matchesCommand[2]),
					parseInt(matchesCommand[3]),
					parseInt(matchesCommand[4])),
				new State([
					parseInt(matchesAfter[1]),
					parseInt(matchesAfter[2]),
					parseInt(matchesAfter[3]),
					parseInt(matchesAfter[4])
				])
			));
		}
		return cases;
	}
}
