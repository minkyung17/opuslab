runPermACP = (caller, ottoEnvironment, ottoFeature, ottoRole) =>
{
	const permACLib = require("./PERM-AC-LIB");
	const permACPTest = require("./PERM-ACP-TEST");


	///////////////////////////////////////////////////
	// ALL ROLES, ALL TESTS FOR PERM-ACP
	///////////////////////////////////////////////////

	// define all roles
	var allRolesForPERM_ACP =
	[
		"apo",
		"apoStaff",
		"dean",
		"div",
		"divdean",
		"librarySa",
		"oa",
		"sa1",
		"vcap"
	];
	
	// define all tests
	var allTestsForPERM_ACP =
	[
		"AdminCompProposals"
	];
	
	
	///////////////////////////////////////////////////
	// CALLER
	///////////////////////////////////////////////////
	
	// print which source is calling/running the test
	permACLib.logThis("caller: " + caller);
	
	
	///////////////////////////////////////////////////
	// USAGE
	///////////////////////////////////////////////////

	logProperUsage = () =>
	{
		// let user know proper usage
		permACLib.logThis("usage:   " + "node (relative dir/)PERM-ACP-CLI.js [env] [feature --add/edit/delete] [role] [browser --optional] [headed --optional]");
		permACLib.logThis("example: " + "node perm-ac/PERM-ACP-CLI.js TEST add oa chrome headed");
	}
	logProperUsage();
	
	
	///////////////////////////////////////////////////
	// INITIAL SETUP
	///////////////////////////////////////////////////

	// if brackets used for mini-batch in future, regex for splitting bracketed roles separated by commas and spaces:
	// ==>   \[[a-zA-Z\,\ ]*\]\ *   <==

	// print to console when test started
	const overallStartTime = new Date();
	permACLib.logThis("run started at: " + permACLib.formatTime(overallStartTime));

	// get args from command line after node and .js
	const args = process.argv.slice(2);
	
	var argsEnvironment = args[0];
	permACLib.logThis("entered environment: " + argsEnvironment);
	if((argsEnvironment == null) ||
		((argsEnvironment !== "DEV") &&
		(argsEnvironment !== "STAGE") &&
		(argsEnvironment !== "TEST")))
	{
		if(argsEnvironment == null) // must be otto/scheduler
		{
		    argsEnvironment = ottoEnvironment;
		    permACLib.logThis("environment changed to OTTO: " + ottoEnvironment);
		}
		else
		{
			permACLib.logThis("don't you know everything needs a PROPER ENVIRONMENT to survive?");
			process.exit();
		}
	}
	
	var argsFeature = args[1];
	permACLib.logThis("entered feature: " + argsFeature);
	if(argsFeature == null)
	{
		argsFeature = ottoFeature;
		permACLib.logThis("feature changed to OTTO: " + ottoFeature);
	}
	else
	{	
		if((argsFeature !== "add") && (argsFeature !== "edit") && (argsFeature !== "delete")) // not feature we're testing
		{
			permACLib.logThis("Feature not showing in this theater.");
			process.exit();
		}
	}

	var argsRole = args[2];
	permACLib.logThis("entered role is: " + argsRole);
	if(argsRole == null)
	{
	    argsRole = ottoRole;
	    permACLib.logThis("role changed to OTTO: " + ottoRole);
	}

	const argsBrowser = args[3];
	permACLib.logThis(argsBrowser == null ? "entered browser: not entered, defaulting to chrome" : "browser: " + argsBrowser);

	const headless = args[4] == null ? "not entered, defaulting to headless" : "false";
	permACLib.logThis("entered headless: " + headless);
	permACLib.logThis("---");
	
	
	///////////////////////////////////////////////////
	// RUNTYPE
	///////////////////////////////////////////////////
    
	// set run type
	const runType = permACLib.determineRunType(argsRole);


	///////////////////////////////////////////////////
	// ROLE VALIDATION
	///////////////////////////////////////////////////

	// validate entered role
	const processedRole = permACLib.handleRole(runType, allRolesForPERM_ACP, argsRole);


	///////////////////////////////////////////////////
	// LOGGING HEADERS TO FILE
	///////////////////////////////////////////////////

	// set up headers and applicable report file to write report file headers
	let reportFileName = getReportFileName(caller, "PERM-AC");
	let reportFileHeaders = getReportFileHeaders("PERM-AC");
	
	// log headers to report file only if CLI since JSON doesn't use headers
	if(caller === "CLI")
	{
	    logHeadersToReportFile(reportFileName, reportFileHeaders);
	}
	
	
	///////////////////////////////////////////////////
	// ROLE SETTINGS
	///////////////////////////////////////////////////
	
	// define role requirements
	const rolesButtonVisibilityAdd = new Map();
		rolesButtonVisibilityAdd.set("apo", "access");
		rolesButtonVisibilityAdd.set("apoStaff", "access");
		rolesButtonVisibilityAdd.set("dean", "denied");
		rolesButtonVisibilityAdd.set("div", "access");
		rolesButtonVisibilityAdd.set("divdean", "denied");
		rolesButtonVisibilityAdd.set("librarySa", "access");
		rolesButtonVisibilityAdd.set("oa", "access");
		rolesButtonVisibilityAdd.set("sa1", "access");
		rolesButtonVisibilityAdd.set("vcap", "denied");

	// define role requirements (this test checks expected admin comp id instead of expected button visibility)
	const rolesAdminCompId = new Map();
		rolesAdminCompId.set("apo", "2249");
		rolesAdminCompId.set("apoStaff", "2249");
		rolesAdminCompId.set("dean", "2249");
		rolesAdminCompId.set("div", "2231");
		rolesAdminCompId.set("divdean", "2249");
		rolesAdminCompId.set("librarySa", "2249");
		rolesAdminCompId.set("oa", "2319");
		rolesAdminCompId.set("sa1", "2249");
		rolesAdminCompId.set("vcap", "2249");

	// define role requirements
	const rolesButtonVisibilityDelete = new Map();
		rolesButtonVisibilityDelete.set("apo", "access");
		rolesButtonVisibilityDelete.set("apoStaff", "access");
		rolesButtonVisibilityDelete.set("dean", "denied");
		rolesButtonVisibilityDelete.set("div", "access");
		rolesButtonVisibilityDelete.set("divdean", "denied");
		rolesButtonVisibilityDelete.set("librarySa", "access");
		rolesButtonVisibilityDelete.set("oa", "access");
		rolesButtonVisibilityDelete.set("sa1", "access");
		rolesButtonVisibilityDelete.set("vcap", "denied");


	///////////////////////////////////////////////////
	// MAIN
	///////////////////////////////////////////////////

	takeMyPERMACPOrder = async (processedRole, testPage) =>
	{
		// get expected visibility for role
		let shouldSee = null;
	 
		if(argsFeature === "add")
		{
			shouldSee = rolesButtonVisibilityAdd.get(processedRole);
		}
		else if(argsFeature === "edit")
		{
			shouldSee = rolesAdminCompId.get(processedRole);
		}
		else if(argsFeature === "delete")
		{
			shouldSee = rolesButtonVisibilityDelete.get(processedRole);
		}
	
		// run tests
		await permACPTest.runPermACP(caller, argsEnvironment, argsFeature, processedRole, shouldSee);
	}


	///////////////////////////////////////////////////
	// RUN TEST(S)
	///////////////////////////////////////////////////

	// run tests
	permACLib.executeRunOrder(runType, allRolesForPERM_ACP, allTestsForPERM_ACP, processedRole, "AdminCompProposals", takeMyPERMACPOrder, overallStartTime);

}