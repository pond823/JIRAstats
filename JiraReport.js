
const csv=require('csvtojson')
const lowerCase = require('lower-case')
const optionDefinitions = [
    { name: 'label', alias: 'l', type: String, defaultValue:''},
    { name: 'exclude', alias: 'x', type: String, defaultValue:''},
    { name: 'file', alias: 'f', type: String, defaultValue:'JIRA.csv' },
    { name: 'everything', alias: 'e', type: Boolean, defaultValue:false },
    { name: 'verbose', alias: 'v', type: Boolean, defaultValue:false},
    
    
  ]
const commandLineArgs = require('command-line-args')
const firstLine = require('firstline')

const options = commandLineArgs(optionDefinitions)  


let tickets =0;

let p1 = {  bugs : 0,
            tickets : 0,
            total : 0,
            sizedTickets :0,
            PBI : 0
         }

let p2 = {  bugs : 0,
            tickets : 0,
            total : 0,
            sizedTickets :0,
            PBI : 0
         }
let p3 = {  bugs : 0,
            tickets : 0,
            total : 0,
            sizedTickets :0,
            PBI : 0
         }

let csvHeaders = [];
if (options.verbose) { 
    console.log("Options used-")
    console.log(options)
}
//re-write headers that repeat the same name e.g. Label, Label becomes Label, Label1
firstLine(options.file, { lineEnding: '\r' }).then((line) => { 
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
.fromFile(`JIRA.csv`)
.on('json',(jsonObj)=>{

    if (options.verbose) { 
        console.log("Processing "+jsonObj['Issue key']+"\r")

    }

    process ('P1', options.label, jsonObj, p1)
    process ('P2', options.label, jsonObj, p2)
    process ('P3', options.label, jsonObj, p3)

})
.on('done',() => {

    console.log(`Label used : ${options.label}   excluding : ${options.exclude}`)
    console.log(`P1 : tickets ${p1.tickets}   bugs ${p1.bugs}   story points ${p1.total}   sized stories ${p1.sizedTickets}   PBIs ${p1.PBI}`);
    console.log(`P2 : tickets ${p2.tickets}   bugs ${p2.bugs}   story points ${p2.total}   sized stories ${p2.sizedTickets}   PBIs ${p2.PBI}`);
    console.log(`P3 : tickets ${p3.tickets}   bugs ${p3.bugs}   story points ${p3.total}   sized stories ${p3.sizedTickets}   PBIs ${p3.PBI}`); 
    }
)
}

function process(priority, label, data, target) {

    if (data[`Status`] === `To Do` || options.everything) {
       if ((options.exclude =='' || data[`Reporter`]!= options.exclude) && data[`Priority`] == priority){
            isBug = false
            if (label == '' || 
                lowerCase(data[`Labels1`])==label || 
                lowerCase(data[`Labels2`])==label || 
                lowerCase(data[`Labels`])==label ) {

                    target.PBI++
                if (data[`Issue Type`]==`Bug`) {
                    target.bugs++;
                    isBug = true
                } else {
                    
                    target.tickets++;
                }

                value = data[`Custom field (Story Points)`]
                
                if (value != `` && !isBug) {
                    target.total += parseInt(value);

                    target.sizedTickets++;
                } 
    
            }

        }

    }

}


