const dtblLib = require("./DTBL-LIB");

// specialized page/URL just for this test
const pageToTest = "ApptsActive";  // must use same key as used elsewhere (e.g. data/PAGE_PATHS, data/PAGE_TITLES, libraries/PAGEFACTORY)

const role = "oa";

// initialize report file name; caller will be undefined here and set later
var reportFileName = null;

// initialize type of modal (success/error) after saving
var saveModalType = null;

// initialize result
var rawResult = "";

// declare test start and end times
var testStartTime = null;
var testEndTime = null;

exports.runDTBLRosterDefaultTest = async (caller, environment) => {
	// initialize values
	var passFail = "";
	var expectedSortingTitle = "Sorting by 1. Name";

    // define prefix for output
    const testModule = "DTBL-ROSTER-DEFAULT";
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
			const activeAppointmentsPage = new dtblLib.ApptsActivePage();
			
			// do "check all" so all column filters will be displayed
			await activeAppointmentsPage.selectCheckAll(loggingPrefix, driver);
			
			
			//////////////////////////////////////////////////////////////////
			// A-Z SORT CHECK
			//////////////////////////////////////////////////////////////////
						
            let namesAsText = await activeAppointmentsPage.getNamesAsText(loggingPrefix, driver);
			
			var defaultNamesOrderCorrect = dtblLib.isAToZ(namesAsText); // for JUDGEMENT
			// print results border
			logThis("---");
		
			// print result
			logThis("NAMES ARE ASCENDING : " + defaultNamesOrderCorrect);

			/*
			// TESTS FOR dtblLib.isAToZ
			console.log("is A to Z: " + dtblLib.isAToZ(["apple", "avocado", "avocado", "plum"])); // true
			console.log("is A to Z: " + dtblLib.isAToZ(["apple", "banana", "coconut", "avocado"])); // false
			console.log("is A to Z: " + dtblLib.isAToZ(["banana", "avocado", "apple"])); // false
			await dtblLib.wait(1000); // give time for tests to finish before driver quits
			*/
			
			
			//////////////////////////////////////////////////////////////////
			// SORT ORDER TEXT CHECK
			//////////////////////////////////////////////////////////////////
		
			// **Text above datatable should note "Sorting by 1. Name"**
			let sortingTitle = await await activeAppointmentsPage.getSortingTitle(loggingPrefix, driver);
			logThis("SORTING TITLE: " + sortingTitle);
			var sortingTitleCorrect = expectedSortingTitle ? true : false; // for JUDGEMENT
		
			// print results border
			logThis("---");
		} // end (if pageDidLoad)
		else
		{
		    dtblLib.logThis(loggingPrefix + "either NO DATA HAS LOADED or NO DATA EXIST");
		    
		    // test can't proceed without data
		    passFail = "ERROR: NO DATA LOADED";
		}
		
		
		//////////////////////////////////////////////////////////////////
		// JUDGEMENT
		//////////////////////////////////////////////////////////////////

		if(defaultNamesOrderCorrect && sortingTitleCorrect) //
		{
			passFail = "passed";
		}
		else // test goes to completion AND all criteria are met
		{
			passFail = "FAILED";
		}
		dtblLib.logThis(loggingPrefix + "passFail: " + passFail);
		
		
		//////////////////////////////////////////////////////////////////
		// CLEANUP
		//////////////////////////////////////////////////////////////////
		
		await dtblLib.quit(driver);
		testEndTime = new Date();
		dtblLib.logThis(loggingPrefix + "END");
		
		await dtblLib.printTestRunTime(loggingPrefix, testStartTime, testEndTime);
		
		
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
