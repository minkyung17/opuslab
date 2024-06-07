const DataTablePage = require ('./DATATABLE_PAGE');
const {By, Key, until} = require('selenium-webdriver');

class RequestAUIDPage extends DataTablePage
{
    //////////////////////////////////////////////////////////////////
	// CONSTRUCTOR
	//////////////////////////////////////////////////////////////////
	
    constructor()
    {
        super();
    }
    
    
    //////////////////////////////////////////////////////////////////
	// REQUEST A UID PAGE (main/non-modal)
	//////////////////////////////////////////////////////////////////
	
    // general page locators
    // use the js get syntax to bind the By as you would with classes in other languages	
}

module.exports = RequestAUIDPage;