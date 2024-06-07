// this file is for tests run from the command line (e.g. by captain tammy)

const ACPEdit = require("./PERM-ACP-EDIT");

// get arguments from command line
var args = process.argv.slice(2);

// run based on values entered by user
runPermACPEdit("CLI", args[0], args[1], args[2]);