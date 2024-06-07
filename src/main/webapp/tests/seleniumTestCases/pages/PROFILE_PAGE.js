const Page = require ('./PAGE');
const text = require ('../libraries/TEXT');

const {By, Key, Select, until} = require('selenium-webdriver');

class ProfilePage extends Page
{
    //////////////////////////////////////////////////////////////////
	// CONSTRUCTOR
	//////////////////////////////////////////////////////////////////
	
    constructor()
    {
        super();
    }
    
    
    //////////////////////////////////////////////////////////////////
	// PROFILE PAGE LOCATORS (non-modal)
	//////////////////////////////////////////////////////////////////
	
    // use the js get syntax to bind the by as you would with classes in other languages
    // general profile page locators
    get searchProfileBy() { return By.id("profile-search"); }
    get searchResultBy() { return By.css(".ui-menu-item"); }
    get addNewAppointmentButtonBy() { return By.xpath('//button[text()="Add New Appointment"]'); }
    get eightYearClockLinkBy() { return By.name("eightYearClock"); }
    get excellenceReviewClockLinkBy() { return By.name("excellenceClock"); }
    get activeAppointmentsLinkBy() { return By.name("profile"); }
    get inactiveAppointmentsLinkBy() { return By.name("inactiveProfile"); }
    get appointmentSetsLinkBy() { return By.name("appointmentSets"); }
    get commentsIconBy() { return By.css(".comment-icon-centered"); }
    get detailstLinkBy() { return By.className(" toggle-message "); }
	get additionalJointAppointmentActiveBy() { return By.xpath('//h2[text()="Management Dept."]/../span[1]/img[1]'); } // specific to PROFILE-END-APPT-SET
	get additionalJointAppointmentInactiveAppointmentBy() { return By.xpath('//h2[text()="Management Dept."]'); } // specific to PROFILE-END-APPT-SET
    get appointmentSetsAppointmentIDBy() { return By.xpath('//th[text()="Adjunct, Management Dept."]/../../tr[2]/td/span[2]'); } // specific to PROFILE-END-APPT-SET
    
    
    //////////////////////////////////////////////////////////////////
	// PROFILE PAGE LOCATORS (profile details)
	//////////////////////////////////////////////////////////////////
	
	get appointmentStatusDetailBy() { return By.xpath('(//td[text()="Appointment Status"])[last()]/../td[last()]'); }
	get departmentCodeDetailBy() { return By.xpath('(//td[text()="Department Code"])[last()]/../td[last()]'); }
	get departmentDetailBy() { return By.xpath('(//td[text()="Department"])[last()]/../td[last()]'); }
	get schoolDetailBy() { return By.xpath('(//td[text()="School"])[last()]/../td[last()]'); }
	get areaDetailBy() { return By.xpath('(//td[text()="Area"])[last()]/../td[last()]'); }
	get location1DetailBy() { return By.xpath('(//td[text()="Location 1"])[last()]/../td[last()]'); }
	get location2DetailBy() { return By.xpath('(//td[text()="Location 2"])[last()]/../td[last()]'); }
	get appointmentAffilicationDetailBy() { return By.xpath('(//td[text()="Appointment Affiliation"])[last()]/../td[last()]'); }
	get titleCodeDetailBy() { return By.xpath('(//td[text()="Title Code"])[last()]/../td[last()]'); }
	get seriesDetailBy() { return By.xpath('(//td[text()="Series"])[last()]/../td[last()]'); }
	get rankDetailBy() { return By.xpath('(//td[text()="Rank"])[last()]/../td[last()]'); }
	get yearsAtCurrentRankDetailBy() { return By.xpath('(//td[text()="Years at Current Rank"])[last()]/../td[last()]'); }
	get stepDetailBy() { return By.xpath('(//td[text()="Step"])[last()]/../td[last()]'); }
	get yearsAtCurrentStepDetailBy() { return By.xpath('(//td[text()="Years at Current Step"])[last()]/../td[last()]'); }
	get percentTimeDetailBy() { return By.xpath('(//td[text()="Percent Time"])[last()]/../td[last()]'); }
	get payrollSalaryDetailBy() { return By.xpath('(//td[text()="Payroll Salary"])[last()]/../td[last()]'); }
	get salaryLastAdvancementDetailBy() { return By.xpath('(//td[text()="Salary at Last Advancement"])[last()]/../td[last()]'); }
	get salaryScaleEffectiveDateDetailBy() { return By.xpath('(//td[text()="Salary Scale Effective Date"])[last()]/../td[last()]'); }
	get apuIDDetailBy() { return By.xpath('(//td[text()="APU ID"])[last()]/../td[last()]'); }
	get hscpScale09DetailBy() { return By.xpath('(//td[text()="HSCP Scale (0-9)"])[last()]/../td[last()]'); }
	get hscpScale0XDetailBy() { return By.xpath('(//td[text()="HSCP Scale 0(X)"])[last()]/../td[last()]'); }
	get hscpBaseSalaryXXDetailBy() { return By.xpath('(//td[text()="HSCP Base Salary (X + X\')"])[last()]/../td[last()]'); }
	get hscpAddlBaseIncrementXDetailBy() { return By.xpath('(//td[text()="HSCP Add\'l Base Increment (X\')"])[last()]/../td[last()]'); }
	get dateOfLastAdvancementDetailBy() { return By.xpath('(//td[text()="Date of Last Advancement"])[last()]/../td[last()]'); }
	get startDateAtSeriesDetailBy() { return By.xpath('(//td[text()="Start Date at Series"])[last()]/../td[last()]'); }
	get startDateAtRankDetailBy() { return By.xpath('(//td[text()="Start Date at Rank"])[last()]/../td[last()]'); }
	get startDateAtStepDetailBy() { return By.xpath('(//td[text()="Start Date at Step"])[last()]/../td[last()]'); }
	get appointmentEndDateDetailBy() { return By.xpath('(//td[text()="Appt. End Date"])[last()]/../td[last()]'); }
	get appointmentIDDetailBy() { return By.xpath('(//td[text()="Appt. ID"])[last()]/../td[last()]'); }
	get pathPositionNumberDetailBy() { return By.xpath('(//td[text()="UCPath Position #"])[last()]/../td[last()]'); }
	
		
    //////////////////////////////////////////////////////////////////
	// NEW APPOINTMENT MODAL LOCATORS
	//////////////////////////////////////////////////////////////////
	
