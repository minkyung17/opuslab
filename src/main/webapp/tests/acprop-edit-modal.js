// have npm/nodejs installed
// have selenium drivers installed for each browser to be tested
// run on command line using:
// node sample.js arg1 arg2

// tests saving comments into acproposal edit modal

function runACProposalCommentTest() {


    const {Builder, By, Key, until} = require('selenium-webdriver');
	var assert = require('assert');

    // get args from command line
    const args = process.argv.slice(2);

    (async function example() {
    let driver = await new Builder().forBrowser(args[0]).build();
    try {
		//////////////////////////////////////////////////////////////////
		// 2FA
		//////////////////////////////////////////////////////////////////
		
		// load page by url
		await driver.get('https://aps-opus-web-d01.dev.it.ucla.edu/opusWeb/ui/dashboard/OA-dash.shtml');
		
		// enter logon id
		driver.findElement(By.id('logon')).sendKeys('opusadmin');
		console.log("logon id entered");
		
		// enter password
		driver.findElement(By.id('pass')).sendKeys('nq9gptst');
		console.log("password entered");
		
		// click submit
		driver.findElement(By.className('primary-button')).click();
		console.log("submit clicked");
		
		// wait for title tag to be found
		let element = await driver.wait(until.titleIs('Opus Admin Dashboard'), 30000);
		console.log("opus dashboard loaded!");
		
		//////////////////////////////////////////////////////////////////
		// AC PROPOSAL COMMENT
		//////////////////////////////////////////////////////////////////
		
		
        // load page by url
		await driver.get('https://aps-opus-web-d01.dev.it.ucla.edu/opusWeb/ui/admin/admin-comp-proposals-summary.shtml?adminCompId=566');
		console.log("Admin Comp Id page loaded");
		

		// open proposal edit modal
		let pencil = await driver.wait(until.elementLocated(By.xpath('//table[@class=" table table-bordered table-responsive"]/tbody/tr[1]/th[2]/span[2]/img')), 30000);
		setTimeout(function(){ pencil.click(); }, 3000);
		console.log("proposal edit modal opened");
		
		
		// enter text into textarea
		await driver.wait(until.elementLocated(By.className(' form-control comment-modal-field undefined '))).sendKeys('ac-proposal comment');
		console.log("text entered into comments box");
		
		// click save button
		await driver.findElement(By.xpath('//button[text()="Save"]')).click();
		console.log("modal save button clicked");
		
		console.log("AC Proposals comment testing successful!");
		
    } 
	catch(error){
		console.error(error.message);
		//console.log("there was an error");
	}
	finally {
        // close browser window
	    //await driver.quit();
	
    	/*
        assert(100 > 10, "Program finished!");
	    */
    }
    }) ();

}

runACProposalCommentTest();
