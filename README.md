# mongodb-dba-project-atlas

## MongoDB Atlas Enterprise DBA Project

This repository demonstrates how enterprise MongoDB Atlas workflows operate across ingestion, metadata validation, RBAC, CI/CD automation, batch monitoring, and operational runbooks. It reflects real enterprise processes used in environments that rely on Atlas, AWS DataSync, StepFunctions, Terraform Enterprise, Vault, Jenkins, and Octopus Deploy.

The project is provided in two versions:

- Docker version — containerised for reproducible development:  
  https://github.com/EricaB0123/mongodb-dba-project-express-api-docker

- Atlas version — mirrors real Atlas DBA workflows without Docker:  
  https://github.com/EricaB0123/mongodb-dba-project-atlas-

---

## Project Status

This project is actively evolving into a full Atlas‑centric operational platform. Several foundational components are complete, while others are intentionally in progress as part of a structured automation roadmap.

---

## Demonstration of DBA Skills

This project is intentionally designed to showcase core Database Administration (DBA) competencies in a modern cloud‑based MongoDB Atlas environment. The focus is on operational discipline, secure configuration, lifecycle management, and ingestion workflows that mirror enterprise data‑platform patterns.

### Demonstration of setup

- DBA Skills Explained  
  https://github.com/EricaB0123/mongodb-dba-project-atlas/blob/main/docs/DBA-SKILLS-DEMONSTRATED.md

- Configuration/Scripts Located in Main Folder  
  https://github.com/EricaB0123/mongodb-dba-project-atlas/tree/main/MongoDB_Atlas_Configuration

- Demonstrations Located in docs Folder  
  https://github.com/EricaB0123/mongodb-dba-project-atlas/blob/main/docs/

---

## Completed

- Atlas connection workflows  
- Metadata validation foundations  
- Initial ingestion pipeline structure  
- Schema audit tooling (JSON)  
- Dataset‑role mapping  

---

## In Progress (Currently Implemented Work)

### Ingestion Pipeline

- Structured/unstructured ingestion scaffolding  
- Express API ingestion endpoints  
- Thunder Client ingestion tests  
- Metadata ingestion workflow  
- Asset ingestion workflow  
- Batch ingestion workflow  
- Ingestion → Atlas RBAC integration using the **appUser** role  

### Monitoring

- Batch lifecycle scaffolding  
- Run status codes  
- Batch status codes  
- Execution stage simulation  
- Aggregation pipeline examples  
- Monitoring folder structure (`src/atlas/monitoring/`)  

### RBAC

Three Atlas roles created for the test database:

- **clusterAdmin**  
  - Full administrative control over the cluster  
  - Cluster‑level actions, user management, full DB access  

- **dbaAdministrator**  
  - Operational DBA role for schema, ingestion oversight, and monitoring  
  - Read/write on admin DB, read/write on test DB, index creation, schema validation  

- **appUser**  
  - Least‑privilege application role used for ingestion API testing  
  - Insert + read on DB collections only  

RBAC folder contains:

- Role JSON definitions  
- User mappings  
- Documentation explaining how Atlas RBAC ties into ingestion  
- Notes on how these roles align with enterprise AD/OIDC patterns  

### Schema Audit & Schema Drift Foundations

- JSON‑based schema audit rules  
- Initial schema‑drift detection logic  
- Field‑level comparison scaffolding  
- Naming‑drift detection concepts  
- Cardinality scoring concepts  
- Large‑document detection concepts  
- Schema audit folder structure  
- Integration points with batch monitoring  
- Early automation prototypes in:  
  - `automation-ideas/`  
  - `src/atlas/monitoring/`  
  - `src/automation-schema-performance/`

---

## Future Roadmap (Next Planned Work)

### Advanced Ingestion

- Full structured/unstructured ingestion logic  
- Ingestion quality scoring  
- Ingestion governance enforcement  

### Monitoring Enhancements

- Ingestion health checks  
- Drift‑triggered monitoring events  
- Dynatrace integration  
- Batch execution timeline dashboards  

### CI/CD Automation

- Terraform Atlas provider expansion  
- Vault secret rotation automation  
- Jenkins DDL pipeline  
- Release branching strategy  
- SIT → pre‑prod → prod promotion automation  

### Operational Automation

- Runbook scheduling  
- Deployment validation workflows  
- Metadata governance automation  
- Automated ingestion approval workflows  

### Schema Drift Automation (Full Implementation Roadmap)

- Full schema‑drift scoring engine  
- Automated drift → Dynatrace alert pipeline  
- CI/CD enforcement (block deployment on drift)  
- Drift dashboards  
- Drift lifecycle reporting  
- Drift → batch monitoring integration  

---