    // new appointment modal locators
    get newAppointmentModalTitleBy() { return By.css(".modal-title"); }
    get modalAppointmentStatusDropdownBy() { return By.id("appointmentStatusType"); }
    get modalDepartmentCodeDropdownBy() { return By.id("departmentCode"); }
    get modalDepartmentBy() { return By.xpath('//input[@name="department"]'); }
    get modalSchoolBy() { return By.xpath('//input[@name="school"]'); }
    get modalAreaBy() { return By.xpath('//input[@name="area"]'); }
    get modalAppointmentAffiliationBy() { return By.id("appointmentAffiliation"); }
    get modalAppointmentAffiliationPrimaryBy() { return By.xpath('//*[@id="appointmentAffiliation"]/option[text()="Primary"]'); }
    get modalAppointmentAffiliationAdditionalBy() { return By.xpath('//*[@id="appointmentAffiliation"]/option[text()="Additional"]'); }
    get modalPercentTimeBy() { return By.id("appointmentPctTime"); }
    get modalLocation1DropdownBy() { return By.id("locationDisplayText1"); }
    get modalLocationAddButtonBy() { return By.name("add"); }
    get modalUCLAPercentBy() { return By.id("locPercentTime1"); }
    get modalLocation2DropdownBy() { return By.id("locationDisplayText2"); }
    get modalLocation2OVMCBy() { return By.xpath('//*[@id="locationDisplayText2"]/option[text()="OVMC"]'); }
    get modalNameValidationMessageBy() { return By.xpath('//div[text()="Location Name may not be blank."]'); }
    get modalLocation2PerentFieldBy() { return By.id("locPercentTime2"); }
    get modalPercentSumValidationMessageBy() { return By.xpath('//div[text()="The sum of all Location %\'s must be equivalent to the Percent Time."]'); }
    get modalLocation2PercentValidationMessageBy() { return By.xpath('//div[text()="Location % may not be blank."]'); }
    get modalTitleCodeDropdownBy() { return By.id("titleCode"); }
    get modalTitleCode001724By() { return By.xpath('//option[text()="001724: ASST PROF IN RES-HCOMP"]'); }
    get modalTitleCode002050By() { return By.xpath('//option[text()="002050: HS ASST CLIN PROF-FY"]'); }
    get modalTitleCode003377By() { return By.xpath('//option[text()="003377: ADJ PROF-AY-B/E/E"]'); }
    get modalSeriesBy() { return By.name("series"); }
    get modalRankBy() { return By.name("rank"); }
    get modalYearsAtCurrentRankBy() { return By.name("yearsAtCurrentRank"); }
    get modalStepDropdownBy() { return By.id("step"); }
    get modalYearsAtCurrentStepBy() { return By.name("yearsAtCurrentStep"); }
    get modalPayrollSalaryBy() { return By.name("payrollSalary"); }
    get modalSalaryAtLastAdvancementBy() { return By.id("currentSalaryAmt"); }
    get modalOnScaleSalaryBy() { return By.name("onScaleSalary"); }
    get modalSalaryScaleEffectiveDateBy() { return By.name('salaryEffectiveDt'); }
    get modalAPUIDropdownBy() { return By.id("apuCode"); }
    get modalapuID1718CTBy() { return By.xpath('//option[text()="1718CT: SURG CARDIAC OTHER - 2023-24"]'); }
    get modalHSCPScale0to9By() { return By.name("hscpScale1to9"); }
    get modalHSCPScale0XBy() { return By.name("hscpScale0"); }
    get modalHSCPBaseSalaryXAndXpBy() { return  By.name("hscpBaseScale"); }
    get modalHSCPAdditionalBaseIncrementXpBy() { return   By.name("hscpAddBaseIncrement"); }
    get modalHSCPAdditionalBaseIncrementXpBy() { return By.name("hscpAddBaseIncrement"); }
    get modalDateOfLastAdvancementBy() { return By.id("lastAdvancementActionEffectiveDt"); }
    get modalNewAppointmentHeaderBy() { return By.xpath('//h1[text()="New Appointment"]'); }
    get modalStartDateAtSeriesBy() { return By.id("startDateAtSeries"); }
    get modalStartDateAtRankBy() { return By.id("startDateAtRank"); }
    get modalStartDateAtStepBy() { return By.id("startDateAtStep"); }
    get modalAppointmentEndDateBy() { return By.id("appointmentEndDt"); }
    get modalApptIDBy() { return By.name("appointmentId"); }
    get modalUCPathPositionNumberBy() { return By.name("positionNbr"); }
    get modalCommentsTextFieldBy() { return By.xpath("//textarea"); }
    get modalSaveButtonBy() { return By.xpath('//button[text()="Save"]'); }
    
    // save result success/fail button (after saving on NEW appointment modal)
    get saveResultOKBy() { return By.xpath('//button[text()="OK"]'); }
    
    // save result warning button (after saving on EDIT appointment modal)
    get warningModalBy() { return By.xpath('//h1[text()=" Warning "]'); }
    get warningSaveButtonBy() { return By.xpath('//button[text()="Save"]'); }
    
    
    //////////////////////////////////////////////////////////////////
	// POST-SAVE LOCATORS
	//////////////////////////////////////////////////////////////////
	
    // after clicking save locators
    get resultModalTitleBy() { return By.css(".white"); }
    get modalFadeInBy() { return By.className("modal fade in"); }
    
    
    //////////////////////////////////////////////////////////////////
	// COMMENTS MODAL LOCATORS
	//////////////////////////////////////////////////////////////////
	
    // comments modal comment locator
    get commentsModalCommentBy() { return By.css(".panel-body"); }
    
    
    //////////////////////////////////////////////////////////////////
	// MODAL DROPDOWN OPTION LOCATORS
	//////////////////////////////////////////////////////////////////
    
    // Appointment Status locators
    get modalAppointmentStatusProspectiveTextBy() { return By.xpath('//*[@id="appointmentStatusType"]/option[text()="Prospective"]'); }
    get modalAppointmentStatusAppointedTextBy() { return By.xpath('//*[@id="appointmentStatusType"]/option[text()="Appointed"]'); }
    get modalAppointmentStatusArchivedTextBy() { return By.xpath('//*[@id="appointmentStatusType"]/option[text()="Archived"]'); }
    get modalAppointmentStatusRemovedTextBy() { return By.xpath('//*[@id="appointmentStatusType"]/option[text()="Removed"]'); }
    
    // Department Code locators
    get modalDepartmentCode030000By() { return By.xpath('//option[text()="030000: Management Dept"]'); }
    get modalDepartmentCode171800By() { return By.xpath('//option[text()="171800: Cardiac Surgery"]'); }
    
    // Appointment Affiliation locators
    get modalAppointmentAffiliationPrimaryTextBy() { return By.xpath('//*[@id="appointmentAffiliation"]/option[text()="Primary"]'); }
    get modalAppointmentAffiliationAdditionalTextBy() { return By.xpath('//*[@id="appointmentAffiliation"]/option[text()="Additional"]'); }
    
    // Location locators
     get modalLocation1UCLABy() { return By.xpath('//*[@id="locationDisplayText1"]/option[text()="UCLA Campus"]'); }
    
    // Step locators
    get modalStep1TextBy() { return By.xpath('//*[@id="step"]/option[text()="1"]'); }
    get modalStep2TextBy() { return By.xpath('//*[@id="step"]/option[text()="2"]'); }
    get modalStep3TextBy() { return By.xpath('//*[@id="step"]/option[text()="3"]'); }
    get modalStep4TextBy() { return By.xpath('//*[@id="step"]/option[text()="4"]'); }
    get modalStep5TextBy() { return By.xpath('//*[@id="step"]/option[text()="5"]'); }
    get modalStep6TextBy() { return By.xpath('//*[@id="step"]/option[text()="6"]'); }
    
    // APU ID locators
    get modalAPUID1718BSBy() { return By.xpath('//*[@id="apuCode"]/option[text()="1718BS: SURG CARDIAC BSCP - 2023-24"]'); }
    get modalAPUID1718CTBy() { return By.xpath('//*[@id="apuCode"]/option[text()="1718CT: SURG CARDIAC OTHER - 2023-24"]'); }
    get modalAPUID1718FWBy() { return By.xpath('//*[@id="apuCode"]/option[text()="1718FW: SURG CARDIAC FELLOW - 2023-24"]'); }
    get modalAPUID1718VSBy() { return By.xpath('//*[@id="apuCode"]/option[text()="1718VS: SURG CARDIAC VISITING - 2023-24"]'); }
    
    //////////////////////////////////////////////////////////////////
	// EIGHT YEAR CLOCK LOCATORS
	//////////////////////////////////////////////////////////////////
	
	 get firstRowBy() { return By.xpath ('//*[@class=" datatable_root "]/div/div/div[3]/div[1]'); }
    
    
    //////////////////////////////////////////////////////////////////
	// MAPS MATCHING VALUES TO TEXT
	//////////////////////////////////////////////////////////////////
	
    // map for Appointment Status locators
    get modalAppointmentStatusMap()
    {
		const modalAppointmentStatusMap = new Map();
		modalAppointmentStatusMap.set("1", this.modalAppointmentStatusProspectiveTextBy);
		modalAppointmentStatusMap.set("2", this.modalAppointmentStatusAppointedTextBy);
		modalAppointmentStatusMap.set("3", this.modalAppointmentStatusArchivedTextBy);
		modalAppointmentStatusMap.set("4", this.modalAppointmentStatusRemovedTextBy);
		
		return modalAppointmentStatusMap;
	}
    
