// this file is for tests run from the command line (e.g. by captain tammy)

const profileEditAppointmentEndedSet = require("./PROFILE-EDIT-APPT-ENDED-SET");

// get arguments from command line
var args = process.argv.slice(2);

// run based on values entered by user
runProfileEditAppointmentEndedSet("CLI", args[0]);