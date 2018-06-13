
const csv=require('csvtojson')
const lowerCase = require('lower-case')

var csvStr = `a,b,c\n1,2,3\n1,2,3\n1,2,3`
let tickets =0;

let thundercatsTotal = 0;
let thunderCatsBlank=0;
let thundercatsSizedTickets =0;

let sambaTotal = 0;
let sambaBlank=0;
let sambaTickets =0;

let hlTotal = 0;
let hlBlank=0;
let hlSizedTickets =0;

let tlTotal = 0;
let tlBlank=0;
let tlSizedTickets =0;
let thunderCatsBugs =0;
let hlBugs = 0;
let tlBugs = 0;
let sambaBugs = 0;
csv({noheader:false})
.fromFile(`JIRA.csv`)
.on('json',(jsonObj)=>{
    if (jsonObj[`Priority`] == `P1` && jsonObj[`Status`] == `To Do` && jsonObj[`Reporter`]!=`Raj.Dandamudi1`) {
        tickets++;
        hasTeam = false;
        console.log(jsonObj[`Labels1`]);
        if (lowerCase(jsonObj[`Labels1`])==`thundercats` || 
            lowerCase(jsonObj[`Labels2`])==`thundercats` || 
            lowerCase(jsonObj[`Labels3`])==`thundercats` ) {
            hasTeam = true;
            value = jsonObj[`Custom field (Story Points)`];
            
            if (value != ``) {
                thundercatsTotal += parseInt(value);
                thundercatsSizedTickets++;
            } else {
                thunderCatsBlank++;
            }
            if (jsonObj[`Issue Type`]==`Bug`) {
                thunderCatsBugs++;
            }

        }
        if (lowerCase(jsonObj[`Labels1`])==`half-life` || 
            lowerCase(jsonObj[`Labels2`])==`half-life` || 
            lowerCase(jsonObj[`Labels3`])==`half-life`) {    
            hasTeam = true;      
            value = jsonObj[`Custom field (Story Points)`];
            if (value != ``) {
                hlTotal += parseInt(value);
                hlSizedTickets++;
            } else {
                hlBlank++;
            }
            if (jsonObj[`Issue Type`]==`Bug`) {
                hlBugs++;
            }

        }
        if (lowerCase(jsonObj[`Labels1`])==`samba` || 
        lowerCase(jsonObj[`Labels2`])==`samba` || 
        lowerCase(jsonObj[`Labels3`])==`samba` ) {
            hasTeam = true;
            value = jsonObj[`Custom field (Story Points)`];
            
            if (value != ``) {
                sambaTotal += parseInt(value);
                sambaTickets++;
            } else {
                sambaBlank++;
            }
            if (jsonObj[`Issue Type`]==`Bug`) {
                sambaBugs++;
            } 
        }
    
        if (hasTeam == false) {
    
            value = jsonObj[`Custom field (Story Points)`];
             if (value != ``) {
                tlTotal += parseInt(value);
                tlSizedTickets++;
                console.log(jsonObj)
                
            } else {
                
                tlBlank++;
            }
            if (jsonObj[`Issue Type`]==`Bug`) {
                tlBugs++;
            }
        }

    }

})
.on('done',() => {
        console.log(`===========================================`);    
        console.log(`Sized Thundercats tickets ${thundercatsSizedTickets}`);
        console.log(`Total Thundercats points ${thundercatsTotal}`);
        console.log(`Unsized Thundercats tickets ${thunderCatsBlank}`);
        console.log(`Of which ${thunderCatsBugs} are bugs`);
   
        console.log(`-------------------------------------------`);
        console.log(`Sized Half-Life tickets ${hlSizedTickets}`);
        console.log(`Total Half-Life points ${hlTotal}`);
        console.log(`Unsized Half-Life tickets ${hlBlank}`);
        console.log(`Of which ${hlBugs} are bugs`);
        
        console.log(`-------------------------------------------`);
        console.log(`Sized Samba tickets ${sambaTickets}`);
        console.log(`Total Samba points ${sambaTotal}`);
        console.log(`Unsized Samba tickets ${sambaBlank}`);
        console.log(`Of which ${sambaBugs} are bugs`);

        console.log(`-------------------------------------------`);
        console.log(`Sized teamless tickets ${tlSizedTickets}`);
        console.log(`Total teamless points ${tlTotal}`);
        console.log(`Unsized teamless tickets ${tlBlank}`);
        console.log(`Of which ${tlBugs} are bugs`);
   
        console.log(`-------------------------------------------`);
        console.log(`Total Sized tickets ${thundercatsSizedTickets+hlSizedTickets+tlSizedTickets+sambaTickets}`);
        console.log(`Total points ${hlTotal+thundercatsTotal+tlTotal+sambaTotal}`);
        console.log(`Total tickets ${tickets}`);
        console.log(`===========================================`); 
        console.log(``);
    }
)


