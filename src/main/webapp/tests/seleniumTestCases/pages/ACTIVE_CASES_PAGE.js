const DataTablePage = require ('./DATATABLE_PAGE');
const {By, Key, until} = require('selenium-webdriver');

class ActiveCasesPage extends DataTablePage
{
    //////////////////////////////////////////////////////////////////
	// CONSTRUCTOR
	//////////////////////////////////////////////////////////////////
	
    constructor()
    {
        super();
    }
    
    
    //////////////////////////////////////////////////////////////////
	// ACTIVE CASES PAGE (main/non-modal)
	//////////////////////////////////////////////////////////////////
	
    // general page locators
    // use the js get syntax to bind the By as you would with classes in other languages
    get startANewCaseButtonToggleBy() { return By.xpath('//*[@id="start-new-case-button"]/div/div/button[2]'); }
    get startMultipleCasesBy() { return By.className("dropdown-item"); }
    get modalBy() { return By.xpath('//*[@class="modal-dialog"]'); }
    get multipleCasesTypeDropdownBy() { return By.className("select-input"); }
    get changeAPUBy() { return By.xpath('//div[@class="modal-body"]/div/div/select/option[text()="Change APU"]'); }
    get endApptBy() { return By.xpath('//div[@class="modal-body"]/div/div/select/option[text()="End Appointment"]'); }
    get reapptBy() { return By.xpath('//div[@class="modal-body"]/div/div/select/option[text()="Reappointment"]'); }
    get renewalBy() { return By.xpath('//div[@class="modal-body"]/div/div/select/option[text()="Renewal"]'); }
    get popupNextButtonBy() { return By.xpath('//button[text()="Next"]'); }
    get modalExportButtonBy() { return By.xpath('//div[@class="modal-body"]/div/div/div[1]/button[text()="Export To Excel"]'); }
    
    
    //////////////////////////////////////////////////////////////////
	// MAIN/NON-MODAL PAGE
	//////////////////////////////////////////////////////////////////
	
	// get Start Multiple Cases menu
	getStartMultipleCasesMenu = async (loggingPrefix, driver) =>
	{
	    // first click caret next to "Start a New Case" button so "Start Multiple Cases" button will show.
		await driver.wait(until.elementLocated(this.startANewCaseButtonToggleBy), 10000);
		let startANewCaseButtonToggle = driver.findElement(this.startANewCaseButtonToggleBy);
		await startANewCaseButtonToggle.click();
		logThis(loggingPrefix + " \"Start a New Case\" button toggle clicked");
	}
	
	// click "Start Multiple Cases" 
	clickStartMultipleCases = async (loggingPrefix, driver) =>
	{
	    // then click "Start Multiple Cases" option/nav
		await driver.wait(until.elementLocated(this.startMultipleCasesBy), 10000);
		let startMultipleCases = driver.findElement(this.startMultipleCasesBy);
		await startMultipleCases.click();
		logThis(loggingPrefix + "Start Multiple Cases  clicked");
	}
	
	// wait for modal
	waitForModal = async (loggingPrefix, driver) =>
	{
	    // before selecting Multiple Cases type, wait for modal to appear
        await driver.wait(until.elementLocated(this.modalBy), 10000);
    }
    
    // click Multiple Cases dropdown
    clickMultipleCasesDropdown = async (loggingPrefix, driver) =>
	{
		await driver.wait(until.elementLocated(this.multipleCasesTypeDropdownBy), 10000);
		let multipleCasesTypeDropdown = driver.findElement(this.multipleCasesTypeDropdownBy);
		await multipleCasesTypeDropdown.click();
		logThis(loggingPrefix + "Multiple Cases type dropdown clicked");
	}
	
	// select "Change APU"
	selectChangeAPU = async (loggingPrefix, driver) =>
	{
		let changeAPUOption= driver.findElement(this.changeAPUBy);
		await changeAPUOption.click();
		logThis(loggingPrefix + "\"Change APU\" selected");
	}
	
	// select "BulkEndAppt"
	selectBulkEndAppt = async (loggingPrefix, driver) =>
	{
		let endAppointmentOption= driver.findElement(this.endApptBy);
		await endAppointmentOption.click();
		logThis(loggingPrefix + "\"End Appointment\" selected");
	}
	
	// select "BulkReappt"
	selectBulkReappt = async (loggingPrefix, driver) =>
	{
		let reappointmentOption= driver.findElement(this.reapptBy);
		await reappointmentOption.click();
		logThis(loggingPrefix + "\"Reappointment\" selected");
	}

	// select "BulkRenewal"
	selectBulkRenewal = async (loggingPrefix, driver) =>
	{
		let renewalOption= driver.findElement(this.renewalBy);
		await renewalOption.click();
		logThis(loggingPrefix + "\"Renewal\" selected");
	}
	
	// click modal Next button
	clickModalNextButton = async (loggingPrefix, driver) =>
	{
		await driver.wait(until.elementLocated(this.popupNextButtonBy), 10000);
		let nextButton = driver.findElement(this.popupNextButtonBy);
		await nextButton.click();
		logThis(loggingPrefix + "modal Next button clicked");
	}
	
	// click modal export button
	clickModalExportButton = async (loggingPrefix, driver) =>
	{
		let exportButton = await driver.wait(until.elementLocated(this.modalExportButtonBy), 30000);
		logThis(loggingPrefix + "modal export button located");
		exportButton.click();
		logThis(loggingPrefix + "modal export button clicked, downloading file...");
	}

}

module.exports = ActiveCasesPage;