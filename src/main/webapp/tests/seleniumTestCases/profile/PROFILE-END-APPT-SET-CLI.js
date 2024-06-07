// this file is for tests run from the command line (e.g. by captain tammy)

const profileEndAppointmentSet = require("./PROFILE-END-APPT-SET");

// get arguments from command line
var args = process.argv.slice(2);

// run based on values entered by user
runProfileEndAppointmentSet("CLI", args[0]);