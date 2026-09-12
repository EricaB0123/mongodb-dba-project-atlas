# mongodb-dba-project-atlas

MongoDB Atlas Enterprise DBA Project
Overview
This repository demonstrates how enterprise MongoDB Atlas workflows operate across ingestion, metadata validation, RBAC, CI/CD automation, batch monitoring, and operational runbooks.
It reflects real enterprise processes used in environments that rely on Atlas, AWS DataSync, StepFunctions, Terraform Enterprise, Vault, Jenkins, and Octopus Deploy.

The project is provided in two versions:

Docker version — containerised for reproducible development: https://github.com/EricaB0123/mongodb-dba-project-express-api-docker
atlas version — mirrors real Atlas DBA workflows without Docker: https://github.com/EricaB0123/mongodb-dba-project-atlas-

## Project Status
This project is actively evolving into a full Atlas‑centric operational platform. Several foundational components are complete, while others are intentionally in progress as part of a structured automation roadmap.

## Demonstration of DBA skills Demonstrated
This project is intentionally designed to showcase core Database Administration (DBA) competencies in a modern cloud‑based MongoDB Atlas environment. The focus is on operational discipline, secure configuration, lifecycle management, and ingestion workflows that mirror enterprise data‑platform patterns.

### Demonstration of setup
- [DBA Skills Explained](https://github.com/EricaB0123/mongodb-dba-project-atlas/blob/main/docs/DBA-SKILLS-DEMONSTRATED.md)
- Configuration/Scripts Located in [Main Folder](https://github.com/EricaB0123/mongodb-dba-project-atlas/tree/main/MongoDB_Atlas_Configuration)
- Demonstrations Located in [docs Folder](https://github.com/EricaB0123/mongodb-dba-project-atlas/blob/main/docs/)

## Completed
- Atlas connection workflows
- Metadata validation foundations
- Initial ingestion pipeline structure
- Schema audit tooling (JSON)
- dataset‑role mapping

## In Progress / Future Ideas
These components are partially implemented and currently being expanded:

- Ingestion pipeline — structured/unstructured ingestion logic
- Monitoring — batch lifecycle, ingestion health, schema audit integration
- CI/CD — detailed Terraform, Vault, and Jenkins pipelines
- Operational automation — runbook scheduling, deployment validation, Dynatrace event ingestion
- Schema Audit - Metadata governance automation Script idea. 

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
## MongoDB Atlas Administration
Enterprise Atlas workflows include:
- Atlas RBAC & OIDC integration
- Compass connection & view verification
- Atlas DDL deployment via Jenkins
- Atlas service account lifecycle
- Batch & lifecycle monitoring

## Documentation lives in:

``
docs/
src/atlas/
automation-ideas/
``
## Ingestion Pipeline (In Progress)
The ingestion pipeline simulates enterprise ingestion patterns used in Atlas‑centric environments.

## Current Features
metadata validation
structured/unstructured ingestion scaffolding
StepFunction simulation
DataSync simulation

## Endpoints
POST /ingest — structured/unstructured ingestion
GET /batch/status — batch lifecycle simulation
GET /atlas/view — Atlas view verification

Ingestion logic lives in:
MongoDB_Atlas_Configuration/src/ingestion/(https://github.com/EricaB0123/mongodb-dba-project-atlas/blob/main/MongoDB_Atlas_Configuration/ingestion/Ingestion_Tests/README.md)


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
``
ingestion/metadata/templates/
ingestion/metadata/examples/
``
## RBAC Workflow (In Progress)

RBAC simulation mirrors enterprise AD/OIDC mapping:

- DatasetUploaders
- DatasetReviewers
- asset-reader
- asset-uploader
- archival-admin

RBAC configuration lives in:

``
MongoDB_Atlas_Configuration/rbac/

``
The RBAC folder simulates enterprise Atlas access‑control patterns using custom roles created specifically for the test database. These roles mirror real Atlas operational separation between application users, DBAs, and cluster‑level administrators.

Roles Created for the Database

- clusterAdmin
    - Full administrative control over the cluster
    - Cluster‑level actions, user management, full DB access
- dbaAdministrator
    - Operational DBA role for schema, ingestion oversight, and monitoring
    - Read/write on admin DB, read/write on test DB, index creation, schema validation
- appUser
    - Least‑privilege application role used for ingestion API testing	Insert
    - read on DB collections only


This folder contains:

- Role JSON definitions
- User mappings
- Documentation explaining how Atlas RBAC ties into ingestion
- Notes on how these roles align with enterprise AD/OIDC patterns



## Batch Monitoring (In Progress)
Batch lifecycle and ingestion status are simulated using:

- run status codes
- batch status codes
- execution stages
- aggregation pipelines

Scripts live in:

``
src/atlas/monitoring/
docs/batch-monitoring.md
``

CI/CD Automation (In Progress / Future Ideas)
This project includes a forward‑looking CI/CD and operational automation roadmap designed to mirror enterprise Atlas environments.

Terraform
- Atlas provider configuration
- Vault secret retrieval
- Service account rotation

Vault
- Secret rotation
- Versioning
- Environment separation

Jenkins
- DDL pipeline
- Release branching strategy
- SIT → pre‑prod → prod promotion

Operational Automation (In Progress)
Enterprise Atlas automation patterns are being modelled, including:

- Runbook scheduling
- Deployment validation workflows
- Dynatrace event ingestion
- Ingestion quality checks
- Metadata governance automation

### Schema Drift Automation (Planned / In Progress)
Schema drift automation is a key future component of this project.
It reflects how enterprise data‑platform teams detect, score, and respond to schema changes across ingestion pipelines.

This automation will include:

- Schema audit execution (JSON‑based audit rules)
- Detection of drift between expected vs actual document structure
- Cardinality scoring for many‑to‑many relationships
- Naming drift detection (field naming inconsistencies)
- Large‑document warnings
- Automated Dynatrace event generation for drift alerts
- Integration with batch lifecycle monitoring
- Optional CI/CD enforcement (preventing deployment if drift exceeds threshold)

This aligns with real Atlas operational practices where schema drift is monitored continuously to protect ingestion reliability and downstream analytics.

[Documentation and prototypes live in:](https://github.com/EricaB0123/mongodb-dba-project-atlas/tree/main/Automation%20Ideas)

```
automation-ideas/
src/atlas/monitoring/
src/automation-schema-performance/

```

## Purpose
This project demonstrates:
- deep understanding of MongoDB Atlas
- ability to operate enterprise ingestion pipelines
- ability to automate operational workflows
- ability to integrate Atlas with AWS, Terraform, Vault, Jenkins, and Octopus
- ability to simulate real enterprise processes in a clean, modern project

It is designed as a portfolio piece for an Atlas‑focused DBA role, with optional AWS and CI/CD extensions.
