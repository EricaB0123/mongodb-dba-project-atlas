# DBA Skills Demonstrated
This project is intentionally designed to showcase core Database Administration (DBA) competencies in a modern cloud‑based MongoDB Atlas environment. The focus is on operational discipline, secure configuration, lifecycle management, and ingestion workflows that mirror enterprise data‑platform patterns.

## 1. Authentication, RBAC & User Management
- This project demonstrates secure and intentional user separation within MongoDB Atlas:
- Creation of multiple Atlas users with role‑appropriate privileges
- Use of SCRAM authentication
- Secure handling of credentials via .env (excluded from repo)
- Demonstration of least‑privilege access for ingestion, monitoring, and administrative tasks
- Clear documentation of cluster setup, user creation, and network access (see DBA‑Setup.md)
- This reflects real‑world operational practice where DBAs enforce strict access boundaries.

  Located in docs/screenshots/:
  
  <img width="1522" height="582" alt="Creating Database User using SCRAM - Simulating custom vs Default Roles" src="https://github.com/user-attachments/assets/8c112365-31c6-425c-b6bb-481214dc4421" />

<img width="865" height="187" alt="Testing Database Connection using Express connection" src="https://github.com/user-attachments/assets/787cc189-b83d-4b7a-85d7-990a2b68eb1b" />


🔹 2. Schema Design & Validation
Although MongoDB is schema‑flexible, this project uses Mongoose models to enforce predictable structure:

- Metadata schema
- Asset schema
- Batch lifecycle schema
- Ingestion queue schema

This demonstrates:

- Controlled ingestion
- Predictable document shape
- Validation of required fields
- Lifecycle stage consistency

Schema validation is a critical DBA responsibility in systems where data quality matters.

🔹 3. Indexing Strategy & Query Performance
Indexes are defined and documented to support ingestion, lookup, and monitoring workflows:

- Unique indexes for identifiers (e.g., datasetName, batchId)
- Supporting indexes for lifecycle queries (runStatus, lifecycleStage)
- Time‑based indexes (createdAt) for monitoring and retention workflows

This demonstrates:

- Understanding of query patterns
- Performance tuning
- Operational readiness for scale
- Awareness of ingestion latency and monitoring needs

Indexes are documented in ddl/indexes.md.

🔹 4. Ingestion Workflow & Lifecycle Management
The project simulates a realistic ingestion pipeline:

- Metadata ingestion
- Structured asset ingestion
- Batch run creation
- Lifecycle stage transitions
- Ingestion queue processing

This mirrors enterprise ingestion systems where DBAs must:

- Monitor ingestion health
- Track batch runs
- Identify failures
- Support operational troubleshooting

Screenshots and workflow documentation are included in DBA‑Setup.md.

🔹 5. Monitoring, Observability & Operational Awareness
The project includes:

- Batch lifecycle tracking
- Ingestion queue state monitoring
- Timestamp‑based analysis
- Separation of ingestion vs monitoring responsibilities
- Documentation of cluster metrics and user activity

This demonstrates the DBA’s role in:

- Operational visibility
- Troubleshooting
- Performance analysis
- Lifecycle governance

🔹 6. Secure Operational Practices
This repository intentionally excludes sensitive operational files:

- .env
- Connection logic
- Controller logic
- Credentials
- Internal configuration

The README instructs reviewers to request access to restricted files.
This demonstrates:

- Security awareness
- Proper credential handling
- Professional repository hygiene
- Real‑world operational discipline

🔹 7. Realistic Cloud Administration
Screenshots and documentation show:

- Cluster creation
- User creation
- Role assignment
- Network access configuration
- Compass connection
- Connection string handling
- Password encoding
- Multi‑user authentication

This provides concrete evidence of hands‑on Atlas administration.

🟦 Summary
This project is not just an Express API — it is a DBA‑focused demonstration of:

- Secure setup
- RBAC
- Schema validation
- Indexing
- Ingestion workflows
- Monitoring
- Operational discipline
- Cloud database administration

It reflects the responsibilities of a modern Database Administrator / Data Platform Engineer working with MongoDB Atlas in an enterprise environment.