    // map for Department Code locators
    get modalDepartmentCodeMap()
    {
		const modalDepartmentCodeMap = new Map();
		modalDepartmentCodeMap.set("165", this.modalDepartmentCode030000By);
		modalDepartmentCodeMap.set("264", this.modalDepartmentCode171800By);
		
		return modalDepartmentCodeMap;
	}
	
    // map for Appointment Affiliation locators
    get modalAppointmentAffiliationMap()
    {
		const modalAppointmentAffiliationMap = new Map();
		modalAppointmentAffiliationMap.set("1", this.modalAppointmentAffiliationPrimaryTextBy);
		modalAppointmentAffiliationMap.set("2", this.modalAppointmentAffiliationAdditionalTextBy);
		
		return modalAppointmentAffiliationMap;
	}
	
	// map for Location locators
    get modalLocationMap()
    {
		const modalLocationMap = new Map();
		modalLocationMap.set("1", this.modalLocation1UCLABy);
		
		return modalLocationMap;
	}
	
    // map for Title Code locators
    get modalTitleCodeMap()
    {
		const modalTitleCodeMap = new Map();
		modalTitleCodeMap.set("287", this.modalTitleCode001724By);
		modalTitleCodeMap.set("437", this.modalTitleCode002050By);
		modalTitleCodeMap.set("697", this.modalTitleCode003377By);
		
		return modalTitleCodeMap;
	}
	
	// map for Step locators
    get modalStepMap()
    {
		const modalStepMap = new Map();
		modalStepMap.set("1", this.modalStep1TextBy);
		modalStepMap.set("3", this.modalStep2TextBy);
		modalStepMap.set("5", this.modalStep3TextBy);
		modalStepMap.set("7", this.modalStep4TextBy);
		modalStepMap.set("9", this.modalStep5TextBy);
		modalStepMap.set("11", this.modalStep6TextBy);
		
		return modalStepMap;
	}
	
	
    //////////////////////////////////////////////////////////////////
	// GENERAL PROFILE PAGE
	//////////////////////////////////////////////////////////////////
	
    // enter search term in input field
    enterSearchProfile = async (loggingPrefix, driver, searchProfile) =>
    {
		let inputField = await driver.wait(until.elementLocated(this.searchProfileBy), 15000);
		inputField.sendKeys(searchProfile);
		logThis(loggingPrefix + "profile [" + searchProfile + "] entered into input search field, waiting for result...");
		showElapsedTime(loggingPrefix, driver, this.searchResultBy);
    }
    
    // click on search result
    clickSearchResult = async (loggingPrefix, driver) =>
    {
		let searchResult = await driver.wait(until.elementLocated(this.searchResultBy), 25000);
		await searchResult.click();
		logThis(loggingPrefix + "search result clicked, waiting for profile...");
	}
	
	// click "add new appointment" button
	clickAddNewAppointmentButton = async (loggingPrefix, driver) =>
	{
		let addNewAppointmentButton = await driver.wait(until.elementLocated(this.addNewAppointmentButtonBy), 15000);
		await driver.executeScript("arguments[0].scrollIntoView(true);", addNewAppointmentButton);
		await addNewAppointmentButton.click();
		logThis(loggingPrefix + '"add new appointment" button clicked, waiting for modal...');
	}
	
	// click Eight Year Clock link
	clickEightYearClockLink = async (loggingPrefix, driver) =>
	{
	    await driver.wait(until.elementLocated(this.eightYearClockLinkBy), 15000);
		const eightYearClockLink = await driver.findElement(this.eightYearClockLinkBy);
		eightYearClockLink.click();
		logThis(loggingPrefix + "Eight Year Clock link clicked");
	}
	
	// click Excellence Review Clock link
	clickExcellenceReviewClockLink = async (loggingPrefix, driver) =>
	{
	    await driver.wait(until.elementLocated(this.excellenceReviewClockLinkBy), 15000);
		const eightYearClockLink = await driver.findElement(this.excellenceReviewClockLinkBy);
		eightYearClockLink.click();
		logThis(loggingPrefix + "Excellence Review Clock link clicked");
	}
	
	// click InactiveAppointments link
	clickInactiveAppointmentsLink = async (loggingPrefix, driver) =>
	{
	    await driver.wait(until.elementLocated(this.inactiveAppointmentsLinkBy), 15000);
		const inactiveAppointmentsLink = await driver.findElement(this.inactiveAppointmentsLinkBy);
		inactiveAppointmentsLink.click();
		logThis(loggingPrefix + "Inactive Appointments link clicked");    
	}
	
	// click Edit Profile for Additional-Joint appointment on "Active Appointments" nav link (also works for "Inactive Appointments" nav link)
	clickAdditionalJointAppointmentEditActive = async (loggingPrefix, driver) =>
	{
		// Click Edit Profile for Additional-Joint appointment
		await driver.wait(until.elementLocated(this.additionalJointAppointmentActiveBy), 10000);
		logThis(loggingPrefix + "Additional Joint edit button located");
		let additionalJointEditButton = driver.findElement(this.additionalJointAppointmentActiveBy);
		
		// must use elementisvisble or else driver will find element click button in dom but throw elementnotinteractable error
		await driver.wait(until.elementIsVisible(additionalJointEditButton), 10000);
		await driver.executeScript("arguments[0].scrollIntoView(true)", additionalJointEditButton);
		await additionalJointEditButton.click();
		logThis(loggingPrefix + "Additional Joint edit button clicked");
	}
	
	getOpusID = async (loggingPrefix, driver) =>
	{
		let pageURL = await driver.getCurrentUrl();
		let pageURLParts = pageURL.split("=");
		let opusID = pageURLParts[1];
		logThis(loggingPrefix + "opus ID is: " + opusID);
	
		return opusID;
	}
	
		
	//////////////////////////////////////////////////////////////////
	// NEW/EDIT APPOINTMENT MODAL
	//////////////////////////////////////////////////////////////////
	
	// check for New Appointment modal
	newAppointmentModalExists = async (loggingPrefix, driver) =>
	{
	    try
	    {
	        //await driver.wait(until.elementLocated(this.newAppointmentModalTitleBy), 30000);
	        showElapsedTime(loggingPrefix, driver, this.newAppointmentModalTitleBy);
	        logThis(loggingPrefix + "New/Edit Appointment modal located");
	        
	        return true;
	    }
	    catch
	    {
	        logThis(loggingPrefix + "New Appointment modal not located");
	        
	        return false;
	    }   
	}
	
	// click Appointment Status dropdown
	clickAppointmentStatusDropdown = async (loggingPrefix, driver) =>
	{
	    let modalAppointmentStatusDropdown = await driver.findElement(this.modalAppointmentStatusDropdownBy);
	    modalAppointmentStatusDropdown.click();
	    logThis(loggingPrefix + "Appointment Status dropdown has been clicked");
	}
	
	// select "Archived" in Appointment Status dropdown
	selectAppointmentStatusArchived = async (loggingPrefix, driver) =>
	{
	    let appointmentStatusDropdown = await driver.findElement(this.modalAppointmentStatusDropdownBy);
	    let appointmentStatusDropdownSelect = new Select(appointmentStatusDropdown);
	    await appointmentStatusDropdownSelect.selectByValue("3");
	    logThis(loggingPrefix + "Appointment Status has been changed to Archived");
	}
	
	// select "Appointed" in Appointment Status dropdown
	selectAppointmentStatusAppointed = async (loggingPrefix, driver) =>
	{
	    let appointmentStatusDropdown = await driver.findElement(this.modalAppointmentStatusDropdownBy);
	    let appointmentStatusDropdownSelect = new Select(appointmentStatusDropdown);
	    await appointmentStatusDropdownSelect.selectByValue("2");
	    logThis(loggingPrefix + "Appointment Status has been changed to Appointed");
	}
	
