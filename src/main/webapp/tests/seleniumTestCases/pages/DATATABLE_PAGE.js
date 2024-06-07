const Page = require ('./PAGE');
const {By, until} = require('selenium-webdriver');

require('../data/EXPORT_FILE_NAMES');

// this class doesn't reflect an actual page but is the generic form of a datatable that will be subclassed by the other pages that present datatables
class DataTablePage extends Page
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
	
    // use the js get syntax to bind the By as you would with classes in other languages
    get firstRecordBy() { return By.xpath('//div[@class=" datatable_root "]/div/div/div[3]/div[1]'); }
    get tableDescriptionsBy() { return By.css(".results_legend"); }
    get changeColumnsButtonBy() { return By.xpath('//button[text()="Change Columns"]'); }
    get changeColumnsModalBy() { return By.xpath('//*[@class="modal-dialog"]'); }
    get editIconBy() { return By.xpath('//*[@id="reactFixedDataTable"]/div/div[4]/div/div[1]/div[3]/div[1]/div/div[1]/div[1]/div/div/div/div/div/div/span/img'); }
    get exportToExcelButtonBy() { return  By.css(".export-to-excel"); }
    
    
	//////////////////////////////////////////////////////////////////
	// LOCATORS: MODAL
	//////////////////////////////////////////////////////////////////
	
	get modalBy() { return By.xpath('//*[@class="modal-dialog"]'); }
	get modalFirstRecordBy() { return By.xpath('//div[@class="modal-body"]/div/div/div[2]/div/div/div[3]/div'); }
	get modalChangeColumnsButtonBy() { return By.xpath('//*[@class="modal-body"]/div/div/div[1]/button[1]'); }
	get checkAllCheckboxBy() { return By.name("all"); }
	get modalCloseButtonBy() { return By.xpath('//button[text()="Close"]'); }
	
		
	//////////////////////////////////////////////////////////////////
	// METHODS
	//////////////////////////////////////////////////////////////////
	
	checkForData = async (loggingPrefix, driver, modal) =>
	{

	    logThis(loggingPrefix + "checking for records in table");
	    
		// check if data loads
		try
		{
		    if(modal)
			{
				// show how long it takes for data to load
				await showElapsedTime(loggingPrefix, driver, this.modalFirstRecordBy);
		
				// look for first record
				await driver.wait(until.elementLocated(this.modalFirstRecordBy), 60000);			
			}
			else
			{
				// show how long it takes for data to load
				await showElapsedTime(loggingPrefix, driver, this.firstRecordBy);
		
				// look for first record
				await driver.wait(until.elementLocated(this.firstRecordBy), 60000);
			}
		
			// as long as first record loads, return as true
			logThis(loggingPrefix + "page loaded with at least one record, checking for error page...");
			return true;
		}
		catch(error)
		{
			logThis(loggingPrefix + "NO RECORDS LOADED, possibly 0 records or error");
			return false;
		}
	}
	
	// click edit icon
	clickEditIcon = async (loggingPrefix, driver) =>
	{
        // check for edit icon
		await driver.wait(until.elementLocated(this.editIconBy), 20000);
		logThis(loggingPrefix + 'edit icon found');
		
		// set window size to avoid element not interactable error
		await driver.manage().window().setRect({ width: 1024, height: 768 });
						
		// click icon
		let editIcon = driver.findElement(this.editIconBy);
		await driver.executeScript("arguments[0].scrollIntoView();", editIcon);
		await editIcon.click();
		logThis(loggingPrefix + 'edit icon clicked');
	}
	
	// click Export to Excel button on datatable page
	clickExportToExcelButton  = async (loggingPrefix, driver) =>
	{
		// find and click export button now that all records are assumed to have loaded
		let exportButton = await driver.wait(until.elementLocated(this.exportToExcelButtonBy), 30000);
		logThis(loggingPrefix + "export button located");
		exportButton.click();
		logThis(loggingPrefix + "export button clicked, downloading file...");
	}
	
	getCurrentRecordsTotal = async (loggingPrefix, driver, modal) =>
	{
		// the fourth parameter is optional and will be passed if we want the records total from the modal table instead of the main table
	
		// get all table descriptions (total will be one if main table, two if modal)
		let tableDescriptions = await driver.wait(until.elementsLocated(this.tableDescriptionsBy), 30000);
	
		// initialize the text that's going to be parsed, whether from main table or modal table
		let descriptionText = "";
	
		if(modal !== undefined)
		{
			// this is for when we want the total from the modal table
			// get table description text from modal table (instead of main table) 
			let modalTableDescription = tableDescriptions[1];
			descriptionText = await modalTableDescription.getText();
		}
		else
		{
			// this is for when we want the total from the main table
			// get table description text from main table
			let mainTableDescription = tableDescriptions[0];
			descriptionText = await mainTableDescription.getText();	
		}

		// create array from table description and find records total -- depending on whether records filtered or not
		let recordsTotal = "";
		const descriptionArray = descriptionText.split(" ");
		
		recordsTotal = descriptionArray[5];
		logThis(loggingPrefix + "total number of records on webpage: " + recordsTotal);
		
		return recordsTotal;
	}
	
	getNumberCurrentVisibleRecords = async (loggingPrefix, driver) =>
	{
		// get all table descriptions
		let tableDescriptions = await driver.wait(until.elementsLocated(this.tableDescriptionsBy), 30000);
	
		// initialize the text that's going to be parsed
		let descriptionText = "";
	
		let mainTableDescription = tableDescriptions[0];
		descriptionText = await mainTableDescription.getText();	
		
		// create array from table description and find number of visible records
		let recordsTotal = "";
		const descriptionArray = descriptionText.split(" ");
	
		recordsTotal = descriptionArray[3];
	
		return recordsTotal;
	}
	
	// retrieve from stored data what the file name of the exported file should be (minus extension)
	getExportFileName = (loggingPrefix, driver, pageToGetFor) =>
	{
	    // get the desired file name from stored data
	    const exportFileName = getExportFileName(pageToGetFor);
	    
	    return exportFileName;
	}
	
	// retrieve from stored data what the file name of the exported file should be (plus extension)
	getExportFileNamePlusExtension = (loggingPrefix, driver, pageToGetFor) =>
	{
	    // get the desired file name from stored data
		const fileName = getExportFileName(pageToGetFor);
		
		// add the extension
		const exportFileNamePlusExtension = fileName + ".csv";
	
		return exportFileNamePlusExtension;
	}
	
	selectCheckAll = async (loggingPrefix, driver, modal) =>
	{
		/*
		* mainly used for XLS/export tests and DTBL tests
		* This method selects the "Check All" checkbox (by first going through the "Change Columns button").
		* This is so all columns are available on the downloaded file.
		* The "modal" parameter is optional and intended for the bulk tests (9-12).
		*/
	
		if(modal !== undefined)
		{
		    try
		    {
				/*
				* This is for tables that appear through a modal (currently XLS/export bulk tests 9-12).
				*/
			
				// before selecting Check All, wait for modal to appear
				await driver.wait(until.elementLocated(this.modalBy), 10000);
				logThis(loggingPrefix + "modal found");
		
				// click Change Columns button
				await this.maximizeWindow(loggingPrefix, driver); // avoid ElementClickInterceptedError in headed
				await driver.wait(until.elementLocated(this.modalChangeColumnsButtonBy), 10000);
				let changeColumnsButton = driver.findElement(this.modalChangeColumnsButtonBy);
				await changeColumnsButton.click();
				logThis(loggingPrefix + "\"Change Columns\" button clicked");
	
				// set window size to avoid element not interactable error (from Page class)
				await this.setPageDimensions(loggingPrefix, driver, 768, 1024);
	
				// click "Check All" checkbox
				await driver.wait(until.elementLocated(this.checkAllCheckboxBy), 10000);
				let checkAllCheckbox = driver.findElement(this.checkAllCheckboxBy);
				await checkAllCheckbox.click();
				logThis(loggingPrefix + "\"Check All\" checkbox clicked");
	
				// close modal
				await driver.wait(until.elementLocated(this.modalCloseButtonBy), 10000);
				let closeModalButton = driver.findElement(this.modalCloseButtonBy);
				await closeModalButton.click();  
				
				// if an action follows, it may have an elementclickintercepterror so make sure modal is gone
				await driver.wait(until.elementIsNotVisible(this.modalBy), 3000);
				logThis(loggingPrefix + "modal no longer visible");
			}
			catch(error)
			{
			    logThis(loggingPrefix + "modal Check All failed");
			    logThis(error);
			}
		}
		else
		{
		    try
		    {
				/*
				* Here the "modal" parameter is undefined, which means it's a normal table that appears without it appearing
				* through a modal that pops up.
				*/
		
				// first, click change columns button
				await driver.wait(until.elementLocated(this.changeColumnsButtonBy), 10000);
				let changeColumnsButton = driver.findElement(this.changeColumnsButtonBy);
				await changeColumnsButton.click();
				logThis(loggingPrefix + "\"Change Columns\" button clicked");
	
				// set window size to avoid element not interactable error
				await this.setPageDimensions(loggingPrefix, driver, 768, 1024);
	
				// check for modal
				await driver.wait(until.elementLocated(this.changeColumnsModalBy), 10000);
				logThis(loggingPrefix + "modal found");
	
				// click "Check All" checkbox (same locator as modal's)
				await driver.wait(until.elementLocated(this.checkAllCheckboxBy), 10000);
				let checkAllCheckbox = driver.findElement(this.checkAllCheckboxBy);
				await checkAllCheckbox.click();
				logThis(loggingPrefix + "\"Check All\" checkbox clicked");
	
				// close modal
				await driver.wait(until.elementLocated(this.modalCloseButtonBy), 10000);
				let changeColumnsCloseModalButton = driver.findElement(this.modalCloseButtonBy);
				await changeColumnsCloseModalButton.click();    
				logThis(loggingPrefix + "Change Columns modal closed");
			}
			catch(error)
			{
			    logThis(loggingPrefix + "modal Check All failed");
			    logThis(error);
			}
		}
	}
}

module.exports = DataTablePage;