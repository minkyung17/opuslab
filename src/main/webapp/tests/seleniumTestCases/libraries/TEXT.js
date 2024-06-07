escapeCommas = (text) =>
{
	if(text.includes(","))
	{
		text = '"' + text + '"';
	}

	return text;
}

isAToZ = (textArray) =>
{
    logThis("entered array: " + textArray);
    
    var isAscending = true;
    
    for(let i = 0; i < textArray.length - 1; i++)
    {
		logThis("index:      " + i);
        logThis("this element: " + textArray[i]);
		logThis("next element: " + textArray[i + 1]);
		 
		if(textArray[i] > textArray[i + 1]) // is descending
		{
			logThis("-----");
			logThis("next element: " + textArray[i + 1]);
			logThis("is descending");
			isAscending = false; // is not ascending
			break; // don't process any more once descending
		}
    }
    return isAscending;
}

isZToA = (textArray) =>
{
    logThis("entered array: " + textArray);
    
    var isDescending = true;
    
    for(let i = 0; i < textArray.length - 1; i++)
    {
		logThis("index:      " + i);
        logThis("this element: " + textArray[i]);
		logThis("next element: " + textArray[i + 1]);
		 
		if(textArray[i] < textArray[i + 1]) // is ascending
		{
			logThis("-----");
			logThis("next element: " + textArray[i + 1]);
			logThis("is ascending");
			isDescending = false; // is not descending
			break; // don't process any more once ascending
		}
    }
    return isDescending;
}

module.exports =
{
    // define what should be accessible by other scripts
    isAToZ,
    isZToA
};
