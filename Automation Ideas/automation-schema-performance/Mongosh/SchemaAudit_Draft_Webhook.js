// ============================================================================
// Dynatrace Schema Audit Script
// Author: Erica — Senior DBA 
// GitHub: https://github.com/EricaB0123/
// Description: Dynatrace-style dashboard output and webhook payload generator
//              for MongoDB schema audit results.
// Version: 0.9.0
// ============================================================================

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

function dashboardLine(severity, message) {
  const tag = severity.toUpperCase();
  const pad = "        ";
  const padded = tag + pad.slice(0, 8 - tag.length);
  print(padded + " | " + message);
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
  quit();
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
  designIssues: {}
};

// ============================================================================
// Design Issues & Severity Mapping
// ============================================================================
collections.forEach(coll => {
  const sample = db[coll].findOne();
  if (!sample) return;

  const refFields = findReferenceFields(sample);
  const issues = [];

  // Over-normalization
  if (refFields.length > 2) {
    issues.push({
      severity: "WARNING",
      message: "Likely over-normalized: too many reference fields."
    });
  }

  // Embedding recommendation
  if (refFields.length > 0 && Object.keys(sample).length < 10) {
    issues.push({
      severity: "WARNING",
      message: "Small document using references → embedding recommended."
    });
  }

  // Join table detection
  if (refFields.length === 2 && Object.keys(sample).length === 2) {
    issues.push({
      severity: "CRITICAL",
      message: "Looks like a join table (N:M) → relational drift."
    });
  }

  auditData.designIssues[coll] = issues;
});

// ============================================================================
// Dynatrace Dashboard Output
// ============================================================================
section("Dynatrace-style Summary");

collections.forEach(coll => {
  const issues = auditData.designIssues[coll];

