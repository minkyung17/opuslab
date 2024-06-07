const DataTablePage = require ('./DATATABLE_PAGE');
const downloadDirectories = require ('../data/DOWNLOAD_DIRECTORIES');
const text = require ('../libraries/TEXT');
const {By, Key, until} = require('selenium-webdriver');

class ApptsActivePage extends DataTablePage
{
    //////////////////////////////////////////////////////////////////
	// CONSTRUCTOR
	//////////////////////////////////////////////////////////////////
	
    constructor()
    {
        super();
        
		this.columnsNeedingReview =
		[
		];

		// set up object for filter checks
		this.allColumns = // currently not used
		[
			"Employee Status",
			"Appt. Status",
			"School",
			"Division",
			"Department",
			"Area",
			"Specialty",
			"Location",
			"Affiliation",
			"Title Code",
			"Appt. Basis",
			"Series",
			"Rank",
			"Step",
			"APU ID",
			"HSCP",
			"Appt. End Date"
		];

		this.dynamicColumns =
		[
			"Employee Status",
			"Title Code",
			"APU ID",
			"Appt. End Date"
		];

		this.expectedFilterCount =
		{
			"Employee Status": "dynamic (>=1)",
			"Appt. Status": "2",
			"School": "23",
			"Division": "13",
			"Department": "191",
			"Area": "83",
			"Specialty": "25",
			"Location": "12",
			"Affiliation": "4",
			"Title Code": "dynamic (>=1)",
			"Appt. Basis": "3",
			"Series": "44",
			"Rank": "20",
			"Step": "61",
			"APU ID": "dynamic (>=1)",
			"HSCP": "2",
			"Appt. End Date": "dynamic (>=1)"
		};
    }
    
    
    //////////////////////////////////////////////////////////////////
	// ACTIVE APPOINTMENTS PAGE LOCATORS
	//////////////////////////////////////////////////////////////////
	
    // general page locators
    // use the js get syntax to bind the By as you would with classes in other languages
    
    // DTBL test filter locators
    get employeeStatusFilterBy() { return By.id("employeeStatusId_ms"); }
    get appointmentStatusFilterBy() { return By.id("appointmentStatusId_ms"); }
    get schoolNameFilterBy() { return By.id("schoolName_ms"); }
    get divisionNameFilterBy() { return By.id("divisionName_ms"); }
    get departmentNameFilterBy() { return By.id("departmentName_ms"); }
    get areaNameFilterBy() { return By.id("areaName_ms"); }
    get specialtyNameFilterBy() { return By.id("specialtyName_ms"); }
    get locationFilterBy() { return By.id("location_ms"); }
    get affiliationFilterBy() { return By.id("affiliation_ms"); }
    get titleCodeFilterBy() { return By.id("titleCode_ms"); }
    get appointmentBasisFilterBy() { return By.id("appointmentBasis_ms"); }
    get seriesFilterBy() { return By.id("series_ms"); }
    get rankFilterBy() { return By.id("rank_ms"); }
    get stepFilterBy() { return By.id("stepTypeId_ms"); }
    get apuFilterBy() { return By.id("apu_ms"); }
    get strHscpFilterBy() { return By.id("strHscp_ms"); }
    get appointmentEndDtFilterBy() { return By.id("appointmentEndDt_ms"); }
    
