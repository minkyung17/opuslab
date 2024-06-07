// this file is for tests run from the command line (e.g. by captain tammy)

const dtblRosterFilterCount = require("./DTBL-ROSTER-FILTER-COUNT");

// get arguments from command line
var args = process.argv.slice(2);

// run based on values entered by user
runDTBLRosterFilterCount("CLI", args[0]);