## Folder Structure

```
MongoDB_Atlas_Configuration/
│
├── src/
│   ├── app.js                 ← Express API entry point
│   ├── config/
│   │   └── db.js              ← MongoDB Atlas connection
│   │
│   ├── routes/                ← API endpoints
│   │   ├── ingest.js
│   │   ├── metadata.js
│   │   ├── assets.js
│   │   └── batch.js
│   │
│   ├── controllers/           ← Ingestion logic
│   │   ├── ingestController.js
│   │   ├── metadataController.js
│   │   ├── assetController.js
│   │   └── batchController.js
│   │
│   └── models/                ← MongoDB collections
│       ├── IngestQueue.js
│       ├── Metadata.js
│       ├── Asset.js
│       └── BatchRun.js
│
├── ingestion/
│   └── Ingestion_Tests/       ← Thunder Client test payloads
│
├── rbac/                      ← RBAC user + role simulation
│
├── cicd/                      ← Terraform, Vault, Jenkins (in progress)
│
├── automation-ideas/          ← Operational automation roadmap
│
├── docs/                      ← Architecture, workflows, diagrams
│
└── README.md
```

---

## MongoDB Atlas Administration

Enterprise Atlas workflows include:

- Atlas RBAC & OIDC integration  
- Compass connection & view verification  
- Atlas DDL deployment via Jenkins  
- Atlas service account lifecycle  
- Batch & lifecycle monitoring  

Documentation lives in:

```
docs/
src/atlas/
automation-ideas/
```

---

## Ingestion Pipeline (In Progress)

The ingestion pipeline simulates enterprise ingestion patterns used in Atlas‑centric environments.

### Current Features

- Metadata validation  
- Structured/unstructured ingestion scaffolding  
- StepFunction simulation  
- DataSync simulation  

### Endpoints

- POST /ingest — structured/unstructured ingestion  
- GET /batch/status — batch lifecycle simulation  
- GET /atlas/view — Atlas view verification  

Ingestion logic lives in:  
https://github.com/EricaB0123/mongodb-dba-project-atlas/blob/main/MongoDB_Atlas_Configuration/ingestion/Ingestion_Tests/README.md

---

## Metadata Workflow

Metadata follows enterprise patterns:

- datasetName  
- datasetUploaderEmail  
- datasetArchivalTeamEmail  
- datasetType  
- fileMetadata  
- retention  
- lifecycleStage  

Templates and examples:

```
ingestion/metadata/templates/
ingestion/metadata/examples/
```

---

## RBAC Workflow (In Progress)

RBAC simulation mirrors enterprise AD/OIDC mapping:

- DatasetUploaders  
- DatasetReviewers  
- asset-reader  
- asset-uploader  
- archival-admin  

RBAC configuration lives in:

```
MongoDB_Atlas_Configuration/rbac/
```

---

## Batch Monitoring (In Progress)

Batch lifecycle and ingestion status are simulated using:

- run status codes  
- batch status codes  
- execution stages  
- aggregation pipelines  

Scripts live in:

```
src/atlas/monitoring/
docs/batch-monitoring.md
```

---

## CI/CD Automation (In Progress / Future Ideas)

### Terraform

- Atlas provider configuration  
- Vault secret retrieval  
- Service account rotation  

### Vault

- Secret rotation  
- Versioning  
- Environment separation  

### Jenkins

- DDL pipeline  
- Release branching strategy  
- SIT → pre‑prod → prod promotion  

### Operational Automation (In Progress)

- Runbook scheduling  
- Deployment validation workflows  
- Dynatrace event ingestion  
- Ingestion quality checks  
- Metadata governance automation  

### Schema Drift Automation (Planned / In Progress)

Schema drift automation is a key future component of this project. It reflects how enterprise data‑platform teams detect, score, and respond to schema changes across ingestion pipelines.

This automation will include:

- Schema audit execution (JSON‑based audit rules)  
- Detection of drift between expected vs actual document structure  
- Cardinality scoring  
- Naming drift detection  
- Large‑document warnings  
- Automated Dynatrace event generation  
- Integration with batch lifecycle monitoring  
- Optional CI/CD enforcement  

Documentation and prototypes live in:

```
automation-ideas/
src/atlas/monitoring/
src/automation-schema-performance/
```

---

## Purpose

This project demonstrates:

- deep understanding of MongoDB Atlas  
- ability to operate enterprise ingestion pipelines  
- ability to automate operational workflows  
- ability to integrate Atlas with AWS, Terraform, Vault, Jenkins, and Octopus  
- ability to simulate real enterprise processes in a clean, modern project  

It is designed as a portfolio piece for an Atlas‑focused DBA role, with optional AWS and CI/CD extensions.
