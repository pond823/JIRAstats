# JIRAstats

Tool for quickly pulling further stats out of a JIRA query csv export. 

Requires Node - https://nodejs.org/en/download/

Once you've cloned or downloaded JIRAstats, go to the installed directory and use

npm install 

Then in JIRA do a query export from your project as CSV file into the JIRAstat install directory. 

``` node UltraJiraReport.js -f <filename of the CSV file you created> ```

this should give you your stats, if you have configured your local.json file correctly.

To do this, you should start with the default.json file and copy it to local.json before editing.

An example stats config...
```
{ "reports" :
	[

    {
	"title" : "Outstanding P1 Stories for Half-life",
	"filterOn" : ["Priority", "Issue Type", "Status", "Labels"],			
	"Priority" : ["P1"],
	"Issue Type" : ["Story", "Epic"],
    "Status" : ["To do"],
    "Labels" : ["Half-life"]		
    }
   ]
 }
 ```
 
 ### title 
 Is the title of this particular report.
 ### filterOn
 This are the JIRA fields you want to match for this particular report.
 
Then for each element in the filterOn, you should list each value you want to match. All fields are transformed to lowercase, so case isn't important.
   

Command line options

-v verbose mode, display extra information during processing

-f use the following filename, otherwise defaults to JIRA.csv

