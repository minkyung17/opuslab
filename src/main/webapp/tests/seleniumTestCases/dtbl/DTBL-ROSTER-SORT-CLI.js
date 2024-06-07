// this file is for tests run from the command line (e.g. by captain tammy)

const dtblRosterSort = require("./DTBL-ROSTER-SORT");

// get arguments from command line
var args = process.argv.slice(2);

// run based on values entered by user
runDTBLRosterSort("CLI", args[0]);