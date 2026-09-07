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

async function testDetectDesignIssues() {
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
    const issues = audit.detectDesignIssues(sample);
    console.log("Design Issues:", issues);
  }

  await audit.disconnect();
}

async function testBuildRelationshipInsights() {
  const uri = process.argv[2];
  const dbName = process.argv[3];
  const collName = process.argv[4];

  if (!uri || !dbName || !collName) {
    console.log("Usage: node script.js <uri> <dbName> <collName>");
    return;
  }

  const audit = new MongoSchemaAudit(uri);
  await audit.connect();

  // Step 1: infer relationships for this single collection
  const rel = await audit.inferRelationships(dbName, collName);

  // Step 2: wrap in collection structure expected by buildRelationshipInsights
  const relObj = { [collName]: rel };

  // Step 3: generate insights
  const insights = audit.buildRelationshipInsights(relObj);

  console.log("Relationship Insights:", insights);

  await audit.disconnect();
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

async function testRunAudit() {
  const uri = process.argv[2];

  if (!uri) {
    console.log("Usage: node script.js <uri>");
    return;
  }

  const audit = new MongoSchemaAudit(uri);
  await audit.connect();

  const result = await audit.runAudit();
  console.log("Full Audit Result:", JSON.stringify(result, null, 2));

  await audit.disconnect();
}