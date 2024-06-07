runPermClockERC = (caller, ottoEnvironment, ottoRole) =>
{
	const permClockLib = require("./PERM-CLOCK-LIB");
	const permClockTest = require("./PERM-CLOCK-ERC-TEST");
	
	
	///////////////////////////////////////////////////
	// ALL ROLES, ALL TESTS FOR PERM-CLOCK-ERC
	///////////////////////////////////////////////////
	
	// define all roles
	var allRolesForPERM_ERC =
	[
		"aa",
		"areaChair",
		"apoStaff",
		"apo",
		"cap",
		"da",
		"dean",
		"deptChair",
		"div",
		"divdean",
		"librarySa",
		"oa",
		"sa1",
		"specChair",
		"specialty",
		"vcap"
	];
	
	// define all tests
	var allTestsForPERM_Clock =
	[
		"ExcellenceReviewClock"
	];
	
	
	///////////////////////////////////////////////////
	// CALLER
	///////////////////////////////////////////////////
	
	// print which source is calling/running the test
	permClockLib.logThis("caller: " + caller);
	
	
	///////////////////////////////////////////////////
	// USAGE
	///////////////////////////////////////////////////

	// let user know proper usage
	logProperUsage = () =>
	{
		permClockLib.logThis("usage:   " + "node (relative dir/)PERM-CLOCK-ERC-CLI.js [ENV] [  [role(s)] --comma-separated, no spaces  ] [browser --optional] [headed --optional]");
		permClockLib.logThis("example: " + "node perm-clock/PERM-CLOCK-ERC-CLI.js TEST cap,oa,div chrome headed");
	}
	logProperUsage();
	
	
	///////////////////////////////////////////////////
	// INITIAL SETUP
	///////////////////////////////////////////////////

	// if brackets used for mini-batch in future, regex for splitting bracketed roles separated by commas and spaces:
	// ==>   \[[a-zA-Z\,\ ]*\]\ *   <==

	// print to console when test started
	const overallStartTime = new Date();
	permClockLib.logThis("run started at: " + permClockLib.formatTime(overallStartTime));

	// get args from command line after node and .js
	const args = process.argv.slice(2);
	
	var argsEnvironment = args[0];
	permClockLib.logThis("entered environment: " + argsEnvironment);
	if((argsEnvironment == null) ||
		((argsEnvironment !== "DEV") &&
		(argsEnvironment !== "STAGE") &&
		(argsEnvironment !== "TEST")))
	{
		if(argsEnvironment == null) // must be otto/scheduler
		{
		    argsEnvironment = ottoEnvironment;
		    permClockLib.logThis("environment changed to OTTO: " + ottoEnvironment);
		}
		else
		{
			permClockLib.logThis("don't you know everything needs a PROPER ENVIRONMENT to survive?");
			process.exit();
		}
	}
	
	var argsRole = args[1];
	permClockLib.logThis("entered role is: " + argsRole);
	if(argsRole == null)
	{
	    argsRole = ottoRole;
	    permClockLib.logThis("role changed to OTTO: " + ottoRole);
	}

	const argsBrowser = args[2];
	permClockLib.logThis(argsBrowser == null ? "entered browser: not entered, defaulting to chrome" : "browser: " + argsBrowser);

	const headless = args[3] == null ? "not entered, defaulting to headless" : "false";
	permClockLib.logThis("entered headless: " + headless);
	permClockLib.logThis("---");
	

	///////////////////////////////////////////////////
	// RUNTYPE
	///////////////////////////////////////////////////
    
	// set run type
	const runType = permClockLib.determineRunType(argsRole);


	///////////////////////////////////////////////////
	// ROLE VALIDATION
	///////////////////////////////////////////////////

	// validate entered role
	const processedRole = permClockLib.handleRole(runType, allRolesForPERM_ERC, argsRole);
	
	
	///////////////////////////////////////////////////
	// LOGGING HEADERS TO FILE
	///////////////////////////////////////////////////
	
	// set up headers and applicable report file to write report file headers
	let reportFileName = getReportFileName(caller, "PERM-CLOCK");
	let reportFileHeaders = getReportFileHeaders("PERM-CLOCK");
	
	// log headers to report file only if CLI since JSON doesn't use headers
	if(caller === "CLI")
	{
	    logHeadersToReportFile(reportFileName, reportFileHeaders);
	}
	
	
	///////////////////////////////////////////////////
	// ROLE SETTINGS
	///////////////////////////////////////////////////
	
	// define role requirements
	const rolesButtonVisibility = new Map();
	    rolesButtonVisibility.set("aa", "denied");
	    rolesButtonVisibility.set("apo", "access");
	    rolesButtonVisibility.set("apoStaff", "access");
	    rolesButtonVisibility.set("areaChair", "denied");
	    rolesButtonVisibility.set("cap", "denied");
	    rolesButtonVisibility.set("da", "access");
	    rolesButtonVisibility.set("dean", "denied");
	    rolesButtonVisibility.set("deptChair", "denied");
	    rolesButtonVisibility.set("div", "access");
	    rolesButtonVisibility.set("divdean", "denied");
	    rolesButtonVisibility.set("librarySa", "access");
	    rolesButtonVisibility.set("oa", "access");
	    rolesButtonVisibility.set("sa1", "access");
	    rolesButtonVisibility.set("specChair", "denied");
	    rolesButtonVisibility.set("specialty", "denied");
	    rolesButtonVisibility.set("vcap", "denied");
	    
	    
	///////////////////////////////////////////////////
	// MAIN
	///////////////////////////////////////////////////

	takeMyPERMClockERCOrder = async (processedRole) =>
	{
		let shouldSee = rolesButtonVisibility.get(processedRole);
	
		await permClockTest.runPermERCTest(caller, argsEnvironment, processedRole, shouldSee) 
	}
	
	
	///////////////////////////////////////////////////
	// RUN TEST(S)
	///////////////////////////////////////////////////

	// run tests
	permClockLib.executeRunOrder(runType, allRolesForPERM_ERC, allTestsForPERM_Clock, processedRole, "ExcellenceReviewClock", takeMyPERMClockERCOrder, overallStartTime);
}