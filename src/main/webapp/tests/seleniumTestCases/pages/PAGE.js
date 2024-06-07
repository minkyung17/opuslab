// this is the most generic object that represents a page/window
// all other basic pages are based on this basic template
const {until} = require('selenium-webdriver');

require('../data/PAGE_TITLES');
require('../libraries/SCREENSHOT');

class Page
{
    //////////////////////////////////////////////////////////////////
	// CONSTRUCTOR
	//////////////////////////////////////////////////////////////////
	
    constructor()
    {
    }
    
    
	//////////////////////////////////////////////////////////////////
	// METHODS
	//////////////////////////////////////////////////////////////////
	
	changeTab = async (loggingPrefix, driver, pageToCheckFor) =>
	{
		//Store the ID of the original window
		const originalWindow = await driver.getWindowHandle();

		//Wait for the new window or tab
		await driver.wait(
			async () => (await driver.getAllWindowHandles()).length === 2,
			10000
		  );

		//Loop through until we find a new window handle
		const windows = await driver.getAllWindowHandles();
		windows.forEach(async handle => {
		  if (handle !== originalWindow) {
			await driver.switchTo().window(handle);
		
			logThis(loggingPrefix + "switched to window handle: " + handle);
		  }
		});

		// wait for the new tab to finish loading content (title as proxy)
		await this.isTitleCorrect(loggingPrefix, driver, pageToCheckFor);
		logThis(loggingPrefix + "title is now: " + await driver.getTitle());
	
		return;
	}
	
	isTitleCorrect = async (loggingPrefix, driver, pageToCheckFor) =>
	{
	    try
	    {
	        // get the expected page title from stored data
			const pageTitle = getPageTitle(pageToCheckFor);
			logThis(loggingPrefix + "expected partial/whole page title: " + pageTitle);
			logThis(loggingPrefix + "waiting for page to load...");
			
			// wait for page title to appear
			await driver.wait(until.titleContains(pageTitle), 60000);
			logThis(loggingPrefix + "current page title is: " + await driver.getTitle());
			logThis(loggingPrefix + pageToCheckFor + " page loaded");	    
			
			return true;
	    }
	    catch(error)
	    {
	        logThis(loggingPrefix + "ERROR on title check");
	        logThis(loggingPrefix + "current page title is: " + await driver.getTitle());
	        logThis(loggingPrefix + "creating kodak moment...");
	        await createKodakMoment(driver);
	        logThis(error);
	        process.exit();
	    }
	}

	maximizeWindow = async (loggingPrefix, driver) =>
	{
        // maximize window size, usually to avoid element not interactable error
		await driver.manage().window().maximize();
		logThis(loggingPrefix + "window maximized");
	}
	
	setPageDimensions = async (loggingPrefix, driver, height, width) =>
	{
	    await driver.manage().window().setRect({ width: width, height: height });
	    logThis(loggingPrefix + "page/window size has been changed to: " + width + "(width) x " + height + "(height)");
	}
}

module.exports = Page;