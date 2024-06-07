// have npm/nodejs installed
// have selenium drivers installed for each browser to be tested
// run on command line using:
// node sample.js arg1 arg2


function runEligibilityTest() {


    const {Builder, By, Key, until} = require('selenium-webdriver');
    const chrome = require("selenium-webdriver/chrome");
    const firefox = require('selenium-webdriver/firefox');
	var assert = require('assert');

    // get args from command line
    const args = process.argv.slice(2);
    const role = args[1];
    console.log("entered role is: " + role);
    
    // handle incorrect parameters
    if(args[1] == null)
    {
        console.log("incorrect parameters, try again");
        return;
    }
    
    // set up the WebDriver
    var driver = null;
    
    // open chrome in a private window
    if(args[0] === "chrome")
    {
        // var driver = new webdriver.Builder().withCapabilities(options.toCapabilities()).build();
        
        // JAVA code
        // DesiredCapabilities capabilities = DesiredCapabilities.chrome();
        // ChromeOptions options = new ChromeOptions();
        // options.addArguments("incognito");
        // capabilities.setCapability(ChromeOptions.CAPABILITY, options);
        
        // FirefoxProfile firefoxProfile = new FirefoxProfile();    
        // firefoxProfile.setPreference("browser.privatebrowsing.autostart", true);
        
        // set up chrome options
        let chromeOptions = new chrome.Options()
            .addArguments("incognito");
        
        driver = new Builder()
            .forBrowser('chrome')
            //.setChromeOptions(new chrome.Options().headless())
            .setChromeOptions(chromeOptions)
            .build();
    }
    if (args[0] === "firefox")
    {
        let fireFoxOptions = new firefox.Options()
        .addArguments("private");
        //options.headless();
            
        driver = new Builder()
            .forBrowser('firefox')
            .setFirefoxOptions(fireFoxOptions)
            .build();
    }
    
    (async function example() {
    //let driver = await new Builder().forBrowser(args[0]).withCapabilities(options.toCapabilities()).build();
    try {
		//////////////////////////////////////////////////////////////////
		// 2FA
		//////////////////////////////////////////////////////////////////
		
		// load page by url
		await driver.get('https://opustst.it.ucla.edu/opusWeb/ui/dashboard/OA-dash.shtml');
		
		if(role == "admin")
		{
		    // enter logon id
		    driver.findElement(By.id('logon')).sendKeys('opusadmin');
		    console.log("logon id entered");
		    
		    // enter password
		    driver.findElement(By.id('pass')).sendKeys('nq9gptst');
		    console.log("password entered");
		
		}
		else if(role == "apo")
		{
		    // enter logon id
		    driver.findElement(By.id('logon')).sendKeys('opusapo');
		    console.log("logon id entered");
		    
		    // enter password
		    driver.findElement(By.id('pass')).sendKeys('38wilshire');
		    console.log("password entered");
		
		}
		else
		{
		    console.log("INTRUDER...exiting");
		    return;
		}
		
		// click submit
		driver.findElement(By.className('primary-button')).click();
		console.log("submit clicked");
		
		// wait for title tag to be found
	      let element = await driver.wait(until.titleIs('Opus Admin Dashboard'), 30000);
		console.log("dev dashboard loaded");
		
		//////////////////////////////////////////////////////////////////
		// ELIGIBILITY
		//////////////////////////////////////////////////////////////////
		
		
        // load page by url
		await driver.get('https://opustst.it.ucla.edu/opusWeb/ui/admin/eligibility.shtml');
		console.log("Eligibility page loaded");
		
		// enter text into textarea
		let searchField = await driver.wait(until.elementLocated(By.className('form-control search-field search-name  ')));
		setTimeout(function(){ searchField.sendKeys('wer'); }, 5000);
		console.log("text entered into name search box");
		
		// click view select dropdown
		let dropdown = await driver.wait(until.elementLocated(By.id('dropdown-basic-0')));
		setTimeout(function(){ dropdown.click(); }, 5000);
		console.log("view select dropdown clicked");
		
		// click save new view link
		let saveViewLink = await driver.wait(until.elementLocated(By.linkText("Save Table Settings as New View")));
		setTimeout(function(){ saveViewLink.click(); }, 2000);
		console.log("new view link clicked");
		
		// type new name in input
		let saveViewInput = await driver.wait(until.elementLocated(By.xpath('//div[@class="modal-body"]/span/form/input')), 30000);
		setTimeout(function(){ saveViewInput.sendKeys('selenium-test-view'); }, 4000);
		console.log("name entered in new view input field");
		
		// click save button on new view name modal
		let modalSaveButton = await driver.wait(until.elementLocated(By.xpath('//button[text()="Save"]')));
		setTimeout(function(){ modalSaveButton.click(); }, 5000);
		console.log("modal save button clicked");
		
		// CHECK: click view select dropdown
		let dropdownCHECK = await driver.wait(until.elementLocated(By.id('dropdown-basic-0')));
		setTimeout(function(){ dropdown.click(); }, 10000);
		console.log("view select dropdown clicked");
		
		let checkView = await driver.wait(until.elementLocated(By.linkText("selenium-test-view")));
		console.log("CONFIRMED NEW VIEW CREATED: view ('selenium-test-view') is there");
		
		// return to dashboard
		await driver.get('https://opustst.it.ucla.edu/opusWeb/ui/dashboard/OA-dash.shtml');
		console.log("once again, dev dashboard loaded");
		
		// return to eligibility page
		await driver.get('https://opustst.it.ucla.edu/opusWeb/ui/admin/eligibility.shtml');
		console.log("once again, Eligibility page loaded");
		
		// again, click view select dropdown
		let dropdown2 = await driver.wait(until.elementLocated(By.id('dropdown-basic-0')), 10000);
		setTimeout(function(){ dropdown2.click(); }, 5000);
		console.log("once again, view select dropdown clicked");
		
		// click the name of the test view so saved settings appear 
		let previousViewLink = await driver.wait(until.elementLocated(By.xpath('//span[text()="selenium-test-view"]')), 10000);
		previousViewLink.click();
		console.log("selected the view previously saved");
		
		setTimeout(function(){ console.log("eligibility test completed SUCCESSFULLY"); }, 2000);
		
		//////////////////////////////////////////////////////////////////
		// CLEANUP: DELETING NEWLY CREATED VIEW FOR FUTURE RUNS
		//////////////////////////////////////////////////////////////////
		
		/*
		// click view select dropdown
		let dropdown3 = await driver.wait(until.elementLocated(By.id('dropdown-basic-0')), 10000);
		setTimeout(function(){ dropdown3.click(); }, 4000); // to account for toast/modal
		console.log("CLEANUP: view select dropdown clicked");
		
		// click delete icon for view
		let deleteIcon = await driver.wait(until.elementLocated(By.xpath('//ul[@role="menu"]/li[2]/a/span[2]/span[1]/img')), 5000).click();
		console.log("CLEANUP: delete icon clicked");
		
		let deleteButton = await driver.wait(until.elementLocated(By.xpath('//button[text()="Save"]')), 5000).click();
		console.log("CLEANUP: modal delete button clicked");
		
		// don't exit until everything done
		setTimeout(function(){  }, 5000); 
		*/
    } 
	catch(error){
		console.error(error.message);
	}
	finally {
        // close browser window - ALWAYS end tests by closing browser window (use quit instead of close)
	    await driver.quit();
	
    	
    }
    }) ();

}

runEligibilityTest();
