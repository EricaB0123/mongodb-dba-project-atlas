### Schema Audit Script

- [What the Script Does](#what-the-script-does)
  - [Relationship Detection](#relationship-detection)
  - [Embedded Array Analysis](#embedded-array-analysis)
  - [High-Cardinality Field Checks](#high-cardinality-field-checks)
  - [Oversized Document Detection](#oversized-document-detection)
  - [Embedding vs Referencing Recommendations](#embedding-vs-referencing-recommendations)
- [When to Use This Script](#when-to-use-this-script)
- [Demonstration](#demonstration)
  - [Example 1: Over-normalized Collection](#example-1-a-collection-that-has-too-many-references)
  - [Pre Steps](#pre-steps)
  - [Running via mongosh](#running-via-mongosh)
  - [Testing the Data Load](#testing-data-loaded)
  - [Report Output in HTML](#html-output)
- [Compass / Terminal JSON Output](#compass--terminal-json-output)
- [Improvements](#improvements)
- [Script Logic Explanation](#script-logic-explanation)

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
- When reviewing embedding vs referencing decisions.





## Demonstration 

Using the Test database setup that contains 'assets, metadata, batchRuns, and lifecycle collections'. Below is Demonstrating the development and testing of the script.

### Example 1 A collection that has too many references.
#### (over‑normalized, too relational)
#### Pre steps:

1) Made sure i had a test database setup.
2) Made sure I had collections setup.

I created the loads as a script which was then uploaded it to Compass. [Database Setup and Load Test](https://github.com/EricaB0123/mongodb-dba-project-atlas-bare-metal/blob/main/Automation%20Ideas/automation-schema-performance/Database-Setup-and-Load-Test.js)

#### Running via mongosh

<img width="577" height="288" alt="image" src="https://github.com/user-attachments/assets/9a27e7ee-e019-45e6-bdf6-0b5372edec15" />

#### Json output

```
l> mongosh "mongodb+srv://username@hiddenvalues.mongodb.net/" `
>>   --quiet `                                                         
>>   --file ".\Automation Ideas\automation-schema-performance\automation-schema-performance.js" |                        
>>   Out-File ".\schema-audit.json" -Encoding utf8
```

#### Testing data loaded

<img width="400" height="200" alt="image" src="https://github.com/user-attachments/assets/40c34078-9504-4e67-8ab1-b1b5501cd4b7" />


#### Running the script

<img width="400" height="200" alt="image" src="https://github.com/user-attachments/assets/0d39bd6f-18ac-4e7c-9334-8c192b43ca91" />


#### Html output

```
PS \Automation Ideas\automation-schema-performance\NODE JS> node Schema_Capture.js html "mongodb+srv://username@hiddenvalues.mongodb.net/"
>> 
HTML report written to schema_audit.html

```

<img width="1862" height="417" alt="image" src="https://github.com/user-attachments/assets/26e57d66-0076-40e4-95e2-3945b1e56241" />


When running the report - i intentiinaly excluded the internal databases. To show the 2 databases in focus.  

In the output we can see that the collection'AssetTagMap'	assetId, tagId	{"assetId":2,"tagId":3}	{"assetId":"Likely 1:N","tagId":"Likely 1:N"}. It has the problem "Small document using references → embedding recommended".
I need to add more context to the script on recommended next actions. The basic idea is that the output is suggesting that instead of keeping a seperate mapping collection that requires level joins. That maybe embedding the tags inside 'asset' could improve performance.  It then prevents the database design from going towards the relational design and more suitable for nosql 

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

##HTML Output

<img width="1840" height="880" alt="image" src="https://github.com/user-attachments/assets/6fd38d17-35f5-480b-b79b-fa5181e5d3c5" />


## Improvements

[Current Script State](https://github.com/EricaB0123/mongodb-dba-project-atlas-bare-metal)

Currently working on the switch logic to show different format output. Ive attached 2 scripts for now. eventually into one less confusing output. main idea is to show the format and suggestions and it can be adjusted. for likes of monitoring or further dba context.

At the moment the script put a single description of possible design issues, but no example or further context. Having an example suggestion could then be further added for the script to make these changes.

For example:
```
Collection	Reference Fields	Distinct Counts	Relationships	Design Issues
assetTagMap	assetId, tagId	{"assetId":2,"tagId":3}	{"assetId":"Likely 1:N","tagId":"Likely 1:N"}	Small document using references → embedding recommended
```
Would make more sense to also include:
```
Separate Collection (References)Embedded Approach (Recommended)
assets collection: { "_id": 2, "name": "Laptop" }
assetTagMap collection: { "assetId": 2, "tagId": 3 }assets collection:{  "_id": 2,  "name": "Laptop",  "tags": [3, 4, 5] }
```
Suggested way the collection could be updated.

## Script Logic Explanation

[Schema Audit Tests](https://github.com/EricaB0123/mongodb-dba-project-atlas/tree/main/Automation%20Ideas/automation-schema-performance/NODE%20JS/TESTING%20Script%20Logic)

I started with 2 Main Classes - Seperated the logic. I've ended up with classes for running the Audit, Filtering per databases and the different mode types.
At the moment the script is run under node.js The next steps is to demonstrate in mongosh and maybe powershell to show the different outputs.

Adding a function 'getParentStatus' helps determine potential normilization. It looks at the collections reference fields, assigns parent or child. This is meant to work with the 'getRecommendation' function to recommend whether a collection should use embedding or referencing. The Next step in the script logic, must implement data safety checks before executing a collection merge. For embedding/reference recommendations, need to validate the 16MB document limit, evaluate index overhead, and account for potential data duplication.


Mongosh Testing:
[Screenshots of Updating scipt logic](https://github.com/EricaB0123/mongodb-dba-project-atlas/tree/main/docs/screenshots)








