
import Puzzle from './puzzle'

class Location {
    constructor(public id: string, public x: number, public y: number) { }
}

// 6a: Largest is 3260 by id 9
// 6b: 42535 are close enough
export default class Puzzle6 extends Puzzle {
    constructor() {
        super("6: Dangerous Coordinates");
    }

    solve() {
        this.solve6a();
        this.solve6b();
    }

    solve6a() {
        const locations = this.loadLocations();
        const extents = this.findExtents(locations);
        const topLeft = extents[0];
        const bottomRight = extents[1];
        const ownership = this.findOwnership(locations, topLeft, bottomRight);
        const possibleIds = this.findPossibleIds(locations, ownership, topLeft, bottomRight);
        const largest = this.findLargest(ownership, possibleIds);
        console.log(`6a: Largest is ${largest[0]} by id ${largest[1]}`);
    }

    solve6b() {
        const locations = this.loadLocations();
        const extents = this.findExtents(locations);
        const topLeft = extents[0];
        const bottomRight = extents[1];
        const closeEnough = this.findCloseEnough(locations, topLeft, bottomRight);
        console.log(`6b: ${closeEnough.length} are close enough`);
    }

    distanceToAll(location: Location, locations: Location[]): number {
        let distance = 0;
        locations.forEach(loc => {
            distance += this.computeDistance(loc, location);
        })
        return distance;
    }

    findCloseEnough(locations: Location[], topLeft: Location, bottomRight: Location): Location[] {
        let closeEnough = new Array<Location>();
        const MaxDistance = 10000;
        for (let x = topLeft.x; x <= bottomRight.x; x++) {
            for (let y = topLeft.y; y <= bottomRight.y; y++) {
                let consider = new Location('temp', x, y);
                let distance = this.distanceToAll(consider, locations);
                if (distance < MaxDistance) {
                    closeEnough.push(consider);
                }
            }
        }
        return closeEnough;
    }

    findLargest(ownership: Location[], possibleIds: string[]): [number, string] {
        let largest = 0;
        let largestId = '';
        possibleIds.forEach(id => {
            let size = 0;
            ownership.forEach(loc => {
                if (loc.id === id) {
                    size++;
                }
            })
            if (size > largest) {
                largest = size;
                largestId = id;
            }
        })
        return [largest, largestId];
    }

    findOwnership(locations: Location[], topLeft: Location, bottomRight: Location): Location[] {
        // Walk through the extents and build up the ownership of each block.
        let ownership = new Array<Location>();
        for (let x = topLeft.x; x <= bottomRight.x; x++) {
            for (let y = topLeft.y; y <= bottomRight.y; y++) {
                // Find the id of the closest location
                const closestId = this.findClosest(new Location('temp', x, y), locations);
                if (closestId !== '') {
                    ownership.push(new Location(closestId, x, y));
                }
            }
        }
        return ownership;
    }

    findPossibleIds(locations: Location[], ownership: Location[], topLeft: Location, bottomRight: Location): string[] {
        // Get the set of all ids
        let allIds = locations.map(loc => loc.id);

        let toRemove = new Set<string>();
        for (let x = topLeft.x; x <= bottomRight.x; x++) {
            const idTop = this.idForLocation(new Location('temp', x, topLeft.y), ownership);
            const idBottom = this.idForLocation(new Location('temp', x, bottomRight.y), ownership);
            toRemove.add(idTop);
            toRemove.add(idBottom);
        }
        for (let y = topLeft.y; y <= bottomRight.y; y++) {
            const idLeft = this.idForLocation(new Location('temp', topLeft.x, y), ownership);
            const idRight = this.idForLocation(new Location('temp', bottomRight.x, y), ownership);
            toRemove.add(idLeft);
            toRemove.add(idRight);
        }

        return allIds.filter(id => !toRemove.has(id));
    }

    idForLocation(location: Location, locations: Location[]): string {
        const found = locations.filter(loc => loc.x === location.x && loc.y === location.y);
        return found.length === 1 ? found[0].id : '';
    }

    findClosest(location: Location, locations: Location[]): string {
        let closestDistance = 9999;
        locations.forEach(loc => {
            const distance = this.computeDistance(loc, location);
            if (distance < closestDistance) {
                closestDistance = distance;
            }
        })

        // If there are mroe than one with this distance, reject it.
        const numberMatching = locations.filter(loc => this.computeDistance(loc, location) === closestDistance);
        if (numberMatching.length === 1) {
            return numberMatching[0].id;
        }

        return '';
    }

    computeDistance(a: Location, b: Location) {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }

    findExtents(locations: Location[]): [Location, Location] {
        const first = locations[0];
        let topLeft = new Location("topLeft", first.x, first.y);
        let bottomRight = new Location("bottomRight", first.x, first.y);
        locations.forEach(location => {
            if (location.x < topLeft.x) {
                topLeft.x = location.x;
            }
            if (location.y < topLeft.y) {
                topLeft.y = location.y;
            }
            if (location.x > bottomRight.x) {
                bottomRight.x = location.x;
            }
            if (location.y > bottomRight.y) {
                bottomRight.y = location.y;
            }
        });
        return [topLeft, bottomRight];
    }

    loadLocations(): Location[] {
        const lines = this.readLines('./data/6');

        let locations = new Array<Location>();
        const locationRegex = "([0-9]+), ([0-9]+)";
        const regexEval = new RegExp(locationRegex);
        lines.forEach((line, index) => {
            const matches = regexEval.exec(line);
            if (matches === null) {
                return -1;
            }
            if (matches.length !== 3) {
                throw `Matched expression, but not correctly: ${line}`;
            }
            const location = new Location(index.toString(), parseInt(matches[1]), parseInt(matches[2]));
            locations.push(location);
        })
        return locations;
    }
}
