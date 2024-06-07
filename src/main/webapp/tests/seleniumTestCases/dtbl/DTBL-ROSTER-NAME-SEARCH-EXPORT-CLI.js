// this file is for tests run from the command line (e.g. by captain tammy)

const dtblRosterNameSearchExport = require("./DTBL-ROSTER-NAME-SEARCH-EXPORT");

// get arguments from command line
var args = process.argv.slice(2);

// run based on values entered by user
runDTBLRosterNameSearchExport("CLI", args[0]);