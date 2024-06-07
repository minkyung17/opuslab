const permClockLib = require("./PERM-CLOCK-LIB");

const pageToTest = "ExcellenceReviewClock";  // must use same key as used elsewhere (e.g. data/PAGE_PATHS)

// initialize report file name
var reportFileName = null;

// initialize result
var rawResult = "";

// initialize judgement to empty
var judgement = "";

// declare test start and end times
var testStartTime = null;
var testEndTime = null;

exports.runPermERCTest = async (caller, environment, role, shouldSee) => {
   
    //////////////////////////////////////////////////////////////////
	// ROLE CHECK
	//////////////////////////////////////////////////////////////////
    
    // define prefix for output
    const testModule = "PERM-CLOCK-ERC";
    const loggingPrefix = testModule + " " + environment + " " + role + " ";
    
    permClockLib.logThis(loggingPrefix + "START");
    testStartTime = new Date();
    
    // check if entered role is one we're checking for (if not, exit)
    const lineup = [
		"aa",
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
		"specChair",
		"specialty",
		"vcap"
    ];
    permClockLib.checkIfInLineup(loggingPrefix, role, lineup);
    
    try
    {
        // declare driver
		var driver = null;
		
		// set up driver
		driver = await permClockLib.setUpDriver(loggingPrefix, driver);
		
		
		//////////////////////////////////////////////////////////////////
		// GET URL
		//////////////////////////////////////////////////////////////////
		
		// load page by url (credentials page will intercept)
		permClockLib.getURL(loggingPrefix, driver, environment, pageToTest, role);
		
		
		//////////////////////////////////////////////////////////////////
		// CREDENTIALS
		//////////////////////////////////////////////////////////////////
		
		// enter credentials and submit
		try
		{
		    const signOnPage = new permClockLib.SignonPage();
		    await signOnPage.enterCredentials(loggingPrefix, driver, role);
		}
		catch(error)
		{
		    permClockLib.logThis(loggingPrefix + "problem with credentials");
		    permClockLib.logThis(error);
		    rawResult = "credentials error";
		}
		
		
		//////////////////////////////////////////////////////////////////
		// GENERAL PAGE ACCESS CHECK
		//////////////////////////////////////////////////////////////////
		
		// create new instance of page being tested
		const selectedPage = await permClockLib.makePage(loggingPrefix, driver, pageToTest);
		
		// don't even bother if page didn't load
		var pageDidLoad = null;
		try
		{
		    const isTitleCorrect = await selectedPage.isTitleCorrect(loggingPrefix, driver, pageToTest);
		    permClockLib.logThis(loggingPrefix + "title is correct");
		    
			pageDidLoad = true;
		}
		catch(error)
		{
		    pageDidLoad = false;
		    permClockLib.logThis(loggingPrefix + "title not correct: page did not load within set time limit");
		    permClockLib.logThis(error);
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
		    // wait for link to be found and then click
		    await selectedPage.clickExcellenceReviewClockLink(loggingPrefix, driver);
		    
			// wait for table to load (first row used as proxy)
			try
			{
				// show wait time elapsed since loading records will take time
				permClockLib.showElapsedTime(loggingPrefix, driver, selectedPage.firstRecordBy);
				permClockLib.logThis(loggingPrefix + "data has loaded in ERC Profile table");
			}
			catch(error)
			{
				permClockLib.logThis(loggingPrefix + "NO data has loaded in ERC Profile table");
				permClockLib.logThis(error);
		
				// test can't proceed without data
				rawResult = "ERROR: no ERC records loaded on  Profile page";
			}


			//////////////////////////////////////////////////////////////////
			// ERC LINK CLICK & BUTTON CHECK
			//////////////////////////////////////////////////////////////////
			
			try
			{			    
			    // check for "Add", "Edit", "Delete"  buttons
			    rawResult = await selectedPage.checkForButtons(loggingPrefix, driver, shouldSee);
			    permClockLib.logThis(loggingPrefix + "button check returned " + rawResult);
			}
			catch(error)
			{
				// if button CAN'T be found, role doesn't have access
				permClockLib.logThis(loggingPrefix + '"Add", "Edit", "Delete"  buttons can\'t be found, no access');
				rawResult = "denied";
				
				permClockLib.logThis(error);		    
			}
		}
		
		
		
		//////////////////////////////////////////////////////////////////
		// JUDGEMENT
		//////////////////////////////////////////////////////////////////
		
		let expectedResult = shouldSee;
		
		let judgement = await permClockLib.compareWithExpectedResult(loggingPrefix, rawResult, expectedResult);
		
		
		//////////////////////////////////////////////////////////////////
		// CLEANUP
		//////////////////////////////////////////////////////////////////
		
		await permClockLib.quit(driver);
		testEndTime = new Date();
		permClockLib.logThis(loggingPrefix + "END");
		
		await printTestRunTime(loggingPrefix, testStartTime, testEndTime);
		
		
		//////////////////////////////////////////////////////////////////
		// LOGGING
		//////////////////////////////////////////////////////////////////
		
        // set report file name
        reportFileName = getReportFileName(caller, "PERM-CLOCK");
        
		if(caller === "CLI")
		{
		    permClockLib.logThis("Hi Captain Tammy! Has OTTO deflated?");
		    
			try
			{
				// set up variable for logging
				let dataForLogFile = [testEndTime, environment, pageToTest, toLiteralRole(role), rawResult, judgement];
		
				// log results to file
				await permClockLib.writeResultsToFile(caller, reportFileName, dataForLogFile);
			}
			catch(error)
			{
				let dataForLogFile = [testEndTime, environment, pageToTest, toLiteralRole(role), "", "ERROR"];
				await permClockLib.writeResultsToFile(caller, reportFileName, dataForLogFile);
			
				permClockLib.logThis(error.message);
				permClockLib.logThis(error);
			}
		}
		else if (caller === "OTTO")// it's otto/scheduler
		{
		    permClockLib.logThis("OTTO'S FLYING? UH-OH");
		    
		    xrayTestIssueKey = permClockLib.getXRAYTestIssueKey(pageToTest);
		    
		    // log results data to file
		    const comment = testModule + ", " + role;
		    const status = judgement;
		    let dataForLogFile = [xrayTestIssueKey, testStartTime, testEndTime, comment, status];
		    await permClockLib.writeResultsToFile(caller, reportFileName, dataForLogFile);
		}
    }
	catch(error)
	{
	    permClockLib.logThis(loggingPrefix + "UH-OH, spaghetti-o's");
		permClockLib.logThis(error.message);
		permClockLib.logThis(error);
		
	    if(caller === "CLI")
	    {
	        await permClockLib.writeResultsToFile(caller, reportFileName, [testEndTime, environment, pageToTest, toLiteralRole(role), "ERROR", error.message]);
	    }
	    else if (caller === "OTTO")
	    {
	         await permClockLib.writeResultsToFile(caller, reportFileName, [pageToTest, testStartTime, testEndTime, error, error.message]);
	    }
		
		logThis(loggingPrefix + "creating kodak moment...");
		await permClockLib.createKodakMoment(driver);
	}
}
