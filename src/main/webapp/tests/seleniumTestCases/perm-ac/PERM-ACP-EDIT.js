runPermACPEdit = (caller, ottoEnvironment, ottoFeature, ottoRole) =>
{
	const permACLib = require("./PERM-AC-LIB");
	const permACPEditTest = require("./PERM-ACP-EDIT-TEST");


	///////////////////////////////////////////////////
	// ALL ROLES, ALL TESTS FOR PERM-ACP-EDIT
	///////////////////////////////////////////////////

	// define all roles
	var allRolesForPERM_ACP_Edit =
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
	var allTestsForPERM_ACP_Edit =
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
		permACLib.logThis("usage:   " + "node (relative dir/)PERM-ACP-EDIT-CLI.js [env] [feature --proposed_edit/final_edit/tracking/proposed_comments/final_comments] [role] [browser --optional] [headed --optional]");
		permACLib.logThis("example: " + "node perm-ac/PERM-ACP-EDIT-CLI.js TEST proposed_edit oa chrome headed");
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
	    // not feature we're testing
		if((argsFeature !== "proposed_edit")
		&& (argsFeature !== "final_edit")
		&& (argsFeature !== "tracking")
		&& (argsFeature !== "proposed_comments")
		&& (argsFeature !== "final_comments"))
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

	const headless = ((args[4] == null) || (args[4] !== "headless")) ? "not entered, defaulting to headless" : "false";
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
	const processedRole = permACLib.handleRole(runType, allRolesForPERM_ACP_Edit, argsRole);


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
	const rolesVisibilityProposedEdit = new Map();
		rolesVisibilityProposedEdit.set("apo", "access");
		rolesVisibilityProposedEdit.set("apoStaff", "access");
		rolesVisibilityProposedEdit.set("dean", "denied");
		rolesVisibilityProposedEdit.set("div", "access");
		rolesVisibilityProposedEdit.set("divdean", "denied");
		rolesVisibilityProposedEdit.set("librarySa", "access");
		rolesVisibilityProposedEdit.set("oa", "access");
		rolesVisibilityProposedEdit.set("sa1", "access");
		rolesVisibilityProposedEdit.set("vcap", "denied");
		
	// define role requirements
	const rolesVisibilityFinalEdit = new Map();
		rolesVisibilityFinalEdit.set("apo", "access");
		rolesVisibilityFinalEdit.set("apoStaff", "access");
		rolesVisibilityFinalEdit.set("dean", "denied");
		rolesVisibilityFinalEdit.set("div", "denied");
		rolesVisibilityFinalEdit.set("divdean", "denied");
		rolesVisibilityFinalEdit.set("librarySa", "denied");
		rolesVisibilityFinalEdit.set("oa", "access");
		rolesVisibilityFinalEdit.set("sa1", "denied");
		rolesVisibilityFinalEdit.set("vcap", "denied");
	
	// define role requirements
	const rolesVisibilityTracking = new Map();
		rolesVisibilityTracking.set("apo", "access");
		rolesVisibilityTracking.set("apoStaff", "access");
		rolesVisibilityTracking.set("dean", "denied");
		rolesVisibilityTracking.set("div", "denied");
		rolesVisibilityTracking.set("divdean", "denied");
		rolesVisibilityTracking.set("librarySa", "denied");
		rolesVisibilityTracking.set("oa", "access");
		rolesVisibilityTracking.set("sa1", "denied");
		rolesVisibilityTracking.set("vcap", "denied");
		
	// define role requirements
	const rolesVisibilityProposedComments = new Map();
		rolesVisibilityProposedComments.set("apo", "access");
		rolesVisibilityProposedComments.set("apoStaff", "access");
		rolesVisibilityProposedComments.set("dean", "access");
		rolesVisibilityProposedComments.set("div", "access");
		rolesVisibilityProposedComments.set("divdean", "access");
		rolesVisibilityProposedComments.set("librarySa", "access");
		rolesVisibilityProposedComments.set("oa", "access");
		rolesVisibilityProposedComments.set("sa1", "access");
		rolesVisibilityProposedComments.set("vcap", "access");
		
	// define role requirements
	const rolesVisibilityFinalComments = new Map();
		rolesVisibilityFinalComments.set("apo", "access");
		rolesVisibilityFinalComments.set("apoStaff", "access");
		rolesVisibilityFinalComments.set("dean", "access");
		rolesVisibilityFinalComments.set("div", "access");
		rolesVisibilityFinalComments.set("divdean", "access");
		rolesVisibilityFinalComments.set("librarySa", "access");
		rolesVisibilityFinalComments.set("oa", "access");
		rolesVisibilityFinalComments.set("sa1", "access");
		rolesVisibilityFinalComments.set("vcap", "access");


	///////////////////////////////////////////////////
	// MAIN
	///////////////////////////////////////////////////

	takeMyPERMACPEditOrder = async (processedRole, testPage) =>
	{
		// get expected visibility for role
		let shouldSee = null;
		
		if(argsFeature === "proposed_edit")
		{
			shouldSee = rolesVisibilityProposedEdit.get(processedRole);
		}
		else if(argsFeature === "final_edit")
		{
			shouldSee = rolesVisibilityFinalEdit.get(processedRole);
		}
		else if(argsFeature === "tracking")
		{
			shouldSee = rolesVisibilityTracking.get(processedRole);
		}
		else if(argsFeature === "proposed_comments")
		{
			shouldSee = rolesVisibilityProposedComments.get(processedRole);
		}
		else if(argsFeature === "final_comments")
		{
			shouldSee = rolesVisibilityFinalComments.get(processedRole);
		}
	
		// run tests
		await permACPEditTest.runPermACPEdit(caller, argsEnvironment, argsFeature, processedRole, shouldSee);
	}


	///////////////////////////////////////////////////
	// RUN TEST(S)
	///////////////////////////////////////////////////

	// run tests
	permACLib.executeRunOrder(runType, allRolesForPERM_ACP_Edit, allTestsForPERM_ACP_Edit, processedRole, "AdminCompProposals", takeMyPERMACPEditOrder, overallStartTime);

}