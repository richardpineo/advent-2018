import 'Promise'
import 'colors'
import Puzzle from './src/puzzle/puzzle'
import { puzzles } from './all-puzzles'

console.log("starting up".blue);

const toRun = function (): Array<Puzzle> {
    if (process.argv.length > 2) {
        let tests = process.argv.slice(2);
        console.log(`Running tests ${tests.join(", ")}`.gray);
        // FIXME
        //        return tests;
        console.log('NOT IMPLEMENTED'.yellow)
    }
    console.log("Running all tests...".gray);
    return puzzles;
};

toRun().forEach(puzzle => {
    console.log("-----".green);
    console.log(`--> Solving ${puzzle.name}`.red);
    puzzle.solve();
    console.log("-----".green);
});

console.log("\nshutting down".blue);
process.exit();
