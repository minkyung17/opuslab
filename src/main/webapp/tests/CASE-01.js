// have npm/nodejs installed
// have selenium drivers installed for each browser to be tested
// run on command line using:
// node sample.js arg1 arg2


function runCasesTest() {
    const {Builder, By, Capabilities, Key, until} = require('selenium-webdriver');
    const chrome = require("selenium-webdriver/chrome");
    const firefox = require('selenium-webdriver/firefox');
	var assert = require('assert');

    // get args from command line
    const args = process.argv.slice(2);
    const role = args[1];
    console.log("entered role is: " + role);
    var intruder = false;
    
    // handle incorrect parameters
    if(args[1] == null)
    {
        console.log("incorrect parameters, try again");
        return;
    }
    
    // set up the WebDriver
    var driver = null;
    
    (async function opus() {
    try {
    
		//////////////////////////////////////////////////////////////////
		// BROWSER
		//////////////////////////////////////////////////////////////////
		
		    
		// open chrome in a private window
		if(args[0] == "chrome")
		{        
			// set up chrome options
			let chromeOptions = new chrome.Options()
				//.addArguments("headless")
				.addArguments("incognito");

		
			driver = await new Builder()
				.forBrowser('chrome')
				.setChromeOptions(chromeOptions)
				.build();
		}
		else if (args[0] == "firefox")
		{
			let fireFoxOptions = new firefox.Options()
				.addArguments("--headless")
				.addArguments("--private");
			
			driver = await new Builder()
				.forBrowser('firefox')
				.setFirefoxOptions(fireFoxOptions)
				.build();
		}
		else
		{
		    console.log('unknown browser');
		    return;
		}
		
    
		//////////////////////////////////////////////////////////////////
		// MFA
		//////////////////////////////////////////////////////////////////
		
		// load opus test site by url
		await driver.get('https://opustst.it.ucla.edu/');
		console.log("opus test site loaded");
		
		// click on sign in button to get to credentials page
		driver.findElement(By.linkText('Sign In')).click();
		console.log("clicked on sign in button, going to credentials page");
		
		if(role == "apo")
		{
		    // enter logon id
		    driver.findElement(By.id('logon')).sendKeys('opusapo');
		    console.log("logon id entered");
		    
		    // enter password
		    driver.findElement(By.id('pass')).sendKeys('38wilshire');
		    console.log("password entered");
		
		}
		/*
		else if(role == "da")
		{
		    // enter logon id
		    driver.findElement(By.id('logon')).sendKeys('opusda1');
		    console.log("logon id entered");
		    
		    // enter password
		    driver.findElement(By.id('pass')).sendKeys('229da979');
		    console.log("password entered");
		
		}
		*/
		/*
		else if(role == "cap")
		{
		    // enter logon id
		    driver.findElement(By.id('logon')).sendKeys('opusaa');
		    console.log("logon id entered");
		    
		    // enter password
		    driver.findElement(By.id('pass')).sendKeys('prof7941');
		    console.log("password entered");
		
		}
		*/
		else
		{
		    console.log("INTRUDER...exiting");
		    intruder = true;
		    return;
		}
		
		// click credentials submit button
		driver.findElement(By.className('primary-button')).click();
		console.log("credentials submit button clicked");
		
		// wait for title tag to be found
		await driver.wait(until.titleContains('Dashboard'), 30000);
		console.log("Dashboard loaded");
		
		
		//////////////////////////////////////////////////////////////////
		// DASHBOARD
		//////////////////////////////////////////////////////////////////
		
		// wait for title tag to be found
		let casesLink = await driver.wait(until.elementLocated(By.linkText('Cases')), 30000);
		console.log("Cases link found");
		
        // click on cases link
		casesLink.click();
		console.log("clicked on cases link, going to cases page...");
		
		
		//////////////////////////////////////////////////////////////////
		// CASES
		//////////////////////////////////////////////////////////////////
		
		// confirm page
		await driver.wait(until.titleIs('Active Cases'), 30000);
		console.log("on active cases page");
		
		// locate start a new case button
		let startNewCaseButton = await driver.wait(until.elementLocated(By.xpath('//button[@id="start-new-case-button"]')), 10000);
		console.log('"start a new case button" located');
		/*
		// wait for start a new case button to be visible
		await driver.wait(until.elementIsVisible(startNewCaseButton), 10000);
		console.log('"start a new case button" is visible');
		*/
		
		/*
		// click start a new case button
		setTimeout(function(){
		    startNewCaseButton.click();
		    console.log("clicked start a new case button");
		}, 5000);
		*/
		
		
		startNewCaseButton.click();
		console.log("clicked start a new case button");
		
		
		// first, wait for modal input to be visible
		//await driver.wait(until.elementIsVisible(driver.findElement(By.id('nameSearchAutocomplete'))), 10000);
		//console.log('modal input now visible');
		
		/*
		// in Start a Case modal, enter 'allen, walter'
		let nameSearchInput = await driver.wait(until.elementLocated(By.id("nameSearchAutocomplete")), 10000);
		nameSearchInput.sendKeys('allen, walter');
		console.log("entered 'allen, walter'");
		
        // select result
        await driver.wait(until.elementLocated(By.css('.ui-menu-item')), 10000).click();
        console.log("selected result");
        
        // click Next button
        driver.findElement(By.xpath('//button[text()="Next"]')).click();
        console.log("clicked Next button");
        
        // choose 'Appointment' from dropdown menu
        await driver.wait(until.elementLocated(By.xpath('//div[@class="modal-body"]/div/div/select/option[3]')), 10000).click();
        console.log("chose 'Appointment' from dropdown menu");
        
        // click Next button
        driver.findElement(By.xpath('//button[text()="Next"]')).click();
        console.log("clicked Next button");
        */        
    } 
	catch(error){
		console.error(error.message);
	}
	finally {
        // close browser window - ALWAYS end tests by closing browser window (use quit instead of close)
	    //await driver.quit();
    }
    }) ();

}

runCasesTest();
