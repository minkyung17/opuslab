const fs = require("fs");

createKodakMoment = async (driver) =>
{
    // keep file names semi-distinct
    let date = new Date();
    
    let encodedString = await driver.takeScreenshot();
    await fs.writeFileSync(getDownloadDirectory("SCREEN") + "exhibit" + date.getHours() + date.getMinutes() + ".png", encodedString, "base64");
}

module.exports =
{
    // define what should be accessible by other scripts
    createKodakMoment
};
