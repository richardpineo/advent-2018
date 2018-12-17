
import Puzzle from './puzzle'
import { start } from 'repl';

class Node {
	constructor(public value: number, next: Node | undefined, prev: Node | undefined) {
		this.next = next || this;
		this.prev = prev || this;
	}

	public next: Node;
	public prev: Node;

	pushBefore(value: number): Node {
		const node = new Node(value, this, this.prev);
		this.prev.next = node;
		this.prev = node;
		return node;
	}

	push(value: number): Node {
		const node = new Node(value, this.next, this);
		this.next.prev = node;
		this.next = node;
		return node;
	}
}

// 14a: 2157138126 for 894512 recipes - what a score!
// 14b: 20365081 for 894501 - what a score!
export default class Puzzle14 extends Puzzle {
	constructor() {
		super("14: Hot Choc");
	}

	solve() {
		this.solveA(9);
		this.solveA(5);
		this.solveA(18);
		this.solveA(2018);
		this.solveA(894501);

		this.solveB('51589');
		this.solveB('01245');
		this.solveB('92510');
		this.solveB('59414');
		this.solveB('894501');
	}

	solveA(recipes: number) {
		// Stop when we have enough
		const stopIf = (start: Node, count: number) => recipes + 10 < count;
		const start = this.solveFor(stopIf)

		let score = '';
		let scoreStart = start;
		for (let i = 0; i < recipes; i++) {
			scoreStart = scoreStart.next;
		}
		for (let i = 0; i < 10; i++) {
			score += scoreStart.value.toString();
			scoreStart = scoreStart.next;
		}

		console.log(`14a: ${score} for ${recipes} recipes - what a score!`);
	}

	solveB(sequence: string) {

		const numbers = sequence.split('').map(n => parseInt(n));

		let length = 0;
		const stopIf = (start: Node, count: number) => {
			/*
			if (count % 10000 === 0) {
				console.log(`${count} processed`)
			}*/

			let result = this.matches(start, numbers);
			if (result === undefined) {
				return false;
			}
			length = result;
			return true;
		}

		this.solveFor(stopIf);
		console.log(`14b: ${length} for ${sequence} - what a score!`);
	}

	matches(start: Node, numbers: number[]): number | undefined {
		let current = start.prev;
		for (let i = numbers.length - 1; i >= 0; i--) {
			if (current.value != numbers[i]) {
				return undefined;
			}
			current = current.prev;
		}
		// See how long it is
		let score = 1;
		while (current != start) {
			score++;
			current = current.prev;
		}
		return score;
	}

	solveFor(shouldStop: (start: Node, count: number) => boolean): Node {
		const start = new Node(3, undefined, undefined);
		let elf1 = start;
		let elf2 = start.push(7);

		this.dump(start, elf1, elf2);

		for (let i = 0; !shouldStop(start, i); i++) {

			// Add scores
			const combined = elf1.value + elf2.value;

			if (combined >= 10) {
				start.pushBefore(1);
			}

			if (shouldStop(start, i)) {
				return start;
			}

			start.pushBefore(combined % 10);

			// Move elves
			elf1 = this.moveElf(elf1);
			elf2 = this.moveElf(elf2);

			this.dump(start, elf1, elf2);
		}
		return start;
	}

	moveElf(elf: Node) {
		const count = elf.value + 1;
		for (let i = 0; i < count; i++) {
			elf = elf.next;
		}
		return elf;
	}

	dump(start: Node, elf1: Node, elf2: Node) {
		return;

		let current = start;
		let line = '';
		do {
			if (current === elf1) {
				line += `(${current.value})`;
			}
			else if (current === elf2) {
				line += `[${current.value}]`;
			}
			else {
				line += ` ${current.value} `;
			}
			current = current.next;
		} while (current !== start);
		console.log(line.gray);
	}
}