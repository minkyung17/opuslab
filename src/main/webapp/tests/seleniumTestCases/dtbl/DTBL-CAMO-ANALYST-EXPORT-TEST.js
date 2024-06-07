const dtblLib = require("./DTBL-LIB");

// specialized page/URL just for this test
const pageToTest = "CasesAtMyOffice";  // must use same key as used elsewhere (e.g. data/PAGE_PATHS, data/PAGE_TITLES, libraries/PAGEFACTORY)

const role = "oa";

// set directory to check downloaded file
const downloadDirectory = getDownloadDirectory("DTBL");

// initialize report file name
var reportFileName = null;

// initialize result
var rawResult = "";

// declare test start and end times
var testStartTime = null;
var testEndTime = null;

exports.runDTBLCAMOAnalystExportTest = async (caller, environment) => {
	// initialize values
	var passFail = "";
	const desiredFileHeader = "APO Analyst";
	const desiredAPOAnalyst = "Tam, Mary";
    const fileName = "APO Queue.csv"; // this is fixed and set by backend
    var recordsFromWebpage = "0";
    var recordsFromCSV = "0";

    // define prefix for output
    const testModule = "DTBL-CAMO-ANALYST-EXPORT";
    const loggingPrefix = testModule + " " + environment + " oa ";
    
    dtblLib.logThis(loggingPrefix + "START");
	testStartTime = new Date();

    // check if entered role is one we're checking for (if not, exit)
    const lineup =
    [
		"oa"
    ];
    dtblLib.checkIfInLineup(loggingPrefix, "oa", lineup);
    
    try
    {
        // declare driver
		var driver = null;
		
		// set up driver
		driver = await dtblLib.setUpDriver(loggingPrefix, driver);
		
		
		//////////////////////////////////////////////////////////////////
		// GET URL
		//////////////////////////////////////////////////////////////////
		
		// load page by url (credentials page will intercept)
		dtblLib.getURL(loggingPrefix, driver, environment, pageToTest, role);
		
		
		//////////////////////////////////////////////////////////////////
		// CREDENTIALS
		//////////////////////////////////////////////////////////////////
		
		// enter credentials and submit
		try
		{
		    const signOnPage = new dtblLib.SignonPage();
		    await signOnPage.enterCredentials(loggingPrefix, driver, role);
		}
		catch(error)
		{
		    dtblLib.logThis(loggingPrefix + "problem with credentials");
		    dtblLib.logThis(error);
		    rawResult = "credentials error";
		}
		
		
		//////////////////////////////////////////////////////////////////
		// GENERAL PAGE ACCESS CHECK
		//////////////////////////////////////////////////////////////////
		
		// create new instance of page being tested
		const selectedPage = await dtblLib.makePage(loggingPrefix, driver, pageToTest);
		
		// don't even bother if page didn't load
		var pageDidLoad = null;
		try
		{
		    const isTitleCorrect = await selectedPage.isTitleCorrect(loggingPrefix, driver, pageToTest);
		    dtblLib.logThis(loggingPrefix + "title is correct");
		    
			pageDidLoad = true;
		}
		catch(error)
		{
		    pageDidLoad = false;
		    dtblLib.logThis(loggingPrefix + "title not correct: page did not load within set time limit");
		    dtblLib.logThis(error);
		    logThis(loggingPrefix + "current page title is: " + await driver.getTitle());
	        logThis(loggingPrefix + "creating kodak moment...");
	        await createKodakMoment(driver);
	        
	        rawResult = "ERROR: page did not load";
		}
		
		
		//////////////////////////////////////////////////////////////////
		// CHECK FOR DATA IN TABLE
		//////////////////////////////////////////////////////////////////
	
		// this boolean comes from DataTable class
		const dataExists = await selectedPage.checkForData(loggingPrefix, driver);
		
		
		//////////////////////////////////////////////////////////////////
		// SPECIFIC FEATURE TESTING
		//////////////////////////////////////////////////////////////////
		
		if((pageDidLoad) && (dataExists))
		{
		
			// create new instance of Profile page
			const camoPage = new dtblLib.CamoPage();
			
			// click APO Analyst filter dropdown
			await camoPage.clickAPOAnalystFilterDropdown(loggingPrefix, driver);
			

			// click APO Analyst filter Uncheck All
			await camoPage.clickAPOAnalystFilterUncheckAll(loggingPrefix, driver);
			
			// click desired location checkbox
	        await camoPage.clickDesiredAPOAnalyst(loggingPrefix, driver, desiredAPOAnalyst);
	        
	        
			//////////////////////////////////////////////////////////////////
			// EXPORT TO EXCEL
			//////////////////////////////////////////////////////////////////
			
			// click export to excel button
			await camoPage.clickExportToExcelButton(loggingPrefix, driver);
			
			// wait for download
			await dtblLib.isFileExported(loggingPrefix, fileName);
			
			
			//////////////////////////////////////////////////////////////////
			// ONLY DESIRED APO ANALYST EXISTS IN EXPORT FILE
			//////////////////////////////////////////////////////////////////
			
			// check if export file only has desired name for each record
			const exportFileContainsOnlyDesiredValue = await dtblLib.exportFileContainsOnlyDesiredValue(loggingPrefix, driver, desiredFileHeader, desiredAPOAnalyst, fileName);
			
			// evaluate test condition met
			exportFileContainsOnlyDesiredValue ? passFail = "passed" : passFail = "FAILED";
		}
		else
		{
		    dtblLib.logThis(loggingPrefix + "either NO DATA HAS LOADED or NO DATA EXIST");
		    
		    // test can't proceed without data
		    passFail = "ERROR: NO DATA LOADED";
		}
		dtblLib.logThis(loggingPrefix + "passFail: " + passFail);
		
		
		//////////////////////////////////////////////////////////////////
		// CLEANUP
		//////////////////////////////////////////////////////////////////
		
		await dtblLib.quit(driver);
		testEndTime = new Date();
		dtblLib.logThis(loggingPrefix + "END");
		
		await permLib.printTestRunTime(loggingPrefix, testStartTime, testEndTime);
		
		
		//////////////////////////////////////////////////////////////////
		// LOGGING TO FILE
		//////////////////////////////////////////////////////////////////
		
        // set report file name
        reportFileName = getReportFileName(caller, "DTBL");
        
		if(caller === "CLI")
		{
		    dtblLib.logThis("Hi Captain Tammy! Has OTTO deflated?");
		    
			try
			{
				// log results data to file
				let dataForLogFile = [testEndTime, environment, testModule, role, passFail];
				await dtblLib.writeResultsToFile(caller, reportFileName, dataForLogFile);
			}
			catch(error)
			{
				let dataForLogFile = [testEndTime, environment, testModule, role, "ERROR"];
				await dtblLib.writeResultsToFile(caller, reportFileName, dataForLogFile);
			
				dtblLib.logThis(error.message);
				dtblLib.logThis(error);
			}
		}
		else if (caller === "OTTO")// it's otto/scheduler
		{
		    dtblLib.logThis("OTTO'S FLYING? UH-OH");
		    
		    const xrayTestIssueKey = dtblLib.getXRAYTestIssueKey("TBD");
		    
		    // log results data to file
		    const comment = testModule + ", " + role;
		    const status = passFail;
		    let dataForLogFile = [xrayTestIssueKey, testStartTime, testEndTime, comment, status];
		    await dtblLib.writeResultsToFile(caller, reportFileName, dataForLogFile);
		}
    }
	catch(error)
	{
	    dtblLib.logThis(loggingPrefix + "UH-OH, spaghetti-o's");
		dtblLib.logThis(error.message);
		dtblLib.logThis(error);
		
	    if(caller === "CLI")
	    {
	        await dtblLib.writeResultsToFile(caller, reportFileName, [testEndTime, environment, pageToTest, toLiteralRole(role), "ERROR", error.message]);
	    }
	    else if (caller === "OTTO")
	    {
	         await dtblLib.writeResultsToFile(caller, reportFileName, [pageToTest, testStartTime, testEndTime, error, error.message]);
	    }
		
		logThis(loggingPrefix + "creating kodak moment...");
		await dtblLib.createKodakMoment(driver);
	}
}
