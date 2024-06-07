// this file is for tests run from the command line (e.g. by captain tammy)

const dtblRosterVisibleRows = require("./DTBL-ROSTER-VISIBLE-ROWS");

// get arguments from command line
var args = process.argv.slice(2);

// run based on values entered by user
runDTBLRosterVisibleRows("CLI", args[0]);