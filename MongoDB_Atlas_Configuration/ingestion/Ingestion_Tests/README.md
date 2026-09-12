## How Ingestion Works

- Routes define the API endpoints
- Controllers contain the logic that runs when an endpoint is called
- Models define the MongoDB collections and document structure
- Mongoose writes the documents into Atlas


The route folder contains the following fields:
- /ingest → ingest route
- /metadata → metadata route
- /assets → assets route
- /batch → batch route

This is the current folder structure:

```
MongoDB_Atlas_Configuration/
│
├── src/
│   ├── app.js
│   ├── config/
│   │   └── db.js
│   │
│   ├── routes/
│   │   ├── ingest.js
│   │   ├── metadata.js
│   │   ├── assets.js
│   │   └── batch.js
│   │
│   ├── controllers/
│   │   ├── ingestController.js
│   │   ├── metadataController.js
│   │   ├── assetController.js
│   │   └── batchController.js
│   │
│   └── models/
│       ├── IngestQueue.js
│       ├── Metadata.js
│       ├── Asset.js
│       └── BatchRun.js
│
├── ingestion/
│   └── Ingestion_Tests/   ← Thunder Client / REST Client test payloads
│
└── .env                   ← MongoDB Atlas connection string
```

The POST ingestion requests are sent to /ingest. Express then forwards the requests to the controller. The Controller then validates and then writes the documnet to the correct model. Documents are created using the Mongoose Model, which sends to the Atlas DB.

The following shows a demonstration of the following steps in :

1. Send a Post Request
2. App.js Routes this
3. routes forward this to the controllers
4. Controllers insert documents
5. Mongoose writes the documents in Atlas
   

## Connecting to the MongoDb via express APi

The server starts successfully, showing the following:

- The API listening on port 3000
- A successful connection message from Mongoose
- Confirmation that Atlas is reachable

<img width="1094" height="252" alt="image" src="https://github.com/user-attachments/assets/6c2a05a1-c93c-435b-8cf3-13a909d020ac" />

## Using Thunder Client to Send Ingestion Requests
Used Thunder Client to send HTTP requests to the Express API, triggering an ingestion into MongoDB Atlas.

<img width="1052" height="695" alt="image" src="https://github.com/user-attachments/assets/852ad496-d521-48ff-bc37-4b730b19d76e" />

### Example: Sending a Test POST Request
This creates a new ingestion queue entry in the MongoDB Atlas.

<img width="1037" height="712" alt="image" src="https://github.com/user-attachments/assets/513db623-d372-46e5-842c-2cef41bfc470" />

### Example: Sending Metadata

<img width="1062" height="701" alt="image" src="https://github.com/user-attachments/assets/cdcbfa41-560f-4389-8cd3-e575086d12b9" />

### Example: Sending Asset Data
<img width="1047" height="747" alt="image" src="https://github.com/user-attachments/assets/ca4eee17-77a0-47fd-9f34-4df82ce42892" />

### Example: Creating a Batch

<img width="1050" height="745" alt="image" src="https://github.com/user-attachments/assets/14ddc187-6e10-441a-9661-deed8399d9a7" />

## Verifying Documents in MongoDB Atlas
Proof documents are showing in mongodb after ingesting. After sending POST requests, the inserted documents appear in the Atlas cluster under the database specified in the .env connection string. I tested this under the 'app user' configured in the [RBAC folder](https://github.com/EricaB0123/mongodb-dba-project-atlas/tree/main/MongoDB_Atlas_Configuration/rbac).

<img width="1003" height="411" alt="image" src="https://github.com/user-attachments/assets/c5572902-f05b-46c5-82f6-976c1d738618" />













