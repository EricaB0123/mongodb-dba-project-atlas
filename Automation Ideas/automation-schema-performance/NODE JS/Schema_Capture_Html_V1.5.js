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
============================================================================ */

const fs = require("fs");
const { MongoClient } = require("mongodb");

/*
    Setting up a class to tidy up the functions and make it easier to manage the output. 
    The class will handle the different modes (shell, json, html) and provide methods for formatting and printing the audit data. 
    This will help in maintaining the code and adding new features in the future.
*/

/* ============================================================================
MongoSchemaAudit — NEW main audit engine
This replaces the old MongoAuditEngine completely.
============================================================================ */

class MongoSchemaAudit {

  constructor(uri) {
    this.client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }

  async connect() {
    await this.client.connect();
  }

  async disconnect() {
    await this.client.close();
  }

  async getDatabases() {
    const adminDb = this.client.db().admin();
    const dbList = await adminDb.listDatabases();
    return dbList.databases.map(db => db.name);
  }

  async getCollections(dbName) {
    const db = this.client.db(dbName);
    const collections = await db.listCollections().toArray();
    return collections.map(c => c.name);
  }

  async sampleDocument(dbName, collName) {
  const db = this.client.db(dbName);
  const collection = db.collection(collName);

  try {
    const sample = await collection.findOne();
    return sample || null;   // return null for empty collections
  } catch (err) {
    console.log(`Error sampling ${dbName}.${collName}:`, err.message);
    return null;
  }
}

  findReferenceFields(doc) {
    const refFields = [];

    for (const key of Object.keys(doc)) {
      const lower = key.toLowerCase();
      if (lower.includes("id") && key !== "_id") {
        refFields.push(key);
      }
    }

    return refFields;
  }

  async analyzeReferenceFields(dbName, collName) {
  const db = this.client.db(dbName);
  const collection = db.collection(collName);

  // 1. Sample a document
  const sample = await this.sampleDocument(dbName, collName);
  if (!sample) {
    return {
      referenceFields: [],
      distinctCounts: {}
    };
  }

  // 2. Detect reference-like fields
  const referenceFields = this.findReferenceFields(sample);

  const distinctCounts = {};

  // 3. Count distinct values for each reference field
  for (const field of referenceFields) {
    try {
      const distinctValues = await collection.distinct(field);
      distinctCounts[field] = distinctValues.length;
    } catch (err) {
      console.log(`Error getting distinct values for ${field}:`, err.message);
      distinctCounts[field] = 0;
    }
  }

  return {
    referenceFields,
    distinctCounts
  };
}



  async inferRelationships(dbName, collName) {
    const db = this.client.db(dbName);
    const collection = db.collection(collName);

    // 1. Sample a document
    const sample = await this.sampleDocument(dbName, collName);
    if (!sample) return {}; // empty collection

    // 2. Use your unified reference-field detector
    const referenceFields = this.findReferenceFields(sample);

    // This was missing
    const results = {};
    // 3. Count total documents
    const totalDocs = await collection.countDocuments();

    // 4. For each reference field, infer relationship type
    for (const field of referenceFields) {
      const distinctValues = await collection.distinct(field);

      let relationship = "";

      if (distinctValues.length === totalDocs) {
        relationship = "Likely 1:1";
      } else if (distinctValues.length < totalDocs) {
        relationship = "Likely 1:N";
      } else {
        relationship = "N:M or irregular";
      }

      results[field] = relationship;
    }

    return results;
  }

  detectDesignIssues(doc) {
  const issues = [];

  if (!doc || typeof doc !== "object") {
    return issues;
  }

  const referenceFields = this.findReferenceFields(doc);
  const fieldCount = Object.keys(doc).length;

  // Over-normalization: too many reference fields
  if (referenceFields.length > 2) {
    issues.push("Likely over-normalized: too many reference fields.");
  }

  // Small document using references → embedding recommended
  if (referenceFields.length > 0 && fieldCount < 10) {
    issues.push("Small document using references → embedding recommended.");
  }

  // Join-table pattern (N:M relational drift)
  if (referenceFields.length === 2 && fieldCount === 2) {
    issues.push("Looks like a join table (N:M) → relational drift.");
  }

  return issues;
}