	// click department code dropdown
	clickDepartmentCodeDropdown = async (loggingPrefix, driver) =>
	{
	    await driver.wait(until.elementLocated(this.modalDepartmentCodeDropdownBy), 15000);
	    logThis(loggingPrefix + "department code dropdown located");
		let departmentCodeDropdown = await driver.findElement(this.modalDepartmentCodeDropdownBy);
		await driver.executeScript("arguments[0].scrollIntoView(true);", departmentCodeDropdown);
		await wait(3000); // waiting for other elements don't work -- ElementClickInterceptedError
		await departmentCodeDropdown.click();
		logThis(loggingPrefix + "department code dropdown clicked");
	}
	
	// select department code
    selectDepartmentCode171800 = async (loggingPrefix, driver) =>
    {
		await driver.findElement(this.modalDepartmentCode171800By).click();
		logThis(loggingPrefix + "department code: 171800: Cardiac Surgery selected");
	}
	
	// enter percent time
	enterPercentTime = async (loggingPrefix, driver, percentTime) =>
	{
		let percentTimeField = await driver.findElement(this.modalPercentTimeBy);
		await driver.executeScript("arguments[0].scrollIntoView()", percentTimeField);
		percentTimeField.sendKeys(percentTime);
		logThis(loggingPrefix + "percent time " + percentTime + " entered");
	}
	
	// enter UCLA campus %
	enterUCLAPercent = async (loggingPrefix, driver, uclaPercent) =>
	{
		let uclaPercentField = await driver.findElement(this.modalUCLAPercentBy);
		uclaPercentField.sendKeys(uclaPercent);
		logThis(loggingPrefix + "UCLA campus percent time entered");
	}
	
	// click add button (add button will only exist for the last existing location)
	clickAddLocationButton = async (loggingPrefix, driver) =>
	{
	    await driver.wait(until.elementLocated(this.modalLocationAddButtonBy), 10000);
	    logThis(loggingPrefix + "add location button located");
		let addLocationButton = await driver.findElement(this.modalLocationAddButtonBy);
		
		await driver.wait(until.elementIsVisible(addLocationButton), 10000);
		
		await addLocationButton.click();
		logThis(loggingPrefix + "add location button clicked");
	}
	
	// select location OVMC
	selectLocation2OVMC = async (loggingPrefix, driver) =>
	{
		// click location2 dropdown
		let location2Dropdown = driver.findElement(this.modalLocation2DropdownBy);
		location2Dropdown.click();
		
		// choose OVMC option
		const select = new Select(location2Dropdown);
		await select.selectByIndex(9);	
		logThis(loggingPrefix + "OVMC selected for location 2");
	}
	
	// enter campus 2 %
	enterLocation2Percent = async (loggingPrefix, driver, locationPercent2) =>
	{
	    await driver.wait(until.elementLocated(this.modalLocation2PerentFieldBy));
		let campus2PercentField = await driver.findElement(this.modalLocation2PerentFieldBy);
		campus2PercentField.sendKeys(locationPercent2);
		logThis(loggingPrefix + "campus 2 percent time entered");
	}
	
	// check for location percent sum validation message
	checkLocationPercentSumValidationMessageCorrect = async (loggingPrefix, driver) =>
	{
		try
		{
			await driver.wait(until.elementLocated(this.modalPercentSumValidationMessageBy), 10000)
			logThis(loggingPrefix + "check A: percent sum validation message did appear");
		}
		catch
		{
			passFail = "FAILED";
			logThis(loggingPrefix + "CHECK A FAILED: percent sum validation message DIDN'T appear");
		}
	}
	
	// blank out location 2 Name
	blankOutLocation2Name = async (loggingPrefix, driver) =>
	{
	    // click location2 dropdown
		let location2Dropdown = driver.findElement(this.modalLocation2DropdownBy);
		location2Dropdown.click();
		
		// choose blank option
		const select = new Select(location2Dropdown);
		await select.selectByIndex(0);		
		logThis(loggingPrefix + "location 2 name blanked out");
	}
	
	// check for name validation message
	checkNameValidationMessageMessageCorrect = async (loggingPrefix, driver) =>
	{
		try
		{
			await driver.wait(until.elementLocated(this.modalPercentSumValidationMessageBy), 10000);
			logThis(loggingPrefix + "check B: name validation message did appear");
		}
		catch
		{
			passFail = "FAILED";
			logThis(loggingPrefix + "CHECK B FAILED: name validation message DIDN'T appear");
		}
	}
	
	// blank out location 2 Percent
	blankOutLocation2Percent = async (loggingPrefix, driver) =>
	{
	    // click location2 percent
		let location2PercentField = driver.findElement(this.modalLocation2PerentFieldBy);
		await location2PercentField.sendKeys(Key.BACK_SPACE + Key.BACK_SPACE);
		logThis(loggingPrefix + "location 2 percent blanked out");
	}
	
	// check location2 percent validation message
	checkLocation2PercentValidationMessageMessageCorrect = async (loggingPrefix, driver) =>
	{		
		try
		{
			await driver.wait(until.elementLocated(this.modalLocation2PercentValidationMessageBy), 10000);
			logThis(loggingPrefix + "check C: percent validation message did appear");
		}
		catch
		{
			passFail = "FAILED";
			logThis(loggingPrefix + "CHECK C FAILED: percent validation message DIDN'T appear");
		}
	}
	
	// click title code dropdown
	clickTitleCodeDropdown = async (loggingPrefix, driver) =>
	{
		await driver.findElement(this.modalTitleCodeDropdownBy).click();
		logThis(loggingPrefix + "title code dropdown clicked");
	}
	
	// select title code 001724
	selectTitleCode001724 = async (loggingPrefix, driver) =>
	{
		await driver.findElement(this.modalTitleCode001724By).click();
		logThis(loggingPrefix + "title code 001724: ASST PROF IN RES-HCOMP selected");
	}
	
	// select title code 002050
	selectTitleCode002050 = async (loggingPrefix, driver) =>
	{
		// choose 002050 option
		let titleCodeDropdown = driver.findElement(this.modalTitleCodeDropdownBy);
		const select = new Select(titleCodeDropdown);
		await select.selectByVisibleText("002050: HS ASST CLIN PROF-FY");
		logThis(loggingPrefix + "title code 002050: HS ASST CLIN PROF-FY selected");
	}
	
	// check series rank validation
	checkSeriesRankCorrect = async (loggingPrefix, driver, actualSeries, expectedSeries, actualRank, expectedRank) =>
	{		
		if((actualSeries === expectedSeries) && (actualRank === expectedRank))
		{
			logThis(loggingPrefix + "check D: series and rank populated correctly");
		}
		else
		{
			logThis(loggingPrefix + "CHECK D FAILED: series and rank DID NOT populate correctly");
		}
	}
	
	// click step dropdown
	clickStepDropdown = async (loggingPrefix, driver) =>
	{
		await driver.findElement(this.modalStepDropdownBy).click();
		logThis(loggingPrefix + "step dropdown clicked");
	}
	
	// select step
	selectStep = async (loggingPrefix, driver, step) =>
	{
	    let selectedLocator = "";
	    
	    if(step === "1")
	    {
	        selectedLocator = this.modalStep1TextBy;
	    }
	    else if(step === "2")
	    {
	        selectedLocator = this.modalStep2TextBy;
	    }
	    else if(step === "3")
	    {
	        selectedLocator = this.modalStep3TextBy;
	    }
		await driver.findElement(selectedLocator).click();
		logThis(loggingPrefix + "step " + step + " clicked");
	}
	
	// check on scale salary
	checkOnScaleSalaryCorrect = async (loggingPrefix, driver, actualOnScaleSalary, expectedOnScaleSalary) =>
	{
		if(actualOnScaleSalary === expectedOnScaleSalary)
		{
			logThis(loggingPrefix + "check E: onScaleSalary populated correctly");
		}
		else
		{
			logThis(loggingPrefix + "CHECK E FAILED: onScaleSalary " + actualOnScaleSalary + ":" + expectedOnScaleSalary + " DID NOT populate correctly");
		}
	}
	
