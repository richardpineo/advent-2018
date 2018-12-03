import Puzzle from './src/puzzle/puzzle'
import Puzzle1a from './src/puzzle/puzzle-1a';
import Puzzle1b from './src/puzzle/puzzle-1b';
import Puzzle2a from './src/puzzle/puzzle-2a';

export const puzzles = Array<Puzzle>();
puzzles.push(new Puzzle1a());
puzzles.push(new Puzzle1b());
puzzles.push(new Puzzle2a());