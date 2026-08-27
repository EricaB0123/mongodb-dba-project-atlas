# mongodb-dba-project-atlas-bare-metal

MongoDB Atlas Enterprise DBA Project
Overview
This repository demonstrates how enterprise MongoDB Atlas workflows operate across ingestion, metadata validation, RBAC, CI/CD automation, batch monitoring, and operational runbooks.
It reflects real enterprise processes used in environments that rely on Atlas, AWS DataSync, StepFunctions, Terraform Enterprise, Vault, Jenkins, and Octopus Deploy.

The project is provided in two versions:

Docker version — containerised for reproducible development: https://github.com/EricaB0123/mongodb-dba-project-express-api-docker

Bare‑metal version — mirrors real Atlas DBA workflows without Docker: https://github.com/EricaB0123/mongodb-dba-project-atlas-bare-metal

Project Versions
1. docker-version/
A containerised version of the project designed for reproducible development environments and CI/CD pipelines.
This version demonstrates modern DevOps practices and is suitable for teams using Docker in development.

Includes:

- Dockerfile
- docker-compose.yml
- containerised Express ingestion service
- local MongoDB container (optional)
- environment variable injection
- isolated dev environment

2. bare-metal-version/
- A non‑Docker version designed to reflect real enterprise Atlas DBA workflows.
- This version demonstrates how Atlas DBAs work in environments where Atlas, Terraform, Jenkins, and Octopus are used without containerisation.

Includes:

- direct Atlas connection
- Express ingestion pipeline
- metadata validation
- structured/unstructured ingestion
- batch monitoring
- lifecycle stages
- RBAC/OIDC mapping
- operational runbooks
- CI/CD deployment steps

This version aligns with enterprise environments where Atlas is the primary database platform.

Folder Structure

```
mongo-enterprise-dba-project/
│
├── docker-version/
│   ├── docker-compose.yml
│   ├── Dockerfile
│   └── src/
│
├── bare-metal-version/
│   ├── src/
│   │   ├── atlas/
│   │   ├── ingestion/
│   │   ├── rbac/
│   │   ├── monitoring/
│   │   └── ddl/
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
├── cicd/
│   ├── terraform/
│   ├── vault/
│   └── jenkins/
│
├── octopus-runbooks/
│
├── docs/
│
└── README.md

```


### MongoDB Atlas Administration

- Capabilities
- Atlas RBAC & OIDC integration
- Compass connection & view verification
- Atlas DDL deployment via Jenkins
- Atlas service account lifecycle
- Batch & lifecycle monitoring
- Atlas workflows are documented in:

```
docs/atlas-workflows.md
src/atlas/
octopus-runbooks/

```

### Ingestion Pipeline 

#### Features
- metadata validation
- structured dataset ingestion
- unstructured dataset reference storage
- StepFunction simulation
- DataSync simulation

#### Endpoints
- POST /ingest — ingest structured/unstructured data
- GET /batch/status — simulate batch lifecycle monitoring
- GET /atlas/view — verify Atlas view access

#### Ingestion logic lives in:

```
bare-metal-version/src/ingestion/
docker-version/src/ingestion/
```

#### Metadata Workflow
Metadata follows enterprise patterns:

- datasetName
- datasetUploaderEmail
- datasetArchivalTeamEmail
- datasetType
- fileMetadata
- retention
- lifecycleStage

Metadata templates and examples are stored in:

```
ingestion/metadata/templates/
ingestion/metadata/examples/
```


#### RBAC Workflow
RBAC simulation mirrors enterprise AD/OIDC mapping:

- DatasetUploaders
- DatasetReviewers
- asset-reader
- asset-uploader
- archival-admin

RBAC configuration lives in:

```
src/atlas/rbac/
```


### Batch Monitoring

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


### CI/CD Automation

Terraform

- Atlas provider configuration
- Vault secret retrieval
- service account rotation

### Vault
- secret rotation
- versioning
- environment separation

### Jenkins
- DDL pipeline
- release branching strategy
- SIT → pre‑prod → prod promotion

### CI/CD documentation lives in:

``
cicd/
``

### Octopus Runbooks
Operational automation is documented in:

```
octopus-runbooks/
```

##### Runbooks include:

- Atlas connection provisioning
- RBAC mapping
- metadata validation
- ingestion trigger
- DDL deployment
- batch monitoring
- service account rotation

These runbooks mirror real enterprise operational workflows.

### Architecture 
 Documentation
Detailed architecture diagrams and workflow explanations live in:

``
docs/
``

Topics include:

- Atlas workflows
- ingestion flow
- metadata lifecycle
- batch monitoring
- CI/CD overview

### Purpose
This project demonstrates:

- deep understanding of MongoDB Atlas
- ability to operate enterprise ingestion pipelines
- ability to automate operational workflows
- ability to integrate Atlas with AWS, Terraform, Vault, Jenkins, and Octopus
- ability to simulate real enterprise processes in a clean, modern project

It is designed as a portfolio piece for an Atlas‑focused DBA role, with optional AWS and CI/CD extensions.