    // DTBL test filter *text* locators
    get employeeStatusFilterTextBy() { return By.xpath('//*[@id="employeeStatusId_ms"]/span[2]'); }
    get appointmentStatusFilterTextBy() { return By.xpath('//*[@id="appointmentStatusId_ms"]/span[2]'); }
    get schoolNameFilterTextBy() { return By.xpath('//*[@id="schoolName_ms"]/span[2]'); }
    get divisionNameFilterTextBy() { return By.xpath('//*[@id="divisionName_ms"]/span[2]'); }
    get departmentNameFilterTextBy() { return By.xpath('//*[@id="departmentName_ms"]/span[2]'); }
    get areaNameFilterTextBy() { return By.xpath('//*[@id="areaName_ms"]/span[2]'); }
    get specialtyNameFilterTextBy() { return By.xpath('//*[@id="specialtyName_ms"]/span[2]'); }
    get locationFilterTextBy() { return By.xpath('//*[@id="location_ms"]/span[2]'); }
    get affiliationFilterTextBy() { return By.xpath('//*[@id="affiliation_ms"]/span[2]'); }
    get titleCodeFilterTextBy() { return By.xpath('//*[@id="titleCode_ms"]/span[2]'); }
    get appointmentBasisFilterTextBy() { return By.xpath('//*[@id="appointmentBasis_ms"]/span[2]'); }
    get seriesFilterTextBy() { return By.xpath('//*[@id="series_ms"]/span[2]'); }
    get rankFilterTextBy() { return By.xpath('//*[@id="rank_ms"]/span[2]'); }
    get stepFilterTextBy() { return By.xpath('//*[@id="stepTypeId_ms"]/span[2]'); }
    get apuFilterTextBy() { return By.xpath('//*[@id="apu_ms"]/span[2]'); }
    get strHscpFilterTextBy() { return By.xpath('//*[@id="strHscp_ms"]/span[2]'); }
    get appointmentEndDtFilterTextBy() { return By.xpath('//*[@id="appointmentEndDt_ms"]/span[2]'); }
    get nameObjectsInNameColumnBy() { return By.xpath('//*[@id="reactFixedDataTable"]/div/div[3]/div/div[1]/div[3]/div/div/div/div/div/div/div/div/div/div/a'); }
    
    // DTBL test default locators
    get sortingTitleBy() { return By.className(" sorting-text "); }
    
    // DTBL test show only locators
    get showOnlyButtonBy() { return By.xpath('//*[@class=" datatable-root "]/div[2]/span[1]/button'); }
    get appointedCheckboxBy() { return By.id("appointed"); }
    get appointmentStatusesBy() { return By.xpath('//*[@id="reactFixedDataTable"]/div/div[3]/div/div[1]/div[3]/div/div/div[1]/div[2]/div/div[4]/div/div/div/div'); } // will get first if only 1
    
    //DTBL test filter location export
    get locationFilterUncheckAllBy() { return By.xpath("/html/body/div[20]/div/ul/li[2]/a/span[2]"); }
    get desiredLocationCheckboxStMaryBy() { return By.xpath('//input[@value="St Mary"]'); }
    get exportToExcelButtonBy() { return By.className("export-to-excel"); }
    
    // DTBL name search export
    get nameSearchFieldBy() { return By.name("fullName"); }
    
    
	//////////////////////////////////////////////////////////////////
	// MAP FOR DTBL FILTER LOCATORS
	//////////////////////////////////////////////////////////////////
	
	// map for filter locators
	get filterMap()
	{
		const filterMap = new Map();
		filterMap.set("Employee Status", {locator: this.employeeStatusFilterBy,
		                                  text: this.employeeStatusFilterTextBy});
		filterMap.set("Appt. Status", {locator: this.appointmentStatusFilterBy,
		                                  text: this.appointmentStatusFilterTextBy});
		filterMap.set("School", {locator: this.schoolNameFilterBy,
		                                  text: this.schoolNameFilterTextBy});
		filterMap.set("Division", {locator: this.divisionNameFilterBy,
		                                  text: this.divisionNameFilterTextBy});
		filterMap.set("Department", {locator: this.departmentNameFilterBy,
		                                  text: this.departmentNameFilterTextBy});
		filterMap.set("Area", {locator: this.areaNameFilterBy,
		                                  text: this.areaNameFilterTextBy});
		filterMap.set("Specialty", {locator: this.specialtyNameFilterBy,
		                                  text: this.specialtyNameFilterTextBy});
		filterMap.set("Location", {locator: this.locationFilterBy,
		                                  text: this.locationFilterTextBy});
		filterMap.set("Affiliation", {locator: this.affiliationFilterBy,
		                                  text: this.affiliationFilterTextBy});
		filterMap.set("Title Code", {locator: this.titleCodeFilterBy,
		                                  text: this.titleCodeFilterTextBy});
		filterMap.set("Appt. Basis", {locator: this.appointmentBasisFilterBy,
		                                  text: this.appointmentBasisFilterTextBy});
		filterMap.set("Series", {locator: this.seriesFilterBy,
		                                  text: this.seriesFilterTextBy});
		filterMap.set("Rank", {locator: this.rankFilterBy,
		                                  text: this.rankFilterTextBy});
		filterMap.set("Step", {locator: this.stepFilterBy,
		                                  text: this.stepFilterTextBy});
		filterMap.set("APU ID", {locator: this.apuFilterBy,
		                                  text: this.apuFilterTextBy});
		filterMap.set("HSCP", {locator: this.strHscpFilterBy,
		                                  text: this.strHscpFilterTextBy});
		filterMap.set("Appt. End Date", {locator: this.appointmentEndDtFilterBy,
		                                  text: this.appointmentEndDtFilterTextBy});
	
	    return filterMap;
	}
	
