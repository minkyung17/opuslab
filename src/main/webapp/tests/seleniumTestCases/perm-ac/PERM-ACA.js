runPermACA = (caller, ottoEnvironment, ottoFeature, ottoRole) =>
{
	// import library full of sub-libraries and actual test
	const permACLib = require("./PERM-AC-LIB");
	const permACATest = require("./PERM-ACA-TEST");


	///////////////////////////////////////////////////
	// ALL ROLES, ALL TESTS FOR PERM-ACA
	///////////////////////////////////////////////////

	// define all roles
	var allRolesForPERM_ACA =
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
	var allTestsForPERM_ACA =
	[
		"AdminCompAllocations"
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
		permACLib.logThis("usage:   " + "node (relative dir/)PERM-ACA-CLI.js [env] [feature --add/edit/delete] [role] [browser --optional] [headed --optional]");
		permACLib.logThis("example: " + "node perm-ac/PERM-ACA-CLI.js TEST add oa chrome headed");
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
	var args = process.argv.slice(2);

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
	
	// demarcate entered values
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
	const processedRole = permACLib.handleRole(runType, allRolesForPERM_ACA, argsRole);


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
		rolesButtonVisibilityAdd.set("div", "denied");
		rolesButtonVisibilityAdd.set("divdean", "denied");
		rolesButtonVisibilityAdd.set("librarySa", "denied");
		rolesButtonVisibilityAdd.set("oa", "access");
		rolesButtonVisibilityAdd.set("sa1", "denied");
		rolesButtonVisibilityAdd.set("vcap", "denied");

	const rolesButtonVisibilityEdit = new Map();
		rolesButtonVisibilityEdit.set("apo", "access");
		rolesButtonVisibilityEdit.set("apoStaff", "access");
		rolesButtonVisibilityEdit.set("dean", "denied");
		rolesButtonVisibilityEdit.set("div", "denied");
		rolesButtonVisibilityEdit.set("divdean", "denied");
		rolesButtonVisibilityEdit.set("librarySa", "denied");
		rolesButtonVisibilityEdit.set("oa", "access");
		rolesButtonVisibilityEdit.set("sa1", "denied");
		rolesButtonVisibilityEdit.set("vcap", "denied");

	const rolesButtonVisibilityDelete = new Map();
		rolesButtonVisibilityDelete.set("apo", "access");
		rolesButtonVisibilityDelete.set("apoStaff", "access");
		rolesButtonVisibilityDelete.set("dean", "denied");
		rolesButtonVisibilityDelete.set("div", "denied");
		rolesButtonVisibilityDelete.set("divdean", "denied");
		rolesButtonVisibilityDelete.set("librarySa", "denied");
		rolesButtonVisibilityDelete.set("oa", "access");
		rolesButtonVisibilityDelete.set("sa1", "denied");
		rolesButtonVisibilityDelete.set("vcap", "denied");
		
		
	///////////////////////////////////////////////////
	// MAIN
	///////////////////////////////////////////////////

	takeMyPERMACAOrder = async (processedRole, testPage) =>
	{
		// get expected visibility for role
		let shouldSee = null;
	 
		if(argsFeature === "add")
		{
			shouldSee = rolesButtonVisibilityAdd.get(processedRole);
		}
		else if(argsFeature === "edit")
		{
			shouldSee = rolesButtonVisibilityEdit.get(processedRole);
		}
		else if(argsFeature === "delete")
		{
			shouldSee = rolesButtonVisibilityDelete.get(processedRole);
		}
	
		// run tests
		await permACATest.runpermACATest(caller, argsEnvironment, argsFeature, processedRole, shouldSee);
	}


	///////////////////////////////////////////////////
	// RUN TEST(S)
	///////////////////////////////////////////////////

	// run tests
	permACLib.executeRunOrder(runType, allRolesForPERM_ACA, allTestsForPERM_ACA, processedRole, "AdminCompAllocations", takeMyPERMACAOrder, overallStartTime);
}