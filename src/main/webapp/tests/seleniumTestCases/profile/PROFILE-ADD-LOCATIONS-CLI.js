// this file is for tests run from the command line (e.g. by captain tammy)

const profileAddLocations = require("./PROFILE-ADD-LOCATIONS");

// get arguments from command line
var args = process.argv.slice(2);

// run based on values entered by user
runProfileAddLocations("CLI", args[0]);