	// map for desired location
	get desiredLocationMap()
	{
	    const desiredLocationMap = new Map();
	    desiredLocationMap.set("St Mary", this.desiredLocationCheckboxStMaryBy);
	    
	    return desiredLocationMap;
	}
	
    //////////////////////////////////////////////////////////////////
	// METHODS - DATATABLE TEST ROSTER-FILTER
	//////////////////////////////////////////////////////////////////
	
	checkFilterExists = async (loggingPrefix, driver, columnName) =>
	{
		try
		{
			// check for filter
			await driver.wait(until.elementLocated(this.filterMap.get(columnName).locator), 15000);
			logThis(loggingPrefix + columnName + " filter exists");
		
			return true;
		}
		catch(error)
		{
			// add column to list of columns needing review
			this.columnsNeedingReview.push(columnName);
		
			// print error message to console
			logThis(loggingPrefix + error.message);
			logThis(loggingPrefix + "no filter: " + columnName);
		
			return false;
		}
	}

	checkFilterCount = async (loggingPrefix, driver, columnName) =>
	{
		// get span containing count text
		let filterButtonSpan = await driver.wait(until.elementLocated(this.filterMap.get(columnName).text), 10000);
		await driver.executeScript('arguments[0].scrollIntoView();', filterButtonSpan);
	
		// check filter text
		let filterText = await filterButtonSpan.getText(); // e.g. "10 selected"
	
		// get only number part of filter count
		let actualFilterCount = filterText.split(" ")[0];
		logThis(loggingPrefix + columnName + " -- expected filter count is: " + this.expectedFilterCount[columnName]);
		logThis(loggingPrefix + columnName + " -- actual filter count is:   " + actualFilterCount);
	
		// check if actual filter count is same as expected
		if(this.dynamicColumns.includes(columnName)) // check dynamic column
		{
			// mark column as needing review if not at least 1
			if(actualFilterCount < 1)
			{
				this.columnsNeedingReview.push(columnName);
			}
		}
		else // check fixed/non-dynamic column
		{
			// (most cases) check against expected number of items in filter
			if(actualFilterCount != this.expectedFilterCount[columnName])
			{
				this.columnsNeedingReview.push(columnName);
			}
		}
	}

	checkFilterExistsAndCount = async (loggingPrefix, driver, columnName) =>
	{
		// check if filter exists
		let filterExists = await this.checkFilterExists(loggingPrefix, driver, columnName);
	
		// check filter count if filter exists
		if(filterExists == true)
		{
			await this.checkFilterCount(loggingPrefix, driver, columnName);
		}
	}
	
	
    //////////////////////////////////////////////////////////////////
	// METHODS - DATATABLE TEST ROSTER-SORT
	//////////////////////////////////////////////////////////////////	
	
	getNamesAsText = async (loggingPrefix, driver) =>
	{
		//////////////////////////////////////////////////////////////////
		// initial state A-Z SORT CHECK
		//////////////////////////////////////////////////////////////////
		
		var namesAsText = [];
		var isInitiallyAToZ = isAToZ(namesAsText);
		logThis("names ARE initially a to z: " + isInitiallyAToZ);
		
		
		//////////////////////////////////////////////////////////////////
		// A-Z SORT CHECK
		//////////////////////////////////////////////////////////////////
		
		
		// get list of all name objects (in name column -- note: these are objects containing the text)
		await driver.wait(until.elementLocated(this.nameObjectsInNameColumnBy), 15000);
		let nameObjectsInNameColumn = await driver.findElements(this.nameObjectsInNameColumnBy);

		await asyncForEach(nameObjectsInNameColumn, async function(value, index)
		{
			let nameAsText = await value.getText();
			namesAsText.push(nameAsText);
		});
	
		// eliminate any empty values
		namesAsText = namesAsText.filter(name => name.length > 0);
		logThis("names: " + namesAsText.join(' || '));
		logThis("# of names: " + namesAsText.length);
		
		// check A-Z sort
		var isSortedAToZ = isAToZ(namesAsText);
		var isSortedZToA = isZToA(namesAsText);
		logThis("AFTER SORT CLICK, NAMES ARE A to Z : " + isSortedAToZ);
		logThis("AFTER SORT CLICK, NAMES ARE Z to A : " + isSortedZToA);
		
		return namesAsText;
	}
	
	
    //////////////////////////////////////////////////////////////////
	// METHODS - DATATABLE TEST ROSTER-DEFAULT
	//////////////////////////////////////////////////////////////////
	
