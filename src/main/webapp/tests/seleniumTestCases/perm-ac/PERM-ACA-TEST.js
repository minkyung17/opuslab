const permACLib = require("./PERM-AC-LIB");

const pageToTest = "AdminCompAllocations";  // must use same key as used elsewhere (e.g. data/PAGE_PATHS)

// initialize report file name
var reportFileName = null;

// initialize result
var rawResult = "";

// initialize judgement to empty
var judgement = "";

// declare test start and end times
var testStartTime = null;
var testEndTime = null;

exports.runpermACATest = async (caller, environment, featureToTest, role, shouldSee) => {    

    //////////////////////////////////////////////////////////////////
	// ROLE CHECK
	//////////////////////////////////////////////////////////////////
    
    // define prefix for output
    const testModule = "PERM-ACA";
    const loggingPrefix = testModule + " " + environment + " " + featureToTest + " " + role + " ";
    
    permACLib.logThis(loggingPrefix + "START");
    testStartTime = new Date();
    
    // check if entered role is one we're checking for (if not, exit)
    const lineup = [
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
    permACLib.checkIfInLineup(loggingPrefix, role, lineup);
    
    try
    {
        // declare driver
		var driver = null;
		
		// set up driver
		driver = await permACLib.setUpDriver(loggingPrefix, driver);
		
		
		//////////////////////////////////////////////////////////////////
		// GET URL
		//////////////////////////////////////////////////////////////////
		
		// load page by url (credentials page will intercept)
		permACLib.getURL(loggingPrefix, driver, environment, pageToTest, role);
		
		
		//////////////////////////////////////////////////////////////////
		// CREDENTIALS
		//////////////////////////////////////////////////////////////////
		
		// enter credentials and submit
		try
		{
		    const signOnPage = new permACLib.SignonPage();
		    await signOnPage.enterCredentials(loggingPrefix, driver, role);
		}
		catch(error)
		{
		    permACLib.logThis(loggingPrefix + "problem with credentials");
		    permACLib.logThis(error);
		    rawResult = "credentials error";
		}
		
		
		//////////////////////////////////////////////////////////////////
		// GENERAL PAGE ACCESS CHECK
		//////////////////////////////////////////////////////////////////
		
		// create new instance of page being tested
		const selectedPage = await permACLib.makePage(loggingPrefix, driver, pageToTest);
		
		// don't even bother if page didn't load
		var pageDidLoad = null;
		try
		{
		    const isTitleCorrect = await selectedPage.isTitleCorrect(loggingPrefix, driver, pageToTest);
		    permACLib.logThis(loggingPrefix + "title is correct");
		    
			pageDidLoad = true;
		}
		catch(error)
		{
		    pageDidLoad = false;
		    permACLib.logThis(loggingPrefix + "title not correct: page did not load within set time limit");
		    permACLib.logThis(error);
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
			// look for "Add Allocation" button
			try
			{
			    if(featureToTest === "add")
			    {
					// click Add Allocation button
					await selectedPage.clickAddAllocationButton(loggingPrefix, driver);
					
					// check for modal
				    await selectedPage.checkForModal(loggingPrefix, driver);
				
					// if click works without error, set raw result as having access
			        rawResult = "access";
			    }
			    else if(featureToTest === "edit")
			    {
					// locate Edit Icon
					await selectedPage.clickEditIcon(loggingPrefix, driver);
					
					// check for modal
				    await selectedPage.checkForModal(loggingPrefix, driver);
				    
					// if click works without error, set raw result as having access
			        rawResult = "access";
			    }
			    else if(featureToTest === "delete")
			    {
			        // check if delete button is enabled (opacity: 1 = enabled; <1 = disabled)
			        rawResult = await selectedPage.isDeleteButtonEnabled(loggingPrefix, driver);
			    }
			}
			catch(error)
			{
				// if button CAN'T be found, role doesn't have access
				permACLib.logThis(loggingPrefix + '"Add Allocation" button can\'t be found or modal didn\'t launch');
				rawResult = "denied";
				
				permACLib.logThis(error);		    
			}
		}
        
        
		//////////////////////////////////////////////////////////////////
		// JUDGEMENT
		//////////////////////////////////////////////////////////////////
		
		let expectedResult = shouldSee;
		
		let judgement = await permACLib.compareWithExpectedResult(loggingPrefix, rawResult, expectedResult);
		
		
		//////////////////////////////////////////////////////////////////
		// CLEANUP
		//////////////////////////////////////////////////////////////////
		
		await permACLib.quit(driver);
		testEndTime = new Date();
		permACLib.logThis(loggingPrefix + "END");
		
		await permACLib.printTestRunTime(loggingPrefix, testStartTime, testEndTime);
		
		
		//////////////////////////////////////////////////////////////////
		// LOGGING
		//////////////////////////////////////////////////////////////////
		
        // set report file name
        reportFileName = getReportFileName(caller, "PERM-AC");
        
		if(caller === "CLI")
		{
		    permACLib.logThis("Hi Captain Tammy! Has OTTO deflated?");
		    
			try
			{
				// set up variable for logging
				let dataForLogFile = [testEndTime, environment, pageToTest, featureToTest, toLiteralRole(role), rawResult, judgement];
		
				// log results to file
				await permACLib.writeResultsToFile(caller, reportFileName, dataForLogFile);
			}
			catch(error)
			{
				let dataForLogFile = [testEndTime, environment, pageToTest, toLiteralRole(role), "", "ERROR"];
				await permACLib.writeResultsToFile(caller, reportFileName, dataForLogFile);
			
				permACLib.logThis(error.message);
				permACLib.logThis(error);
			}
		}
		else if (caller === "OTTO")// it's otto/scheduler
		{
		    permACLib.logThis("OTTO'S FLYING? UH-OH");
		    
		    const xrayTestIssueKey = permACLib.getXRAYTestIssueKey(pageToTest);
		    
		    // log results data to file
		    const comment = testModule + ", " + role;
		    const status = passFail;
		    let dataForLogFile = [xrayTestIssueKey, testStartTime, testEndTime, comment, status];
		    await permACLib.writeResultsToFile(caller, reportFileName, dataForLogFile);
		}
    }
	catch(error)
	{
	    permACLib.logThis(loggingPrefix + "UH-OH, spaghetti-o's");
		permACLib.logThis(error.message);
		permACLib.logThis(error);
		
	    if(caller === "CLI")
	    {
	        await permACLib.writeResultsToFile(caller, reportFileName, [testEndTime, environment, pageToTest, toLiteralRole(role), "ERROR", error.message]);
	    }
	    else if (caller === "OTTO")
	    {
	         await permACLib.writeResultsToFile(caller, reportFileName, [pageToTest, testStartTime, testEndTime, error, error.message]);
	    }
		
		logThis(loggingPrefix + "creating kodak moment...");
		await permACLib.createKodakMoment(driver);
	}
}
