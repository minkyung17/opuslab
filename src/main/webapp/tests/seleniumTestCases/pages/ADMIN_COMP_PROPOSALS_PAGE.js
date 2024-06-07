const DataTablePage = require ('./DATATABLE_PAGE');
const {By, Key, until} = require('selenium-webdriver');

class AdminCompProposalsPage extends DataTablePage
{
    //////////////////////////////////////////////////////////////////
	// CONSTRUCTOR
	//////////////////////////////////////////////////////////////////
	
    constructor()
    {
        super();
    }
    
    
    //////////////////////////////////////////////////////////////////
	// ADMIN COMP PROPOSALS PAGE (main/non-modal)
	//////////////////////////////////////////////////////////////////
	
    // general page locators
    // use the js get syntax to bind the By as you would with classes in other languages
    get firstHeaderBy() { return By.tagName("h1"); }
    get addNewProposalButtonBy() { return By.xpath('//button[text()="Add New Proposal"]'); }
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
	
	// click Add New Proposal button
	clickAddNewProposalButton = async (loggingPrefix, driver) =>
	{
	    // check for add new proposal button
		let addNewProposalButton = await driver.wait(until.elementLocated(this.addNewProposalButtonBy), 20000);
		logThis(loggingPrefix + '"Add New Proposal" button found');
		
		// click button
		await driver.executeScript("arguments[0].scrollIntoView();", addNewProposalButton);
		await addNewProposalButton.click();
		logThis(loggingPrefix + '"Add New Proposal" button clicked');
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

module.exports = AdminCompProposalsPage;