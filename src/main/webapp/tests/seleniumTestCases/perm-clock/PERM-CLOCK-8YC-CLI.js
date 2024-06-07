// this file is for tests run from the command line (e.g. by captain tammy)

const clock8YC = require("./PERM-CLOCK-8YC");

// get arguments from command line
var args = process.argv.slice(2);

// run based on values entered by user
runPermClock8YC("CLI", args[0], args[1]);