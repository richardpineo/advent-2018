
import Puzzle from './puzzle'
import * as _ from 'lodash'

enum Direction {
	North = 'N',
	South = 'S',
	East = 'E',
	West = 'W'
}

class Location {
	constructor(public x: number, public y: number) { }
}

class Cart {
	constructor(public location: Location, public facing: Direction) {
	}
}

enum TrackPart {
	Empty = ' ',
	NorthSouth = '|',
	EastWest = '-',
	Intersection = '+',
	Clockwise = '/',
	Widdershins = '\\'
}

class Track {
	constructor(public dimX: number, dimY: number) {
	}

	public getPart(location: Location) {
		const found = this.parts.get(location);
		return found === undefined ? TrackPart.Empty : found;
	}
	public setPart(location: Location, part: TrackPart) {
		this.parts.set(location, part);
	}

	private parts = new Map<Location, TrackPart>();
}

export default class Puzzle12 extends Puzzle {
	constructor() {
		super("13: Mine cart mayhem");
	}

	private track!: Track;
	private carts = new Array<Cart>();

	solve() {
		this.loadTrackAndCarts('13-test');
		this.solveA();
		this.solveB();
	}

	private solveA() {
		console.log(`42`);
	}

	private solveB() {
	}

	private loadTrackAndCarts(filePath: string) {
		const lines = this.readLines(`./data/${filePath}`);

		// Find the dims
		const dimY = lines.length;
		const dimX = _.max(lines.map(l => l.length));
		this.track = new Track(<number>dimX, dimY);

		lines.forEach((line, y) => {
			const lineParts = line.split('');
			lineParts.forEach((lp, x) => {
				const trackPart = this.toTrackPart(lp);
				const location = new Location(x, y);
				this.track.setPart(location, trackPart);

				const cart = this.toCart(location, lp);
				if (cart !== undefined) {
					this.carts.push(cart);
				}
			});
		})
	}

	private toCart(location: Location, s: string): Cart | undefined {
		switch (s) {
			case ">":
				return new Cart(location, Direction.East);
			case "<":
				return new Cart(location, Direction.West);
			case "^":
				return new Cart(location, Direction.North);
			case "v":
				return new Cart(location, Direction.South);
			default:
				return undefined;
		}
	}

	private toTrackPart(s: string): TrackPart {
		switch (s) {
			case "/":
				return TrackPart.Clockwise;
			case "\\":
				return TrackPart.Widdershins;
			case "-":
			case ">":
			case "<":
				return TrackPart.EastWest;
			case "|":
			case "^":
			case "v":
				return TrackPart.NorthSouth;
			case "+":
				return TrackPart.Intersection;
			case " ":
				return TrackPart.Empty;
			default:
				throw (`unknown part: ${s}`);
		}
	};
}
