// <reference path="../typings/globals/node/index.d.ts" />
import * as fs from "fs";

export default abstract class Puzzle {

    constructor(public name: string) { }
    abstract solve(): void;

    readLines(relativePath: string): Array<string> {
        const lines: Array<string> = fs.readFileSync(relativePath).toString().split("\n");
        return lines;
    }
}
