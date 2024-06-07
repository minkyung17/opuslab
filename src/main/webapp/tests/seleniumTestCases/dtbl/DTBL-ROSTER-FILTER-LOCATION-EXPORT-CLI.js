// this file is for tests run from the command line (e.g. by captain tammy)

const dtblRosterFilterLocationExport = require("./DTBL-ROSTER-FILTER-LOCATION-EXPORT");

// get arguments from command line
var args = process.argv.slice(2);

// run based on values entered by user
runDTBLRosterFilterLocationExport("CLI", args[0]);