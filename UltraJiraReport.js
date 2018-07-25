const lowercase = require('lower-case')
const csv=require('csvtojson')
const optionDefinitions = [
    { name: 'file', alias: 'f', type: String, defaultValue:'JIRA.csv' },
    { name: 'verbose', alias: 'v', type: Boolean, defaultValue:false},
    
  ]
const commandLineArgs = require('command-line-args')
const firstLine = require('firstline')

const options = commandLineArgs(optionDefinitions)  

var config = require('config');

var reports = config.get("reports");
reports.forEach(function(element) {

    element.itemCount = 0;
    element.pointsCount = 0;
    element.itemsWithPoints = 0;
    verboseLog (element)
});

if (options.verbose) { 
    console.log("Options used-")
    console.log(options)
}
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

    if (options.verbose) { 
        console.log("Headers used-")
        console.log(headers)
    }
    extract(headers)
})

function extract(headersArray) {

csv({noheader:false, headers:headersArray})
.fromFile(options.file)
.on('json',(jsonObj)=>{

    if (options.verbose) { 
        console.log("Processing "+jsonObj['Issue key']+"\r")

    }

    process (jsonObj)

})
.on('done',() => {
    reports.forEach(function(element) {
        console.log();
        console.log(element.title);
        console.log(`Tickets : ${element.itemCount} Story Points ${element.pointsCount} Tickets With Points ${element.itemsWithPoints} `)  
        console.log();
        }
    )
    
})
}



function process(data) {
    verboseLog(data)
    
    reports.forEach(function(element) {

        verboseLog(`Report - ${element.title}`)
        var filter = element.filter;
        match = true;
        if (filter != undefined) {
            filter.forEach(function(filterElement) {
                     var filterValues = element[filterElement];
                   
                    if (Array.isArray(filterValues)) {
                        
                        filterValues.forEach(function(value) {
                            if (lowercase(data[filterElement]) != lowercase(value)) {
                                match = false;
                                verboseLog(`---- ${lowercase(data[filterElement])} != ${lowercase(value)}`)
                            } else {
                                verboseLog(`++++ ${lowercase(data[filterElement])} == ${lowercase(value)}`)
                            }
                        });
                    }
                });
            }

            if (match) {
                            if (options.verbose) {
                                console.log(`FOUND ${data[`Summary`]}`)
                            }
           
                            element.itemCount++;
                            value = data[`Custom field (Story Points)`]
                            if (value != ``) {
                                element.pointsCount += parseInt(value);
                                element.itemsWithPoints++;
                                if (options.verbose) {
                                    console.log(`SP : ${value}`)
                                }
                                
                            }

            }        
     });

}

function verboseLog(msg) {
    if (options.verbose) {
        console.log(msg);
    }
}
