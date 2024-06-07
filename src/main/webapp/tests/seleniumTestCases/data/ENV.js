// this is a general file that operates above both Otto and the manual test for Tammy because it sets the environment to test against in both cases

const environmentMap = new Map();

environmentMap.set("DEV", "https://aps-opus-web-d01.dev.it.ucla.edu");
environmentMap.set("STAGE", "https://stage.opus.ucla.edu");
environmentMap.set("TEST", "https://opustst.it.ucla.edu");


getEnvironmentURL = (environmentToGetFor) =>
{
	const environmentURL = environmentMap.get(environmentToGetFor);
	
	return environmentURL;
}

module.exports =
{
    // define what should be accessible by other scripts
    getEnvironmentURL
};