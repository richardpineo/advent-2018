// <reference path="../typings/globals/node/index.d.ts" />
import * as fs from "fs";

export default abstract class Puzzle {

    constructor(public name: string) { }
    abstract solve(): void;

    readFile(relativePath: string): string {
        return fs.readFileSync(relativePath).toString();
    }
    readLines(relativePath: string): Array<string> {
        return this.readFile(relativePath).split("\n");
    }
}
