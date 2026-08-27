
### Database Collection Setup

- Metadata — describes datasets (who, what, structure)
- Assets — actual data records tied to a dataset
- BatchRuns — tracks ingestion runs and lifecycle
- IngestQueue — tracks queued ingestion tasks

### Fields for each collection

##### metadata
- datasetName (string, required, unique)
- uploaderEmail (string, required)
- fields (array of { name, type })
- createdAt (date, required)

##### assets
- datasetName (string, required)
- data (object, required)
- createdAt (date, required)

##### batchRuns
- batchId (string, required, unique)
- runStatus (string: pending/running/succeeded/failed)
- lifecycleStage (string: created/validated/ingested/archived)
- startedAt (date)
- completedAt (date)

##### ingestQueue
- datasetName (string, required)
- status (string: queued/running/completed/failed)
- createdAt (date)
- updatedAt (date)