	// enter salary at last advancement
	enterSalaryAtLastAdvancement = async (loggingPrefix, driver, salaryAtLastAdvancement) =>
	{
		await driver.findElement(this.modalSalaryAtLastAdvancementBy).sendKeys(salaryAtLastAdvancement);
		logThis(loggingPrefix + salaryAtLastAdvancement + " entered in Salary at Last Advancement");
	}
	
	
	//////////////////////////////////////////////////////////////////
	// MODAL: SALARY DETAILS
	//////////////////////////////////////////////////////////////////

	// click APU ID dropdown
	clickAPUIDDropdown = async (loggingPrefix, driver) =>
	{
		let apuDropdown = await driver.wait(until.elementLocated(this.modalAPUIDropdownBy), 20000);
		apuDropdown.click();
		logThis(loggingPrefix + "APU ID dropdown clicked");
	}
	
	// wait until Salary at Last Advancement repaints to continue
	waitForSalaryAtLastAdvancement = async (loggingPrefix, driver) =>
	{
		let currentSalaryAmt = "";
		do
		{
		    currentSalaryAmt = await driver.findElement(this.modalSalaryAtLastAdvancementBy).getAttribute("value");
		}while(currentSalaryAmt === "");
		logThis(loggingPrefix + "SLA changed to: " + currentSalaryAmt);
	}
	
	// choose APU ID 1718CT
	chooseAPUID1718CT = async (loggingPrefix, driver) =>
	{
		let apuID = await driver.wait(until.elementLocated(this.modalapuID1718CTBy), 10000);
		apuID.click();
		logThis(loggingPrefix + "APU ID 1718CT selected");
	}
	
	// wait for fields to change after APU ID selected
	waitForHSCPAdditional = async (loggingPrefix, driver) =>
	{
		let hscpAdditional = "";
		do
		{
		    hscpAdditional = await driver.findElement(this.modalHSCPAdditionalBaseIncrementXpBy).getAttribute("value");
		}while(hscpAdditional === "");
		logThis(loggingPrefix + "HSCP additional base increment changed to: " + hscpAdditional);
	}
	
	
	//////////////////////////////////////////////////////////////////
	// MODAL: APPOINTMENT DETAILS
	//////////////////////////////////////////////////////////////////
	
	// enter Date of Last Advancement
	enterDateOfLastAdvancement = async (loggingPrefix, driver, dateOfLastAdvancement) =>
	{
		await driver.findElement(this.modalDateOfLastAdvancementBy).sendKeys(dateOfLastAdvancement);
		logThis(loggingPrefix + dateOfLastAdvancement + " entered in Date of Last Advancement");
	}
	
	// click away to dismiss js datepicker
	dismissJSDatepicker = async (loggingPrefix, driver) =>
	{
		await driver.findElement(this.modalNewAppointmentHeaderBy).click();
		logThis(loggingPrefix + "datepicker dismissed");
	}
	
	// enter date in Start Date at Series
	enterStartDateAtSeries = async (loggingPrefix, driver, date) =>
	{
	    await driver.findElement(this.modalStartDateAtSeriesBy).click(); // first click in input field to dismiss any other js calendars
		await driver.findElement(this.modalStartDateAtSeriesBy).sendKeys(date);
		logThis(loggingPrefix + "entered " + date + " in Start Date at Series");
	}
	
	// enter date in Start Date at Rank
	enterStartDateAtRank = async (loggingPrefix, driver, date) =>
	{
	    await driver.findElement(this.modalStartDateAtRankBy).click(); // first click in input field to dismiss any other js calendars
		await driver.findElement(this.modalStartDateAtRankBy).sendKeys(date);
		logThis(loggingPrefix + "entered " + date + " in Start Date at Rank");
	}
	
	// enter date in Start Date at Step
	enterStartDateAtStep = async (loggingPrefix, driver, date) =>
	{
	    await driver.findElement(this.modalStartDateAtStepBy).click();
		await driver.findElement(this.modalStartDateAtStepBy).sendKeys(date);
		logThis(loggingPrefix + "entered " + date + " in Start Date at Step");
	}
	
	// enter comment in Comments text area
	enterComments = async (loggingPrefix, driver, comments) =>
	{
		await driver.findElement(this.modalCommentsTextFieldBy).click(); // just sendkeys doesnt work on this textarea
		await driver.findElement(this.modalCommentsTextFieldBy).clear(); // just sendkeys doesnt work on this textarea
		await driver.findElement(this.modalCommentsTextFieldBy).sendKeys(comments);
		logThis(loggingPrefix + "entered " + comments + " in Comments field");
	}
	
	// click modal save button
	clickSaveButton = async (loggingPrefix, driver) =>
	{
	    let saveButton = await driver.findElement(this.modalSaveButtonBy);
	    
		await driver.executeScript("arguments[0].scrollIntoView()", saveButton); // for screenshot purposes
		saveButton.click();
		logThis(loggingPrefix + "Save button clicked");
	}
	
	//////////////////////////////////////////////////////////////////
	// READING OF MODAL ENTRIES
	//////////////////////////////////////////////////////////////////
	
	// get modal Appointment Status
	getModalAppointmentStatus = async (driver) =>
	{
		let appointmentStatusSelect = await driver.findElement(this.modalAppointmentStatusDropdownBy);  // Appointment Status (disabled dropdown element)
		let appointmentStatusValue = await appointmentStatusSelect.getAttribute("value"); // value of selected option
		
		// use By selector corresponding to dropdown's value
		let modalAppointmentStatusText = await driver.findElement(this.modalAppointmentStatusMap.get(appointmentStatusValue)).getText();
		
		return modalAppointmentStatusText;
	}
	
	// get modal Department code
	getModalDepartmentCode = async (driver) =>
	{
	    // get modal's department code dropdown element
	    let departmentCode = await driver.findElement(this.modalDepartmentCodeDropdownBy);
	    
	    // get the dropdown element's value
	    let departmentCodeValue = await driver.executeScript("return arguments[0].value", departmentCode);
	    
	    // leaving in for debugging purposes
	    // logThis("departmentCodeValue is: " + departmentCodeValue);
	    
	    // use By selector to get dropdown's value corresponding text
	    let modalDepartmentCodeText = await driver.findElement(this.modalDepartmentCodeMap.get(departmentCodeValue)).getText();
		
	    return modalDepartmentCodeText;
	}
	
	// get modal Department
	getModalDepartment = async (driver) =>
	{
		let department = await driver.findElement(this.modalDepartmentBy);
		let departmentValue = await department.getAttribute("value");
		
		return departmentValue;
	}
	
	// get modal School
	getModalSchool = async (driver) =>
	{
	    let school = await driver.findElement(this.modalSchoolBy);
		let schoolValue = await school.getAttribute("value");
		
		return schoolValue;
	}
	
	// get modal Area
	getModalArea = async (driver) =>
	{
		let area = await driver.findElement(this.modalAreaBy);
		let areaValue = await area.getAttribute("value");
		
		return areaValue;
	}
	
	// get modal Appointment Affiliation
	getModalAppointmentAffiliation = async (driver) =>
	{
	    let appointmentAffiliation = await driver.findElement(this.modalAppointmentAffiliationBy);
		let appointmentAffiliationValue = await appointmentAffiliation.getAttribute("value");
	    
	    // use By selector based on dropdown's value
		let modalAppointmentAffiliationText = await driver.findElement(this.modalAppointmentAffiliationMap.get(appointmentAffiliationValue)).getText();
		
	    return modalAppointmentAffiliationText;		
	}
	
	// get modal Percent Time
	getModalPercentTime = async (driver) =>
	{
	    let appointmentPercentTime = await driver.findElement(this.modalPercentTimeBy).getAttribute("value");
	    
	    return appointmentPercentTime;
	}
	
	// get Location1 (dropdown)
	getLocation1 = async (driver) =>
	{
		let location1Dropdown = await driver.findElement(this.modalLocation1DropdownBy);
		let location1Value = await location1Dropdown.getAttribute("value");
		
		// use By selector based on dropdown's value
		let modalLocation1Text = "";
		if(location1Value === "1")
		{
		    modalLocation1Text = await driver.findElement(this.modalLocation1UCLABy).getText();
		}
		
		return modalLocation1Text;
	}
	
