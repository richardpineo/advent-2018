import 'Promise'
import 'colors'
const fs = require('fs')

const puzzleDir = 'puzzle';

console.log("starting up".blue);

let all = Array<string>();
fs.readdirSync(puzzleDir).forEach((file: string) => {
    file = file.replace('.ts', '.js');
    all.push(file);
})

let toRun = function () {
    if (process.argv.length > 2) {
        let tests = process.argv.slice(2);
        console.log(`Running tests ${tests.join(", ")}`.gray);
        return tests;
    }
    console.log("Running all tests...".gray);
    return all;
};

toRun().forEach(r => {
    console.log("-----".green);
    const relativePath = `./${puzzleDir}/${r}`;
    const logPath = r.replace('.js', '');
    console.log(`--> Solving ${logPath}`.red);
    require(relativePath);
    console.log("-----".green);
});

console.log("\nshutting down".blue);
process.exit();
