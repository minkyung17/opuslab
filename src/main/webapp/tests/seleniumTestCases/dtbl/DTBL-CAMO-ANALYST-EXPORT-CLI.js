// this file is for tests run from the command line (e.g. by captain tammy)

const dtblCAMOAnalystExport = require("./DTBL-CAMO-ANALYST-EXPORT");

// get arguments from command line
var args = process.argv.slice(2);

// run based on values entered by user
runDTBLCAMOAnalystExport("CLI", args[0]);