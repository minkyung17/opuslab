// this file is for tests run from the command line (e.g. by captain tammy)

const profileNewAppt = require("./PROFILE-NEW-APPT");

// get arguments from command line
var args = process.argv.slice(2);

// run based on values entered by user
runProfileNewAppt("CLI", args[0]);