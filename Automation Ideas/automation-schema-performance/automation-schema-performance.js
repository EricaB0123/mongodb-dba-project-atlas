// ============================================================================
// Unified Schema Audit Script
// Author: Erica — Senior DBA / Data Platform Engineer
// GitHub: https://github.com/EricaB0123/
// Description: Automated schema fingerprinting, reference analysis,
//              relationship inference, and design issue detection for MongoDB.
// Modes: json | dynatrace | html
// Version: 1.0.0
// ============================================================================

if (typeof MODE === "undefined") {
  MODE = "json";
}

// ============================================================================
// Allowed Databases
// ============================================================================
const allowedDatabases = [
  "ingestionDB"
];

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
print("Collections:");
collections.forEach(function(c) {
  print(" - " + c);
});

// ============================================================================
// Database Filtering
// ============================================================================
if (allowedDatabases.indexOf(currentDB) === -1) {
  section("Database Filter Blocked Execution");
  print("Current DB '" + currentDB + "' is not allowed.");
  print("Allowed DBs:");
  allowedDatabases.forEach(function(d) {
    print(" - " + d);
  });
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
  referenceAnalysis: {},
  relationships: {},
  designIssues: {}
};

// ============================================================================
// Reference Field Analysis
// ============================================================================
collections.forEach(function(coll) {
  const sample = db[coll].findOne();
  if (!sample) return;

  const refFields = findReferenceFields(sample);

  auditData.referenceAnalysis[coll] = {
    referenceFields: refFields,
    distinctCounts: {}
  };

  refFields.forEach(function(field) {
    const distinctValues = db[coll].distinct(field);
    auditData.referenceAnalysis[coll].distinctCounts[field] =
      distinctValues.length;
  });
});

// ============================================================================
// Relationship Inference
// ============================================================================
collections.forEach(function(coll) {
  const sample = db[coll].findOne();
  if (!sample) return;

  const refFields = findReferenceFields(sample);
  auditData.relationships[coll] = {};

  refFields.forEach(function(field) {
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
// Design Issues & Recommendations
// ============================================================================
collections.forEach(function(coll) {
  const sample = db[coll].findOne();
  if (!sample) return;

  const refFields = findReferenceFields(sample);
  const issues = [];

  if (refFields.length > 2) {
    issues.push("Likely over-normalized: too many reference fields.");
  }

  if (refFields.length > 0 &&
      Object.keys(sample).length < 10) {
    issues.push("Small document using references -> embedding recommended.");
  }

  if (refFields.length === 2 &&
      Object.keys(sample).length === 2) {
    issues.push("Looks like a join table (N:M) -> relational drift.");
  }

  auditData.designIssues[coll] = issues;
});

// ============================================================================
// MODE: JSON
// ============================================================================
if (MODE === "json") {
  section("JSON Output");
  jsonBlock(auditData);
  section("Schema Audit Complete");
  quit();
}

// ============================================================================
// MODE: Dynatrace Dashboard
// ============================================================================
if (MODE === "dynatrace") {

  function dashboardLine(severity, message) {
    const tag = severity.toUpperCase();
    const pad = "        ";
    const padded = tag + pad.slice(0, 8 - tag.length);
    print(padded + " | " + message);
  }

  section("Dynatrace-style Summary");

  collections.forEach(function(coll) {
    const issues = auditData.designIssues[coll];

    if (!issues || issues.length === 0) {
      dashboardLine("info", coll + ": No issues detected");
      return;
    }

    issues.forEach(function(issue) {
      let severity = "info";

      if (issue.indexOf("over-normalized") >= 0) {
        severity = "warning";
      }
      if (issue.indexOf("join table") >= 0) {
        severity = "critical";
      }
      if (issue.indexOf("embedding") >= 0) {
        severity = "warning";
      }

      dashboardLine(severity, coll + ": " + issue);
    });
  });

  const dynatracePayload = collections.map(function(coll) {
    const issues = auditData.designIssues[coll] || [];

    return {
      collection: coll,
      issues: issues.map(function(issue) {
        let severity = "INFO";
        if (issue.indexOf("over-normalized") >= 0) {
          severity = "WARNING";
        }
        if (issue.indexOf("join table") >= 0) {
          severity = "CRITICAL";
        }
        if (issue.indexOf("embedding") >= 0) {
          severity = "WARNING";
        }
        return {
          severity: severity,
          message: issue
        };
      })
    };
  });

  section("Dynatrace Webhook Payload");
  jsonBlock(dynatracePayload);

  section("Schema Audit Complete");
  quit();
}
