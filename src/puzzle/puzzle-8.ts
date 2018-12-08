
import Puzzle from './puzzle'

class Node {
    constructor(public metadata: number[], public children: Node[]) {
    }
}

class Tree {
    constructor(public root: Node) {
    }
}

// 8a:
// 8b:
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
        console.log(`1b: ${42}`);
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

    fileToTree(): Tree {
        const text = this.readFile('./data/8');
        const data = text.split(' ').map(t => parseInt(t));
        const root = this.dataToNode(data, 0);
        return new Tree(<Node>root);
    }

    offsetCount(node: Node): number {
        let offset = 0;
        node.children.forEach(c => offset += this.offsetCount(c));
        return offset += node.metadata.length;
    }

    dataToNode(data: number[], offset: number): Node {
        // First 2 are # children and # metadata
        const childCount = data[offset];
        const metadataCount = data[offset + 1];

        // consume the children
        let dataOffset = 2;
        const children = new Array<Node>();
        for (let childIndex = 0; childIndex < childCount; childIndex++) {
            const child = this.dataToNode(data, offset + dataOffset);
            dataOffset += this.offsetCount(child);
            children.push(child);
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
