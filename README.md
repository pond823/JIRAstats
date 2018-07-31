# JIRAstats

Tool for quickly pulling further stats out of a JIRA query csv export. 

Requires Node - https://nodejs.org/en/download/

Once you've cloned or downloaded JIRAstats, go to the installed directory and use

npm install 

Then in JIRA do a query export from your project as CSV file into the JIRAstat install directory and type 

node UltraJiraReport.js 

this should give you your stats.

Options

-v verbose mode, display extra information during processing

-f use the following filename, otherwise defaults to JIRA.csv

