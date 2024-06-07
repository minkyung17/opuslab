asyncForEach = async (array, callback) =>
{
	// this method is like a forEach but acts asynchronously to wait between array elements
	// modified from https://codeburst.io/javascript-async-await-with-foreach-b6ba62bbf404
	for (let index = 0; index < array.length; index++)
	{
		await callback(array[index]);
	}
}

module.exports =
{
    // define what should be accessible by other scripts
    asyncForEach
}