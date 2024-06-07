compareWithExpectedResult = async (loggingPrefix, rawResult, expectedResult) =>
{
    logThis(loggingPrefix + "raw result     : " + rawResult);
    logThis(loggingPrefix + "expected result: " + expectedResult);
    
	// print judgement
	if(rawResult === expectedResult)
	{
		logThis(loggingPrefix + "***PASSED***");
		return "passed";
	}
	else
	{
		logThis(loggingPrefix + "***FAILED***");
		return "FAILED";
	}
}

module.exports =
{
    // define what should be accessible by other scripts
    compareWithExpectedResult
};
