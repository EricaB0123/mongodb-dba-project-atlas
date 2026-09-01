# DBA Skills Demonstrated
This project is intentionally designed to showcase core Database Administration (DBA) competencies in a modern cloud‑based MongoDB Atlas environment. The focus is on operational discipline, secure configuration, lifecycle management, and ingestion workflows that mirror enterprise data‑platform patterns.

### Demonstration of setup

  - Configuration/Scripts Located in [Main Folder](https://github.com/EricaB0123/mongodb-dba-project-atlas/tree/main/MongoDB_Atlas_Configuration/)
  - Demonstrations Located in [docs Folder](https://github.com/EricaB0123/mongodb-dba-project-atlas/tree/main/MongoDB_Atlas_Configuration/screenshots)


## 1. Authentication, RBAC & User Management
- This project demonstrates secure and intentional user separation within MongoDB Atlas:
- Creation of multiple Atlas users with role‑appropriate privileges
- Use of SCRAM authentication
- Secure handling of credentials via .env (excluded from repo)
- Demonstration of least‑privilege access for ingestion, monitoring, and administrative tasks
- Clear documentation of cluster setup, user creation, and network access (see DBA‑Setup.md)
- This reflects real‑world operational practice where DBAs enforce strict access boundaries.

- [RBAC Setup demonstration/scripts](https://github.com/EricaB0123/mongodb-dba-project-atlas/tree/main/MongoDB_Atlas_Configuration/rbac)

#### Creating Database Users in Atlas
  
  <img width="400" height="200" alt="Creating Database User using SCRAM - Simulating custom vs Default Roles" src="https://github.com/user-attachments/assets/8c112365-31c6-425c-b6bb-481214dc4421" />

_in this example is demonstrates 2 user types. I ended up with dbAdmin for 'DBA' and readWrite for the other 'user'. Felt readWriteAnyDatabase can be further controlled with custom roles._

<img width="400" height="200" alt="image" src="https://github.com/user-attachments/assets/75aca513-9faa-4a1c-b44b-cf4aa2497216" />


_in this example i'm filtering through custom role vs default. I ended up just specifying 1 database for now with the ability to read and write_

<img width="400" height="200" alt="image" src="https://github.com/user-attachments/assets/cc0cb56d-a65c-4e1a-b2ad-18a75fde786d" />


MongoDB Atlas provides a set of default built‑in roles, such as:

- read
- readWrite
- dbAdmin
- clusterMonitor
- readWriteAnyDatabase
- dbAdminAnyDatabase
- atlasAdmin

However, these roles can be then be further controlled with the usage of custom roles. To enforce least-privilege access and align permissions with operational responsibilities. 

_There are several roles within the Atlas UI, that could be separated from the DBA and Application role. Some settings like the 'autoCompact' where background tasks or  an automation account that handles these processes. For example, a ClusterMonitorRole_

This project demonstrates a realistic split between two operational personas:

##### Database Administrator (DBA)
Elevated privileges
Ability to manage indexes, collections, and lifecycle operations
Responsible for cluster health, schema validation, and ingestion governance.

##### Application User (readWrite)
- Limited to inserting and reading documents
- No administrative privileges
- Cannot modify indexes, roles, or cluster configuration
  
_often there are difference in opinions to the level of access an application 'user' vs application 'service' has. The usage of the custom roles can allow for further granularity like only granting 'users' to specific indexes. To enforce the difference in responsibilities in the Cluster, Database levels. It can help to prevent the difference in 'adding app changes' vs managing a database_

##### SCRAM Authentication
Both users authenticate using SCRAM‑SHA, the industry‑standard mechanism for MongoDB Atlas.

SCRAM ensures:
- password hashing
- challenge‑response authentication
- secure credential exchange
- compatibility with Atlas connection strings

In enterprise environments, SCRAM is typically paired with:

- RBAC (Role‑Based Access Control)
- IP allowlists
- network boundaries
- audit logging

_My preference with database security would be Users setup within Active Directory (AD) or LDAP groups.
This then enforces the RBAC roles further, by automatically granting MongoDB permissions based on AD group memberships. You can also have further control within the organisation to who actually gets added to the groups.
In [RBAC Folder](https://github.com/EricaB0123/mongodb-dba-project-atlas/tree/main/MongoDB_Atlas_Configuration/rbac) I have demonstrated this sepration duty in dev Atlas cluster. The ideal setup would be usage of Groups and away from SCRAM accounts_ 

## Role setup and Justification
<img width="200" height="200" alt="image" src="https://github.com/user-attachments/assets/193f85ec-4144-4948-8305-dbaa596e0b89" />

The Database Administrator role is designed to give a user the ability to perform operational tasks across the database environment. This includes creating, modifying, and dropping collections, indexes, and user‑defined roles. A DBA also requires access to administrative functions such as user management, schema validation, and performance tuning. 
By default you could apply the 'AtlasAdmin' role. However, grants very broad permissions — including cluster‑level configuration, project‑wide settings, and administrative actions that may exceed what a traditional DBA needs.

To follow least‑privilege principles, it is often better to create a custom DBA role that limits permissions to:

- Cluster‑level monitoring (e.g., serverStatus, connPoolStats)
- Administrative actions within the admin database
- Full control over specific application databases

This approach avoids granting global cluster configuration rights unless they are explicitly required. In many cases, applying the built‑in dbAdmin role on selected databases — combined with custom privileges — provides a safer and more controlled permission model.

This separation ensures:

- Cluster configuration remains restricted
- DBAs can manage data structures and indexes
- Application users only receive DB‑level permissions
- Operational monitoring can be delegated without full admin access
- It also aligns with enterprise RBAC patterns where cluster‑level, DBA‑level, and DB‑level responsibilities are clearly separated.


## 2. Schema Design & Validation
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

## 3. Indexing Strategy & Query Performance
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

## 4. Ingestion Workflow & Lifecycle Management
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

## 5. Monitoring, Observability & Operational Awareness
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

## 6. Secure Operational Practices
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

## 7. Realistic Cloud Administration
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

## Summary
This project - has some DBA‑focused demonstration of:

- Secure setup
- RBAC
- Schema validation
- Indexing
- Ingestion workflows
- Monitoring
- Operational discipline
- Cloud database administration

It reflects the responsibilities of a modern Database Administrator / Data Platform Engineer working with MongoDB Atlas in an enterprise environment.
