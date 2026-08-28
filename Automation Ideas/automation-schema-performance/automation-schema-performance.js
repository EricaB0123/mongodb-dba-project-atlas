// Dynamic Schema Audit Script (Clean + Readable Version)
// Erica's learning version — safe for mongosh, no raw text, fully dynamic

use('ingestionDB');

// ------------------------------------------------------------
// Formatting Helpers
// ------------------------------------------------------------
function section(title) {
  print("\n======================================");
  print(" " + title);
  print("======================================\n");
}

function subheader(title) {
  print("\n--- " + title + " ---");
}

function line(label, value) {
  print(" - " + label + ": " + value);
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

section("Collections Detected");
collections.forEach(c => line("Collection", c));

// ------------------------------------------------------------
// 2. Reference Field Analysis
// ------------------------------------------------------------
section("Reference Field Analysis");

collections.forEach(coll => {
  const sample = db[coll].findOne();
  if (!sample) {
    subheader(coll + " (empty)");
    return;
  }

  subheader(coll);

  const refFields = findReferenceFields(sample);

  if (refFields.length === 0) {
    line("Reference-like fields", "None");
  } else {
    line("Reference-like fields", refFields.join(", "));
  }

  refFields.forEach(field => {
    const distinctCount = db[coll].distinct(field).length;
    line(`Distinct values for ${field}`, distinctCount);
  });
});

// ------------------------------------------------------------
// 3. Relationship Inference
// ------------------------------------------------------------
section("Relationship Inference");

collections.forEach(coll => {
  const sample = db[coll].findOne();
  if (!sample) return;

  const refFields = findReferenceFields(sample);

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

    line(`${coll}.${field}`, relationship);
  });
});

// ------------------------------------------------------------
// 4. Basic Embedding Recommendations
// ------------------------------------------------------------
section("Embedding Recommendations");

collections.forEach(coll => {
  const sample = db[coll].findOne();
  if (!sample) return;

  const refFields = findReferenceFields(sample);

  if (refFields.length > 2) {
    line(coll, "Has multiple reference fields → possible over-normalization");
  }
});

// ------------------------------------------------------------
// End
// ------------------------------------------------------------
section("Schema Audit Complete");
