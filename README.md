# JIRAstats

Tool for quickly pulling further stats out of a JIRA query csv export. 

Requires Node - https://nodejs.org/en/download/

Once you've cloned or downloaded JIRAstats, go to the installed directory and use

npm install 

Then in JIRA do a query export from your project as CSV file into the JIRAstat install directory and type 

node JiraReport.js 

this should give you your stats.

Options

-e include all statues in reports, otherwise only "To Do"

-v verbose mode, display extra information during processing

-f use the following filename, otherwise defaults to JIRA.csv

-l only process tickets with the following label

-x exclude tickets with either the following label or report

-n nolabel exclude tickets with labels of any value

