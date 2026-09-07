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
    const sample = await collection.findOne();
    if (!sample) return {}; // empty collection

    // 2. Find reference-like fields
    const fields = Object.keys(sample);
    const referenceFields = fields.filter(
      f => f.toLowerCase().includes("id") && f !== "_id"
    );

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

  
  

}

async function testAnalyzeReferenceFields() {
  const uri = process.argv[2];
  const dbName = process.argv[3];
  const collName = process.argv[4];

  if (!uri || !dbName || !collName) {
    console.log("Usage: node script.js <uri> <dbName> <collName>");
    return;
  }

  const audit = new MongoSchemaAudit(uri);
  await audit.connect();

  const result = await audit.analyzeReferenceFields(dbName, collName);
  console.log("Reference Field Analysis:", result);

  await audit.disconnect();
}


async function testFindReferenceFields() {
  const uri = process.argv[2];
  const dbName = process.argv[3];
  const collName = process.argv[4];

  if (!uri || !dbName || !collName) {
    console.log("Usage: node script.js <uri> <dbName> <collName>");
    return;
  }

  const audit = new MongoSchemaAudit(uri);
  await audit.connect();

  const sample = await audit.sampleDocument(dbName, collName);

  if (!sample) {
    console.log("Collection is empty or inaccessible.");
  } else {
    const refs = audit.findReferenceFields(sample);
    console.log("Reference-like fields:", refs);
  }

  await audit.disconnect();
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

class HtmlAuditRunner {

  htmlBlock(obj) {
    return `<pre>${JSON.stringify(obj, null, 2)}</pre>`;
  }

  run(auditData) {
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

async function testSampleDocument() {
  const uri = process.argv[2];
  const dbName = process.argv[3];
  const collName = process.argv[4];

  if (!uri || !dbName || !collName) {
    console.log("Usage: node script.js <uri> <dbName> <collName>");
    return;
  }

  const audit = new MongoSchemaAudit(uri);
  await audit.connect();

  const sample = await audit.sampleDocument(dbName, collName);
  console.log("Sample document:", sample);

  await audit.disconnect();
}

// Uncomment this line when testing:
//testSampleDocument();
// main();
//testFindReferenceFields();
testAnalyzeReferenceFields();


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

  // TEMPORARY TEST OUTPUT (until runAudit is implemented)
  const databases = await engine.getDatabases();

  const auditData = {
    scannedAt: new Date().toISOString(),
    databases: databases
  };

  await engine.disconnect();

  const handleMode = new SchemaAuditMode();
  handleMode.HandleScriptMode(modeType, auditData);
}

//main();