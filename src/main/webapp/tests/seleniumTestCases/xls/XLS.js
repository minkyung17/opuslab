runXLS = (caller, ottoEnvironment, ottoFileName) =>
{
	// import library full of sub-libraries and actual test
	const xlsLib = require("./XLS-LIB");
	const xlsTest = require("./XLS-TEST");
	
	
	///////////////////////////////////////////////////
	// ALL ROLES, ALL TESTS FOR XLS
	///////////////////////////////////////////////////
	
	// define all roles
	const allRolesForXLS =
	[
		"apo"
	];

	// (these must be the same in data/EXPORT_FILE_NAMES, data/PAGE_PATHS, data/PAGE_TITLES, libraries/PAGEFACTORY, xls/XLS)
	// define all tests
	var allTestsForXLS =
	[
		"ActiveCases",
		"CompletedCases",
		"WithdrawnCases",
		"CamoAPO",
		"CamoCAP",
		"CamoDeansOffice",
		"CamoDepartment",
		"CamoLibrary",
		"BulkChangeAPU",
		"BulkEndAppt",
		"BulkReappt",
		"BulkRenewal",
		"Eligibility",
		"EndowedChairsActive",
		"EndowedChairsPending",
		"EndowedChairsModificationRequest",
		"EndowedChairsDisestablished",
		"EndowedChairsInactive",
		"EndowedChairsIncomplete",
		"ApptsActive",
		"ApptsInactive",
		"EightYearClock",
		"ExcellenceReviewClock",
		"SalaryReport",
		"PathCompReport",
		"AdminCompAllocations",
		"AdminCompProposals",
		"AdminCompReport",
		"VerifyCompliance"
	];
	
	
	///////////////////////////////////////////////////
	// CALLER
	///////////////////////////////////////////////////
	
	// print which source is calling/running the test
	xlsLib.logThis("caller: " + caller);
	
	
	///////////////////////////////////////////////////
	// USAGE
	///////////////////////////////////////////////////

	logProperUsage = () =>
	{
		// let user know proper usage
		xlsLib.logThis("usage:   " + "node (relative dir/)XLS-CLI.js [env] [file names (without extension --comma-separated and no spaces if multiple)] [browser --optional] [headed --optional]");
		xlsLib.logThis("example: " + "node xls/XLS-CLI.js TEST ActiveCases,AdminCompReport chrome headed");
		xlsLib.logThis("possible file names: \x1b[92m" + allTestsForXLS.join(" ") + "\x1b[0m");
		xlsLib.logThis("---");
	}
	logProperUsage();


	///////////////////////////////////////////////////
	// INITIAL SETUP
	///////////////////////////////////////////////////

	// if brackets used for mini-batch in future, regex for splitting bracketed roles separated by commas and spaces:
	// ==>   \[[a-zA-Z\,\ ]*\]\ *   <==

	// print to console when test started
	const overallStartTime = new Date();
	xlsLib.logThis("run started at: " + xlsLib.formatTime(overallStartTime));

	// get args from command line after node and .js
	const args = process.argv.slice(2);
	
	var argsEnvironment = args[0];
	xlsLib.logThis("entered environment: " + argsEnvironment);
	if((argsEnvironment == null) ||
		((argsEnvironment !== "DEV") &&
		(argsEnvironment !== "STAGE") &&
		(argsEnvironment !== "TEST")))
	{
		if(argsEnvironment == null) // must be otto/scheduler
		{
		    argsEnvironment = ottoEnvironment;
		    xlsLib.logThis("environment changed to OTTO: " + ottoEnvironment);
		}
		else
		{
			xlsLib.logThis("don't you know everything needs a proper ENVIRONMENT to survive?");
			process.exit();
		}
	}

	var argsFileName = args[1];
	xlsLib.logThis("entered File Name is: " + argsFileName);
	if(argsFileName == null)
	{
		argsFileName = ottoFileName;
		xlsLib.logThis("page/file name changed to OTTO: " + ottoFileName);
	}

	var pageToTest = argsFileName;

	const argsBrowser = args[2];
	xlsLib.logThis(argsBrowser == null ? "entered browser: not entered, defaulting to chrome" : "browser: " + argsBrowser);

	const headless = args[3] == null ? "not entered, defaulting to headless" : "false";
	xlsLib.logThis("headless: " + headless);
	xlsLib.logThis("---");
	
	
	///////////////////////////////////////////////////
	// RUNTYPE
	///////////////////////////////////////////////////
	
	// set run type
	const runType = xlsLib.determineRunType(argsFileName);


	///////////////////////////////////////////////////
	// FILENAME VALIDATION
	///////////////////////////////////////////////////

	logThis("entered File Name: " + argsFileName);
	let fileNameValid = false;

	if(runType === "single")
	{
		for(let i = 0; i < allTestsForXLS.length; i++)
		{
			// check if entered file name is valid, disregarding case
			fileNameValid = new RegExp(allTestsForXLS[i], "i").test(argsFileName.toLowerCase());
		
			if(fileNameValid)
			{
				// convert to correct capitalization and stop checking
				argsFileName = allTestsForXLS[i];
			
				break;
			}
		}
	
		if(fileNameValid)
		{
			xlsLib.logThis("valid file/page name entered");		
		}
		else
		{
			xlsLib.logThis("FILE/PAGE NAME not valid -- be more like Tammy and know the correct test names");
			process.exit();
		}
	}
	else if(runType === "mini-batch")
	{    
		// first split the entered file name to check each one
		const enteredFileNames = argsFileName.split(",");
	
		enteredFileNames.forEach(enteredFileName =>
		{
			if(allTestsForXLS.includes(enteredFileName))
			{
				xlsLib.logThis(enteredFileName + ": valid file/page name entered");
			}
			else
			{
				xlsLib.logThis("FILE/PAGE NAME not valid -- be more like Tammy and mind your case sensitivity");
				process.exit();   
			}
		});
	}
	else if(runType === "all")
	{
		xlsLib.logThis("All?  I see you're feeling a little greedy today.");
	}


	///////////////////////////////////////////////////
	// LOGGING HEADERS TO FILE
	///////////////////////////////////////////////////

	// set up headers and applicable report file to write report file headers
	let reportFileName = getReportFileName(caller, "XLS");
	let reportFileHeaders = getReportFileHeaders("XLS");
	
	// log headers to report file only if CLI since JSON doesn't use headers
	if(caller === "CLI")
	{
	    logHeadersToReportFile(reportFileName, reportFileHeaders);
	}
	
	
	///////////////////////////////////////////////////
	// MAIN
	///////////////////////////////////////////////////

	takeMyXLSOrder = async (role, testPage) =>
	{
		// CAMO Library uses oa instead of apo, so change role
		if(testPage.toLowerCase() === "camolibrary")
		{
			xlsLib.logThis("CamoLibrary detected, changing role to oa");
		
			// change role to oa only for CAMOLibrary
			role = "oa";
		}
	
		// run tests
		await xlsTest.runXLS(caller, argsEnvironment, testPage);
	}


	///////////////////////////////////////////////////
	// RUN TEST(S)
	///////////////////////////////////////////////////
	
	// run tests
	xlsLib.executeRunOrder(runType, allRolesForXLS, allTestsForXLS, "apo", argsFileName, takeMyXLSOrder, overallStartTime);
}