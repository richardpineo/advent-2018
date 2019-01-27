
import Puzzle from './puzzle'

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
// 16b:
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