	// get Location2 (dropdown)
	getLocation2 = async (driver) =>
	{
		let location2Dropdown = await driver.findElement(this.modalLocation2DropdownBy);
		let location2Value = await location2Dropdown.getAttribute("value");
		
		// use By selector based on dropdown's value
		let modalLocation2Text = "";
		if(location2Value === "7")
		{
		    modalLocation2Text = await driver.findElement(this.modalLocation2OVMCBy).getText();
		}
		
		return modalLocation2Text;
	}
	
	// get Title Code (dropdown)
	getTitleCode = async (driver) =>
	{
		const titleCodeDropdown = await driver.findElement(this.modalTitleCodeDropdownBy);
		
		let titleCodeValue = await titleCodeDropdown.getAttribute("value");
		
		// use By selector corresponding to dropdown's value
		let titleCodeText = await driver.findElement(this.modalTitleCodeMap.get(titleCodeValue)).getText();
		
		return titleCodeText;
	}
	
	// get Series
	getSeries = async (driver) =>
	{
		let series = await driver.findElement(this.modalSeriesBy).getAttribute("value");
		
		return series;
	}
	
	// get Rank
	getRank = async (driver) =>
	{
		let rank = await driver.findElement(this.modalRankBy).getAttribute("value");
		
		return rank;
	}
	
	// get Years at Current Rank
	getYearsAtCurrentRank = async (driver) =>
	{
		let yearsAtCurrentRank = await driver.findElement(this.modalYearsAtCurrentRankBy).getAttribute("value");
		
		return yearsAtCurrentRank;
	}
	
	// get Step (dropdown)
	getStep = async (driver) =>
	{
		let stepDropdown = await driver.findElement(this.modalStepDropdownBy);
		let stepValue = await stepDropdown.getAttribute("value");
		
		// use By selector corresponding to dropdown's value
		let stepText = await driver.findElement(this.modalStepMap.get(stepValue)).getText();
		
		return stepText;
	}
	
	// get Years at Current Step
	getYearsAtCurrentStep = async (driver) =>
	{
		let yearsAtCurrentStep = await driver.findElement(this.modalYearsAtCurrentStepBy).getAttribute("value");
		
		return yearsAtCurrentStep;
	}
	
	// get Payroll Salary
	getPayrollSalary = async (driver) =>
	{
		let payrollSalary = await driver.findElement(this.modalPayrollSalaryBy).getAttribute("value");
		
		return payrollSalary;
	}
	
	// get Salary at Last Advancement -- continuous checking necessary since value re-paints for some reason
	getSalaryAtLastAdvancement = async (driver) =>
	{
		let salaryLastAdvancement = await driver.findElement(this.modalSalaryAtLastAdvancementBy);
		let salaryLastAdvancementText = "";
		do
		{
			salaryLastAdvancementText = await salaryLastAdvancement.getAttribute("value");
		}while(salaryLastAdvancementText === "")
		
		return salaryLastAdvancementText;
	}
	
	// get On-Scale Salary
	getOnScaleSalary = async (driver) =>
	{
	    // needs to wait since based on step being entered/returned
	    await driver.wait(until.elementLocated(this.modalOnScaleSalaryBy), 20000);
	    
		let OnScaleSalaryText = await driver.findElement(this.modalOnScaleSalaryBy).getAttribute("value");
		
		return OnScaleSalaryText;
	}
		
	// get Salary Scale Effective Date
	getSalaryScaleEffectiveDate = async (driver) =>
	{
		let salaryEffectiveDateText = await driver.findElement(this.modalSalaryScaleEffectiveDateBy).getAttribute("value");
		
		return salaryEffectiveDateText;
	}
	
	// get APU ID
	getAPUID = async (driver) =>
	{
	    await driver.wait(until.elementLocated(this.modalAPUIDropdownBy), 5000);
		let apuID = await driver.findElement(this.modalAPUIDropdownBy);
		let apuIDValue = 0;
		do
		{
			apuIDValue = await apuID.getAttribute("value");
		}while(apuIDValue === "")
		const apuIDSelect = new Select(apuID);
		const apuIDSelected = apuIDSelect.getAllSelectedOptions(); // this returns a list of selected options (length one in this case)
		const apuIDText = apuIDSelected[0];
		
		return apuIDText;
	}
	
	// get HSCP Scale (0-9)
	getHSCPScale0to9 = async (driver) =>
	{
		let hscpScale1to9 = await driver.findElement(this.modalHSCPScale0to9By).getAttribute("value");
		
		return hscpScale1to9;
	}
	
	// get HSCP Scale 0(X)
	getHSCPScale0X = async (driver) =>
	{
		let hscpScale0X = await driver.findElement(this.modalHSCPScale0XBy).getAttribute("value");
		
		return hscpScale0X;
	}
	
	// get HSCP Base Salary (X + X')
	getHSCPBaseSalaryXAndXp = async (driver) =>
	{
		let hscpBaseSalaryXAndXp = await driver.findElement(this.modalHSCPBaseSalaryXAndXpBy).getAttribute("value");
		
		return hscpBaseSalaryXAndXp;
	}
	
	// get HSCP Additional Base Increment (X')
	getHSCPAdditionalBaseIncrementXp = async (driver) =>
	{
		let hscpAdditionalBaseIncrementXp = await driver.findElement(this.modalHSCPAdditionalBaseIncrementXpBy).getAttribute("value");
		
		return hscpAdditionalBaseIncrementXp;
	}
	
	// get Date of Last Advancement
	getDateOfLastAdvancement = async (driver) =>
	{
		let dateOfLastAdvancement = await driver.findElement(this.modalDateOfLastAdvancementBy).getAttribute("value");
		
		return dateOfLastAdvancement;
	}
	
	// get Start Date at Series
	getStartDateAtSeries = async (driver) =>
	{
		let startDateAtSeries = await driver.findElement(this.modalStartDateAtSeriesBy).getAttribute("value");
		
		return startDateAtSeries;
	}
	
	// get Start Date at Rank
	getStartDateAtRank = async (driver) =>
	{
		let startDateRank = await driver.findElement(this.modalStartDateAtRankBy).getAttribute("value");
		
		return startDateRank;
	}
	
	// get Start Date at Step
	getStartDateAtStep = async (driver) =>
	{
		let startDateAtStep = await driver.findElement(this.modalStartDateAtStepBy).getAttribute("value");
		
		return startDateAtStep;
	}
	
	// get Appointment End Date
	getAppointmentEndDate = async (driver) =>
	{
		let appointmentEndDate = await driver.findElement(this.modalAppointmentEndDateBy).getAttribute("value");
		
		return appointmentEndDate;
	}
	
	// get Appt. ID
	getApptID = async (driver) =>
	{
		let apptId = await driver.findElement(this.modalApptIDBy).getAttribute("value");
		
		return apptId;
	}
	
	// get UCPath Position #
	getUCPathPositionNumber = async (driver) =>
	{
		let ucPathPositionNumber = await driver.findElement(this.modalUCPathPositionNumberBy).getAttribute("value");
		
		return ucPathPositionNumber;
	}
	
	// get Comments
	getComments = async (driver) =>
	{
		let comments = await driver.findElement(this.modalCommentsTextFieldBy).getAttribute("value");
		
		return comments;
	}
	
	// click ok button on success/fail modal
	clickSaveResultOK = async (driver) =>
	{
		await driver.findElement(this.saveResultOKBy).click();
	}

	// get number in comments icon 
	getNumberInCommentsIcon = async (driver) =>
	{
	   // get number in comments icon 
		const commentsIcon = await driver.findElement(this.commentsIconBy);
		
		return await commentsIcon.getText();
	}

	// check comments modal content
	getCommentsModalComment = async (driver) =>
	{
	    driver.findElement(this.commentsIconBy).click();
		await driver.wait(until.elementLocated(this.commentsModalCommentBy), 5000);
		const commentElements = await driver.findElements(this.commentsModalCommentBy); // this will get all comments
		const comment = await commentElements[0].getText(); // this will only get the first comment, but we're assuming only one exists
		
		return comment;
	}
	
