import 'Promise'
import 'colors'

console.log("starting up".blue);

let all = [
    "./1a"
];

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
    console.log(`--> Solving advent puzzle ${r}`.red);
    require(r);
    console.log("-----".green);
});

console.log("\nshutting down".blue);
process.exit();
