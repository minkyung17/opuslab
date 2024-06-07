const {Builder, By, Key, until} = require('selenium-webdriver');

checkForErrorPage = async (loggingPrefix, driver) =>
{
    logThis(loggingPrefix + "doing initial permissions check");
    
    // this function checks the page title after  * seconds
    await wait(10000);
    let currentTitle = null;
	const errorTitle = "Access to this Page Error";
	
	// get title of page it's on after waiting
	currentTitle = await driver.getTitle();
	logThis(loggingPrefix + "page title after waiting: " + currentTitle);

	if(currentTitle == errorTitle)
	{
		logThis(loggingPrefix + "RESULT: DENIED");
		return "denied";
	}
	else
	{
		logThis(loggingPrefix + "RESULT: ACCESS");
		return "access";
	}
}


module.exports =
{
    // define what should be accessible by other scripts  
    checkForErrorPage    
};
