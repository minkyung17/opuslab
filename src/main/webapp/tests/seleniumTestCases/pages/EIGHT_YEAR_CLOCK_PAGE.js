/*****************************************************************
** this class is for an individual profile's eight year clocks,
** NOT the eight year clock summary datatable
*****************************************************************/

const DataTablePage = require ('./DATATABLE_PAGE');
const {By, Key, until} = require('selenium-webdriver');

class EightYearClockPage extends DataTablePage
{
    //////////////////////////////////////////////////////////////////
	// CONSTRUCTOR
	//////////////////////////////////////////////////////////////////
	
    constructor()
    {
        super();
    }
    
    
    //////////////////////////////////////////////////////////////////
	// EIGHT YEAR CLOCK PAGE LOCATORS
	//////////////////////////////////////////////////////////////////
	
    // general page locators
    // use the js get syntax to bind the By as you would with classes in other languages
    get eightYearClockLinkBy() { return By.name("eightYearClock"); }
	get addRowButtonBy() { return By.xpath('//*[text()="Add Row"]'); }
	get firstEditIconBy() { return By.xpath('//*[@class=" datatable_root "]/div/div/div[3]/div[1]/div/div/div/div/div/div/div/div/div/img'); }
	get deleteButtonBy() { return By.xpath('//*[text()="Delete"]'); }
	
	
    //////////////////////////////////////////////////////////////////
	// METHODS
	//////////////////////////////////////////////////////////////////
	
	checkForButtons = async(loggingPrefix, driver, shouldSee) =>
	{
		logThis(loggingPrefix + "shouldSee is: " + shouldSee)
		// initialize result
		var result = "";
	
	
		//////////////////////////////////////////////////////////////////
		// ADD ROW BUTTON CHECK
		//////////////////////////////////////////////////////////////////
	
		try
		{
			// look for Add Row button
			await driver.wait(until.elementLocated(this.addRowButtonBy), 5000);
			logThis(loggingPrefix + "Add Row button     found");
			
			return "access";
		}
		catch(error)
		{
			logThis(loggingPrefix + "Add Row button NOT found");
			
			return "denied";
		}
	

		//////////////////////////////////////////////////////////////////
		// EDIT BUTTON CHECK
		//////////////////////////////////////////////////////////////////
	
		try
		{
			// look for Edit icon/button
			await driver.wait(until.elementLocated(this.firstEditIconBy), 5000);
			logThis(loggingPrefix + "Edit icon/button   found");
			
			return "access";
		}
		catch(error)
		{
			logThis(loggingPrefix + "Edit icon/button NOT found");
			
			return "denied";
		}
	
	
		//////////////////////////////////////////////////////////////////
		// DELETE BUTTON CHECK
		//////////////////////////////////////////////////////////////////
	
		try
		{
			// look for Delete button
			await driver.wait(until.elementLocated(this.deleteButtonBy), 3000);
		
			logThis(loggingPrefix + "Delete button      found");
			
			return "access";
		}
		catch(error)
		{
			logThis(loggingPrefix + "Delete button NOT found");
			
			return "denied";			
		}
	}
	
	clickEightYearClockLink = async (loggingPrefix, driver) =>
	{
	    try
	    {
			await driver.wait(until.elementLocated(this.eightYearClockLinkBy), 10000);
			logThis(loggingPrefix + "Eight Year Clock link located");
			
			let eightYearClockLink = await driver.findElement(this.eightYearClockLinkBy);
			eightYearClockLink.click();
			logThis(loggingPrefix + "Eight Year Clock link clicked");
	    }
	    catch(error)
	    {
	        logThis(loggingPrefix + '"Eight Year Clock link NOT located');
	        logThis(error);
	    }
	}
}

module.exports = EightYearClockPage;