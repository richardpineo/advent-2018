
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

	private turnCount = 0;

	moveOrder(track: Track) {
		return this.location.x * track.dimX + this.location.y;
	}

	turnRight() {
		switch (this.facing) {
			case Direction.North:
				this.facing = Direction.East;
			case Direction.East:
				this.facing = Direction.South;
			case Direction.South:
				this.facing = Direction.West;
			case Direction.West:
				this.facing = Direction.North;
		}
	}

	turnLeft() {
		switch (this.facing) {
			case Direction.North:
				this.facing = Direction.West;
			case Direction.West:
				this.facing = Direction.South;
			case Direction.South:
				this.facing = Direction.East;
			case Direction.East:
				this.facing = Direction.North;
		}
	}

	advance() {
		switch (this.facing) {
			case Direction.North:
				this.location.y += -1;
				break;
			case Direction.South:
				this.location.y += 1;
				break;
			case Direction.West:
				this.location.x += -1;
				break;
			case Direction.East:
				this.location.x += 1;
				break;
		}
	}

	move(track: Track) {
		this.advance();

		const part = track.getPart(this.location);
		switch (part) {
			case TrackPart.Clockwise:
				this.turnRight();
				break;
			case TrackPart.Widdershins:
				this.turnLeft();
				break;
			case TrackPart.Intersection: {
				const action = this.turnCount % 3;
				switch (action) {
					case 0:
						this.turnLeft();
						break;
					case 1:
					case 2:
						this.turnRight();
						break;
				}
				this.turnCount++;
			}
		}
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
		const collision = this.runUntilCollision();
		if (collision === undefined) {
			console.log(`No collision found!`.red);
		}
		else {
			console.log(`${collision.x},${collision.y} collision detected`)
		}
	}

	private solveB() {
	}

	private runUntilCollision(): Location | undefined {
		for (let tick = 0; tick < 10000; tick++) {
			// Sort the carts by move order
			this.carts.sort((a, b) => a.moveOrder(this.track) - b.moveOrder(this.track));
			for (let i = 0; i < this.carts.length; i++) {
				const c = this.carts[i];

				c.move(this.track);

				// check for collision
				const collision = this.hasCollisionAt();
				if (collision !== undefined) {
					return collision;
				}
			}
		}
		return undefined;
	}

	private hasCollisionAt(): Location | undefined {
		const grouped = _.groupBy(this.carts, c => c.moveOrder(this.track));
		const collisions = _.filter(grouped, g => g.length > 1);
		if (collisions.length > 0) {
			return collisions[0][0].location;
		}
		return undefined;
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
