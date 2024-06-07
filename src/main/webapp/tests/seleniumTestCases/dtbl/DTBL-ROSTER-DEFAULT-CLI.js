// this file is for tests run from the command line (e.g. by captain tammy)

const dtblRosterDefault = require("./DTBL-ROSTER-DEFAULT");

// get arguments from command line
var args = process.argv.slice(2);

// run based on values entered by user
runDTBLRosterDefault("CLI", args[0]);