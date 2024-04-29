const fs = require("fs-extra");

try
{
    fs.ensureDir("tests-results");
    fs.emptyDir("tests-results");
}
catch (error)
{
    console.log("Folder not created! " + error)
}