  buildRelationshipInsights(relationships) {
  const insights = {};

  // relationships = { collName: { fieldName: "Likely 1:N", ... } }

  for (const collName of Object.keys(relationships)) {
    const rels = relationships[collName];
    insights[collName] = [];

    for (const field of Object.keys(rels)) {
      const type = rels[field];

      if (type === "Likely 1:1") {
        insights[collName].push(
          `${field} → 1:1 relationship (tight coupling).`
        );
      }

      if (type === "Likely 1:N") {
        insights[collName].push(
          `${field} → 1:N relationship (parent-child).`
        );
      }

      if (type === "N:M or irregular") {
        insights[collName].push(
          `${field} → N:M or irregular (join-table behaviour).`
        );
      }
    }
  }

  return insights;
}

// Main Audit Function Pulling apart and rebuidling the functions withint e main class
async runAudit() {
  const auditData = {
    scannedAt: new Date().toISOString(),
    databases: {},
  };

  // 1. Get all databases
  const dbNames = await this.getDatabases();

  for (const dbName of dbNames) {
    const dbReport = {
      collections: [],
      referenceAnalysis: {},
      relationships: {},
      relationshipInsights: {},
      designIssues: {}
    };

    // 2. Get collections for this database
    const collections = await this.getCollections(dbName);
    dbReport.collections = collections;

    // 3. Loop each collection and run analysis
    for (const collName of collections) {

      // Sample document
      const sample = await this.sampleDocument(dbName, collName);

      // Reference field analysis
      const refAnalysis = await this.analyzeReferenceFields(dbName, collName);
      dbReport.referenceAnalysis[collName] = refAnalysis;

      // Relationship inference
      const relationships = await this.inferRelationships(dbName, collName);
      dbReport.relationships[collName] = relationships;

      // Design issues
      const issues = this.detectDesignIssues(sample);
      dbReport.designIssues[collName] = issues;
    }

    // 4. Build relationship insights AFTER all relationships are collected
    dbReport.relationshipInsights = this.buildRelationshipInsights(
      dbReport.relationships
    );

    // 5. Store this database report
    auditData.databases[dbName] = dbReport;
  }

  return auditData;
}


}


class ShellAuditRunner {
  run(auditData) {
    console.log("=== Schema Audit (Shell Mode) ===");
    console.log(JSON.stringify(auditData, null, 2));
    console.log("=== Schema Audit Complete ===");
  }
}

class JsonAuditRunner {

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
    console.log(this.jsonBlock(auditData));
    console.log("Schema Audit Complete");
  }
}

class HtmlReportBuilder {

  constructor(outputFile = "schema_audit.html") {
    this.outputFile = outputFile;
  }

