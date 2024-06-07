const xlsLib = require("./XLS-LIB");
var assert = require('assert');

const role = "apo";

// initialize report file name
var reportFileName = null;

// set fileRecordCount to empty in log in case file doesn't download, then add value if file downloads
var fileRecordCount = "";

// total number of records in table
var webpageRecordsTotal = 0;

// did the export succeed
var fileDidDownload = null;

// initialize judgement to empty
var judgement = "";

// declare test start and end times
var testStartTime = null;
var testEndTime = null;

exports.runXLS = async (caller, environment, pageToTest) => {

    //////////////////////////////////////////////////////////////////
	// ROLE CHECK
	//////////////////////////////////////////////////////////////////
    
    // define prefix for output
    const testModule = "XLS";
    const loggingPrefix = testModule + " " + environment + " " + pageToTest + " " + role + " ";
    
    xlsLib.logThis(loggingPrefix + "START");
    testStartTime = new Date();
    
    // check if entered role is one we're checking for (if not, exit)
    const lineup =
    [
		"apo",
		"oa"
    ];
    xlsLib.checkIfInLineup(loggingPrefix, role, lineup);
    
    try
    {
        // declare driver
		var driver = null;
		
		// set up driver
		driver = await xlsLib.setUpDriver(loggingPrefix, driver);
		
		
		//////////////////////////////////////////////////////////////////
		// GET URL
		//////////////////////////////////////////////////////////////////
		
		// load page by url (credentials page will intercept)
		xlsLib.getURL(loggingPrefix, driver, environment, pageToTest);
		
		
		//////////////////////////////////////////////////////////////////
		// CREDENTIALS
		//////////////////////////////////////////////////////////////////
		
		// enter credentials and submit
		try
		{
		    const signOnPage = new xlsLib.SignonPage();
		    await signOnPage.enterCredentials(loggingPrefix, driver, role);
		}
		catch(error)
		{
		    xlsLib.logThis(loggingPrefix + "problem with credentials");
		    xlsLib.logThis(error);
		    rawResult = "credentials error";
		}
		
		
		//////////////////////////////////////////////////////////////////
		// GENERAL PAGE ACCESS CHECK
		//////////////////////////////////////////////////////////////////
		
		// create new instance of page being tested
		const selectedPage = await xlsLib.makePage(loggingPrefix, driver, pageToTest);
		
		// don't even bother if page didn't load
		var pageDidLoad = null;
		try
		{
		    await selectedPage.isTitleCorrect(loggingPrefix, driver, pageToTest);
		    
			pageDidLoad = true;
		}
		catch(error)
		{
		    pageDidLoad = false;
		    xlsLib.logThis(loggingPrefix + "page did not load within set time limit");
		}
		
		if(pageDidLoad)
		{		
			// initialize result
			let rawResult = "";
		
			// do initial permissions check (general page, not in-page)
			try
			{
				rawResult = await xlsLib.checkForErrorPage(loggingPrefix, driver, rawResult);
			}
			catch(error)
			{
				xlsLib.logThis(loggingPrefix + "problem checking initial page permissions");
				xlsLib.logThis(error.message);
				rawResult = "error page appeared";
			}
		
		
			//////////////////////////////////////////////////////////////////
			// CHECK FOR DATA IN TABLE
			//////////////////////////////////////////////////////////////////
		
			// this boolean comes from DataTable class
			let dataExists = await selectedPage.checkForData(loggingPrefix, driver);
			
			
			//////////////////////////////////////////////////////////////////
			// MODAL (BULK TESTS) OR GENERAL PAGE
			//////////////////////////////////////////////////////////////////
			
			if(new RegExp('Bulk', "i").test(pageToTest)) // modal (bulk tests)
			{
			    // get Start Multiple Cases menu
			    await selectedPage.getStartMultipleCasesMenu(loggingPrefix, driver);
			    
			    // click "Start Multiple Cases" 
			    await selectedPage.clickStartMultipleCases(loggingPrefix, driver);
			    
			    // wait for modal to appear
			    await selectedPage.waitForModal(loggingPrefix, driver);
			    
			    // click MultipleCases dropdown
			    await selectedPage.clickMultipleCasesDropdown(loggingPrefix, driver);
			    
			    // select case type based on entered input
			    if(new RegExp('[a-zA-Z]*ChangeAPU[a-zA-Z]*', "i").test(pageToTest)) // Change APU
			    {
			        await selectedPage.selectChangeAPU(loggingPrefix, driver);
			    }
			    else if(new RegExp('[a-zA-Z]*BulkEndAppt[a-zA-Z]*', "i").test(pageToTest)) // End Appointment
			    {
			        await selectedPage.selectBulkEndAppt(loggingPrefix, driver);
			    }
			    else if(new RegExp('[a-zA-Z]*BulkReappt[a-zA-Z]*', "i").test(pageToTest)) // Reappointment
			    {
			        await selectedPage.selectBulkReappt(loggingPrefix, driver);
			    }
			    else if(new RegExp('[a-zA-Z]*BulkRenewal[a-zA-Z]*', "i").test(pageToTest)) // Renewal
			    {
			        await selectedPage.selectBulkRenewal(loggingPrefix, driver);
			    }
			    
			    // click modal Next button
			    await selectedPage.clickModalNextButton(loggingPrefix, driver);
			    
			    // set modal to true so Check All in modem table will get checked and not the one in general page
			    let modal = true;
			    
			    // select modal's Check All
		        await selectedPage.selectCheckAll(loggingPrefix, driver, modal);
		        
		        // get total from webpage to compare to records in file
		        await selectedPage.checkForData(loggingPrefix, driver, modal);
		        webpageRecordsTotal = await selectedPage.getCurrentRecordsTotal(loggingPrefix, driver, modal);
		        
		        // click modal export button
		        await selectedPage.clickModalExportButton(loggingPrefix, driver);
			}
			else // general page
			{
				//////////////////////////////////////////////////////////////////
				// CAMO - SPECIAL HANDLING
				//////////////////////////////////////////////////////////////////
			
				if(new RegExp('[a-zA-Z]*CAMO[a-zA-Z]*', "i").test(pageToTest))
				{		    
					xlsLib.logThis(loggingPrefix + "handling dropdown for CAMO page -- " + pageToTest);
					if(!new RegExp('[a-zA-Z]*APO[a-zA-Z]*', "i").test(pageToTest)) // APO is excluded because it's the default
					{
						// first click the view dropdown (same for all)
						await selectedPage.clickViewDropdown(loggingPrefix, driver);
					
						// select dropdown option based on entered page
						if(new RegExp('[a-zA-Z]*CAP[a-zA-Z]*', "i").test(pageToTest))
						{
							// select CAP
							await selectedPage.selectCAPView(loggingPrefix, driver);
						}
						else if(new RegExp('[a-zA-Z]*DeansOffice[a-zA-Z]*', "i").test(pageToTest))
						{
							// select Dean's Office
							await selectedPage.selectDeansOfficeView(loggingPrefix, driver);
						}
						else if(new RegExp('[a-zA-Z]*Department[a-zA-Z]*', "i").test(pageToTest))
						{
							// select Department
							await selectedPage.selectDepartmentView(loggingPrefix, driver);
						}
						else if(new RegExp('[a-zA-Z]*Library[a-zA-Z]*', "i").test(pageToTest))
						{
							// select Library
							await selectedPage.selectLibraryView(loggingPrefix, driver);
						}
					}	
				
					// check for data again since it will refresh
					let dataExists = await selectedPage.checkForData(loggingPrefix, driver);		    
				}
			
			
				//////////////////////////////////////////////////////////////////
				// RETURN TO REGULARLY SCHEDULED PROGRAM (FROM CAMO)
				//////////////////////////////////////////////////////////////////
			
				// since records are all-or-none, all records total should be final, so get total
				webpageRecordsTotal = await selectedPage.getCurrentRecordsTotal(loggingPrefix, driver);
		
				// only keep going if some records load
				//if(dataExists)
				// temporarily changing to always happen since 0 records may be possible at present
				if(true)
				{
					//////////////////////////////////////////////////////////////////
					// CHECK ALL - GENERAL PAGE (get all columns in table for export)
					//////////////////////////////////////////////////////////////////
					
					await selectedPage.selectCheckAll(loggingPrefix, driver);
			
			
					//////////////////////////////////////////////////////////////////
					// EXPORT TO EXCEL
					//////////////////////////////////////////////////////////////////
			
					// click Export To Excel button
					await selectedPage.clickExportToExcelButton(loggingPrefix, driver);
				}
				else // no records have loaded
				{
					rawResult = "ERROR";
				}
			} // end of general page conditional
			
			
			//////////////////////////////////////////////////////////////////
			// FILE SYSTEM: EXPORTED FILE CHECK
			//////////////////////////////////////////////////////////////////
			
			// only keep going if some records load
			//if(dataExists)
			// temporarily changing to always happen since 0 records may be possible at present
			if(true)
			{
				// define name of exported file
				const fileNamePlusExtension = selectedPage.getExportFileNamePlusExtension(loggingPrefix, driver, pageToTest);
				xlsLib.logThis(loggingPrefix + "checking file system directory for: " + fileNamePlusExtension);
			
				// get status of file download
				fileDidDownload = await xlsLib.isFileExported(loggingPrefix, fileNamePlusExtension);
	
				if(fileDidDownload)
				{
					fileDidDownload = "yes";
		
					// get the number of records in file (rows - headers)
					fileRecordCount = await xlsLib.getFileRecordTotal(loggingPrefix, fileNamePlusExtension);
					xlsLib.logThis(loggingPrefix + "total number of records in file: " + fileRecordCount);
				}
				else
				{
					fileDidDownload = "no";
		
					// if file didn't download, test automatically failed
					judgement = "FAILED";
				}
			}
				
						
			//////////////////////////////////////////////////////////////////
			// JUDGEMENT
			//////////////////////////////////////////////////////////////////
		
			// get pass/fail result 
			judgement = await xlsLib.compareWithExpectedResult(loggingPrefix, fileRecordCount, webpageRecordsTotal);
		}
		else // page didn't even load
		{
		    judgement = "FAILED: no page load";
		}
		
		
		//////////////////////////////////////////////////////////////////
		// CLEANUP
		//////////////////////////////////////////////////////////////////
		
		await xlsLib.quit(driver);
		testEndTime = new Date();
		xlsLib.logThis(loggingPrefix + "END");
		
		await xlsLib.printTestRunTime(loggingPrefix, testStartTime, testEndTime);
		
		
		//////////////////////////////////////////////////////////////////
		// LOGGING
		//////////////////////////////////////////////////////////////////
		
        // set report file name
        reportFileName = getReportFileName(caller, "XLS");
        
		if(caller === "CLI")
		{
		    xlsLib.logThis("Hi Captain Tammy! Has OTTO deflated?");
		    
			try
			{
				// set up variable for logging
				var dataForLogFile = [testEndTime, environment, pageToTest, role, webpageRecordsTotal, fileRecordCount, fileDidDownload, judgement];
		
				// log results to file
				await xlsLib.writeResultsToFile(caller, reportFileName, dataForLogFile);
		
				// wait for file exists check and record count to finish before quitting
				await xlsLib.wait(6000);
			}
			catch(error)
			{
				let dataForLogFile = [testEndTime, environment, pageToTest, toLiteralRole(role), "", "ERROR"];
				await xlsLib.writeResultsToFile(caller, reportFileName, dataForLogFile);
			
				xlsLib.logThis(error.message);
				xlsLib.logThis(error);
			}
		}
		else if (caller === "OTTO")// it's otto/scheduler
		{
		    xlsLib.logThis("OTTO'S FLYING? UH-OH");
		    
		    const xrayTestIssueKey = xlsLib.getXRAYTestIssueKey(pageToTest);
		    
		    // log results data to file
		    const comment = testModule + ", " + role;
		    const status = judgement;
		    let dataForLogFile = [xrayTestIssueKey, testStartTime, testEndTime, comment, status];
		    await xlsLib.writeResultsToFile(caller, reportFileName, dataForLogFile);
		}
    }
	catch(error)
	{
	    xlsLib.logThis(loggingPrefix + "UH-OH, spaghetti-o's");
		xlsLib.logThis(error.message);
		xlsLib.logThis(error);
		
	    if(caller === "CLI")
	    {
	        await xlsLib.writeResultsToFile(caller, reportFileName, [testEndTime, environment, pageToTest, toLiteralRole(role), "ERROR", error.message]);
	    }
	    else if (caller === "OTTO")
	    {
	         await xlsLib.writeResultsToFile(caller, reportFileName, [pageToTest, testStartTime, testEndTime, error, error.message]);
	    }
		
		logThis(loggingPrefix + "creating kodak moment...");
		await xlsLib.createKodakMoment(driver);
	}
}