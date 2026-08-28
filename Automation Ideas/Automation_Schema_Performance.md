### Schema Audit Script

#### Overview

This script is designed to give me a practical, data‑driven view of how collections relate to each other based on what’s actually stored in the database. It analyses document structures and reference IDs to work out whether a relationship behaves like 1:1, 1:N, or N:M, and flags any embedded arrays that have grown past 100 items.

It also checks for oversized documents, large arrays, and high‑cardinality fields. From there, it provides guidance on whether embedding or referencing is still appropriate, especially if the current pattern is drifting away from MongoDB’s recommended design practices.

The main purpose is to act as a guardrail during migrations, ingestion changes, or routine schema reviews. Atlas has great tools like Performance Advisor and Data Modeling, but they’re reactive — they rely on query telemetry and only highlight issues once they start affecting performance.

This script is proactive. It helps me validate that the schema still aligns with how the application consumes data and catches structural drift early — especially cases where the model starts becoming overly normalized or rigid, similar to traditional relational PK/FK patterns. The aim is to ensure embedding vs referencing decisions haven’t silently shifted in a way that could cause performance degradation later.

#### What the Script Does
- Relationship Detection  
Determines whether a collection pair behaves as 1:1, 1:N, or N:M based on reference distribution and document counts.
- Embedded Array Analysis  
Flags any documents containing embedded arrays with more than 100 items, a common early indicator of performance drift.
- High‑Cardinality Field Checks  
Identifies fields with excessive distinct values that may impact indexing or query performance.
- Oversized Document Detection  
Highlights documents approaching MongoDB’s 16MB limit or showing signs of unbounded growth.
- Embedding vs Referencing Recommendations  
Suggests whether embedding or referencing is more appropriate based on observed patterns, array growth, and relationship density.

#### When to Use This Script
- Before or after migrations
- During ingestion pipeline changes
- When performance degradation is suspected
- As part of routine DBA health checks
- When reviewing embedding vs referencing decisions

## Demonstration 

Using the Test database setup that contains 'assets, metadata, batchRuns, and lifecycle collections'. Below is Demonstrating the development and testing of the script.

### Example 1 A collection that has too many references (over‑normalized, too relational).

#### Pre steps:

1) Made sure i had a test database setup.
2) Made sure I had collections setup.

I created the loads as a script which was then uploaded it to Compass. [Database Setup and Load Test](https://github.com/EricaB0123/mongodb-dba-project-atlas-bare-metal/blob/main/Automation%20Ideas/automation-schema-performance/Database-Setup-and-Load-Test.js)

##### Running via the mongosh shell

<img width="577" height="288" alt="image" src="https://github.com/user-attachments/assets/9a27e7ee-e019-45e6-bdf6-0b5372edec15" />

##### Testing the data was loaded

<img width="400" height="200" alt="image" src="https://github.com/user-attachments/assets/40c34078-9504-4e67-8ab1-b1b5501cd4b7" />


#### Running the script

<img width="400" height="200" alt="image" src="https://github.com/user-attachments/assets/0d39bd6f-18ac-4e7c-9334-8c192b43ca91" />

#### Json output

```
l> mongosh "mongodb+srv://username@hiddenvalues.mongodb.net/" `
>>   --quiet `                                                         
>>   --file ".\Automation Ideas\automation-schema-performance\automation-schema-performance.js" |                        
>>   Out-File ".\schema-audit.json" -Encoding utf8


```

#### Html output

```
Atlas ingestionDB> load("Automation Ideas/automation-schema-performance/automation-schema-performance.js")

HTML report generated: audit-report.html

true

```

### Report output and Automation Suggestions

The schema‑audit script now supports multiple output modes designed for both local development and future automation. These outputs allow the audit to be consumed in different environments — from terminal debugging to monitoring dashboards and deployment pipelines. The next phase is to operationalise the audit so it becomes part of the ingestion platform’s ongoing observability and governance.

### Compass / Terminal JSON Output
The JSON output mode provides a clean, machine‑readable representation of the audit results. This format is suitable for:

- CI/CD pipelines
- Octopus runbooks
- ingestion validation steps
- local debugging
- exporting results into other tooling

Because the JSON output is deterministic and stable, it can be used as an artifact in deployment pipelines or stored for comparison across runs. This is the recommended mode for automation scenarios where the audit needs to be consumed programmatically.

### Terminal JSON Output
For local development, the terminal JSON output offers a quick way to inspect schema issues without requiring external tooling. Can run the script directly against a local or Atlas cluster and immediately see:

- reference‑field analysis
- relationship inference
- design‑issue detection
- collection fingerprints

This mode is ideal for manual checks, troubleshooting ingestion issues, or validating schema changes before committing them.

#### Example output

```
======================================
 Database Fingerprint
======================================

Database Name: ingestionDB
Collection Count: 6
Collections:
 - assetTagMap
 - tags
 - assets
 - categories
 - metadata
 - assetCategoryMap

======================================
 JSON Output
======================================

{
  "database": "ingestionDB",
  "collections": [
    "assetTagMap",
    "tags",
    "assets",
    "categories",
    "metadata",
    "assetCategoryMap"
  ],
  "referenceAnalysis": {
    "assetTagMap": {
      "referenceFields": [
        "assetId",
        "tagId"
      ],
      "distinctCounts": {
        "assetId": 2,
        "tagId": 3
      }
    },
    "tags": {
      "referenceFields": [],
      "distinctCounts": {}
    },
    "assets": {
      "referenceFields": [
        "metadataId"
      ],
      "distinctCounts": {
        "metadataId": 2
      }
    },
    "categories": {
      "referenceFields": [],
      "distinctCounts": {}
    },
    "metadata": {
      "referenceFields": [],
      "distinctCounts": {}
    },
    "assetCategoryMap": {
      "referenceFields": [
        "assetId",
        "categoryId"
      ],
      "distinctCounts": {
        "assetId": 2,
        "categoryId": 2
      }
    }
  },
  "relationships": {
    "assetTagMap": {
      "assetId": "Likely 1:N",
      "tagId": "Likely 1:N"
    },
    "tags": {},
    "assets": {
      "metadataId": "Likely 1:1"
    },
    "categories": {},
    "metadata": {},
    "assetCategoryMap": {
      "assetId": "Likely 1:1",
      "categoryId": "Likely 1:1"
    }
  },
  "designIssues": {
    "assetTagMap": [
      "Small document using references -> embedding recommended."
    ],
    "tags": [],
    "assets": [
      "Small document using references -> embedding recommended."
    ],
    "categories": [],
    "metadata": [],
    "assetCategoryMap": [
      "Small document using references -> embedding recommended."
    ]
  }
}

======================================
 Schema Audit Complete
======================================
```




