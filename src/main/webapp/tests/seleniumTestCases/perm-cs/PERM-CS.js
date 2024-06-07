runPermCS = (caller, ottoEnvironment, ottoRole) =>
{
	const permCSLib = require("./PERM-CS-LIB");
	const permCSTest = require("./PERM-CS-TEST");
	
	
	///////////////////////////////////////////////////
	// ALL ROLES, ALL TESTS FOR PERM-CS
	///////////////////////////////////////////////////
	
	// define all roles
	var allRolesForPERM_CS =
	[
		"aa",
		"apb",
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
		"senate",
		"specChair",
		"specialty",
		"vcap",
		"vcedi",	
	];
	
	// define all tests
	var allTestsForPERM_CS =
	[
		"CaseSummary"
	];
	
	
	///////////////////////////////////////////////////
	// CALLER
	///////////////////////////////////////////////////
	
	// print which source is calling/running the test
	permCSLib.logThis("caller: " + caller);
	
	
	///////////////////////////////////////////////////
	// USAGE
	///////////////////////////////////////////////////

	// let user know proper usage
	logProperUsage = () =>
	{
		// let user know proper usage
		permCSLib.logThis("usage:   " + "node (relative dir/)PERM-CS-CLI.js [ENV] [  [role(s)] --comma-separated, no spaces  ] [browser --optional] [headed --optional]");
		permCSLib.logThis("example: " + "node perm-cs/PERM-CS-CLI.js TEST cap,oa,div chrome headed");
	}
	logProperUsage();


	///////////////////////////////////////////////////
	// INITIAL SETUP
	///////////////////////////////////////////////////

	// if brackets used for mini-batch in future, regex for splitting bracketed roles separated by commas and spaces:
	// ==>   \[[a-zA-Z\,\ ]*\]\ *   <==

	// print to console when test started
	const overallStartTime = new Date();
	permCSLib.logThis("run started at: " + permCSLib.formatTime(overallStartTime));

	// get args from command line after node and .js
	const args = process.argv.slice(2);
	
	var argsEnvironment = args[0];
	permCSLib.logThis("entered environment: " + argsEnvironment);
	if((argsEnvironment == null) ||
		((argsEnvironment !== "DEV") &&
		(argsEnvironment !== "STAGE") &&
		(argsEnvironment !== "TEST")))
	{
		if(argsEnvironment == null) // must be otto/scheduler
		{
		    argsEnvironment = ottoEnvironment;
		    permCSLib.logThis("environment changed to OTTO: " + ottoEnvironment);
		}
		else
		{
			permCSLib.logThis("don't you know everything needs a PROPER ENVIRONMENT to survive?");
			process.exit();
		}
	}
	
	var argsRole = args[1];
	permCSLib.logThis("entered role is: " + argsRole);
	if(argsRole == null)
	{
	    argsRole = ottoRole;
	    permCSLib.logThis("role changed to OTTO: " + ottoRole);
	}

	const argsBrowser = args[2];
	permCSLib.logThis(argsBrowser == null ? "entered browser: not entered, defaulting to chrome" : "browser: " + argsBrowser);

	const headless = args[3] == null ? "not entered, defaulting to headless" : "false";
	permCSLib.logThis("entered headless: " + headless);
	permCSLib.logThis("---");
	

	///////////////////////////////////////////////////
	// RUNTYPE
	///////////////////////////////////////////////////
    
	// set run type
	const runType = permCSLib.determineRunType(argsRole);


	///////////////////////////////////////////////////
	// ROLE VALIDATION
	///////////////////////////////////////////////////

	// validate entered role
	const processedRole = permCSLib.handleRole(runType, allRolesForPERM_CS, argsRole);
	
	
	///////////////////////////////////////////////////
	// LOGGING HEADERS TO FILE
	///////////////////////////////////////////////////
	
	// set up headers and applicable report file to write report file headers
	let reportFileName = getReportFileName(caller, "PERM-CS");
	let reportFileHeaders = getReportFileHeaders("PERM-CS");
	
	// log headers to report file only if CLI since JSON doesn't use headers
	if(caller === "CLI")
	{
	    logHeadersToReportFile(reportFileName, reportFileHeaders);
	}
	
	
	///////////////////////////////////////////////////
	// ROLE SETTINGS
	///////////////////////////////////////////////////

    // define role requirements
	const rolesLinkVisibility = new Map();
	    rolesLinkVisibility.set("aa", "access");
	    rolesLinkVisibility.set("apb", "denied");
	    rolesLinkVisibility.set("apo", "access");
	    rolesLinkVisibility.set("apoStaff", "access");
	    rolesLinkVisibility.set("areaChair", "denied");
	    rolesLinkVisibility.set("cap", "denied");
	    rolesLinkVisibility.set("da", "access");
	    rolesLinkVisibility.set("dean", "denied");
	    rolesLinkVisibility.set("deptChair", "denied");
	    rolesLinkVisibility.set("div", "access");
	    rolesLinkVisibility.set("divdean", "denied");
	    rolesLinkVisibility.set("librarySa", "access");
	    rolesLinkVisibility.set("oa", "access");
	    rolesLinkVisibility.set("sa1", "access");
	    rolesLinkVisibility.set("senate", "denied");
	    rolesLinkVisibility.set("specChair", "denied");
	    rolesLinkVisibility.set("specialty", "access");
	    rolesLinkVisibility.set("vcap", "denied");
	    rolesLinkVisibility.set("vcedi", "denied");


	///////////////////////////////////////////////////
	// MAIN
	///////////////////////////////////////////////////

	takeMyPERMCSOrder = async (processedRole) =>
	{
		var shouldSee = rolesLinkVisibility.get(processedRole);
	
        await permCSTest.runPermCSTest(caller, argsEnvironment, processedRole, shouldSee);
	}


	///////////////////////////////////////////////////
	// RUN TEST(S)
	///////////////////////////////////////////////////

	// run tests
	permCSLib.executeRunOrder(runType, allRolesForPERM_CS, allTestsForPERM_CS, processedRole, "CaseSummary", takeMyPERMCSOrder, overallStartTime);
}