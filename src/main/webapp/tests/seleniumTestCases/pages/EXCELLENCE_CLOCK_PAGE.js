const DataTablePage = require ('./DATATABLE_PAGE');
const {By, Key, until} = require('selenium-webdriver');

class ExcellenceReviewClockPage extends DataTablePage
{
    //////////////////////////////////////////////////////////////////
	// CONSTRUCTOR
	//////////////////////////////////////////////////////////////////
	
    constructor()
    {
        super();
    }
    
    
    //////////////////////////////////////////////////////////////////
	// EXCELLENCE REVIEW CLOCK PAGE LOCATORS
	//////////////////////////////////////////////////////////////////
	
    // general page locators
    // use the js get syntax to bind the By as you would with classes in other languages
    get excellenceReviewClockLinkBy() { return By.name("excellenceClock"); }
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
	
	clickExcellenceReviewClockLink = async (loggingPrefix, driver) =>
	{
	    try
	    {
			await driver.wait(until.elementLocated(this.excellenceReviewClockLinkBy), 10000);
			logThis(loggingPrefix + "Excellence Review Clock link located");
			
			let excellenceReviewClockLink = await driver.findElement(this.excellenceReviewClockLinkBy);
			excellenceReviewClockLink.click();
			logThis(loggingPrefix + "Excellence Review Clock link clicked");
	    }
	    catch(error)
	    {
	        logThis(loggingPrefix + '"Excellence Review Clock link NOT located');
	        logThis(error);
	    }
	}
}

module.exports = ExcellenceReviewClockPage;