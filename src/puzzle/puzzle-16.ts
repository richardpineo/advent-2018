
import Puzzle from './puzzle'

class State {
	constructor(public r1: number, public r2: number, public r3: number, public r4: number) {
	}
}

class Command {
	constructor(public opcode: number, public inputA: number, public inputB: number, public output: number) {
	}
}

class TestCase {
	constructor(public before: State, public command: Command, public after: State) {
	}
}

// 16a:
// 16b:
export default class Puzzle16 extends Puzzle {
	constructor() {
		super("16: Watch programming");
	}

	solve() {
		this.solve1a();
	}

	solve1a() {
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
				new State(
					parseInt(matchesBefore[1]),
					parseInt(matchesBefore[2]),
					parseInt(matchesBefore[3]),
					parseInt(matchesBefore[4])),
				new Command(
					parseInt(matchesCommand[1]),
					parseInt(matchesCommand[2]),
					parseInt(matchesCommand[3]),
					parseInt(matchesCommand[4])),
				new State(
					parseInt(matchesAfter[1]),
					parseInt(matchesAfter[2]),
					parseInt(matchesAfter[3]),
					parseInt(matchesAfter[4]))
			));
		}

		console.log(`15a: ${cases.length} cases loaded`);
	}
}
