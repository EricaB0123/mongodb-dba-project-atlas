// ============================================================================
// Unified Schema Audit Script
// Author: Erica — Senior DBA 
// GitHub: https://github.com/EricaB0123/
// Modes: shell | json | html
// Version: 1.4.0
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
  if (!sample) return;

  const refFields = findReferenceFields(sample);
  const issues = [];

  if (refFields.length > 2) {
    issues.push("Likely over-normalized: too many reference fields.");
  }

  if (refFields.length > 0 && Object.keys(sample).length < 10) {
    issues.push("Small document using references → embedding recommended.");
  }

  if (refFields.length === 2 && Object.keys(sample).length === 2) {
    issues.push("Looks like a join table (N:M) → relational drift.");
  }

  auditData.designIssues[coll] = issues;
});

// ============================================================================
// MODE HANDLERS
// ============================================================================

function runShellMode() {
  section("Schema Audit (Shell Mode)");
  jsonBlock(auditData);
  section("Schema Audit Complete");
}

function runJsonMode() {
  section("JSON Output");
  jsonBlock(auditData);
  section("Schema Audit Complete");
}

function runHtmlMode() {

  function htmlHeader(title) {
    print("<html><head><title>" + title + "</title>");
    print("<style>");
    print("body { font-family: Arial; padding: 20px; }");
    print("h1 { border-bottom: 2px solid #444; }");
    print("h2 { margin-top: 30px; }");
    print(".section { margin-bottom: 40px; }");
    print(".issue { color: #b30000; }");
    print(".insight { color: #0066cc; }");
    print("</style></head><body>");
    print("<h1>MongoDB Schema Audit Report</h1>");
  }

  function htmlFooter() {
    print("</body></html>");
  }

  htmlHeader("Schema Audit");

  // Database Fingerprint
  print("<div class='section'>");
  print("<h2>Database Fingerprint</h2>");
  print("<p><strong>Database:</strong> " + auditData.database + "</p>");
  print("<p><strong>Collections:</strong></p><ul>");
  auditData.collections.forEach(c => print("<li>" + c + "</li>"));
  print("</ul></div>");

  // Reference Analysis
  print("<div class='section'>");
  print("<h2>Reference Analysis</h2>");
  Object.keys(auditData.referenceAnalysis).forEach(coll => {
    const info = auditData.referenceAnalysis[coll];
    print("<h3>" + coll + "</h3>");
    print("<p><strong>Reference Fields:</strong> " + info.referenceFields.join(", ") + "</p>");
    print("<ul>");
    Object.keys(info.distinctCounts).forEach(field => {
      print("<li>" + field + ": " + info.distinctCounts[field] + " distinct values</li>");
    });
    print("</ul>");
  });
  print("</div>");

  // Relationship Insights
  print("<div class='section'>");
  print("<h2>Relationship Insights</h2>");
  Object.keys(auditData.relationshipInsights).forEach(coll => {
    print("<h3>" + coll + "</h3>");
    const insights = auditData.relationshipInsights[coll];
    if (insights.length === 0) {
      print("<p>No relationship insights detected.</p>");
    } else {
      insights.forEach(msg => print("<p class='insight'>" + msg + "</p>"));
    }
  });
  print("</div>");

  // Design Issues
  print("<div class='section'>");
  print("<h2>Design Issues & Recommendations</h2>");
  Object.keys(auditData.designIssues).forEach(coll => {
    print("<h3>" + coll + "</h3>");
    const issues = auditData.designIssues[coll];
    if (issues.length === 0) {
      print("<p>No issues detected.</p>");
    } else {
      issues.forEach(issue => print("<p class='issue'>" + issue + "</p>"));
    }
  });
  print("</div>");

  htmlFooter();
}

// ============================================================================
// MODE SWITCH
// ============================================================================
if (MODE === "shell") runShellMode();
if (MODE === "json") runJsonMode();
if (MODE === "html") runHtmlMode();
