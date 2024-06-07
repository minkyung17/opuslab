// this file is for tests run from the command line (e.g. by captain tammy)

const perm = require("./PERM");

// get arguments from command line
var args = process.argv.slice(2);

// run based on values entered by user
runPerm("CLI", args[0], args[1], args[2]);