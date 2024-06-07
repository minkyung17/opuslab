const permCSLib = require("./PERM-CS-LIB");

const pageToTest = "CaseSummary";  // must use same key as used elsewhere (e.g. data/PAGE_PATHS)

// initialize report file name
var reportFileName = null;

// initialize result
var rawResult = "";

// initialize judgement to empty
var judgement = "";

// declare test start and end times
var testStartTime = null;
var testEndTime = null;

exports.runPermCSTest = async (caller, environment, role, shouldSee) => {

    //////////////////////////////////////////////////////////////////
	// TEST SETUP
	//////////////////////////////////////////////////////////////////
    
    // define prefix for output
    const testModule = "PERM-CS " + role;
    const loggingPrefix = testModule + " " + environment + " " + role + " ";
    
    permCSLib.logThis(loggingPrefix + "START");
    testStartTime = new Date();
    
    // check if entered role is one we're checking for (if not, exit)
    const lineup = [
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
    permCSLib.checkIfInLineup(loggingPrefix, role, lineup);
    
    try
    {
        // declare driver
		var driver = null;
		
		// set up driver
		driver = await permCSLib.setUpDriver(loggingPrefix, driver);
		
		
		//////////////////////////////////////////////////////////////////
		// GET URL
		//////////////////////////////////////////////////////////////////
		
		// load page by url (credentials page will intercept)
		permCSLib.getURL(loggingPrefix, driver, environment, pageToTest, role);
		
		
		//////////////////////////////////////////////////////////////////
		// CREDENTIALS
		//////////////////////////////////////////////////////////////////
		
		// enter credentials and submit
		try
		{
		    const signOnPage = new permCSLib.SignonPage();
		    await signOnPage.enterCredentials(loggingPrefix, driver, role);
		}
		catch(error)
		{
		    permCSLib.logThis(loggingPrefix + "problem with credentials");
		    permCSLib.logThis(error);
		    rawResult = "credentials error";
		}
		
		
		//////////////////////////////////////////////////////////////////
		// GENERAL PAGE ACCESS CHECK
		//////////////////////////////////////////////////////////////////
		
		// create new instance of page being tested
		const selectedPage = await permCSLib.makePage(loggingPrefix, driver, pageToTest);
		
		// don't even bother if page didn't load
		var pageDidLoad = null;
		try
		{
		    const isTitleCorrect = await selectedPage.isTitleCorrect(loggingPrefix, driver, pageToTest);
		    permCSLib.logThis(loggingPrefix + "title is correct");
		    
			pageDidLoad = true;
		}
		catch(error)
		{
		    pageDidLoad = false;
		    permCSLib.logThis(loggingPrefix + "title not correct: page did not load within set time limit");
		    permCSLib.logThis(error);
		    logThis(loggingPrefix + "current page title is: " + await driver.getTitle());
	        logThis(loggingPrefix + "creating kodak moment...");
	        await createKodakMoment(driver);
	        
	        rawResult = "ERROR: page did not load";
		}
		
		
		//////////////////////////////////////////////////////////////////
		// SPECIFIC FEATURE TESTING
		//////////////////////////////////////////////////////////////////
		
		if(pageDidLoad)
		{
		
			// create new instance of Case Summary page
			const selectedPage = new permCSLib.CaseSummaryPage();
		
			try
			{
				// wait for page to fully load
				await selectedPage.waitForPageToLoad(loggingPrefix, driver);
			
				// click on ReviewProcess link
				await selectedPage.clickReviewProcessLink(loggingPrefix, driver);
			}
			catch(error)
			{
				permCSLib.logThis(loggingPrefix + "page didn't fully load");
				permCSLib.logThis(error);
			
				// test can't proceed without data
				passFail = "ERROR: NO PAGE LOAD";
			}
		
		
			//////////////////////////////////////////////////////////////////
			// LINK CHECK
			//////////////////////////////////////////////////////////////////
			
			// check for "Enter an Interfolio Packet ID" link
			rawResult = await selectedPage.checkForEnterInterfolioPacketIDLink(loggingPrefix, driver);
		}
		
		
		//////////////////////////////////////////////////////////////////
		// JUDGEMENT
		//////////////////////////////////////////////////////////////////
		
		let expectedResult = shouldSee;
		
		let judgement = await permCSLib.compareWithExpectedResult(loggingPrefix, rawResult, expectedResult);
		
				
		//////////////////////////////////////////////////////////////////
		// CLEANUP
		//////////////////////////////////////////////////////////////////
		
		await permCSLib.quit(driver);
		testEndTime = new Date();
		permCSLib.logThis(loggingPrefix + "END");
		
		await permCSLib.printTestRunTime(loggingPrefix, testStartTime, testEndTime);
		
		
		//////////////////////////////////////////////////////////////////
		// LOGGING
		//////////////////////////////////////////////////////////////////
		
        // set report file name
        reportFileName = getReportFileName(caller, "PERM-CS");
        
		if(caller === "CLI")
		{
		    permCSLib.logThis("Hi Captain Tammy! Has OTTO deflated?");
		    
			try
			{
				// set up variable for logging
				let dataForLogFile = [testEndTime, environment, pageToTest, toLiteralRole(role), rawResult, judgement];
		
				// log results to file
				await permCSLib.writeResultsToFile(caller, reportFileName, dataForLogFile);
			}
			catch(error)
			{
				let dataForLogFile = [testEndTime, environment, pageToTest, toLiteralRole(role), "", "ERROR"];
				await permCSLib.writeResultsToFile(caller, reportFileName, dataForLogFile);
			
				permCSLib.logThis(error.message);
				permCSLib.logThis(error);
			}
		}
		else if (caller === "OTTO")// it's otto/scheduler
		{
		    permCSLib.logThis("OTTO'S FLYING? UH-OH");
		    
		    xrayTestIssueKey = permCSLib.getXRAYTestIssueKey(pageToTest);
		    
		    // log results data to file
		    const comment = testModule + ", " + role;
		    const status = passFail;
		    let dataForLogFile = [xrayTestIssueKey, testStartTime, testEndTime, comment, status];
		    await permCSLib.writeResultsToFile(caller, reportFileName, dataForLogFile);
		}
    }
	catch(error)
	{
	    permCSLib.logThis(loggingPrefix + "UH-OH, spaghetti-o's");
		permCSLib.logThis(error.message);
		permCSLib.logThis(error);
		
	    if(caller === "CLI")
	    {
	        await permCSLib.writeResultsToFile(caller, reportFileName, [testEndTime, environment, pageToTest, toLiteralRole(role), "ERROR", error.message]);
	    }
	    else if (caller === "OTTO")
	    {
	         await permCSLib.writeResultsToFile(caller, reportFileName, [pageToTest, testStartTime, testEndTime, error, error.message]);
	    }
		
		logThis(loggingPrefix + "creating kodak moment...");
		await permCSLib.createKodakMoment(driver);
	}
}
