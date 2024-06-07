runAllTests = async (allRoles, allPages, takeMyOrder, overallStartTime) =>
{
    // for each role, test all pages
    await asyncForEach(allRoles, async role =>
    {
        await asyncForEach(allPages, async testPage =>
        {
             await takeMyOrder(role, testPage);
        });
    });
	
	// this is for printing end time stats
	await wait(3000);
	
	// print overall run time
    await printBulkjobRunTime(overallStartTime);
}

runAllPagesForGivenRoles = async (allRoles, takeMyOrder, overallStartTime) =>
{
    await asyncForEach(allRoles, role => takeMyOrder(role, testPage));
	
	// this is for printing end time stats
	await wait(3000);
	
	// print overall run time
    await printBulkjobRunTime(overallStartTime);
}

runMiniBatchTestsForGivenRoles = async (enteredRole, enteredTestPage, takeMyOrder, overallStartTime) =>
{
    // get individual pages
    let testPages = enteredTestPage.split(",");
   
	// loop through all tests specified by the parameter (inclusive) consecutively (e.g. 3-5 means run 3, 4, 5)
	await asyncForEach(testPages, async testPage =>
	{
	    // get individual roles
	    let allRoles = enteredRole.split(",");
	    
	    await asyncForEach(allRoles, async role =>
        {
            logThis("mini-batch test page: " + testPage);
		    await takeMyOrder(role, testPage);
        });
        
		
	});

    // this is for printing end time stats
    await wait(5000);
    
    // print overall run time
    await printBulkjobRunTime(overallStartTime);
}

determineRunType = (roleOrTestPage) =>
{
    // run tests based on role parameter entered
	if(roleOrTestPage.includes(",")) // a mini-batch run
	{
		logThis("runType: mini-batch...combo plate!");
		runType = "mini-batch";
	}
    else // a single test or full-batch run
    {
		if(roleOrTestPage == "all") // full-batch run
		{
			// run all tests
			logThis("runType: all");
			runType = "all";
		}
		else // a single test
		{
			logThis("runType: single");
			runType = "single";
		}
    }
    return runType;
}

executeRunOrder = (runType, allRolesToTest, allPages, enteredRole, enteredTestPage, takeMyOrder, overallStartTime) =>
{
	// run tests according to command entered
	if(runType === "all")
	{
		runAllTests(allRolesToTest, allPages, takeMyOrder, overallStartTime);
	}
	else if(runType === "mini-batch")
	{
		async function runMiniBatch()
		{
			await runMiniBatchTestsForGivenRoles(enteredRole, enteredTestPage, takeMyOrder, overallStartTime);
		}
		runMiniBatch();
	}
	else if(runType === "single")
	{
		takeMyOrder(enteredRole, enteredTestPage);
	}
}

module.exports =
{
    // define what should be accessible by other scripts
    determineRunType,
    executeRunOrder,
    runAllPagesForGivenRoles,
    runMiniBatchTestsForGivenRoles,
    runAllTests
};
