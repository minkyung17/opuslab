const DataTablePage = require ('./DATATABLE_PAGE');
const {By, Key, until} = require('selenium-webdriver');

class CamoPage extends DataTablePage
{
    //////////////////////////////////////////////////////////////////
	// CONSTRUCTOR
	//////////////////////////////////////////////////////////////////
	
    constructor()
    {
        super();
    }
    
    
    //////////////////////////////////////////////////////////////////
	// LOCATORS
	//////////////////////////////////////////////////////////////////
	
    // general page locators
    // use the js get syntax to bind the By as you would with classes in other languages
    get viewDropdownBy() { return By.id("dropdown-basic-0"); }
    get viewDropdownCAPOptionBy() { return By.xpath('//a[text()="CAP"]'); }
    get viewDropdownDeansOfficeOptionBy() { return By.xpath('//a[text()="Dean\'s Office"]'); }
    get viewDropdownDepartmentOptionBy() { return By.xpath('//a[text()="Department"]'); }
    get viewDropdownLibraryOptionBy() { return By.xpath('//a[text()="Library"]'); }
    get apoAnalystFilterDropdownBy() { return By.id("apoAnalyst_ms"); }
    get apoAnalystFilterUncheckAllBy() { return By.xpath("/html/body/div[23]/div/ul/li[2]/a/span[2]"); }
    get apoAnalystFilterMaryTamBy() { return By.id("ui-multiselect-19-apoAnalyst-option-2"); }
    

	//////////////////////////////////////////////////////////////////
	// MAP FOR DTBL FILTER LOCATORS
	//////////////////////////////////////////////////////////////////
	
	// map for desired location
	get desiredAPOAnalystMap()
	{
	    const desiredAPOAnalystMap = new Map();
	    desiredAPOAnalystMap.set("Tam, Mary", this.apoAnalystFilterMaryTamBy);
	    
	    return desiredAPOAnalystMap;
	}
	
	
    //////////////////////////////////////////////////////////////////
	// METHODS
	//////////////////////////////////////////////////////////////////
	
    // find and click view dropdown selection
    clickViewDropdown = async (loggingPrefix, driver) =>
    {
        try
        {
			await driver.wait(until.elementLocated(this.viewDropdownBy), 30000);
			let viewDropdown = await driver.findElement(this.viewDropdownBy);
			viewDropdown.click();
			logThis(loggingPrefix + "dropdown clicked");
        }
        catch(error)
        {
            logThis(loggingPrefix + "view dropdown NOT located");
        }
	}
	
	selectCAPView = async (loggingPrefix, driver) =>
    {
        try
        {
            await driver.wait(until.elementLocated(this.viewDropdownCAPOptionBy), 30000);
			let viewDropdownCAP = await driver.findElement(this.viewDropdownCAPOptionBy);
			logThis(loggingPrefix + "CAP option located in dropdown");
			viewDropdownCAP.click();
			logThis(loggingPrefix + "CAP view selected");
        }
        catch(error)
        {
            logThis(loggingPrefix + "CAP option NOT located in dropdown");
        }
	}
	
	selectDeansOfficeView = async (loggingPrefix, driver) =>
    {
        try
        {
            await driver.wait(until.elementLocated(this.viewDropdownDeansOfficeOptionBy), 30000);
			let viewDropdownDeansOffice = await driver.findElement(this.viewDropdownDeansOfficeOptionBy);
			logThis(loggingPrefix + "Dean's Office option located in dropdown");
			viewDropdownDeansOffice.click();
			logThis(loggingPrefix + "Dean's Office view selected");
        }
        catch(error)
        {
            logThis(loggingPrefix + "Dean's Office option NOT located in dropdown");
        }
	}
	
	selectDepartmentView = async (loggingPrefix, driver) =>
    {
        try
        {
            await driver.wait(until.elementLocated(this.viewDropdownDepartmentOptionBy), 30000);
			let viewDropdownCAP = await driver.findElement(this.viewDropdownDepartmentOptionBy);
			logThis(loggingPrefix + "Department option located in dropdown");
			viewDropdownCAP.click();
			logThis(loggingPrefix + "Department view selected");
        }
        catch(error)
        {
            logThis(loggingPrefix + "Department option NOT located in dropdown");
        }
	}
	
	selectLibraryView = async (loggingPrefix, driver) =>
    {
        try
        {
            await driver.wait(until.elementLocated(this.viewDropdownLibraryOptionBy), 30000);
			let viewDropdownLibrary = await driver.findElement(this.viewDropdownLibraryOptionBy);
			logThis(loggingPrefix + "Library option located in dropdown");
			viewDropdownLibrary.click();
			logThis(loggingPrefix + "Library view selected");
        }
        catch(error)
        {
            logThis(loggingPrefix + "Library option NOT located in dropdown");
        }
	}
	
	
    //////////////////////////////////////////////////////////////////
	// METHODS - DTBL-CAMO-ANALYST-EXPORT
	//////////////////////////////////////////////////////////////////
	
	clickAPOAnalystFilterDropdown = async (loggingPrefix, driver) =>
    {
		await driver.wait(until.elementLocated(this.apoAnalystFilterDropdownBy), 3000);
		let apoAnalystFilterDropdown = await driver.findElement(this.apoAnalystFilterDropdownBy);
		await driver.executeScript("arguments[0].scrollIntoView()", apoAnalystFilterDropdown);
		apoAnalystFilterDropdown.click();
		logThis(loggingPrefix + "APO Analyst filter dropdown clicked");
	}
	
	clickAPOAnalystFilterUncheckAll = async (loggingPrefix, driver) =>
    {
		await driver.wait(until.elementLocated(this.apoAnalystFilterUncheckAllBy), 3000);
		let apoAnalystFilterUncheckAll = await driver.findElement(this.apoAnalystFilterUncheckAllBy);
		await driver.executeScript("arguments[0].scrollIntoView()", apoAnalystFilterUncheckAll);
		apoAnalystFilterUncheckAll.click();
		logThis(loggingPrefix + "APO Analyst filter Uncheck All clicked");
	}
	
	clickDesiredAPOAnalyst = async (loggingPrefix, driver, desiredAPOAnalyst) =>
    {
		await driver.wait(until.elementLocated(this.desiredAPOAnalystMap.get(desiredAPOAnalyst)), 3000);
		let apoAnalyst = await driver.findElement(this.desiredAPOAnalystMap.get(desiredAPOAnalyst));
		await driver.executeScript("arguments[0].scrollIntoView()", apoAnalyst);
		apoAnalyst.click();
		logThis(loggingPrefix + "APO Analyst " + desiredAPOAnalyst + " clicked");
	}
}

module.exports = CamoPage;