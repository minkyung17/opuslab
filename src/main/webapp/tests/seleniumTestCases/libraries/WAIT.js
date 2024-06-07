wait = async (ms) =>
{
    // modified from https://www.w3schools.com/js/tryit.asp?filename=tryjs_async4
    let myPromise = new Promise(function(resolve) {
        setTimeout(function() {resolve("");}, ms);
    });
    await myPromise;
}

module.exports =
{
    // define what should be accessible by other scripts
    wait
};
