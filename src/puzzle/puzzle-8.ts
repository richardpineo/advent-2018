
import Puzzle from './puzzle'

class Node {
	constructor(public metadata: number[], public children: Node[]) {
	}
}

class Tree {
	constructor(public root: Node) {
	}
}

// 8a: 46829 is the sum of the metadata.
// 8a: 37450 is the value of the root node.
export default class Puzzle8 extends Puzzle {
	constructor() {
		super("1: Christmas trees");
	}

	solve() {
		this.solveA();
		this.solveB();
	}

	solveA() {
		const tree = this.fileToTree();

		// Add up the metadata
		const sum = this.addMetadata(tree.root);
		console.log(`8a: ${sum} is the sum of the metadata.`);
	}

	solveB() {
		const tree = this.fileToTree();

		// Add up the metadata
		const value = this.findValue(tree.root);
		console.log(`8a: ${value} is the value of the root node.`);
	}

	addMetadata(node: Node): number {
		let sum = 0;
		node.children.forEach(c => {
			sum += this.addMetadata(c);
		});
		node.metadata.forEach(m => {
			sum += m;
		});
		return sum;
	}

	findValue(node: Node): number {
		if (node.children.length === 0) {
			return this.addMetadata(node);
		}

		let value = 0;
		node.metadata.forEach(m => {
			const index = m - 1;
			if (index >= 0 && index < node.children.length) {
				value += this.findValue(node.children[index]);
			}
		});
		return value;
	}

	fileToTree(): Tree {
		const text = this.readFile('./data/8');
		const data = text.split(' ').map(t => parseInt(t));
		const root = this.dataToNode(data, 0);
		return new Tree(<Node>root);
	}

	offsetCount(node: Node): number {
		let offset = 0;
		node.children.forEach(c => offset += this.offsetCount(c));
		// Add 2 for the header
		return offset += node.metadata.length + 2;
	}

	dataToNode(data: number[], offset: number): Node {
		// First 2 are # children and # metadata
		const childCount = data[offset];
		const metadataCount = data[offset + 1];
		let dataOffset = offset + 2;

		// consume the children
		const children = new Array<Node>();
		for (let childIndex = 0; childIndex < childCount; childIndex++) {
			const child = this.dataToNode(data, dataOffset);
			children.push(child);
			dataOffset += this.offsetCount(child);
		}

		// consume the metadata
		let metadata = new Array<number>();
		for (let metadataIndex = 0; metadataIndex < metadataCount; metadataIndex++) {
			metadata.push(data[dataOffset]);
			dataOffset++;
		}

		return new Node(metadata, children);
	}
}
