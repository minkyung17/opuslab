const profileLib = require("./PROFILE-LIB");

// specialized page/URL just for this test
const pageToTest = "ProfileAppointmentSet";  // must use same key as used elsewhere (e.g. data/PAGE_PATHS, data/PAGE_TITLES, libraries/PAGEFACTORY)

const role = "apo";

// initialize report file name
var reportFileName = null;

// initialize type of modal (success/error) after saving
var saveModalType = null;

// initialize result
var rawResult = "";

// initialize judgement to empty
var judgement = "";

// declare test start and end times
var testStartTime = null;
var testEndTime = null;

exports.runprofileEndAppointmentSetTest = async (caller, environment) => {
	// initialize values
	var passFail = "";
	const modalComments = "PROFILE-ENDAPPTSET";
	
    // define prefix for output
    const testModule = "PROFILE-END-APPT-SET apo";
    const loggingPrefix = testModule + " " + environment + " apo ";
    
    profileLib.logThis(loggingPrefix + "START");
    testStartTime = new Date();
    
    // check if entered role is one we're checking for (if not, exit)
    const lineup =
    [
		"apo"
    ];
    profileLib.checkIfInLineup(loggingPrefix, "apo", lineup);
    
    try
    {
        // declare driver
		var driver = null;
		
		// set up driver
		driver = await profileLib.setUpDriver(loggingPrefix, driver);
		
		
		//////////////////////////////////////////////////////////////////
		// GET URL
		//////////////////////////////////////////////////////////////////
		
		// load page by url (credentials page will intercept)
		profileLib.getURL(loggingPrefix, driver, environment, pageToTest, role);
		
		
		//////////////////////////////////////////////////////////////////
		// CREDENTIALS
		//////////////////////////////////////////////////////////////////
		
		// enter credentials and submit
		try
		{
		    const signOnPage = new profileLib.SignonPage();
		    await signOnPage.enterCredentials(loggingPrefix, driver, role);
		}
		catch(error)
		{
		    profileLib.logThis(loggingPrefix + "problem with credentials");
		    profileLib.logThis(error);
		    rawResult = "credentials error";
		}
		
		
		//////////////////////////////////////////////////////////////////
		// GENERAL PAGE ACCESS CHECK
		//////////////////////////////////////////////////////////////////
		
		// create new instance of page being tested
		const selectedPage = await profileLib.makePage(loggingPrefix, driver, pageToTest);
		
		// don't even bother if page didn't load
		var pageDidLoad = null;
		try
		{
		    const isTitleCorrect = await selectedPage.isTitleCorrect(loggingPrefix, driver, pageToTest);
		    profileLib.logThis(loggingPrefix + "title is correct");
		    
			pageDidLoad = true;
		}
		catch(error)
		{
		    pageDidLoad = false;
		    profileLib.logThis(loggingPrefix + "title not correct: page did not load within set time limit");
		    profileLib.logThis(error);
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
		
			// create new instance of Profile page
			const profilePage = new profileLib.ProfilePage();
			
			// click Edit Profile for Additional-Joint appointment on "Active Appointments" nav link
            await profilePage.clickAdditionalJointAppointmentEditActive(loggingPrefix, driver);
		
		
			//////////////////////////////////////////////////////////////////
			// MODAL ENTRY
			//////////////////////////////////////////////////////////////////
			
			if(await profilePage.newAppointmentModalExists(loggingPrefix, driver))
			{
				await profilePage.selectAppointmentStatusArchived(loggingPrefix, driver);
				
				// enter comments
				await profilePage.enterComments(loggingPrefix, driver, modalComments);
			}
		
		
			//////////////////////////////////////////////////////////////////
			// LOGGING OF MODAL DATA TO CONSOLE
			//////////////////////////////////////////////////////////////////
		
			// define variable to concatenate entered data to
			var modalFields = "";
		
			// output entered data to console
			profileLib.logThis(loggingPrefix + "DATA READ FROM MODAL -------------------------");
		
			// "modal"+FieldName (e.g.modalAppointmentStatusText) are the actual values a user would see in each modal field
			let modalAppointmentStatus = await profilePage.getModalAppointmentStatus(driver);
			profileLib.logThis(loggingPrefix + "Appointment Status         : " + modalAppointmentStatus);
			modalFields += modalAppointmentStatus + ", ";
		
			let modalDepartmentCode = await profilePage.getModalDepartmentCode(driver);
			profileLib.logThis(loggingPrefix + "Department Code            : " + modalDepartmentCode);
			modalFields += modalDepartmentCode + ", ";
		
			let department = await profilePage.getModalDepartment(driver);
			profileLib.logThis(loggingPrefix + "Department                 : " + department);
			modalFields += department + ", ";
		
			let school = await profilePage.getModalSchool(driver);
			profileLib.logThis(loggingPrefix + "School                     : " + school);
			modalFields += school + ", ";
			/* NA for this test
			let area = await profilePage.getModalArea(driver);
			profileLib.logThis(loggingPrefix + "Area                       : " + area);
			modalFields += area + ", ";
			*/
			modalFields += ", "; // to compensate logging
			
			let appointmentAffiliation = await profilePage.getModalAppointmentAffiliation(driver);
			profileLib.logThis(loggingPrefix + "Appointment Affiliation    : " + appointmentAffiliation);
			modalFields += appointmentAffiliation + ", ";
		
			let modalAppointmentPercentTime = await profilePage.getModalPercentTime(driver);
			profileLib.logThis(loggingPrefix + "Percent Time               : " + modalAppointmentPercentTime);
			modalFields += modalAppointmentPercentTime + ", ";
		
			let location1 = await profilePage.getLocation1(driver);
			profileLib.logThis(loggingPrefix + "Location 1                 : " + location1);
			modalFields += location1 + ", ";
		    /* NA for this test
			let location2 = await profilePage.getLocation2(driver);
			profileLib.logThis(loggingPrefix + "Location 2                 : " + location2);
			modalFields += location2 + ", ";
			*/
			modalFields += ", "; // to compensate logging
			
			let titleCode = await profilePage.getTitleCode(driver);
			profileLib.logThis(loggingPrefix + "Title Code                 : " + titleCode);
			modalFields += titleCode + ", ";
		
			let series = await profilePage.getSeries(driver);
			profileLib.logThis(loggingPrefix + "Series                     : " + series);
			modalFields += series + ", ";
		
			let rank = await profilePage.getRank(driver);
			profileLib.logThis(loggingPrefix + "Rank                       : " + rank);
			modalFields += rank + ", ";
		
			let yearsAtCurrentRank = await profilePage.getYearsAtCurrentRank(driver);
			profileLib.logThis(loggingPrefix + "Years at Current Rank      : " + yearsAtCurrentRank);
			modalFields += yearsAtCurrentRank + ", ";
		
			let step = await profilePage.getStep(driver);
			profileLib.logThis(loggingPrefix + "Step                       : " + step);
			modalFields += step + ", ";
		
			let yearsAtCurrentStep  = await profilePage.getYearsAtCurrentStep(driver);
			profileLib.logThis(loggingPrefix + "Years at Current Step      : " + yearsAtCurrentStep);
			modalFields += yearsAtCurrentStep + ", ";
		
			let payrollSalary = await profilePage.getPayrollSalary(driver);
			profileLib.logThis(loggingPrefix + "Payroll Salary             : " + payrollSalary);
			modalFields += payrollSalary + ", ";
		
			let salaryLastAdvancement = await profilePage.getSalaryAtLastAdvancement(driver);
			profileLib.logThis(loggingPrefix + "Salary at Last Advancement : " + salaryLastAdvancement);
			modalFields += salaryLastAdvancement + ", ";
		
			let salaryEffectiveDate = await profilePage.getSalaryScaleEffectiveDate(driver);
			profileLib.logThis(loggingPrefix + "Salary Scale Effective Date: " + salaryEffectiveDate);
			modalFields += salaryEffectiveDate + ", ";
			
			/* NA for this test
			let apuID = await profilePage.getAPUID(driver);
			profileLib.logThis(loggingPrefix + "APU ID                     : " + apuID);
			modalFields += apuID + ", ";
			
			let hscpScale1to9 = await profilePage.getHSCPScale0to9(driver);
			profileLib.logThis(loggingPrefix + "HSCP Scale (0-9)           : " + hscpScale1to9);
			modalFields += hscpScale1to9 + ", ";
			
			let hscpScale0X = await profilePage.getHSCPScale0X(driver);
			profileLib.logThis(loggingPrefix + "HSCP Scale 0(X)            : " + hscpScale0X);
			modalFields += hscpScale0X + ", ";
		
			let hscpBaseSalaryXAndX = await profilePage.getHSCPBaseSalaryXAndXp(driver);
			profileLib.logThis(loggingPrefix + "HSCP Base Salary (X + X')  : " + hscpBaseSalaryXAndX);
			modalFields += hscpBaseSalaryXAndX + ", ";
		
			let hscpAdditionalBaseIncrementXp = await profilePage.getHSCPAdditionalBaseIncrementXp(driver);
			profileLib.logThis(loggingPrefix + "HSCP Add'l Base Increment  : " + hscpAdditionalBaseIncrementXp);
			modalFields += hscpAdditionalBaseIncrementXp + ", ";
			*/
			
			// adjust modalFields since some fields are NA for this test
			modalFields += ", , , , , ";
			
			let dateOfLastAdvancement = await profilePage.getDateOfLastAdvancement(driver);
			profileLib.logThis(loggingPrefix + "Date of Last Advancement   : " + dateOfLastAdvancement);
			modalFields += dateOfLastAdvancement + ", ";
		
			let startDateAtSeries = await profilePage.getStartDateAtSeries(driver);
			profileLib.logThis(loggingPrefix + "Start Date at Series       : " + startDateAtSeries);
			modalFields += startDateAtSeries + ", ";
		
			let startDateAtRank = await profilePage.getStartDateAtRank(driver);
			profileLib.logThis(loggingPrefix + "Start Date at Rank         : " + startDateAtRank);
			modalFields += startDateAtRank + ", ";
		
			let startDateAtStep = await profilePage.getStartDateAtStep(driver);
			profileLib.logThis(loggingPrefix + "Start Date at Step         : " + startDateAtStep);
			modalFields += startDateAtStep + ", ";
		
			let appointmentEndDate = await profilePage.getAppointmentEndDate(driver);
			profileLib.logThis(loggingPrefix + "Appt. End Date             : " + appointmentEndDate);
			modalFields += appointmentEndDate + ", ";
			
			// declared at start since apptID doesn't appear until after saving
			apptID = await profilePage.getApptID(driver);
			profileLib.logThis(loggingPrefix + "Appt. ID                   : " + apptID);
			// modalFields += apptID + ", "; // removed since already used as test identifier
		
			let ucPathPositionNumber = await profilePage.getUCPathPositionNumber(driver);
			profileLib.logThis(loggingPrefix + "Path Position #            : " + ucPathPositionNumber);
			modalFields += ucPathPositionNumber + ", ";
		
			// Comments Icon Number (this is not actually in the modal, but logically goes here so a blank is added in the "modal" line so it aligns with the "read" line of the log file)
			modalFields += "" + ", ";
			
			// Comments
			let comments = await profilePage.getComments(driver);
			profileLib.logThis(loggingPrefix + "Comments                   : " + comments);
			modalFields += comments; // no trailing comma since this is last modal field
		
			// mark end of data read from modal
			profileLib.logThis(loggingPrefix + "----------------------------------------------");
		
		
			//////////////////////////////////////////////////////////////////
			// SAVE BUTTON & WARNING MODAL SAVE BUTTON
			//////////////////////////////////////////////////////////////////
		
			// click Save button
			await profilePage.clickSaveButton(loggingPrefix, driver);
			
			// click save button on warning modal (now it's really saving)
			await profilePage.clickWarningModalSaveButton(loggingPrefix, driver);
			
			
			//////////////////////////////////////////////////////////////////
			// RESULT CONFIRMATION
			//////////////////////////////////////////////////////////////////
			
			// click Inactive Appointments link
			await profilePage.clickAppointmentSetsLink(loggingPrefix, driver);
			
			// get Appointment ID under "Appointment Sets" link
			let appointmentIDInAppointmentSets = await profilePage.getAppointmentIDAppointmentSetsLink(loggingPrefix, driver);
			
			// check if Appointment ID under "Appointment Sets" link is same as 
			appointmentIDInAppointmentSets === apptID ? passFail = "passed" : passFail = "FAILED";
			
			
			//////////////////////////////////////////////////////////////////
			// Opus ID
			//////////////////////////////////////////////////////////////////
		
			opusID = await profilePage.getOpusID(loggingPrefix, driver);
		} // end (if pageDidLoad)
		
		
		//////////////////////////////////////////////////////////////////
		// CLEANUP
		//////////////////////////////////////////////////////////////////
		
		await profileLib.quit(driver);
		testEndTime = new Date();
		profileLib.logThis(loggingPrefix + "END");
		
		await profileLib.printTestRunTime(loggingPrefix, testStartTime, testEndTime);
		
		
		//////////////////////////////////////////////////////////////////
		// LOGGING OF MODAL DATA TO FILE
		//////////////////////////////////////////////////////////////////
		
        // set report file name
        reportFileName = getReportFileName(caller, "PROFILE");
        
		if(caller === "CLI")
		{
		    profileLib.logThis("Hi Captain Tammy! Has OTTO deflated?");
		    
			try
			{
				// log input data (row 1 of log file record) to file
				// set up variable for logging
				let dataForLogFile1 = [testEndTime, environment, pageToTest, passFail, role, opusID, "", modalFields, saveModalType];
				await profileLib.writeResultsToFile(caller, reportFileName, dataForLogFile1);
			}
			catch(error)
			{
				let dataForLogFile = [testEndTime, environment, pageToTest, toLiteralRole(role), "", "ERROR"];
				await profileLib.writeResultsToFile(caller, reportFileName, dataForLogFile);
			
				profileLib.logThis(error.message);
				profileLib.logThis(error);
			}
		}
		else if (caller === "OTTO")// it's otto/scheduler
		{
		    profileLib.logThis("OTTO'S FLYING? UH-OH");
		    
		    xrayTestIssueKey = profileLib.getXRAYTestIssueKey(pageToTest);
		    
		    // log results data to file
		    const comment = testModule + ", " + role;
		    const status = passFail;
		    let dataForLogFile = [xrayTestIssueKey, testStartTime, testEndTime, comment, status];
		    await profileLib.writeResultsToFile(caller, reportFileName, dataForLogFile);
		}
    }
	catch(error)
	{
	    profileLib.logThis(loggingPrefix + "UH-OH, spaghetti-o's");
		profileLib.logThis(error.message);
		profileLib.logThis(error);
		
	    if(caller === "CLI")
	    {
	        await profileLib.writeResultsToFile(caller, reportFileName, [testEndTime, environment, pageToTest, toLiteralRole(role), "ERROR", error.message]);
	    }
	    else if (caller === "OTTO")
	    {
	         await profileLib.writeResultsToFile(caller, reportFileName, [pageToTest, testStartTime, testEndTime, error, error.message]);
	    }
		
		logThis(loggingPrefix + "creating kodak moment...");
		await profileLib.createKodakMoment(driver);
	}
}
