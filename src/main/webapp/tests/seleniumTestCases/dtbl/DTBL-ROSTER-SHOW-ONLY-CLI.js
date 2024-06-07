// this file is for tests run from the command line (e.g. by captain tammy)

const dtblRosterShowOnly = require("./DTBL-ROSTER-SHOW-ONLY");

// get arguments from command line
var args = process.argv.slice(2);

// run based on values entered by user
runDTBLRosterShowOnly("CLI", args[0]);