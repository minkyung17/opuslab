const {Builder, By, Key, until} = require('selenium-webdriver');
const webdriver = require('selenium-webdriver');
const chrome = require("selenium-webdriver/chrome");
const firefox = require('selenium-webdriver/firefox');

require('../libraries/DOWNLOADS');
require('../data/DOWNLOAD_DIRECTORIES');
require('../data/ENV');
require('../data/PAGE_PATHS');

// get args from command line after node and .js
const args = process.argv.slice(2);

// second-chance driver setup
var secondChanceGiven = false;

setUpDriver = async (loggingPrefix, driver) =>
{
    try
    {
		//////////////////////////////////////////////////////////////////
		// BROWSER SETUP
		//////////////////////////////////////////////////////////////////

        // declare capabilities
		const chromeCapabilities = webdriver.Capabilities.chrome();
		
		// set DOWNLOAD_DIRECTORY
		const downloadDirectory = getDownloadDirectory("DEFAULT") === null ? "/usr/local/bin" : getDownloadDirectory("DEFAULT");

		// build driver for specified browser
		if(args.includes("firefox"))
		{
			// define options
			if(headed === "headed")
			{
				fireFoxOptions = new firefox.Options()
				.addArguments("--private");
			}
			else
			{
				fireFoxOptions = new firefox.Options()
				.addArguments("--headless")
				.addArguments("--private");
			}
		
			logThis(loggingPrefix + "creating firefox instance...");
		
			driver = await new Builder()
				.forBrowser('firefox')
				.setFirefoxOptions(fireFoxOptions)
				.build();
		}
		else // default to chrome unless other browser specified
		{
			// define options
			if((args.includes("headed")))
			{
			    /* OLD WAY
				// set up chrome options
				chromeOptions = new chrome.Options()
				.addArguments("incognito");
				*/
				
				chromeCapabilities.set('goog:chromeOptions', {
					'prefs': {
					  'download': {
						'default_directory': downloadDirectory,
						'prompt_for_download': 'false'
					  }
					}
				});
			}
			else // chrome headless
			{
			    /* OLD WAY
				// set up chrome options
				chromeOptions = new chrome.Options()
				.addArguments("headless")
				.addArguments("incognito")
				.{
		            "download.default_directory": DOWNLOAD_DIRECTORY
		         };
		         */       

				chromeCapabilities.set('goog:chromeOptions', {
					'args': ['headless'],
					'prefs': {
					  'download': {
						'default_directory': downloadDirectory,
						'prompt_for_download': 'false'
					  }
					}
				});				
			}
		
			logThis(loggingPrefix + "creating chrome instance...");
		    
		    /* OLD WAY
			driver = await new Builder()
				.forBrowser('chrome')
				.setChromeOptions(chromeOptions) // alternate syntax: .setChromeOptions(new chrome.Options().headless())
				.build();
            */
            
            driver = await new Builder()
				    .forBrowser('chrome')
				    .withCapabilities(chromeCapabilities)
				    .build();
            
			await logThis(loggingPrefix + "driver has been set up");
		}
	}
	catch(error)
	{
	    // quit current driver since there was a problem
	    console.log(loggingPrefix + "PROBLEM CREATING BROWSER");
	    console.error(loggingPrefix + error.name);
		console.error(loggingPrefix + error.message);
		
		// second chances only
		if(secondChanceGiven == false)
		{
			// get back
			console.log(loggingPrefix + "TRYING BROWSER AGAIN...");
			setUpDriver(loggingPrefix, driver);
			secondChanceGiven = true;
		}
		else
		{
		    console.log(loggingPrefix + "recidivist browser >:(");
		    process.exit();
		}
	}
	return driver;
}

// gets full URL of page based on entered page and info in data store
getURL = async (loggingPrefix, driver, environment, pageToGetURLFor, role) =>
{
	/* role parameter is optional and for Dashboard multi-paths */
	
	// set up full path based on stored data
	const fullURL = getEnvironmentURL(environment) + getPagePath(pageToGetURLFor, role);
	logThis(loggingPrefix + "URL to get: " + fullURL);
	try
	{
		// load page by url (credentials page will intercept)
		await driver.get(fullURL);
		logThis(loggingPrefix + "getting page to check permission...");	
	}
	catch(error)
	{
	    logThis(loggingPrefix + "ERROR getting URL");
	    logThis(error);
	}
}

quit = async (driver) =>
{
    try
    {
		// close browser window - ALWAYS end tests by closing browser window (use quit instead of close)
		await driver.quit();
    }
    catch(error)
    {
        logThis("driver.quit call failed");
    }
}

module.exports =
{
    // define what should be accessible by other scripts
    setUpDriver,
    quit
};
