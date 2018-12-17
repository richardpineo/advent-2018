
import Puzzle from './puzzle'

class Node {
	constructor(public value: number, next: Node | undefined, prev: Node | undefined) {
		this.next = next || this;
		this.prev = prev || this;
	}

	public next: Node;
	public prev: Node;

	pushBefore(value: number): Node {
		const node = new Node(value, this, this.next);
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
// 14b:
export default class Puzzle14 extends Puzzle {
	constructor() {
		super("14: Hot Choc");
	}

	solve() {
		/*
		this.solveA(9);
		this.solveA(5);
		this.solveA(18);
		this.solveA(2018); */
		this.solveA(894501);
		this.solveB();
	}

	solveA(recipes: number) {
		const start = new Node(3, undefined, undefined);
		let elf1 = start;
		let elf2 = start.push(7);
		let numRecipes = 2;

		this.dump(start, elf1, elf2);
		const atLeast = recipes + 10;

		for (let i = 0; numRecipes <= atLeast; i++) {

			// Add scores
			const combined = elf1.value + elf2.value;

			if (combined >= 10) {
				start.pushBefore(1);
				numRecipes++;
			}
			numRecipes++;
			start.pushBefore(combined % 10);

			// Move elves
			elf1 = this.moveElf(elf1);
			elf2 = this.moveElf(elf2);

			this.dump(start, elf1, elf2);
		}

		let score = '';
		let scoreStart = start;
		for (let i = 0; i < recipes; i++) {
			scoreStart = scoreStart.next;
		}
		for (let i = 0; i < 10; i++) {
			score += scoreStart.value.toString();
			scoreStart = scoreStart.next;
		}

		console.log(`${score} for ${numRecipes} recipes - what a score!`);
	}

	solveB() {
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