	getSortingTitle = async (loggingPrefix, driver) =>
	{
	    // **Text above datatable should note "Sorting by 1. Name"**
		let sortingTitle = await driver.findElement(this.sortingTitleBy).getText();
		
		return sortingTitle;
	}
	
	
    //////////////////////////////////////////////////////////////////
	// METHODS - DATATABLE TEST ROSTER-SHOW-ONLY
	//////////////////////////////////////////////////////////////////
	
	
	// click on "show only" dropdown button
	clickShowOnlyButton = async (loggingPrefix, driver) =>
	{	
		await driver.wait(until.elementLocated(this.showOnlyButtonBy), 10000);
		let showOnlyButton = driver.findElement(this.showOnlyButtonBy);
		showOnlyButton.click();
		logThis(loggingPrefix + "Show Only button clicked");
	}
	
	// choose "appointed" on "show only" button menu/dropdown
	chooseAppointedShowOnly = async (loggingPrefix, driver, desiredAppointmentStatus) =>
	{
		await driver.wait(until.elementLocated(this.appointedCheckboxBy), 10000);
		let appointedCheckbox = driver.findElement(this.appointedCheckboxBy);
		await driver.executeScript("arguments[0].scrollIntoView()", appointedCheckbox); // to avoid ElementClickInterceptedError
		appointedCheckbox.click();
		logThis(loggingPrefix + desiredAppointmentStatus + " checkbox clicked");
	}
	
	// get appointment status texts
	getAppointmentStatusTexts = async (loggingPrefix, driver) =>
	{
		// get appointment statuses
		await driver.wait(until.elementLocated(this.appointmentStatusesBy), 10000);
		let appointmentStatusElements = await driver.findElements(this.appointmentStatusesBy);
		logThis(loggingPrefix + "Appointment Status elements found: " + appointmentStatusElements.length);
		
		// create list of appoint status text values
		let appointmentStatusTexts = [];
		
		await asyncForEach(appointmentStatusElements, async appointmentStatusElement =>
		{
			//let appointmentStatusElementText = await appointmentStatusElement.getText();
			let appointmentStatusElementText = await driver.executeScript("return arguments[0].innerHTML",appointmentStatusElement); // getText does not work
			logThis(loggingPrefix + "Appointment Status element text is: " + appointmentStatusElementText);
			
			// remove blanks
			if(appointmentStatusElementText !== "")
			{
				appointmentStatusTexts.push(appointmentStatusElementText);
			}
			
		});
		
		logThis(loggingPrefix + "all Appointment text values: " + appointmentStatusTexts.join(" | "));
		logThis(loggingPrefix + "total # of Appointment Statuses being checked: " + appointmentStatusTexts.length);
		
		return appointmentStatusTexts;
	}
	
	// check appointment status texts
	checkAppointmentStatuses = async (loggingPrefix, driver, appointmentStatusTexts, expectedAppointmentStatus) =>
	{
		let appointmentStatusCount = 0;
		
		logThis(loggingPrefix + "expected Appointment Status value: " + expectedAppointmentStatus);
		
		// check statuses so they're all same as expectedAppointmentStatus
		let appointmentStatusesMatchExpected = appointmentStatusTexts.every(appointmentStatus =>
		{
		    logThis(loggingPrefix + "Appointment Status value being checked: " + appointmentStatus);
		    return appointmentStatus === expectedAppointmentStatus;
		});
		
		return appointmentStatusesMatchExpected; // true or false based on result of .every()
	}
	
    //////////////////////////////////////////////////////////////////
	// METHODS - DATATABLE TEST ROSTER-VISIBLE-ROWS
	//////////////////////////////////////////////////////////////////
	