  // Attempt at making the html report more readable, seperating out the recommendations


//method for pulling part the information. To be pulled from the main build method.
buildHtmlWithRecommendations(auditData) {
  //Put the objects into an arrary for it to then be grabbed for the html output
  
  /*
  Removed the following lines as they were to test the implementation with one db:
  const dbNames = Object.keys(auditData.databases);
  const firstDb = dbNames[0];

  const dbReport = auditData.databases[firstDb];
  const firstCollection = dbReport.collections[0];
 */

/*
  The JSON structure is as follows:
  {
    "databases": {  
        "dbName": {
            "collections": ["coll1", "coll2"],
            "referenceAnalysis": {  
            "relationships": {
            "designIssues": {
  }

  IN order for the html to be built, we need to loop through each database, then each collection, and extract the relevant information for the report.
  

*/
 const items = [];
// Loop all databases
  for (const [dbName, dbReport] of Object.entries(auditData.databases)) {

    // Loop all collections inside each database
    for (const collName of dbReport.collections) {
    items.push({
      database: dbName,
      collection: collName,
      referenceFields: dbReport.referenceAnalysis[collName].referenceFields,
      distinctCounts: dbReport.referenceAnalysis[collName].distinctCounts,
      relationships: dbReport.relationships[collName],
      designIssues: dbReport.designIssues[collName]
    });

  }
}
    return items.map(item => `
    <h2>${item.database}</h2>
    <table border="1">
      <tr>
        <th>Collection</th>
        <th>Reference Fields</th>
        <th>Distinct Counts</th>
        <th>Relationships</th>
        <th>Design Issues</th>
      </tr>
      <tr>
        <td>${item.collection}</td>
        <td>${item.referenceFields.join(", ")}</td>
        <td>${JSON.stringify(item.distinctCounts)}</td>
        <td>${JSON.stringify(item.relationships)}</td>
        <td>${item.designIssues.join(", ")}</td>
      </tr>
    </table>
    <br/>
  `).join('');

}

  // Builds a simple HTML report from the audit data
  buildHtml(auditData) {
   // const jsonPretty = JSON.stringify(auditData, null, 2);
    const recommendations = this.buildHtmlWithRecommendations(auditData);
    return `
<html>
<head>
<title>MongoDB Schema Audit Report</title>
<style>
  body { font-family: Arial, sans-serif; padding: 20px; }
  h1 { color: #333; }
  pre {
    background: #f4f4f4;
    padding: 15px;
    border-radius: 6px;
    overflow-x: auto;
  }
</style>
</head>
<body>
<h1>MongoDB Schema Audit Report</h1>

  ${recommendations}

</body>
</html>
`;
  }

  writeHtml(auditData) {
    const html = this.buildHtml(auditData);
    fs.writeFileSync(this.outputFile, html);
    console.log(`HTML report written to ${this.outputFile}`);
  }
}



/* ============================================================================
HTML Runner — thin wrapper around HtmlReportBuilder
============================================================================ */

class HtmlAuditRunner {
  constructor() {
    this.builder = new HtmlReportBuilder();
  }

  run(auditData) {
    this.builder.writeHtml(auditData);
  }
}
  


class SchemaAuditMode {
  constructor() {
    this.auditDataModes = {
      shell: new ShellAuditRunner(),
      json: new JsonAuditRunner(),
      html: new HtmlAuditRunner()
    };
  }

  HandleScriptMode(mode, auditData) {
    const auditMode = this.auditDataModes[mode];

    if (!auditMode) {
      const allowedModes = Object.keys(this.auditDataModes).join(", ");
      console.log(`Allowed modes: ${allowedModes}`);
      console.log(`Invalid MODE: ${mode}. Allowed modes: ${allowedModes}`);
      return;
    }

    auditMode.run(auditData);
  }
}

/* ============================================================================
TEMPORARY TEST — sampleDocument
Place this BEFORE main(), AFTER the class.
============================================================================ */

//Moved testsampleDoc to seperate doc.







// Uncomment this line when testing:
//testSampleDocument();
// main();
//testFindReferenceFields();
//testAnalyzeReferenceFields();
//testDetectDesignIssues();
//testBuildRelationshipInsights();
// main();
//testRunAudit();


async function main() {

  const modeType = process.argv[2]; // shell | json | html
  const uri = process.argv[3];      // MongoDB URI

  if (!modeType) {
    console.log("Please specify a mode: shell | json | html");
    return;
  }

  if (!uri) {
    console.log("Please provide a MongoDB URI");
    return;
  }

  // NEW ENGINE
  const engine = new MongoSchemaAudit(uri);
  await engine.connect();

  const auditData = await engine.runAudit();
  await engine.disconnect();

  const handleMode = new SchemaAuditMode();
  handleMode.HandleScriptMode(modeType, auditData);
}

main();