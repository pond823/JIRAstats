
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
        console.log(element.title);
        console.log(`Tickets : ${element.itemCount} Story Points ${element.pointsCount} Tickets With Points ${element.itemsWithPoints} `)  
        }
    )
    
})
}



function process(data) {

    reports.forEach(function(element) {
        console.log(element.title);
        element.itemCount = 0;
        element.pointsCount = 0;
        element.itemsWithPoints = 0;
        var filter = element.filter;
        if (filter != undefined) {
            filter.forEach(function(filterElement) {
                    console.log(filterElement);

                    var filterValues = element[filterElement];
                    console.log(element[filterElement]);

                    match = false;
                    if (Array.isArray(filterValues)) {
                        
                        filterValues.forEach(function(value) {
                            if (data[filterElement] == value) {
                                match = true;
                            }
                        });

                        if (match) {
                            element.itemCount++;
                            value = data[`Custom field (Story Points)`]
                            if (value != ``) {
                                element.pointsCount += parseInt(value);
                                element.itemsWithPoints++;
                                
                            }

                        }


                    }


                });
            }        
     });

}


