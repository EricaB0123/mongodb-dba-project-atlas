# Architecture Overview

## Database Setup

### metadata  
Stores dataset‑level information and structural definitions.  
Acts as the ingestion system’s **[metadata catalog](ca://s?q=Explain_metadata_catalog)**.

**Purpose**
- Identify datasets uniquely  
- Track who uploaded the dataset  
- Describe expected fields and types  
- Provide schema governance for ingestion  

**Required Fields**
- datasetName — unique identifier  
- uploaderEmail — audit trail  
- fields[] — array describing field names and types  
- createdAt — timestamp for lifecycle and retention  

---

### assets  
Stores the actual data records belonging to a dataset.  
This is the ingestion system’s **[payload layer](ca://s?q=Explain_payload_layer)**.

**Purpose**
- Store individual records tied to a dataset  
- Support flexible document shapes  
- Enable dataset‑level queries and lifecycle operations  

**Required Fields**
- datasetName — links asset to metadata  
- data — the ingested record  
- createdAt — supports retention, sorting, monitoring  

---

### batchRuns  
Tracks ingestion runs and their lifecycle stages.  
This is the system’s **[operational heartbeat](ca://s?q=Explain_operational_heartbeat)**.

**Purpose**
- Record ingestion attempts  
- Track run status (pending, running, succeeded, failed)  
- Track lifecycle stage (created, validated, ingested, archived)  
- Support monitoring and troubleshooting  

**Required Fields**
- batchId — unique identifier  
- runStatus — operational state  
- lifecycleStage — ingestion lifecycle  
- startedAt / completedAt — duration and SLA tracking  

---

### ingestQueue  
Represents queued ingestion tasks waiting to be processed.  
This is the ingestion system’s **[orchestration layer](ca://s?q=Explain_ingestion_orchestration)**.

**Purpose**
- Queue datasets for ingestion  
- Track queue state  
- Support ingestion processors  
- Detect stuck or failed jobs  

**Required Fields**
- datasetName — identifies dataset  
- status — queued, running, completed, failed  
- createdAt — queue entry timestamp  
- updatedAt — last state change  

---

## Database Collection Setup

- Metadata — describes datasets (who, what, structure)  
- Assets — actual data records tied to a dataset  
- BatchRuns — tracks ingestion runs and lifecycle  
- IngestQueue — tracks queued ingestion tasks  

---

## Fields for Each Collection

### metadata
- datasetName (string, required, unique)  
- uploaderEmail (string, required)  
- fields (array of { name, type })  
- createdAt (date, required)  

### assets
- datasetName (string, required)  
- data (object, required)  
- createdAt (date, required)  

### batchRuns
- batchId (string, required, unique)  
- runStatus (string: pending / running / succeeded / failed)  
- lifecycleStage (string: created / validated / ingested / archived)  
- startedAt (date)  
- completedAt (date)  

### ingestQueue
- datasetName (string, required)  
- status (string: queued / running / completed / failed)  
- createdAt (date)  
- updatedAt (date)  

---

## Tools Used to Create the Database, Collections, and Indexes

<img width="200" height="200" alt="image" src="https://github.com/user-attachments/assets/d4ba2ee3-7567-4fe0-b44a-c3ab60548f08" />

I created the database via Mongo Compass and via Express.js commands to demonstrate multiple ways to create the database and collections. The aim was to demonstrate the main important aspects of the database design — particularly choosing the right collation and fields.

<img width="450" height="100" alt="image" src="https://github.com/user-attachments/assets/4080c852-7b3f-4dca-bc97-55427cffbe27" />

Using JS to create the indexes as part of one script.

<img width="450" height="100" alt="image" src="https://github.com/user-attachments/assets/e94fcb90-1685-4c61-9dab-dc1dcf1f04cf" />

---

## Collation Strategy

All ingestion‑related collections use:

```
{
  "locale": "en",
  "strength": 2
}
```

**Reason**
- Ensures case‑insensitive matching for datasetName, runStatus, lifecycleStage, and queue status  
- Prevents ingestion failures caused by case mismatches  
- Provides predictable sorting and filtering  
- Matches enterprise Atlas DBA standards  

**Collections using this collation**
- metadata  
- assets  
- batchRuns  
- ingestQueue  

Indexes inherit this collation automatically.

---

## Index Creation

### metadata indexes
- `{ datasetName: 1 }` (unique)  
  **Reason:** Fast lookup of metadata by datasetName and enforcement of dataset uniqueness.

---

### assets collection

**Purpose**  
Stores individual data records associated with a dataset.

**Fields**
- datasetName (string)  
- data (object)  
- createdAt (date)  

**Indexes**
- datasetName  
- createdAt  
