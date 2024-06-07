const {By, until} = require('selenium-webdriver');

const Page = require ('./PAGE');

require('../data/CREDENTIALS');

// this class doesn't reflect an actual page but is the generic form of a datatable that will be subclassed by the other pages that present datatables
class SignonPage extends Page
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
    get logonInputFieldBy() { return By.id('logon'); }
	get passwordInputFieldBy() { return By.id('pass'); }
	get credentialsSubmitButtonBy() { return By.className('primary-button'); }
	
	
	//////////////////////////////////////////////////////////////////
	// METHODS
	//////////////////////////////////////////////////////////////////
	
	// enter credentials
	enterCredentials = async (loggingPrefix, driver, role) =>
	{
		// wait for sign-on page to load before entering credentials
		this.isTitleCorrect(loggingPrefix, driver, "SignOn");
		
		// enter logon id
		await driver.wait(until.elementLocated(this.logonInputFieldBy), 30000);
		await driver.findElement(this.logonInputFieldBy).sendKeys(getLogonFor(role));
		logThis(loggingPrefix + "logon id entered: " + getLogonFor(role));
	
		// enter password
		await driver.wait(until.elementLocated(this.passwordInputFieldBy), 30000);
		await driver.findElement(this.passwordInputFieldBy).sendKeys(getPasswordFor(role));
		logThis(loggingPrefix + "password entered: " + getPasswordFor(role));
	
		// click credentials submit button
		await driver.wait(until.elementLocated(this.credentialsSubmitButtonBy), 30000);
		logThis(loggingPrefix + "credentials submit button clicked...");
		await driver.findElement(this.credentialsSubmitButtonBy).click();
	}

}

module.exports = SignonPage;