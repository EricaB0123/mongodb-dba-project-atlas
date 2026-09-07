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


//Class Structure


/*
    Setting up a class to tidy up the functions and make it easier to manage the output. 
    The class will handle the different modes (shell, json, html) and provide methods for formatting and printing the audit data. 
    This will help in maintaining the code and adding new features in the future.
*/

// Add these as classes to handle the expected modes of the html, json output.

class ShellAuditRunner {
  run(auditData) {
    section("Schema Audit (Shell Mode)");
    jsonBlock(auditData);
    section("Schema Audit Complete");
  }
}

class JsonAuditRunner {

    // Added the Json function to the class to help with the output of the json data.
  jsonBlock(obj) {
    return JSON.stringify(obj, null, 2);
  }

  section(title) {
    print("");
    print("======================================");
    print(" " + title);
    print("======================================");
    print("");
  }  
  run(auditData) {
    section("JSON Output");
    jsonBlock(auditData);
    section("Schema Audit Complete");
  }
}

class HtmlAuditRunner {

  htmlBlock(obj) {
   //swapping print to return to tril html output

   //print("<pre>" + JSON.stringify(obj, null, 2) + "</pre>");



    return "<pre>" + JSON.stringify(obj, null, 2) + "</pre>";}

  run(auditData) {
    // Note: Adjusted to use auditData if needed
    print("<html><head><title>Schema Audit HTML Report</title></head><body>");
    this.htmlBlock(auditData);
    print("</body></html>");
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
            print(`Allowed modes: ${allowedModes}`);
            console.error(`Invalid MODE: ${mode}. Allowed modes: ${allowedModes}`);
            return;
        }
            // Pass the data down to the selected mode function
            auditMode.run(auditData);
        
    }
}

 // Sample data to test the script
const auditData = { status: "success", items: [1, 2, 3] };
const handleMode = new SchemaAuditMode();

// Call the Mode class
handleMode.HandleScriptMode(modeType, auditData);
  
