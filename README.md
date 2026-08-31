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

## Folder Structure

```
│   ├── src/
│   │   ├── atlas/
│   │   ├── ingestion/        ← in progress
│   │   ├── rbac/             ← in progress
│   │   ├── monitoring/       ← in progress
│   │   └── ddl/
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
├── cicd/                     ← in progress
│   ├── terraform/
│   ├── vault/
│   └── jenkins/
│
├── automation-ideas/         
│
├── docs/
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
docs/atlas-workflows.md
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

``
MongoDB_Atlas_Configuration/src/ingestion/
docker-version/src/ingestion/
``

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
src/atlas/rbac/
``
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

## CI/CD Automation (In Progress / Future Ideas)
- Terraform
- Atlas provider configuration
- Vault secret retrieval
- service account rotation

Vault
- secret rotation
- versioning
- environment separation

Jenkins
- DDL pipeline
- release branching strategy
- SIT → pre‑prod → prod promotion

CI/CD documentation:

```
cicd/
Automation Ideas/
```
The automation-ideas/ folder contains the forward‑looking automation roadmap for this project. It expands beyond runbooks into broader operational automation concepts.

This includes:
- schema audit automation
- Dynatrace event ingestion
- ingestion quality checks
- metadata governance automation
- runbook scheduling concepts
- deployment validation workflows

Explore the full list of ideas:

## Automation Ideas
### Architecture Documentation
Detailed architecture diagrams and workflow explanations live in:

```
docs/
Topics include:
- Atlas workflows
- ingestion flow
- metadata lifecycle
- batch monitoring
- CI/CD overview
```

## Purpose
This project demonstrates:
- deep understanding of MongoDB Atlas
- ability to operate enterprise ingestion pipelines
- ability to automate operational workflows
- ability to integrate Atlas with AWS, Terraform, Vault, Jenkins, and Octopus
- ability to simulate real enterprise processes in a clean, modern project

It is designed as a portfolio piece for an Atlas‑focused DBA role, with optional AWS and CI/CD extensions.
