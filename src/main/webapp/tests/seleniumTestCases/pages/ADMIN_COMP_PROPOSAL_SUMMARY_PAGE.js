const DataTablePage = require ('./DATATABLE_PAGE');
const {By, Key, until} = require('selenium-webdriver');

class AdminCompProposalSummaryPage extends DataTablePage
{
    //////////////////////////////////////////////////////////////////
	// ADMIN COMP PROPOSALS SUMMARY PAGE (main/non-modal)
	//////////////////////////////////////////////////////////////////
	
    // use the js get syntax to bind the by as you would with classes in other languages
    // general page locators
    get adminCompSummaryTableHeaderBy() { return By.xpath('//*[@id="adminCompSummary"]/div/div/div/div/table[1]/tbody/tr[1]/th[1]'); }
    get proposedOrganizationNameBy() { return By.xpath('//*[text()="Organization Name"]/../td[2]'); }
    get proposedEditIconBy() { return By.xpath('//th[text()="Proposed "]/span[1]/img'); }
    get finalDecisionEditIconBy() { return By.xpath('//th[text()="Final Decision "]/span[1]/img'); }
    get trackingDatesEditIconBy() { return By.xpath('//h2[text()="Tracking Dates"]/span[1]/img'); }
    get proposedCommentIconBy() { return By.xpath('//th[text()="Proposed "]/div/span/div'); }
    get finalDecisionCommentIconBy() { return By.xpath('//th[text()="Final Decision "]/div/span/div'); }
    
	
	//////////////////////////////////////////////////////////////////
	// MODAL
	//////////////////////////////////////////////////////////////////
	
	// this get binding is used by Proposed modal, Final Decision modal, Tracking Dates, Proposed Comments modal since they have the same xpath
	get modalBy() { return By.xpath('//*[@role="document"]/div'); }
	get commentsModalHeaderBy() { return By.id('ModalHeader'); }
	
	
    //////////////////////////////////////////////////////////////////
	// CONSTRUCTOR
	//////////////////////////////////////////////////////////////////
	
    constructor()
    {
        super();
    }
    
    
    //////////////////////////////////////////////////////////////////
	// MAIN/NON-MODAL PAGE
	//////////////////////////////////////////////////////////////////
	
    // enter search term in input field
    getProposedOrganizationName = async (loggingPrefix, driver) =>
    {
		let proposedOrganizationName = await driver.wait(until.elementLocated(this.proposedOrganizationNameBy), 15000);
		let proposedOrganizationNameText = await proposedOrganizationName.getText();
		logThis(loggingPrefix + "Organization Name in Proposed column is: " + proposedOrganizationNameText);
    }
    
    clickProposedEditIcon = async (loggingPrefix, driver) =>
    {
        // click on edit icon in summary page to get proposed modal
		let summaryEditIcon = await driver.wait(until.elementLocated(this.proposedEditIconBy), 30000);
		
		// avoid ElementNotInteractableError
		await driver.wait(until.elementIsVisible(summaryEditIcon), 20000);
		logThis(loggingPrefix + "Proposed edit icon visible");
		
		await summaryEditIcon.click();
		logThis(loggingPrefix + "edit icon on summary page clicked");
    }
    
    // check for modal (used for both Proposed and Final Decision tests)
    checkForModal = async (loggingPrefix, driver) =>
    {
		await driver.wait(until.elementLocated(this.modalBy), 20000);
		logThis(loggingPrefix + "modal located");
	}
	
	// on summary page, click final decision edit icon to get modal
	clickFinalDecisionEditIcon = async (loggingPrefix, driver) =>
	{
		await driver.wait(until.elementLocated(this.finalDecisionEditIconBy), 20000);
		let finalDecisionEditIcon = driver.findElement(this.finalDecisionEditIconBy);
		
		// avoid elementnotinteractable error
		await driver.executeScript('arguments[0].scrollIntoView();', finalDecisionEditIcon);
		await driver.wait(until.elementIsVisible(finalDecisionEditIcon), 20000);
		logThis(loggingPrefix + "Final edit icon visible");
		
		await finalDecisionEditIcon.click();
		logThis(loggingPrefix + "Final Decision edit icon on summary page clicked");
	}
	
	// on summary page, click final decision edit icon to get modal
	clickTrackingDatesEditIcon = async (loggingPrefix, driver) =>
	{
		// click on edit icon in summary page to get tracking dates modal
		await driver.wait(until.elementLocated(this.trackingDatesEditIconBy), 30000);
		logThis(loggingPrefix + "tracking dates edit icon located");
		let trackingDatesEditIcon = await driver.findElement(this.trackingDatesEditIconBy);
		
		// avoid elementnotinteractable error
		await driver.executeScript("arguments[0].scrollIntoView()", trackingDatesEditIcon);
		logThis(loggingPrefix + "tracking dates edit icon scrolled into view");
		await driver.wait(until.elementIsVisible(trackingDatesEditIcon), 20000);
		logThis(loggingPrefix + "tracking dates edit icon visible");
		
		await trackingDatesEditIcon.click();
		logThis(loggingPrefix + "tracking dates edit icon on summary page clicked");
	}
	
	// on summary page, click proposed comments icon
	clickProposedCommentsIcon = async (loggingPrefix, driver) =>
	{
		// click on comment icon for proposed in summary page
		await driver.wait(until.elementLocated(this.proposedCommentIconBy), 10000);
		let proposedCommentIcon = await driver.findElement(this.proposedCommentIconBy);
		
		// avoid click intercept error
		await driver.executeScript("arguments[0].scrollIntoView()", proposedCommentIcon);
		
		await proposedCommentIcon.click();
		logThis(loggingPrefix + "comment icon for Proposed on summary page clicked");
	}
	
	// on comments modal, get what title says (used for both proposed and final decision)
	getCommentsModalTitleText = async (loggingPrefix, driver) =>
	{
        // check for modal title
		await driver.wait(until.elementLocated(this.commentsModalHeaderBy));
		logThis(loggingPrefix + "modal header located");
		
		let modalTitle = await driver.findElement(this.commentsModalHeaderBy);
		let modalTitleText = await modalTitle.getText();
		logThis(loggingPrefix + "modal title is: " + modalTitleText);
		
		return modalTitleText;
	}
	
	// on summary page, click final decision comments icon
	clickFinalDecisionCommentsIcon = async (loggingPrefix, driver) =>
	{
        // click on comment icon for final decision in summary page
		await driver.wait(until.elementLocated(this.finalDecisionCommentIconBy), 10000);
		let finalDecisionCommentIcon = await driver.findElement(this.finalDecisionCommentIconBy);
		
		// avoid click intercept error
		await driver.executeScript("arguments[0].scrollIntoView();", finalDecisionCommentIcon);
		
		await finalDecisionCommentIcon.click();
		logThis(loggingPrefix + "comment icon for Final Decision on Summary page clicked");
	}
}

module.exports = AdminCompProposalSummaryPage;