	// get text values of name columns of each record
	getNameTexts = async (loggingPrefix, driver) =>
	{
		//////////////////////////////////////////////////////////////////
		// VISIBLE ROWS IN DATATABLE
		//////////////////////////////////////////////////////////////////
		
		// get list of all name objects (in name column -- note: these are the objects, not the text)
		// We're using the names as proxies for "rows" since there's the header row and possibly rows that aren't "visible,"
		// which shouldn't count.  The assumption is that Names, unlike Empl. IDs for example, always exist.
		// This allows us to eliminate "rows" if they don't have names while we couldn't do the same for rows that don't have data
		// for other columns, since they still might be valid rows without that data.
		await driver.wait(until.elementLocated(this.nameObjectsInNameColumnBy), 15000);
		let nameObjectsInNameColumn = await driver.findElements(this.nameObjectsInNameColumnBy); // this will end up being human visible + 1 hidden
		let numberVisibleRows = nameObjectsInNameColumn.length;
		logThis(loggingPrefix + "Number of visible Names/rows: " + (numberVisibleRows - 1));
		
		// create list of name text values
		let nameTexts = [];
		
		await asyncForEach(nameObjectsInNameColumn, async function(nameElement)
		{
			let nameElementText = await nameElement.getText();
			
			// remove blanks
			if(nameElementText === "")
			{
				logThis(loggingPrefix + "[" + nameElementText +"]" + " removed from final list of Names/rows");
			}
			else
			{
				nameTexts.push(nameElementText);
			}			    
		});
		logThis(loggingPrefix + "final list of Names/rows is: " + nameTexts.join(" | "));
		
		return nameTexts;
	}
	
	
    //////////////////////////////////////////////////////////////////
	// METHODS - DATATABLE TEST ROSTER-FILTER-LOCATION-EXPORT
	//////////////////////////////////////////////////////////////////
	
	// click Location filter dropdown
	clickLocationFilter = async (loggingPrefix, driver) =>
	{
		// click Location dropdown
		await driver.wait(until.elementLocated(this.locationFilterBy), 3000);
		let locationDropdown = await driver.findElement(this.locationFilterBy);
		await driver.executeScript("arguments[0].scrollIntoView()", locationDropdown);
		locationDropdown.click();
		logThis(loggingPrefix + "location dropdown clicked");
	}
	
	// click Location filter Uncheck All
	clickLocationFilterUncheckAll = async (loggingPrefix, driver) =>
	{
		// click Uncheck all icon
		await driver.wait(until.elementLocated(this.locationFilterUncheckAllBy), 3000);
		let locationUncheckIcon = await driver.findElement(this.locationFilterUncheckAllBy);
		await driver.executeScript("arguments[0].scrollIntoView()", locationUncheckIcon);
		await driver.wait(until.elementIsVisible(locationUncheckIcon));
		locationUncheckIcon.click();
		logThis(loggingPrefix + "location uncheck all icon clicked");
	}
	
	// click desired location checkbox
	clickDesiredLocationCheckbox = async (loggingPrefix, driver, desiredLocation) =>
	{
		// click desired location checkbox
		let desiredLocationCheckbox = await driver.findElement(this.desiredLocationMap.get(desiredLocation));
		desiredLocationCheckbox.click();
		logThis(loggingPrefix + desiredLocation + " checkbox clicked");
	}
	
	// click export to excel button
	clickExportToExcelButton = async (loggingPrefix, driver) =>
	{
		let exportButton = await driver.findElement(this.exportToExcelButtonBy);
		exportButton.click();
		logThis(loggingPrefix + "Export To Excel button clicked");
	}
	
	
    //////////////////////////////////////////////////////////////////
	// METHODS - DATATABLE TEST ROSTER-NAME-SEARCH-EXPORT
	//////////////////////////////////////////////////////////////////
	
	// search for desired name
	searchDesiredName = async (loggingPrefix, driver, desiredName, fileName) =>
	{
		await driver.wait(until.elementLocated(this.nameSearchFieldBy), 5000);
		let nameSearchField = await driver.findElement(this.nameSearchFieldBy);
		await nameSearchField.sendKeys(desiredName);
		logThis(loggingPrefix + "name search field found and desired name [" + desiredName + "] entered");
	}
}

module.exports = ApptsActivePage;