const DataTablePage = require ('./DATATABLE_PAGE');
const {By, Key, until} = require('selenium-webdriver');

class AdminCompAllocationsPage extends DataTablePage
{
    //////////////////////////////////////////////////////////////////
	// CONSTRUCTOR
	//////////////////////////////////////////////////////////////////
	
    constructor()
    {
        super();
    }
    
    
    //////////////////////////////////////////////////////////////////
	// ADMIN COMP ALLOCATIONS PAGE (main/non-modal)
	//////////////////////////////////////////////////////////////////
	
    // general page locators
    // use the js get syntax to bind the By as you would with classes in other languages
    get addAllocationButtonBy() { return By.xpath('//button[text()="Add Allocation"]'); }
    get firstHeaderBy() { return By.tagName("h1"); }
    get editIconBy() { return By.xpath('//*[@id="reactFixedDataTable"]/div/div/div[3]/div/div[1]/div[3]/div[1]/div/div[1]/div[1]/div/div/div/div/div/div/span/img'); }
    get modalBy() { return By.xpath("/html/body/div[10]/div/div[2]/div"); }
    get deleteButtonBy() { return By.xpath('//button[text()="Delete"]'); }
    
    
    //////////////////////////////////////////////////////////////////
	// MODAL
	//////////////////////////////////////////////////////////////////
	
	// modal page locators
	get modalBy() { return By.className("modal-dialog"); }
	
	
	//////////////////////////////////////////////////////////////////
	// METHODS
	//////////////////////////////////////////////////////////////////
	
	// check for error page
	checkForErrorPage = async (loggingPrefix, driver, rawResult) =>
	{
	    // since page routes from successful page, wait a bit to check for error page
		await wait(5000);
		
		let header = await driver.wait(until.elementLocated(this.firstHeaderBy), 10000);
		let headerText = await header.getText();
		logThis(loggingPrefix + "first header says: " + headerText);
		
		// if error page appears, set result and exit
		headerText.toLowerCase().includes("sorry") ? rawResult = "denied" : rawResult = "";
		
		return rawResult;
	}
		
    // click Add Allocation button
    clickAddAllocationButton = async (loggingPrefix, driver) =>
    {
        // if button CAN be found, role probably has access but not considering it full access until modal appears
		let addAllocationButton = await driver.wait(until.elementLocated(this.addAllocationButtonBy), 60000);
		logThis(loggingPrefix + '"Add Allocation" button found');
		
		// click "Add Allocation" button
		addAllocationButton.click();
		let modalElements = await driver.wait(until.elementsLocated(this.modalBy), 20000);
		logThis(loggingPrefix + "modal launched");
    }
    
    // locate edit icon
    clickEditIcon = async (loggingPrefix, driver) =>
    {
		// if edit icon CAN be found, role probably has access but not considering it full access until modal appears
		let editIcon = await driver.wait(until.elementLocated(By.xpath('//*[@id="reactFixedDataTable"]/div/div/div[3]/div/div[1]/div[3]/div[1]/div/div[1]/div[1]/div/div/div/div/div/div/span/img')), 20000);
		logThis(loggingPrefix + "edit icon found");
							
		await driver.manage().window().setRect({ width: 1024, height: 768 });
	
		// click edit icon
		await driver.executeScript("arguments[0].scrollIntoView();", editIcon);
		await editIcon.click();
		logThis(loggingPrefix + "edit icon clicked");
	}
	
	// make sure modal is launched
	checkForModal = async (loggingPrefix, driver) =>
	{
		let modal = await driver.wait(until.elementLocated(this.modalBy), 10000);
		logThis(loggingPrefix + "modal launched");
	}
	
	// check whether or not delete button enabled
	isDeleteButtonEnabled = async (loggingPrefix, driver) =>
	{
	    let rawResult = null;
	    
		try
		{
			// check for Delete Button(s) -- should exist in all cases
			let deleteButton = await driver.wait(until.elementsLocated(this.deleteButtonBy), 20000);
			logThis(loggingPrefix + "delete button(s) found");
			
			// check if Delete Button is enabled (enabled = opacity 1.0; else disabled)
			let opacity = await deleteButton[0].getCssValue("opacity");
			logThis(loggingPrefix + "opacity is: " + opacity);
			parseInt(opacity) < 1.00 ? rawResult = "denied" : rawResult = "access";
		}
		catch(error)
		{
			// if delete button CAN'T be found, role doesn't have access
			logThis(loggingPrefix + "delete button can't be found");
			logThis(error.message);
			rawResult = "error: access to general page";
		}
		
		return rawResult;
	}
}

module.exports = AdminCompAllocationsPage;