import 'Promise'
import 'colors'
import Puzzle from './src/puzzle/puzzle'
import { puzzles } from './all-puzzles'

console.log("The solution often turns out more beautiful than the puzzle.".red);
console.log("  - Richard Dawkins\n".gray);

puzzles.forEach(puzzle => {
    console.log(`♘ Puzzle ${puzzle.name}`.green);
    const start = new Date().getTime();
    puzzle.solve();
    const end = new Date().getTime();
    console.log(`♞ ${(end - start) / 1000} seconds\n`.gray);

});

console.log("\nshutting down".blue);
process.exit();
