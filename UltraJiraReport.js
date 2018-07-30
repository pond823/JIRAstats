const lowercase = require('lower-case')
const csv = require('csvtojson')
const optionDefinitions = [
    { name: 'file', alias: 'f', type: String, defaultValue: 'JIRA.csv' },
    { name: 'verbose', alias: 'v', type: Boolean, defaultValue: false },

]
const commandLineArgs = require('command-line-args')
const firstLine = require('firstline')

var colors = require('colors');

const options = commandLineArgs(optionDefinitions)

var config = require('config');

var reports = config.get("reports");
reports.forEach(function (element) {

    element.itemCount = 0;
    element.pointsCount = 0;
    element.itemsWithPoints = 0;
    verboseLog(element)
});


verboseLog("Options used-".blue)
verboseLog(options)

//re-write headers that repeat the same name e.g. Label, Label becomes Label, Label1
firstLine(options.file, { lineEnding: '\n' }).then((line) => {
    var headers = line.split(`,`)
    var previous = ``
    var count = 1
    var arrayLength = headers.length;
    for (var i = 0; i < arrayLength; i++) {
        if (headers[i] == previous) {
            previous = headers[i]
            headers[i] = headers[i] + count.toString()
            count++
        } else {
            count = 1
            previous = headers[i]
        }
    }


    verboseLog("Headers used-")
    verboseLog(headers)

    extract(headers)
})

function extract(headersArray) {

    csv({ noheader: false, headers: headersArray })
        .fromFile(options.file)
        .on('json', (jsonObj) => {


            verboseLog("Processing " + jsonObj['Issue key'] + "\r")

            process(jsonObj)

        })
        .on('done', () => {
            reports.forEach(function (element) {

                console.log(element.title);
                console.log(`Tickets: ${element.itemCount}    Story Points: ${element.pointsCount}   Tickets With Points: ${element.itemsWithPoints} `.green)
                console.log();
            }
            )

        })
}



function process(data) {

    reports.forEach(function (report) {
        match = false
        verboseLog(`Report - ${report.title}`)
        match = matchAllFilterCatogories(report, data);
 
        if (match) {
            verboseLog(`Matched ${data[`Summary`]}`.blue)
            report.itemCount++;
            value = data[`Custom field (Story Points)`]
            if (value != ``) {
                report.pointsCount += parseInt(value);
                report.itemsWithPoints++;
            }
        }
    });
}

function verboseLog(msg) {
    if (options.verbose) {
        console.log(msg);
    }
}

function matchAllFilterCatogories(report, data) {
    var filterOn = report.filterOn;
    var match = true
    if (filterOn != undefined) {
        filterOn.forEach(function (filterElement) {
            var filterValues = report[filterElement];
            if (matchAnyFilterValue(filterElement, filterValues, data) != true) {
                match = false;
            }
        });
    }
    return match
}

function matchAnyFilterValue(filterElement, filterValues, data) {
    var match = false
    if (Array.isArray(filterValues)) {

        filterValues.forEach(function (value) {

            verboseLog(filterElement)
            if (lowercase(data[filterElement]) == lowercase(value)) {
                match = true;
                verboseLog(`++++ ${lowercase(data[filterElement])} == ${lowercase(value)}`)
            } else {
                verboseLog(`---- ${lowercase(data[filterElement])} != ${lowercase(value)}`)
            }

            for (i = 0; i < 5; i++) {
                namedColumn = filterElement + i.toString();
                if (data[namedColumn] != null) {
                    verboseLog(namedColumn)
                    if (lowercase(data[namedColumn]) == lowercase(value)) {
                        match = true;
                        verboseLog(`++++ ${lowercase(data[namedColumn])} == ${lowercase(value)}`)
                    } else {
                        verboseLog(`---- ${lowercase(data[namedColumn])} != ${lowercase(value)}`)
                    }
                } 
            }


        });
    }
    return match
}


