// Dynamic Schema Audit Script with HTML Output + Design Explanations
// Clean, readable, safe for mongosh, and perfect for learning.

use('ingestionDB');

// ------------------------------------------------------------
// HTML Writer Helpers
// ------------------------------------------------------------
const fs = require("fs");

function writeHtmlStart(path) {
  fs.writeFileSync(path, `
<html>
<head>
<title>MongoDB Schema Audit Report</title>
<style>
  body { font-family: Arial, sans-serif; padding: 20px; }
  h1 { border-bottom: 2px solid #444; padding-bottom: 5px; }
  h2 { margin-top: 30px; color: #333; }
  pre { background: #f4f4f4; padding: 10px; border-radius: 5px; }
</style>
</head>
<body>
<h1>MongoDB Schema Audit Report</h1>
`);
}

function writeHtmlSection(path, title, jsonObj) {
  fs.appendFileSync(path, `
<h2>${title}</h2>
<pre>${JSON.stringify(jsonObj, null, 2)}</pre>
`);
}

function writeHtmlEnd(path) {
  fs.appendFileSync(path, `
</body>
</html>
`);
}

// ------------------------------------------------------------
// Helper: detect fields that look like references
// ------------------------------------------------------------
function findReferenceFields(doc) {
  const refFields = [];
  for (const key in doc) {
    if (key.toLowerCase().includes("id") && key !== "_id") {
      refFields.push(key);
    }
  }
  return refFields;
}

// ------------------------------------------------------------
// 1. Discover collections dynamically
// ------------------------------------------------------------
const collections = db.getCollectionNames();

// ------------------------------------------------------------
// Build audit data structure
// ------------------------------------------------------------
const auditData = {
  collections: collections,
  referenceAnalysis: {},
  relationships: {},
  designIssues: {}
};

// ------------------------------------------------------------
// 2. Reference Field Analysis
// ------------------------------------------------------------
collections.forEach(coll => {
  const sample = db[coll].findOne();
  if (!sample) return;

  const refFields = findReferenceFields(sample);

  auditData.referenceAnalysis[coll] = {
    referenceFields: refFields,
    distinctCounts: {}
  };

  refFields.forEach(field => {
    auditData.referenceAnalysis[coll].distinctCounts[field] =
      db[coll].distinct(field).length;
  });
});

// ------------------------------------------------------------
// 3. Relationship Inference
// ------------------------------------------------------------
collections.forEach(coll => {
  const sample = db[coll].findOne();
  if (!sample) return;

  const refFields = findReferenceFields(sample);
  auditData.relationships[coll] = {};

  refFields.forEach(field => {
    const distinctValues = db[coll].distinct(field).length;
    const totalDocs = db[coll].countDocuments();

    let relationship = "";
    if (distinctValues === totalDocs) {
      relationship = "Likely 1:1";
    } else if (distinctValues < totalDocs) {
      relationship = "Likely 1:N";
    } else {
      relationship = "N:M or irregular";
    }

    auditData.relationships[coll][field] = relationship;
  });
});

// ------------------------------------------------------------
// 4. Design Issues & Recommendations
// ------------------------------------------------------------
collections.forEach(coll => {
  const sample = db[coll].findOne();
  if (!sample) return;

  const refFields = findReferenceFields(sample);

  const issues = [];

  // Over-normalization
  if (refFields.length > 2) {
    issues.push("Collection has multiple reference fields → likely over-normalized (relational-style design).");
  }

  // Missed embedding opportunities
  if (refFields.length > 0 && Object.keys(sample).length < 10) {
    issues.push("Document is small but uses references → embedding may be more efficient.");
  }

  // Join table detection
  if (refFields.length === 2 && Object.keys(sample).length === 2) {
    issues.push("Collection looks like a join table (N:M) → common relational drift pattern.");
  }

  auditData.designIssues[coll] = issues;
});

// ------------------------------------------------------------
// 5. Write HTML Report
// ------------------------------------------------------------
const outputPath = "audit-report.html";

writeHtmlStart(outputPath);
writeHtmlSection(outputPath, "Collections", auditData.collections);
writeHtmlSection(outputPath, "Reference Analysis", auditData.referenceAnalysis);
writeHtmlSection(outputPath, "Relationship Inference", auditData.relationships);
writeHtmlSection(outputPath, "Design Issues & Recommendations", auditData.designIssues);
writeHtmlEnd(outputPath);

print("\nHTML report generated: audit-report.html\n");
