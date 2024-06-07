const cron = require('node-cron');
const dtblCAMOAnalystExport = require("./dtbl/DTBL-CAMO-ANALYST-EXPORT");
const dtblRosterDefault = require("./dtbl/DTBL-ROSTER-DEFAULT");
const dtblRosterFilterCount = require("./dtbl/DTBL-ROSTER-FILTER-COUNT");
const dtblRosterFilterLocationExport = require("./dtbl/DTBL-ROSTER-FILTER-LOCATION-EXPORT");
const dtblRosterNameSearchExport = require("./dtbl/DTBL-ROSTER-NAME-SEARCH-EXPORT");
const dtblRosterShowOnly = require("./dtbl/DTBL-ROSTER-SHOW-ONLY");
const dtblRosterSort = require("./dtbl/DTBL-ROSTER-SORT");
const dtblRosterVisibleRows = require("./dtbl/DTBL-ROSTER-VISIBLE-ROWS");
const perm = require("./perm/PERM");
const permACA = require("./perm-ac/PERM-ACA");
const permACP = require("./perm-ac/PERM-ACP");
const permACPEdit = require("./perm-ac/PERM-ACP-EDIT");
const permClock8YC = require("./perm-clock/PERM-CLOCK-8YC");
const permClockERC = require("./perm-clock/PERM-CLOCK-ERC");
const permCS = require("./perm-cs/PERM-CS");
const profileAddLocations = require("./profile/PROFILE-ADD-LOCATIONS");
const profileEditAppointmentEndedSet = require("./profile/PROFILE-EDIT-APPT-ENDED-SET");
const profileEndAppointmentSet = require("./profile/PROFILE-END-APPT-SET");
const profileNewAppt = require("./profile/PROFILE-NEW-APPT");
const xls = require("./xls/XLS");

// Schedule tasks to be run on the server
// second (optional) | minute | hour | day of month | month | day of week
cron.schedule('15 03 14 * * Wednesday', function() // every Monday at 10am
{
    console.log("scheduler started!");
    // *** EXAMPLES ***
    // runDTBLCAMOAnalystExport("TEST");
    // runDTBLRosterDefault("TEST");
    // runDTBLRosterFilterCount("TEST");
    // runDTBLRosterFilterLocationExport("TEST");
    // runDTBLRosterNameSearchExport("TEST");
    // runDTBLRosterShowOnly("TEST");
    // runDTBLRosterSort("TEST");
    // runDTBLRosterVisibleRows("TEST");
    // runPerm("TEST", "ApptsActive", "oa");
    // runPermACA("DEV", "add", "vcap");
    // runPermACP("TEST", "add", "oa");
    // runPermACPEdit("TEST", "proposed_edit", "dean");
    // runPermClock8YC("TEST", "cap");
    // runPermClockERC("TEST", "cap");
    // runPermCS("TEST", "vcedi");
    // runProfileNewAppt("TEST");
    // runProfileAddLocations("TEST");
    // runProfileEndAppointmentSet("TEST");
    // runProfileEditAppointmentEndedSet("TEST");
    // runXLS("TEST", "ActiveCases");
    
    /*
    runDTBLCAMOAnalystExport("OTTO", "TEST");
    runDTBLRosterDefault("OTTO", "TEST");
    runDTBLRosterFilterCount("OTTO", "TEST");    
    runDTBLRosterFilterLocationExport("OTTO", "TEST");
    runDTBLRosterNameSearchExport("OTTO", "TEST");
    runDTBLRosterShowOnly("OTTO", "TEST");
    runDTBLRosterSort("OTTO", "TEST");
    runDTBLRosterVisibleRows("OTTO", "TEST");
    runPerm("OTTO", "TEST", "all", "all");
    runPermACA("OTTO", "TEST", "add", "all");
    runPermACA("OTTO", "TEST", "edit", "all");
    runPermACA("OTTO", "TEST", "delete", "all");
    */
    runPermACP("OTTO", "TEST", "add", "all");
    runPermACP("OTTO", "TEST", "edit", "all");
    runPermACP("OTTO", "TEST", "delete", "all");
    /*
    runPermACPEdit("OTTO", "TEST", "proposed_edit", "all");
    runPermACPEdit("OTTO", "TEST", "final_edit", "all");
    runPermACPEdit("OTTO", "TEST", "tracking", "all");
    runPermACPEdit("OTTO", "TEST", "proposed_comments", "all");
    runPermACPEdit("OTTO", "TEST", "final_comments", "all");
    runPermClock8YC("OTTO", "TEST", "all");
    runPermClockERC("OTTO", "TEST", "all");
    runPermCS("OTTO", "TEST", "all");
    runProfileNewAppt("OTTO", "TEST");
    runProfileAddLocations("OTTO", "TEST");
    runProfileEndAppointmentSet("OTTO", "TEST");
    runProfileEditAppointmentEndedSet("OTTO", "TEST");
    runXLS("OTTO", "TEST", "all");
    */
});