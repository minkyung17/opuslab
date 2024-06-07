const {By, Key, until} = require('selenium-webdriver');

var countUpTime = 0;

addLeading0ToShortFormatCurrentDate = (loggingPrefix, shortFormatCurrentDate) =>
{
	// add 0 to front of date if single digit since short form cuts off leading 0
	if(shortFormatCurrentDate.length < 10)
	{
	    logThis(loggingPrefix + "current date short form: " + shortFormatCurrentDate + "..."); // before
		shortFormatCurrentDate = "0" + shortFormatCurrentDate;
		logThis(loggingPrefix + "was converted to: " + shortFormatCurrentDate); // after
	}
	
	return shortFormatCurrentDate;
}

convertToXRAYJSONFormat = (date) =>
{
    /*
    * formats a date that's compatible with xray's json format
    */
    
    let isoStringPlusOffset = date.toISOString().replace("Z", "") + "-0" + date.getTimezoneOffset()/60 + ":00";
    
    return isoStringPlusOffset;
}

countUp = (loggingPrefix, startSecond) =>
{
    // example of how to use this method in Profile 001: MODAL SAVE BUTTON
    
    // as long as countup isn't just starting, clear line so only one shows status
    if(countUpTime !== 0)
    {
        // clear line for next message
		process.stdout.clearLine();
		process.stdout.cursorTo(0);
    }
    
	// print message
	process.stdout.write(loggingPrefix + "waiting " + countUpTime + "s");

	// increase global object variable to increase elapsed time
	countUpTime += 1;
}

formatTime = (date) =>
{
    // take date object and format for printing to console
	var currentTime = new Date();
	let currentHour = currentTime.getHours() < 10 ? "0" + currentTime.getHours() : currentTime.getHours();
	let currentMinutes = currentTime.getMinutes() < 10 ? "0" + currentTime.getMinutes() : currentTime.getMinutes();
	let currentSeconds = currentTime.getSeconds() < 10 ? "0" + currentTime.getSeconds() : currentTime.getSeconds();
	
	return (currentHour + ":" + currentMinutes + ":" + currentSeconds);
}


getCurrentDate224 = (loggingPrefix) =>
{
	let currentDate = new Date().toLocaleDateString("en-US", {month:"2-digit", day:"2-digit", year:"numeric"});
	logThis(loggingPrefix + "current date is: " + currentDate);
	
	return currentDate;
}

printTestRunTime = async (loggingPrefix, testStartTime, testEndTime) =>
{
    // print time test finishes
    logThis(loggingPrefix + "individual test finished at: " + formatTime(testEndTime));

	// print test run time
	let runTimeMilliseconds = testEndTime - testStartTime; // total ms of individual run
	let runTimeSeconds = runTimeMilliseconds / 1000; // total seconds of individual run
	let runTimeMinutes = (runTimeSeconds/60) >= 1 ? Math.floor(runTimeSeconds/60) : "0";
	logThis(loggingPrefix + "test finished in: " + runTimeMinutes + "m " + (runTimeSeconds % 60) + "s");
}

printBulkjobRunTime = async (overallStartTime) =>
{
    // print bulk job run time
    const overallFinishTime = new Date();
    let runTimeMilliseconds = overallFinishTime - overallStartTime; // total ms of individual run
    let runTimeSeconds = runTimeMilliseconds / 1000; // total seconds of individual run
    let runTimeMinutes = (runTimeSeconds/60) >= 1 ? Math.floor(runTimeSeconds/60) : "0";
    logThis("marathon finished in: " + runTimeMinutes + "m " + (runTimeSeconds % 60) + "s");
}

showElapsedTime = async (loggingPrefix, driver, stopElementBy) =>
{
    // when stopElementBy parameter is located, elapsed time display will stop
    let elapsedCounter = setInterval(countUp, 1000, loggingPrefix, countUpTime);
	
	try
	{
	    // stop elapsed time display when element located
		await driver.wait(until.elementLocated(stopElementBy), 60000);
		process.stdout.write("\n"); // start new line after stopping countup
		clearInterval(elapsedCounter); // stop countup for save button when success/fail modal appears
	}
	catch(err)
	{
	    // stop counter since won't clear if element isn't found
	    clearInterval(elapsedCounter);
	    process.stdout.write("\n");
	    logThis(loggingPrefix + "stop element wasn't found");
	    
	    // reset counter
	    countUpTime = 0;
	}
}

module.exports =
{
    // define what should be accessible by other scripts
    convertToXRAYJSONFormat,
    countUp,
    countUpTime,
    formatTime,
    getCurrentDate224,
    printBulkjobRunTime,
    printTestRunTime,
    showElapsedTime
};