	// get title of result modal
	getResultModalTitle = async (driver) =>
	{
		await driver.wait(until.elementLocated(this.resultModalTitleBy), 60000);
		let resultModalTitle = driver.findElement(this.resultModalTitleBy);
		return await resultModalTitle.getText();
	}
	
	// click "Save" on warning modal
	clickWarningModalSaveButton = async (loggingPrefix, driver) =>
	{
	    await driver.wait(until.elementLocated(this.warningModalBy), 5000);
	    await driver.wait(until.elementLocated(this.warningSaveButtonBy), 5000);
	    let warningModalSaveButton = await driver.findElement(this.warningSaveButtonBy);
	    warningModalSaveButton.click();
	    logThis(loggingPrefix + "save button on warning modal clicked");
	}
	
	
	//////////////////////////////////////////////////////////////////
	// MAIN PAGE: PROFILE DETAILS
	//////////////////////////////////////////////////////////////////
	
	getProfilePageDetails = async (loggingPrefix, driver, profileURL, profileFields) =>
	{
		try
		{
			//await driver.get(profileURL);
			logThis(loggingPrefix + "Profile page re-loaded to read data on page");
		}
		catch(error)
		{
			console.error(error.message);
			return;
		}
	
		// output data read from profile page to console
		logThis(loggingPrefix + "DATA READ FROM PROFILE PAGE ------------------");
	
		// toggle details link
		let detailsLinks = await driver.wait(until.elementsLocated(this.detailstLinkBy), 15000);
		let detailsLink = detailsLinks[detailsLinks.length - 1];
		await driver.executeScript('arguments[0].scrollIntoView();', detailsLink); // to avoid click intercept
		detailsLink.click();
	
		// Appointment Status
		let appointmentStatus = await driver.findElement(this.appointmentStatusDetailBy);
		let appointmentStatusText = await appointmentStatus.getText();
		logThis(loggingPrefix + "Appointment Status            : " + appointmentStatusText);
		profileFields["Appointment Status"] = escapeCommas(appointmentStatusText);
	
		// Department Code
		let departmentCode = await driver.findElement(this.departmentCodeDetailBy);
		let departmentCodeText = await departmentCode.getText();
		logThis(loggingPrefix + "Department Code               : " + departmentCodeText);
		profileFields["Department Code"] = escapeCommas(departmentCodeText);
	
		// Department
		let department = await driver.findElement(this.departmentDetailBy);
		let departmentText = await department.getText();
		logThis(loggingPrefix + "Department                    : " + departmentText);
		profileFields["Department"] = escapeCommas(departmentText);
	
		// School
		let school = await driver.findElement(this.schoolDetailBy);
		let schoolText = await school.getText();
		logThis(loggingPrefix + "School                        : " + schoolText);
		profileFields["School"] = escapeCommas(schoolText);
	
		// Area
		let area = await driver.findElement(this.areaDetailBy);
		let areaText = await area.getText();
		logThis(loggingPrefix + "Area                          : " + areaText);
		profileFields["Area"] = escapeCommas(areaText);
	
		// Location 1
		let location1 = await driver.findElement(this.location1DetailBy);
		let location1Text = await location1.getText();
		logThis(loggingPrefix + "Location 1                    : " + location1Text);
		profileFields["Location 1"] = escapeCommas(location1Text);
	
		// Location 2
		let location2 = await driver.findElement(this.location2DetailBy);
		let location2Text = await location2.getText();
		logThis(loggingPrefix + "Location 2                    : " + location2Text);
		profileFields["Location 2"] = escapeCommas(location2Text);
	
		// Appointment Affiliation
		let appointmentAffiliation = await driver.findElement(this.appointmentAffilicationDetailBy);
		let appointmentAffiliationText = await appointmentAffiliation.getText();
		logThis(loggingPrefix + "Appointment Affiliation       : " + appointmentAffiliationText);
		profileFields["Appointment Affiliation"] = escapeCommas(appointmentAffiliationText);
	
		// Title Code
		let titleCode = await driver.findElement(this.titleCodeDetailBy);
		let titleCodeText = await titleCode.getText();
		logThis(loggingPrefix + "Title Code                    : " + titleCodeText);
		profileFields["Title Code"] = escapeCommas(titleCodeText);
	
		// Series
		let series = await driver.findElement(this.seriesDetailBy);
		let seriesText = await series.getText();
		logThis(loggingPrefix + "Series                        : " + seriesText);
		profileFields["Series"] = escapeCommas(seriesText);
	
		// Rank
		let rank = await driver.findElement(this.rankDetailBy);
		let rankText = await rank.getText();
		logThis(loggingPrefix + "Rank                          : " + rankText);
		profileFields["Rank"] = escapeCommas(rankText);
	
		// Years at Current Rank
		let yearsCurrentRank = await driver.findElement(this.yearsAtCurrentRankDetailBy);
		let yearsCurrentRankText = await yearsCurrentRank.getText();
		logThis(loggingPrefix + "Years at Current Rank         : " + yearsCurrentRankText);
		profileFields["Years at Current Rank"] = escapeCommas(yearsCurrentRankText);
	
		// Step
		let step = await driver.findElement(this.stepDetailBy);
		let stepText = await step.getText();
		logThis(loggingPrefix + "Step                          : " + stepText);
		profileFields["Step"] = escapeCommas(stepText);
	
		// Years at Current Step
		let yearsCurrentStep = await driver.findElement(this.yearsAtCurrentStepDetailBy);
		let yearsCurrentStepText = await yearsCurrentStep.getText();
		logThis(loggingPrefix + "Years at Current Step         : " + yearsCurrentStepText);
		profileFields["Years at Current Step"] = escapeCommas(yearsCurrentStepText);
	
		// Percent Time
		let percentTime = await driver.findElement(this.percentTimeDetailBy);
		let percentTimeText = await percentTime.getText();
		logThis(loggingPrefix + "Percent Time                  : " + percentTimeText);
		profileFields["Percent Time"] = escapeCommas(percentTimeText);
	
		// Payroll Salary
		let payrollSalary = await driver.findElement(this.payrollSalaryDetailBy);
		let payrollSalaryText = await payrollSalary.getText();
		logThis(loggingPrefix + "Payroll Salary                : " + payrollSalaryText);
		profileFields["Payroll Salary"] = escapeCommas(payrollSalaryText);
	
		// Salary at Last Advancement
		let salaryLastAdvancement = await driver.findElement(this.salaryLastAdvancementDetailBy);
		let salaryLastAdvancementText = await salaryLastAdvancement.getText();
		logThis(loggingPrefix + "Salary at Last Advancement    : " + salaryLastAdvancementText);
		profileFields["Salary at Last Advancement"] = escapeCommas(salaryLastAdvancementText);
	
		// Salary Scale Effective Date
		let salaryScaleEffectiveDate = await driver.findElement(this.salaryScaleEffectiveDateDetailBy);
		let salaryScaleEffectiveDateText = await salaryScaleEffectiveDate.getText();
		logThis(loggingPrefix + "Salary Scale Effective Date   : " + salaryScaleEffectiveDateText);
		profileFields["Salary Scale Effective Date"] = escapeCommas(salaryScaleEffectiveDateText);
		/* NA for PROFILE-ADD-LOCATIONS test
		// APU ID
		let apuID = await driver.findElement(this.apuIDDetailBy);
		let apuIDText = await apuID.getText();
		logThis(loggingPrefix + "APU ID                        : " + apuIDText);
		profileFields["APU ID"] = escapeCommas(apuIDText);
	
		// HSCP Scale (0-9)
		let hscpScale09 = await driver.findElement(this.hscpScale09DetailBy);
		let hscpScale09Text = await hscpScale09.getText();
		logThis(loggingPrefix + "HSCP Scale (0-9)              : " + hscpScale09Text);
		profileFields["HSCP Scale (0-9)"] = escapeCommas(hscpScale09Text);
	
		// HSCP Scale 0(X)
		let hscpScale0X = await driver.findElement(this.hscpScale0XDetailBy);
		let hscpScale0XText = await hscpScale0X.getText();
		logThis(loggingPrefix + "HSCP Scale 0(X)               : " + hscpScale0XText);
		profileFields["HSCP Scale 0(X)"] = escapeCommas(hscpScale0XText);
	
		// HSCP Base Salary (X + X')
		let hscpBaseSalaryXX = await driver.findElement(this.hscpBaseSalaryXXDetailBy);
		let hscpBaseSalaryXXText = await hscpBaseSalaryXX.getText();
		logThis(loggingPrefix + "HSCP Base Salary (X + X')     : " + hscpBaseSalaryXXText);
		profileFields["HSCP Base Salary (X + X')"] = escapeCommas(hscpBaseSalaryXXText);
	
		// HSCP Add'l Base Increment (X')
		let hscpAddlBaseIncrementX = await driver.findElement(this.hscpAddlBaseIncrementXDetailBy);
		let hscpAddlBaseIncrementXText = await hscpAddlBaseIncrementX.getText();
		logThis(loggingPrefix + "HSCP Add'l Base Increment (X'): " + hscpAddlBaseIncrementXText);
		profileFields["HSCP Add'l Base Increment (X')"] = escapeCommas(hscpAddlBaseIncrementXText);
	
		// Date of Last Advancement
		let dateLastAdvancement = await driver.findElement(this.dateOfLastAdvancementDetailBy);
		let dateLastAdvancementText = await dateLastAdvancement.getText();
		logThis(loggingPrefix + "Date of Last Advancement      : " + dateLastAdvancementText);
		profileFields["Date of Last Advancement"] = escapeCommas(dateLastAdvancementText);
		*/
		// Start Date at Series
		let startDateSeries = await driver.findElement(this.startDateAtSeriesDetailBy);
		let startDateSeriesText = await startDateSeries.getText();
		logThis(loggingPrefix + "Start Date at Series          : " + startDateSeriesText);
		profileFields["Start Date at Series"] = escapeCommas(startDateSeriesText);
	
		// Start Date at Rank
		let startDateRank = await driver.findElement(this.startDateAtRankDetailBy);
		let startDateRankText = await startDateRank.getText();
		logThis(loggingPrefix + "Start Date at Rank            : " + startDateRankText);
		profileFields["Start Date at Rank"] = escapeCommas(startDateRankText);
	
		// Start Date at Step
		let startDateStep = await driver.findElement(this.startDateAtStepDetailBy);
		let startDateStepText = await startDateStep.getText();
		logThis(loggingPrefix + "Start Date at Step            : " + startDateStepText);
		profileFields["Start Date at Step"] = escapeCommas(startDateStepText);
	
		// Appt. End Date
		let apptEndDate = await driver.findElement(this.appointmentEndDateDetailBy);
		let apptEndDateText = await apptEndDate.getText();
		logThis(loggingPrefix + "Appt. End Date                : " + apptEndDateText);
		profileFields["Appt. End Date"] = escapeCommas(apptEndDateText);
	
		// Appt. ID (will be used both as part of "table read list" and as ID for both what's read from modal and table on profile page)
		let appointmentIDNumber = await driver.findElement(this.appointmentIDDetailBy);
		let apptIDText = await appointmentIDNumber.getText();
		logThis(loggingPrefix + "Appt ID                       : " + apptIDText);
		profileFields["Appt. ID"] = escapeCommas(apptIDText); // will be removed later to be used as test identifier since profileFields object will be joined into array
	
		// Path Position #
		let pathPosition = await driver.findElement(this.pathPositionNumberDetailBy);
		let pathPositionText = await pathPosition.getText();
		logThis(loggingPrefix + "UCPath Position #             : " + pathPositionText);
		profileFields["Path Position #"] = escapeCommas(pathPositionText);
	
		// mark end of data read from profile page
		logThis(loggingPrefix + "----------------------------------------------");
	
		return profileFields;
	}
	
	
	//////////////////////////////////////////////////////////////////
	// MAIN PAGE: APPOINTMENT SETS
	//////////////////////////////////////////////////////////////////
	
