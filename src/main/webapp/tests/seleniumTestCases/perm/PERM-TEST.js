const permLib = require("./PERM-LIB");

// initialize report file name
var reportFileName = null;

// initialize result
var rawResult = "";

// initialize judgement to empty
var judgement = "";

// declare test start and end times
var testStartTime = null;
var testEndTime = null;

exports.runPERM = async (caller, environment, role, pageToTest) => {

    //////////////////////////////////////////////////////////////////
	// ROLE CHECK
	//////////////////////////////////////////////////////////////////
    
    // define prefix for output
    const testModule = "PERM";
    const loggingPrefix = testModule + " " + environment + " " + pageToTest + " " + role + " ";
    
    permLib.logThis(loggingPrefix + "START");
    testStartTime = new Date();
    
    // check if entered role is one we're checking for (if not, exit)
    const lineup =
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
    permLib.checkIfInLineup(loggingPrefix, role, lineup);
    
    try
    {
        // declare driver
		var driver = null;
		
		// set up driver
		driver = await permLib.setUpDriver(loggingPrefix, driver);
		
		
		//////////////////////////////////////////////////////////////////
		// GET URL
		//////////////////////////////////////////////////////////////////
		
		// load page by url (credentials page will intercept)
		permLib.getURL(loggingPrefix, driver, environment, pageToTest, role);
		
		
		//////////////////////////////////////////////////////////////////
		// CREDENTIALS
		//////////////////////////////////////////////////////////////////
		
		// enter credentials and submit
		try
		{
		    const signOnPage = new permLib.SignonPage();
		    await signOnPage.enterCredentials(loggingPrefix, driver, role);
		}
		catch(error)
		{
		    permLib.logThis(loggingPrefix + "problem with credentials");
		    permLib.logThis(error);
		    rawResult = "credentials error";
		}
		
		
		//////////////////////////////////////////////////////////////////
		// GENERAL PAGE ACCESS CHECK
		//////////////////////////////////////////////////////////////////
		
		// create new instance of page being tested
		const selectedPage = await permLib.makePage(loggingPrefix, driver, pageToTest);
		
		// don't even bother if page didn't load
		var pageDidLoad = null;
		try
		{
		    const isTitleCorrect = await selectedPage.isTitleCorrect(loggingPrefix, driver, pageToTest);
		    permLib.logThis(loggingPrefix + "title is correct");
		    
			pageDidLoad = true;
		}
		catch(error)
		{
		    pageDidLoad = false;
		    permLib.logThis(loggingPrefix + "title not correct: page did not load within set time limit");
		    permLib.logThis(error);
		    logThis(loggingPrefix + "current page title is: " + await driver.getTitle());
	        logThis(loggingPrefix + "creating kodak moment...");
	        await createKodakMoment(driver);
	        
	        rawResult = "ERROR: page did not load";
		}
		
		if(pageDidLoad)
		{
			// do initial permissions check (general page, not in-page)
			try
			{
				rawResult = await permLib.checkForErrorPage(loggingPrefix, driver, rawResult);
			}
			catch(error)
			{
				permLib.logThis(loggingPrefix + "problem checking initial page permissions");
				permLib.logThis(error.message);
				rawResult = "ERROR: error page appeared";
			}
		}

		//////////////////////////////////////////////////////////////////
		// JUDGEMENT
		//////////////////////////////////////////////////////////////////
		
		// get expected page/feature access for role from stored data (should be "access" or "denied")
		let expectedPageOrFeaturePermission = permLib.getPageOrFeaturePermission(pageToTest)[role];
		permLib.logThis(loggingPrefix + "expected permission is: " + expectedPageOrFeaturePermission);
		
		// get pass/fail result 
		judgement = await permLib.compareWithExpectedResult(loggingPrefix, rawResult, expectedPageOrFeaturePermission);
		
		
		//////////////////////////////////////////////////////////////////
		// CLEANUP
		//////////////////////////////////////////////////////////////////
		
		await permLib.quit(driver);
		testEndTime = new Date();
		permLib.logThis(loggingPrefix + "END");
		
		await permLib.printTestRunTime(loggingPrefix, testStartTime, testEndTime);
		
		
		//////////////////////////////////////////////////////////////////
		// LOGGING
		//////////////////////////////////////////////////////////////////
		
        // set report file name
        reportFileName = getReportFileName(caller, "PERM");
        
		if(caller === "CLI")
		{
		    permLib.logThis("Hi Captain Tammy! Has OTTO deflated?");
		    
			try
			{
				// set up variable for logging
				var dataForLogFile = [testEndTime, environment, pageToTest, toLiteralRole(role), rawResult, judgement];
		
				// log results to file
				await permLib.writeResultsToFile(caller, reportFileName, dataForLogFile);
			}
			catch(error)
			{
				let dataForLogFile = [testEndTime, environment, pageToTest, toLiteralRole(role), "", "ERROR"];
				await permLib.writeResultsToFile(caller, reportFileName, dataForLogFile);
			
				permLib.logThis(error.message);
				permLib.logThis(error);
			}
		}
		else if (caller === "OTTO")// it's otto/scheduler
		{
		    permLib.logThis("OTTO'S FLYING? UH-OH");
		    
		    // initialize issue testkey for xray
		    const xrayTestIssueKey = null;
		    
		    if(pageToTest === "Dashboard") // for dashboard tests, which xray issue results will be sent to are determined by role
		    {
		        if(role === "oa")
		        {
		            xrayTestIssueKey = permLib.getXRAYTestIssueKey("OpusAdminDashboard"); // OA
		        }
		        else if((role === "apo") || (role === "apoStaff")) // AAPO
		        {
		            xrayTestIssueKey = permLib.getXRAYTestIssueKey("AAPODashboard");
		        }
		        else if((role === "div") || (role === "sa1") || (role === "librarySa")) // SA
		        {
		            xrayTestIssueKey = permLib.getXRAYTestIssueKey("SADashboard");
		        }
		        else if((role === "da") || (role === "aa") || (role === "specialty")) // DA
		        {
		            xrayTestIssueKey = permLib.getXRAYTestIssueKey("DADashboard");
		        }
		        else if((role === "cap") || (role === "vcedi") || (role === "apb") || (role === "senate")) // CAP
		        {
		            xrayTestIssueKey = permLib.getXRAYTestIssueKey("CAPDashboard");
		        }
		        else if((role === "vcap") || (role === "divdean") || (role === "dean")) // VCAP & DEANS
		        {
		            xrayTestIssueKey = permLib.getXRAYTestIssueKey("VCAPDeansDashboard");
		        }
		        else if((role === "deptChair") || (role === "areaChair") || (role === "specChair")) // CHAIRS
		        {
		            xrayTestIssueKey = permLib.getXRAYTestIssueKey("ChairsDashboard");
		        }
		    }
		    else if(role === "ManagePermissionsUnits")
		    {
		        if((role === "sa1") || (role === "librarySa") || (role === "div") || (role === "da") || (role === "aa") || (role === "specialty"))
		        {
		            xrayTestIssueKey = permLib.getXRAYTestIssueKey("ManagePermissionsUnitsSADA"); //     SA, Library SA, Division Admin, Department Admin, AA, Specialty Admin
		        }
		        else
		        {
		            xrayTestIssueKey = permLib.getXRAYTestIssueKey("ManagePermissionsUnits");
		        }
		    }
		    else
		    {
		        xrayTestIssueKey = permLib.getXRAYTestIssueKey(pageToTest);
		    }
		    
		    // log results data to file
		    const comment = testModule + ", " + role;
		    const status = passFail;
		    let dataForLogFile = [xrayTestIssueKey, testStartTime, testEndTime, comment, status];
		    await permLib.writeResultsToFile(caller, reportFileName, dataForLogFile);
		}
    }
	catch(error)
	{
	    permLib.logThis(loggingPrefix + "UH-OH, spaghetti-o's");
		permLib.logThis(error.message);
		permLib.logThis(error);
		
	    if(caller === "CLI")
	    {
	        await permLib.writeResultsToFile(caller, reportFileName, [testEndTime, environment, pageToTest, toLiteralRole(role), "ERROR", error.message]);
	    }
	    else if (caller === "OTTO")
	    {
	         await permLib.writeResultsToFile(caller, reportFileName, [pageToTest, testStartTime, testEndTime, error, error.message]);
	    }
		
		logThis(loggingPrefix + "creating kodak moment...");
		await permLib.createKodakMoment(driver);
	}
}