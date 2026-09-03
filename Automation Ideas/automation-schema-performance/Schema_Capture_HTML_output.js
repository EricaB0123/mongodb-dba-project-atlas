// ============================================================================
// Unified Schema Audit Script
// Author: Erica — Senior DBA / Data Platform Engineer
// GitHub: https://github.com/EricaB0123/
// Modes: shell | json | html
// Version: 1.3.0
// ============================================================================

// Do NOT override MODE if already set in shell
MODE = MODE || "shell";

print("\n======================================");
print(" Active Mode: " + MODE);
print("======================================\n");

// ============================================================================
// Allowed Databases
// ============================================================================
const allowedDatabases = ["ingestionDB"];

// ============================================================================
// Formatting Helpers
// ============================================================================
function section(title) {
  print("");
  print("======================================");
  print(" " + title);
  print("======================================");
  print("");
}

function jsonBlock(obj) {
  print(JSON.stringify(obj, null, 2));
}

// ============================================================================
// Database Fingerprint
// ============================================================================
const currentDB = db.getName();
const collections = db.getCollectionNames();

section("Database Fingerprint");
print("Database Name: " + currentDB);
print("Collection Count: " + collections.length);
collections.forEach(c => print(" - " + c));

// ============================================================================
// Database Filtering
// ============================================================================
if (allowedDatabases.indexOf(currentDB) === -1) {
  section("Database Filter Blocked Execution");
  print("Current DB '" + currentDB + "' is not allowed.");
  print("Allowed DBs:");
  allowedDatabases.forEach(d => print(" - " + d));
  print("Switch DB and re-run.");
  quit(); // allowed here because script must stop
}

// ============================================================================
// Helper: detect reference-like fields
// ============================================================================
function findReferenceFields(doc) {
  const refFields = [];
  for (const key in doc) {
    const lower = key.toLowerCase();
    if (lower.indexOf("id") >= 0 && key !== "_id") {
      refFields.push(key);
    }
  }
  return refFields;
}

// ============================================================================
// Build audit data structure
// ============================================================================
const auditData = {
  database: currentDB,
  collections: collections,
  referenceAnalysis: {},
  relationships: {},
  relationshipInsights: {},
  designIssues: {}
};

// ============================================================================
// Reference Field Analysis
// ============================================================================
collections.forEach(coll => {
  const sample = db[coll].findOne();
  if (!sample) return;

  const refFields = findReferenceFields(sample);

  auditData.referenceAnalysis[coll] = {
    referenceFields: refFields,
    distinctCounts: {}
  };

  refFields.forEach(field => {
    const distinctValues = db[coll].distinct(field);
    auditData.referenceAnalysis[coll].distinctCounts[field] =
      distinctValues.length;
  });
});

// ============================================================================
// Relationship Inference
// ============================================================================
collections.forEach(coll => {
  const sample = db[coll].findOne();
  if (!sample) return;

  const refFields = findReferenceFields(sample);
  auditData.relationships[coll] = {};

  refFields.forEach(field => {
    const distinctValues = db[coll].distinct(field);
    const totalDocs = db[coll].countDocuments();

    let relationship = "";
    if (distinctValues.length === totalDocs) {
      relationship = "Likely 1:1";
    } else if (distinctValues.length < totalDocs) {
      relationship = "Likely 1:N";
    } else {
      relationship = "N:M or irregular";
    }

    auditData.relationships[coll][field] = relationship;
  });
});

// ============================================================================
// Relationship Insights
// ============================================================================
function buildRelationshipInsights() {
  const insights = {};

  collections.forEach(coll => {
    const rels = auditData.relationships[coll];
    if (!rels) return;

    insights[coll] = [];

    Object.keys(rels).forEach(field => {
      const type = rels[field];

      if (type === "Likely 1:1") {
        insights[coll].push(field + " → 1:1 relationship (tight coupling).");
      }

      if (type === "Likely 1:N") {
        insights[coll].push(field + " → 1:N relationship (parent-child).");
      }

      if (type === "N:M or irregular") {
        insights[coll].push(field + " → N:M or irregular (join-table behaviour).");
      }
    });
  });

  return insights;
}

auditData.relationshipInsights = buildRelationshipInsights();

// ============================================================================
// Design Issues
// ============================================================================
collections.forEach(coll => {
  const sample = db[coll].findOne();
