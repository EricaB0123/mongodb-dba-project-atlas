
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

##Tools Used to create the Database, Collections and Indexes:

<img width="200" height="200" alt="image" src="https://github.com/user-attachments/assets/d4ba2ee3-7567-4fe0-b44a-c3ab60548f08" />

_I created the database via Mongo Compass and via the express js commands. To demonstrate multiple ways to create the database and collections. The aim was to demonstrated the main important aspects of the database design. Particulr choosing the right  _ 

<img width="100" height="200" alt="image" src="https://github.com/user-attachments/assets/4080c852-7b3f-4dca-bc97-55427cffbe27" />


### Index Creation

##### metadata indexes
- { datasetName: 1 } (unique)
Reason: Fast lookup of metadata by datasetName and enforcement of dataset uniqueness.
#### assets collection

Purpose:
Stores individual data records associated with a dataset.

Fields:
- datasetName (string)
- data (object)
- createdAt (date)

Indexes:
- datasetName
- createdAt


