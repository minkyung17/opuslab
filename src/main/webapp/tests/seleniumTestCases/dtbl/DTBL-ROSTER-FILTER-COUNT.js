runDTBLRosterFilterCount = (caller, ottoEnvironment) =>
{
	const dtblLib = require("./DTBL-LIB");
    const dtblRosterFilterCountTest = require("./DTBL-ROSTER-FILTER-COUNT-TEST");
    
    
	///////////////////////////////////////////////////
	// ALL ROLES, ALL TESTS FOR DTBL-ROSTER-FILTER-COUNT
	///////////////////////////////////////////////////
	
	// define all roles
	var allRolesForDTBL_Roster_Filter_Count =
	[
		"oa"
	];
	
	// define all tests
	var allTestsForDTBL_Roster_Filter_Count =
	[
		"ApptsActive"
	];
	
	
	///////////////////////////////////////////////////
	// CALLER
	///////////////////////////////////////////////////
	
	// print which source is calling/running the test
	dtblLib.logThis("caller: " + caller);
	
	
	///////////////////////////////////////////////////
	// USAGE
	///////////////////////////////////////////////////
	
	// let user know proper usage
	logProperUsage = () =>
	{
		dtblLib.logThis("usage:   " + "node (relative dir/)DTBL-ROSTER-FILTER-COUNT-CLI.js [env] [browser --optional] [headed --optional]");
		dtblLib.logThis("example: " + "node dtbl/DTBL-ROSTER-FILTER-COUNT-CLI.js TEST chrome headed");
	}
	logProperUsage();
	
	
	///////////////////////////////////////////////////
	// INITIAL SETUP
	///////////////////////////////////////////////////

	// if brackets used for mini-batch in future, regex for splitting bracketed roles separated by commas and spaces:
	// ==>   \[[a-zA-Z\,\ ]*\]\ *   <==

	// print to console when test started
	const overallStartTime = new Date();
	dtblLib.logThis("run started at: " + dtblLib.formatTime(overallStartTime));

	// get args from command line after node and .js
	const args = process.argv.slice(2);
	
	var argsEnvironment = args[0];
	dtblLib.logThis("entered environment: " + argsEnvironment);
	if((argsEnvironment == null) ||
		((argsEnvironment !== "DEV") &&
		(argsEnvironment !== "STAGE") &&
		(argsEnvironment !== "TEST")))
	{
		if(argsEnvironment == null) // must be otto/scheduler
		{
		    argsEnvironment = ottoEnvironment;
		    dtblLib.logThis("environment changed to OTTO: " + ottoEnvironment);
		}
		else
		{
			dtblLib.logThis("don't you know everything needs a PROPER ENVIRONMENT to survive?");
			process.exit();
		}
	}

	const argsBrowser = args[1];
	dtblLib.logThis(argsBrowser == null ? "entered browser: not entered, defaulting to chrome" : "entered browser: " + argsBrowser);

	const headless = args[2];
	dtblLib.logThis(headless == null ? "not entered, defaulting to headless" : "entered headless: " + headless);
	
	// demarcate entered values
	dtblLib.logThis("---");
	
	
	///////////////////////////////////////////////////
	// RUNTYPE
	///////////////////////////////////////////////////
    
	// only uses oa so hard-code
	const runType = "single";
	
	
	///////////////////////////////////////////////////
	// LOGGING HEADERS TO FILE
	///////////////////////////////////////////////////
	
	// set up headers and applicable report file to write report file headers
	let reportFileName = getReportFileName(caller, "DTBL");
	let reportFileHeaders = getReportFileHeaders("DTBL");
	
	// log headers to report file only if CLI since JSON doesn't use headers
	if(caller === "CLI")
	{
	    logHeadersToReportFile(reportFileName, reportFileHeaders);
	}
	
	
	///////////////////////////////////////////////////
	// MAIN
	///////////////////////////////////////////////////

	takeMyDTBLRosterFilterCountOrder = async () =>
	{	
        await dtblRosterFilterCountTest.runDTBLRosterFilterCountTest(caller, argsEnvironment);
	}
	
	
	///////////////////////////////////////////////////
	// RUN TEST(S)
	///////////////////////////////////////////////////

	// run tests
	dtblLib.executeRunOrder(runType, allRolesForDTBL_Roster_Filter_Count, allTestsForDTBL_Roster_Filter_Count, "apo", "ProfileAppointmentSet", takeMyDTBLRosterFilterCountOrder, overallStartTime);
}