	// click "Appointment Sets" nav link (specifically for after saving modal)
	clickAppointmentSetsLink = async (loggingPrefix, driver) =>
	{
		// first wait until save warning modal is gone
		try
		{
		    // make sure save warning modal is gone or else clickintercepterror
			const saveWarningModal = await driver.findElement(this.warningModalBy);
			await driver.wait(until.stalenessOf(saveWarningModal), 45000);
			
			// make sure modal fade-in is gone or else clickintercepterror
			const modalFadeIn = await driver.findElement(this.modalFadeInBy);
			await driver.wait(until.stalenessOf(modalFadeIn), 45000);
			
			logThis(loggingPrefix + "Save warning modal and modal fade-in went stale (removed from the DOM, or a new page has loaded)");
		}
		catch(error)
		{
		    logThis(loggingPrefix + error.message);
		}
		
		try
		{
			await driver.wait(until.elementLocated(this.appointmentSetsLinkBy), 10000);
			const appointmentSetsLink = await driver.findElement(this.appointmentSetsLinkBy);
			appointmentSetsLink.click();
			logThis(loggingPrefix + "\"Appointment Sets\" link clicked"); 
		}
		catch(error) // error finding "Appointment Sets" link or clicking it
		{
			logThis(loggingPrefix + "couldn't find or click \"Appointment Sets\" link"); 
		}
	}
	
	// get Appointment ID on Appointment Sets link
	getAppointmentIDAppointmentSetsLink = async (loggingPrefix, driver) =>
	{
	    await driver.wait(until.elementLocated(this.appointmentSetsAppointmentIDBy), 10000);
	    logThis(loggingPrefix + "Appointment ID under Appointment Sets link located");
	    
	    let appointmentSetsAppointmentID = await driver.findElement(this.appointmentSetsAppointmentIDBy);
	    let appointmentSetsAppointmentIDText = await appointmentSetsAppointmentID.getText();
	    logThis(loggingPrefix + "Appointment ID under \"Appointment Sets\" link is: " + appointmentSetsAppointmentIDText);
	    
	    return appointmentSetsAppointmentIDText;
	}
	
	// click ActiveAppointments link
	clickActiveAppointmentsLink = async (loggingPrefix, driver) =>
	{
		// first wait until save warning modal is gone
		try
		{
		    // make sure save warning modal is gone or else clickintercepterror
			const saveWarningModal = await driver.findElement(this.warningModalBy);
			await driver.wait(until.stalenessOf(saveWarningModal), 45000);
			
			// make sure modal fade-in is gone or else clickintercepterror
			const modalFadeIn = await driver.findElement(this.modalFadeInBy);
			await driver.wait(until.stalenessOf(modalFadeIn), 45000);
			
			logThis(loggingPrefix + "Save warning modal and modal fade-in went stale (removed from the DOM, or a new page has loaded)");
		}
		catch(error)
		{
		    logThis(loggingPrefix + error.message);
		}
		
	    await driver.wait(until.elementLocated(this.activeAppointmentsLinkBy), 15000);
		const activeAppointmentsLink = await driver.findElement(this.activeAppointmentsLinkBy);
		activeAppointmentsLink.click();
		logThis(loggingPrefix + "Active Appointments link clicked");    
	}
	
	// check for Joint Appointment on Active Appointments tab
	jointAppointmentActiveAppointmentsExists = async (loggingPrefix, driver) =>
	{
	    try
	    {
			await driver.wait(until.elementLocated(this.additionalJointAppointmentActiveBy), 10000);
			logThis(loggingPrefix + "Joint Appointment on Active Appointments located");
			
			return true;
	    }
	    catch(error)
	    {
	        logThis(loggingPrefix + "Joint Appointment on Active Appointments NOT located");
	        
	        return false;
	    }
	}
}

module.exports = ProfilePage;