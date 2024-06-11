const profileLib = require("./PROFILE-LIB");

const pageToTest = "ProfileSearch";  // must use same key as used elsewhere (e.g. data/PAGE_PATHS)

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

exports.runProfileNewApptTest = async (caller, environment) => {
	// set values
	var opusID = "";
	var apptID = "";
	var joinedProfileFields = "";
	var passFail = "";
	const searchProfile = "Test-Edimi, Six";
	const percentTime = "30";
	const uclaPercent = "0";
	const campus2Percent = "30";
	const modalStep = "3"; // doesn't like plain-old step (inconsistent)
	const salaryAtLastAdvancement = "100000";
	const modalDateOfLastAdvancement = "03/02/2021"; // doesn't like plain-old dateOfLastAdvancement (inconsistent)
	const modalComments = "Test Case Profile-AddNew 001";
	const profileURL = "https://opustst.it.ucla.edu/opusWeb/ui/admin/profile.shtml?id=210995"; // needs reloading so new details can be read
	
	const expectedNumberOfComments = 1;
	    
    // define prefix for output
    const testModule = "PROFILE-NEW-APPT apo";
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
		
			// enter search term in input field, select result, and click add new appointment button
			await profilePage.enterSearchProfile(loggingPrefix, driver, searchProfile);
			await profilePage.clickSearchResult(loggingPrefix, driver);
			await profilePage.clickAddNewAppointmentButton(loggingPrefix, driver);
		
		
			//////////////////////////////////////////////////////////////////
			// MODAL ENTRY
			//////////////////////////////////////////////////////////////////
		
			// basic info
			await profilePage.clickDepartmentCodeDropdown(loggingPrefix, driver);
			await profilePage.selectDepartmentCode171800(loggingPrefix, driver);
			await profilePage.enterPercentTime(loggingPrefix, driver, percentTime);
		
			// locations: campus and % at each
			await profilePage.enterUCLAPercent(loggingPrefix, driver, uclaPercent);
			await profilePage.setPageDimensions(loggingPrefix, driver, 510, 1290); //to avoid click intercept error in headless 
			await profilePage.clickAddLocationButton(loggingPrefix, driver);
			await profilePage.selectLocation2OVMC(loggingPrefix, driver);
			await profilePage.enterLocation2Percent(loggingPrefix, driver, campus2Percent);
			await profilePage.clickTitleCodeDropdown(loggingPrefix, driver);
			await profilePage.selectTitleCode001724(loggingPrefix, driver);
			await profilePage.clickStepDropdown(loggingPrefix, driver);
			await profilePage.selectStep(loggingPrefix, driver, modalStep);
			await profilePage.enterSalaryAtLastAdvancement(loggingPrefix, driver, salaryAtLastAdvancement);
		
			// salary details
			await profilePage.clickAPUIDDropdown(loggingPrefix, driver);
			await profilePage.waitForSalaryAtLastAdvancement(loggingPrefix, driver);
			await profilePage.chooseAPUID1718CT(loggingPrefix, driver);
			await profilePage.waitForHSCPAdditional(loggingPrefix, driver);
		
			// appointment details
			await profilePage.enterDateOfLastAdvancement(loggingPrefix, driver, modalDateOfLastAdvancement);
			await profilePage.dismissJSDatepicker(loggingPrefix, driver);
			const currentDate = getCurrentDate224(loggingPrefix);
			await profilePage.enterStartDateAtSeries(loggingPrefix, driver, currentDate);
			await profilePage.dismissJSDatepicker(loggingPrefix, driver);
			await profilePage.enterStartDateAtRank(loggingPrefix, driver, currentDate);
			await profilePage.dismissJSDatepicker(loggingPrefix, driver);
			await profilePage.enterStartDateAtStep(loggingPrefix, driver, currentDate);
			await profilePage.dismissJSDatepicker(loggingPrefix, driver);
		
			// comments
			await profilePage.enterComments(loggingPrefix, driver, modalComments);
		
		
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
		
			let area = await profilePage.getModalArea(driver);
			profileLib.logThis(loggingPrefix + "Area                       : " + area);
			modalFields += area + ", ";
		
			let appointmentAffiliation = await profilePage.getModalAppointmentAffiliation(driver);
			profileLib.logThis(loggingPrefix + "Appointment Affiliation    : " + appointmentAffiliation);
			modalFields += appointmentAffiliation + ", ";
		
			let appointmentPercentTime = await profilePage.getModalPercentTime(driver);
			profileLib.logThis(loggingPrefix + "Percent Time               : " + appointmentPercentTime);
			modalFields += appointmentPercentTime + ", ";
		
			let location1 = await profilePage.getLocation1(driver);
			profileLib.logThis(loggingPrefix + "Location 1                 : " + location1);
			modalFields += location1 + ", ";
		
			let location2 = await profilePage.getLocation2(driver);
			profileLib.logThis(loggingPrefix + "Location 2                 : " + location2);
			modalFields += location2 + ", ";
		
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
			// SAVE BUTTON
			//////////////////////////////////////////////////////////////////
		
			// click save button
			await profilePage.clickSaveButton(loggingPrefix, driver);
		
			// show wait time elapsed since saving will take time
			showElapsedTime(loggingPrefix, driver, profilePage.resultModalTitleBy);
		
		
			//////////////////////////////////////////////////////////////////
			// SUCCESS/FAIL MODAL
			//////////////////////////////////////////////////////////////////
			
			const modalHeader = await profilePage.getResultModalTitle(driver);
		
			// default result to fail
			saveModalType = "FAILURE";
		
			if(modalHeader === "Success!")
			{
				saveModalType = "success";
			}
			profileLib.logThis(loggingPrefix + "after clicking save button, this modal appeared: " + saveModalType);
			
			// click ok button on success/fail modal
			await profilePage.clickSaveResultOK(driver);
			profileLib.logThis(loggingPrefix + "OK button on success/fail modal clicked");
		
		
			//////////////////////////////////////////////////////////////////
			// PROFILE PAGE DETAILS
			//////////////////////////////////////////////////////////////////
		
			// define object for logging to file
			let profileFields =
			{
				"Appointment Status": "",
				"Department Code": "",
				"Department": "",
				"School": "",
				"Area": "",
				"Appointment Affiliation": "",
				"Percent Time": "",
				"Location 1": "",
				"Location 2": "",
				"Title Code": "",
				"Series": "",
				"Rank": "",
				"Years at Current Rank": "",
				"Step": "",
				"Years at Current Step": "",
				"Payroll Salary": "",
				"Salary at Last Advancement": "",
				"Salary Scale Effective Date": "",
				"APU ID": "",
				"HSCP Scale (0-9)": "",
				"HSCP Scale 0(X)": "",
				"HSCP Base Salary (X + X')": "",
				"HSCP Add'l Base Increment (X')": "",
				"Date of Last Advancement": "",
				"Start Date at Series": "",
				"Start Date at Rank": "",
				"Start Date at Step": "",
				"Appt. End Date": "",
				"Appt. ID": "",
				"Path Position #": "",
				"Comments Icon #": "",
				"Comment": ""
			};
		
			if(saveModalType === "success")
			{
				// set profile fields in the log file (most of second row) when saving is successful
				profileFields = await profilePage.getProfilePageDetails(loggingPrefix, driver, profileURL, profileFields);
			}
			else
			{
				// fields read from the profile page (most of the second row in the log file) will be blank for anything other than a successful save
			}
		
		
			//////////////////////////////////////////////////////////////////
			// COMMENTS ICON & MODAL
			//////////////////////////////////////////////////////////////////
		
			// get number in comments icon
			let commentsIconNumber = await profilePage.getNumberInCommentsIcon(driver);
		
			// check number in comments icon
			profileLib.logThis(loggingPrefix + "expected number of comments: " + expectedNumberOfComments);
			profileLib.logThis(loggingPrefix + "number of comments read    : " + commentsIconNumber);
			
			if(parseInt(commentsIconNumber) === expectedNumberOfComments)
			{
				passFail = "passed";
				profileLib.logThis(loggingPrefix + "number of comments shown in icon did match expected number");
			
				// add to object for log file
				profileFields["Comments Icon #"] = commentsIconNumber;
			}
			else
			{
				passFail = "FAILED";
				profileLib.logThis(loggingPrefix + "number of comments shown in icon did NOT match expected number");
			
				// add to object for log file
				profileFields["Comments Icon #"] = commentsIconNumber;
			}
		
			// get comments modal content
			let comment = await profilePage.getCommentsModalComment(driver);
			profileLib.logThis(loggingPrefix + "first comment is: " + comment);
		
			// set comment for logging
			profileFields["Comment"] = comment;
		
			// store apptID (previously read) separately since will be removed from profileFields object so object can be joined into CSV format
			apptID = profileFields["Appt. ID"];
			delete profileFields["Appt. ID"];
		
			// create an array of the values in the profileFields object
			let profileFieldsValuesArray = Object.values(profileFields);
		
			// create a comma-separated string by joining the values in the profileFields object
			joinedProfileFields = profileFieldsValuesArray.join(",");
		
		
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
		// LOGGING OF MODAL DATAL TO FILE
		//////////////////////////////////////////////////////////////////
		
        // set report file name
        reportFileName = getReportFileName(caller, "PROFILE");
        
		if(caller === "CLI")
		{
		    profileLib.logThis("Hi Captain Tammy! Has OTTO deflated?");
		    
			try
			{
				// if it gets to this point without being marked as having failed, mark as passed
				if(passFail === "")
				{
					passFail = "passed";
				}
		
				/* logging to log file is split into two rows because
				/* apptID doesn't appear until after data is entered
				*/
		
				// log input data (row 1 of log file record) to file
				// set up variable for logging
				let dataForLogFile1 = [testEndTime, environment, pageToTest, passFail, role, opusID, "", modalFields, saveModalType];
				await profileLib.writeResultsToFile(caller, reportFileName, dataForLogFile1);
		
				// log details data (row 2 of log file record) to file
				let dataForLogFile2 = [testEndTime, environment, pageToTest, passFail, role, opusID, apptID, joinedProfileFields, ""];
				await profileLib.writeResultsToFile(caller, reportFileName, dataForLogFile2);
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