runProfileEditAppointmentEndedSet = (caller, ottoEnvironment) =>
{
	const profileLib = require("./PROFILE-LIB");
    const profileEditAppointmentEndedSetTest = require("./PROFILE-EDIT-APPT-ENDED-SET-TEST");
    
    
	///////////////////////////////////////////////////
	// ALL ROLES, ALL TESTS FOR PPROFILE-END-APPT-SET
	///////////////////////////////////////////////////
	
	// define all roles
	var allRolesForProfile_Edit_Appointment_Ended_Set =
	[
		"apo"	
	];
	
	// define all tests
	var allTestsForProfile_Edit_Appointment_Ended_Set =
	[
		"ProfileAppointmentSet"
	];
	
	
	///////////////////////////////////////////////////
	// CALLER
	///////////////////////////////////////////////////
	
	// print which source is calling/running the test
	profileLib.logThis("caller: " + caller);
	
	
	///////////////////////////////////////////////////
	// USAGE
	///////////////////////////////////////////////////
	
	// let user know proper usage
	logProperUsage = () =>
	{
		profileLib.logThis("usage:   " + "node (relative dir/)PROFILE-EDIT-APPT-ENDED-SET-CLI.js [env] [test number(s)] [browser --optional] [headed --optional]");
		profileLib.logThis("example: " + "node profile/PROFILE-EDIT-APPT-ENDED-SET-CLI.js TEST chrome headed");
	}
	logProperUsage();
	
	
	///////////////////////////////////////////////////
	// INITIAL SETUP
	///////////////////////////////////////////////////

	// if brackets used for mini-batch in future, regex for splitting bracketed roles separated by commas and spaces:
	// ==>   \[[a-zA-Z\,\ ]*\]\ *   <==

	// print to console when test started
	const overallStartTime = new Date();
	profileLib.logThis("run started at: " + profileLib.formatTime(overallStartTime));

	// get args from command line after node and .js
	const args = process.argv.slice(2);
	
	var argsEnvironment = args[0];
	profileLib.logThis("entered environment: " + argsEnvironment);
	if((argsEnvironment == null) ||
		((argsEnvironment !== "DEV") &&
		(argsEnvironment !== "STAGE") &&
		(argsEnvironment !== "TEST")))
	{
		if(argsEnvironment == null) // must be otto/scheduler
		{
		    argsEnvironment = ottoEnvironment;
		    profileLib.logThis("environment changed to OTTO: " + ottoEnvironment);
		}
		else
		{
			profileLib.logThis("don't you know everything needs a PROPER ENVIRONMENT to survive?");
			process.exit();
		}
	}

	const argsBrowser = args[1];
	profileLib.logThis(argsBrowser == null ? "entered browser: not entered, defaulting to chrome" : "entered browser: " + argsBrowser);

	const headless = args[2];
	profileLib.logThis(headless == null ? "not entered, defaulting to headless" : "entered headless: " + headless);
	
	// demarcate entered values
	profileLib.logThis("---");
	
	
	///////////////////////////////////////////////////
	// RUNTYPE
	///////////////////////////////////////////////////
    
	// only uses apo so hard-code
	const runType = "single";
	
	
	///////////////////////////////////////////////////
	// LOGGING HEADERS TO FILE
	///////////////////////////////////////////////////
	
	// set up headers and applicable report file to write report file headers
	let reportFileName = getReportFileName(caller, "PROFILE");
	let reportFileHeaders = getReportFileHeaders("PROFILE");
	
	// log headers to report file only if CLI since JSON doesn't use headers
	if(caller === "CLI")
	{
	    logHeadersToReportFile(reportFileName, reportFileHeaders);
	}
	
	
	///////////////////////////////////////////////////
	// RUN TEST(S)
	///////////////////////////////////////////////////

	// run tests
	profileLib.executeRunOrder(runType, allRolesForProfile_Edit_Appointment_Ended_Set, allTestsForProfile_Edit_Appointment_Ended_Set, "apo", "ProfileAppointmentSet", takeMyProfileEditAppointmentEndedSetOrder, overallStartTime);
}