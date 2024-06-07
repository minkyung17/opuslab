runPerm = (caller, ottoEnvironment, ottoPageFeature, ottoRole) =>
{
	// import library full of sub-libraries and actual test
	const permLib = require("./PERM-LIB");
	const permTest = require("./PERM-TEST");


	///////////////////////////////////////////////////
	// ALL ROLES, ALL TESTS FOR perm
	///////////////////////////////////////////////////

	const allRolesForPERM =
	[
		"aa",
		"apb",
		"apo",
		"apoStaff",
		"areaChair",
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
		"vcedi"
	];

	// (these must be the same in data/EXPORT_FILE_NAMES, data/PAGE_PATHS, data/PAGE_TITLES, libraries/PAGEFACTORY, perm/perm)
	var allTestsForPERM =
	[     
		"ActiveCases",
		"AdminCompAllocations",
		"AdminCompProposals",
		"AdminCompReport",
		"ApptsActive",
		"ApptsInactive",
		"CasesAtMyOffice",
		"CompletedCases",
		"Dashboard",
		"EightYearClock",
		"Eligibility",
		"EndowedChairsActive",
		"EndowedChairsPending",
		"EndowedChairsModificationRequest",
		"EndowedChairsDisestablished",
		"EndowedChairsInactive",
		"EndowedChairsIncomplete",
		"ExcellenceReviewClock",
		"LinkUCPathPosition",
		"ManagePermissionsUnits",
		"ManagePermissionsUsers",
		"PathCompReport",
		"PrimaryAdditionalComparisonHiddenMismatches",
		"PrimaryAdditionalComparisonMismatches",
		"ProfileSearch",
		"RequestAUID",
		"SalaryReport",
		"UCPathOpusComparisonMismatches",
		"UCPathOpusComparisonHiddenMismatches",
		"UIDAdmin",
		"VerifyCompliance",
		"WithdrawnCases"
	
	];


	///////////////////////////////////////////////////
	// CALLER
	///////////////////////////////////////////////////
	
	// print which source is calling/running the test
	permLib.logThis("caller: " + caller);
	
	
	///////////////////////////////////////////////////
	// USAGE
	///////////////////////////////////////////////////

	logProperUsage = () =>
	{
		// let user know proper usage
		permLib.logThis("usage: " + "node (relative dir/)PERM-CLI.js [ENV] [page/feature (without extension --comma-separated and no spaces if multiple)] [role] [browser --optional] [headed --optional]");
		permLib.logThis("example: " + "node perm/PERM-CLI.js TEST ApptsActive,ApptsInactive oa chrome headed");
		permLib.logThis("possible file names: \x1b[92m" + allTestsForPERM.join(" ") + "\x1b[0m");
		permLib.logThis("---");
	}
	logProperUsage();


	///////////////////////////////////////////////////
	// INITIAL SETUP
	///////////////////////////////////////////////////

	// if brackets used for mini-batch in future, regex for splitting bracketed roles separated by commas and spaces:
	// ==>   \[[a-zA-Z\,\ ]*\]\ *   <==

	// print to console when test started
	const overallStartTime = new Date();
	permLib.logThis("run started at: " + permLib.formatTime(overallStartTime));

	// get args from command line after node and .js
	const args = process.argv.slice(2);

	var argsEnvironment = args[0];
	permLib.logThis("entered environment: " + argsEnvironment);
	if((argsEnvironment == null) ||
		((argsEnvironment !== "DEV") &&
		(argsEnvironment !== "STAGE") &&
		(argsEnvironment !== "TEST")))
	{
		if(argsEnvironment == null) // must be otto/scheduler
		{
		    argsEnvironment = ottoEnvironment;
		    permLib.logThis("environment changed to OTTO: " + ottoEnvironment);
		}
		else
		{
			permLib.logThis("don't you know everything needs a PROPER ENVIRONMENT to survive?");
			process.exit();
		}
	}

	var argsPageFeature = args[1];
	permLib.logThis("entered page/feature: " + argsPageFeature);
	if(argsPageFeature == null)
	{
	    argsPageFeature = ottoPageFeature;
	    permLib.logThis("page/feature changed to OTTO: " + ottoPageFeature);
	}
	
	var argsRole = args[2];
	if(argsRole == null)
	{
	    argsRole = ottoRole;
	    permLib.logThis("role changed to OTTO: " + ottoRole);
	}

	const argsBrowser = args[3];
	permLib.logThis(argsBrowser == null ? "entered browser: not entered, defaulting to chrome" : "entered browser: " + argsBrowser);

	const argsHeadless = args[4] == null ? "not entered, defaulting to headless" : "false";
	permLib.logThis("entered headless: " + argsHeadless);
	permLib.logThis("---");


	///////////////////////////////////////////////////
	// RUNTYPE
	///////////////////////////////////////////////////

	// set run type
	const runType = permLib.determineRunType(argsPageFeature);


	///////////////////////////////////////////////////
	// FILENAME VALIDATION
	///////////////////////////////////////////////////

	logThis("entered File Name: " + argsPageFeature);
	let fileNameValid = false;

	if(runType === "single")
	{
		for(let i = 0; i < allTestsForPERM.length; i++)
		{
			// check if entered file name is valid, disregarding case
			fileNameValid = new RegExp(allTestsForPERM[i], "i").test(argsPageFeature.toLowerCase());
		
			if(fileNameValid)
			{
				// convert to correct capitalization and stop checking
				argsPageFeature = allTestsForPERM[i];
			
				break;
			}
		}
	
		if(fileNameValid)
		{
			permLib.logThis("valid file/page name entered");		
		}
		else
		{
			permLib.logThis("FILE/PAGE NAME not valid -- be more like Tammy and know the correct test names");
			process.exit();
		}
	}
	else if(runType === "mini-batch")
	{    
		// first split the entered file name to check each one
		const enteredFileNames = argsPageFeature.split(",");
	
		enteredFileNames.forEach(enteredFileName =>
		{
			if(allTestsForPERM.includes(enteredFileName))
			{
				permLib.logThis(enteredFileName + ": valid file/page name entered");
			}
			else
			{
				permLib.logThis("FILE/PAGE NAME not valid -- be more like Tammy and mind your case sensitivity");
				process.exit();   
			}
		});
	}
	else if(runType === "all")
	{
		permLib.logThis("All?  I see you're feeling a little greedy today.");
	}


	///////////////////////////////////////////////////
	// LOGGING HEADERS TO FILE
	///////////////////////////////////////////////////

	// set up headers and applicable report file to write report file headers
	let reportFileName = getReportFileName(caller, "PERM");
	let reportFileHeaders = getReportFileHeaders("PERM");
	
	// log headers to report file only if CLI since JSON doesn't use headers
	if(caller === "CLI")
	{
	    logHeadersToReportFile(reportFileName, reportFileHeaders);
	}
	

	///////////////////////////////////////////////////
	// MAIN
	///////////////////////////////////////////////////

	takeMyPERMOrder = async () =>
	{	
        await permTest.runPERM(caller, argsEnvironment, argsRole, argsPageFeature);
	}
	
		
	///////////////////////////////////////////////////
	// RUN TEST(S)
	///////////////////////////////////////////////////

	// run tests
	permLib.executeRunOrder(runType, allRolesForPERM, allTestsForPERM, argsRole, argsPageFeature, takeMyPERMOrder, overallStartTime);
}