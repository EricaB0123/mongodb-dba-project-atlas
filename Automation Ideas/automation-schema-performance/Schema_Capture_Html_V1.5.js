/* ============================================================================
Unified Schema Audit Script
Author: EricaB — Senior DBA 
GitHub: https://github.com/EricaB0123/
Modes: shell | json | html
Version: 1.5.0

Changes:
- Added Classes to make the script easier to filter the output and not have to specify the database name in the script.
- Added classes to help filter the mode the user will choose to output the audit data.


next steps: 
- less switch and focus on one output. Then comeback to attempting different formats.
- at the moment it prints the output and suggestions 
*/

const fs = require("fs");

//Class Structure


/*
    Setting up a class to tidy up the functions and make it easier to manage the output. 
    The class will handle the different modes (shell, json, html) and provide methods for formatting and printing the audit data. 
    This will help in maintaining the code and adding new features in the future.
*/

// Add these as classes to handle the expected modes of the html, json output.

class ShellAuditRunner {
  run(auditData) {
    //section("Schema Audit (Shell Mode)");
    //jsonBlock(auditData);
    //section("Schema Audit Complete");
    console.log("=== Schema Audit (Shell Mode) ===");
    //console.log(JSON.stringify(auditData, null, 2));
    console.log(JSON.stringify(auditData, null, 2));
    console.log("=== Schema Audit Complete ===");
  }
}

class JsonAuditRunner {

    // Added the Json function to the class to help with the output of the json data.
  jsonBlock(obj) {
    return JSON.stringify(obj, null, 2);
  }

  section(title) {
    console.log("");
    console.log("======================================");
    console.log(" " + title);
    console.log("======================================");
    console.log("");
  }  
  run(auditData) {
    console.log("JSON Output");
   // jsonBlock(auditData);
    console.log(this.jsonBlock(auditData));
    console.log("Schema Audit Complete");
  }
}

class HtmlAuditRunner {

  htmlBlock(obj) {
   //swapping print to return to tril html output

   //print("<pre>" + JSON.stringify(obj, null, 2) + "</pre>");
   return `<pre>${JSON.stringify(obj, null, 2)}</pre>`;
//    return "<pre>" + JSON.stringify(obj, null, 2) + "</pre>";}
  }
  run(auditData) {
    // Note: Adjusted to use auditData if needed
   //console.log("<html><head><title>Schema Audit HTML Report</title></head><body>");
    //console.log(this.htmlBlock(auditData));
    //console.log("</body></html>");
   
    const html = `
<html>
<head>
<title>Schema Audit HTML Report</title>
</head>
<body>
${this.htmlBlock(auditData)}
</body>
</html>
`;
       fs.writeFileSync("schema_audit.html", html);
    console.log("HTML report written to schema_audit.html");
  }
  }




    //Called it schemasauditmode to trial out the ability to better filter out the output modes.
class SchemaAuditMode {
    constructor() {
        // Map mode strings to their respective class methods
        this.auditDataModes = {
        shell: new ShellAuditRunner(),
        json: new JsonAuditRunner(),
        html: new HtmlAuditRunner()
        };
    }

    // Accept the chosen mode and the data to process
    HandleScriptMode(mode, auditData) {
        const auditMode = this.auditDataModes[mode];
        
        if (!auditMode) {
            const allowedModes = Object.keys(this.auditDataModes).join(", ");
            console.log(`Allowed modes: ${allowedModes}`);
            console.log(`Invalid MODE: ${mode}. Allowed modes: ${allowedModes}`);
            return;
        }
            // Pass the data down to the selected mode function
            auditMode.run(auditData);
        
    }
}

 // Sample data to test the script
const auditData = { status: "success", items: [1, 2, 3] };

const modeType = process.argv[2];


// Call the Mode class
const handleMode = new SchemaAuditMode();
handleMode.HandleScriptMode(modeType, auditData);
  
