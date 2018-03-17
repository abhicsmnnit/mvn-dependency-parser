const fs = require('fs');

const request = require('request');
const cheerio = require('cheerio');
const parseString = require('xml2js').parseString;

const filename = process.argv[2];

if (filename === undefined) {
    console.log("Please provide the path to your pom.xml file.");
    return;
}

fs.readFile(filename, 'utf8', (err, xml) => {
    parseString(xml, function (err, result) {
        result.project.dependencies[0].dependency.forEach(element => {
            request({
                url: `https://mvnrepository.com/artifact/${element.groupId}/${element.artifactId}`
            }, (error, response, body) => {
                try {
                    const $ = cheerio.load(body);
                    const latestVersion = $('a.vbtn')[0].children[0].data;
                    console.log(`${element.groupId},${element.artifactId},${element.version},${latestVersion}`);
                }
                catch (err) {
                    // Choose what you want to do:
                    // console.error(`Can't fetch for ${element.groupId},${element.artifactId}`);
                    // console.log(`${element.groupId},${element.artifactId},${element.version}`);
                }
            });
        });
    });
});