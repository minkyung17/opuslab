runProfileAddLocations = (caller, ottoEnvironment) =>
{
	const profileLib = require("./PROFILE-LIB");
    const profileAddLocationsTest = require("./PROFILE-ADD-LOCATIONS-TEST");
    
    
	///////////////////////////////////////////////////
	// ALL ROLES, ALL TESTS FOR PROFILE-ADD-LOCATIONS
	///////////////////////////////////////////////////
	
	// define all roles
	var allRolesForProfile_Add_Locations =
	[
		"apo"	
	];
	
	// define all tests
	var allTestsForProfile_Add_Locations =
	[
		"ProfileSearch"
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
		profileLib.logThis("usage:   " + "node (relative dir/)PROFILE-ADD-LOCATIONS-CLI.js [env] [test number(s)] [browser --optional] [headed --optional]");
		profileLib.logThis("example: " + "node profile/PROFILE-ADD-LOCATIONS-CLI.js TEST chrome headed");
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
	// MAIN
	///////////////////////////////////////////////////

	takeMyProfileAddLocationsOrder = async () =>
	{	
        await profileAddLocationsTest.runProfileAddLocationsTest(caller, argsEnvironment);
	}
	
	
	///////////////////////////////////////////////////
	// RUN TEST(S)
	///////////////////////////////////////////////////

	// run tests
	profileLib.executeRunOrder(runType, allRolesForProfile_Add_Locations, allTestsForProfile_Add_Locations, "apo", "ProfileSearch", takeMyProfileAddLocationsOrder, overallStartTime);
}