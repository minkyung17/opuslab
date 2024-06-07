const Page = require ('./PAGE');
const {By, Key, until} = require('selenium-webdriver');

class CaseSummaryPage extends Page
{
    //////////////////////////////////////////////////////////////////
	// CONSTRUCTOR
	//////////////////////////////////////////////////////////////////
	
    constructor()
    {
        super();
    }
    
    
    //////////////////////////////////////////////////////////////////
	// CASE SUMMARY PAGE (main/non-modal)
	//////////////////////////////////////////////////////////////////
	
    // general page locators
    // use the js get syntax to bind the By as you would with classes in other languages
    get caseSummaryHeaderBy() { return By.xpath('//h1[text()=" Case Summary "]'); }
    get reviewProcessLinkBy() { return By.name("reviewProcess"); }
    get enterInterfolioPacketIDLinkBy() { return By.xpath('//*[@id="reactCaseSummary"]/div/div[2]/div[2]/div/p[7]/a'); }
    
    
    //////////////////////////////////////////////////////////////////
	// MAIN/NON-MODAL PAGE
	//////////////////////////////////////////////////////////////////
	
    // check for data to make sure page has fully loaded
    waitForPageToLoad = async (loggingPrefix, driver) =>
    {
		// using the Case Summary header as a proxy for the page fully loading
		await driver.wait(until.elementLocated(this.caseSummaryHeaderBy), 20000);
		logThis(loggingPrefix + "Profile data page loaded (Case Summary header used as proxy)");
    }
    
     // click on ReviewProcess link
     clickReviewProcessLink = async (loggingPrefix, driver) =>
     {
        // page fully loaded, so click on ReviewProcess link
		await driver.wait(until.elementLocated(this.reviewProcessLinkBy), 20000);
		let reviewProcessLink = await driver.findElement(this.reviewProcessLinkBy);
		reviewProcessLink.click();
		logThis(loggingPrefix + "Review Process link clicked");
     }
     
    // check for "Enter an Interfolio Packet ID" link
    checkForEnterInterfolioPacketIDLink = async (loggingPrefix, driver) =>
    {
    
        try
        {
			// show wait time elapsed since saving will take time
		    showElapsedTime(loggingPrefix, driver, this.enterInterfolioPacketIDLinkBy);
		    
		    // check for "Enter an Interfolio Packet ID" link
			await driver.wait(until.elementLocated(this.enterInterfolioPacketIDLinkBy), 10000);
			logThis(loggingPrefix + "\"Enter an Interfolio Packet ID\" link found");    
			return "access";
        }
        catch(error)
        {
            logThis(loggingPrefix + "timeout error finding Interfolio Packet ID link");
            return "denied";
        }

    }
}

module.exports = CaseSummaryPage;