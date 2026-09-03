
# Database Performance Metrics
## Connections and Cursors
## Excess - Application Structure Issues
  

Atlas Monitoring tools — Have Metrics, Performance Advisor, Schema Suggestions, and Performance Insights. They are reactive, based on telemetry, slow queries, or sampled documents to highlight issues after they begin affecting performance.

There performance Gap with Atlas monitoring is the structrual drift detection. Mainly the relationship inference, and embedding vs referencing validation based on real data distribution, not query behaviour.

I've started looking into areas that could help the performance further:
[Database Design Extract Script Idea](https://github.com/EricaB0123/mongodb-dba-project-atlas/blob/main/Automation%20Ideas/Automation_Schema_Performance.md)
 VS Atlas Monitoring

 Atlas Does NOT Have
1. Relationship Pattern Detection (1:1, 1:N, N:M)
Atlas has no feature that infers relationship types from real data distribution.

What would be helpful: 
- counts distinct reference IDs
- classifies relationship behaviour
- flags relational drift (PK/FK patterns)

2. Cross‑Collection Structural Analysis
Atlas tools operate per collection or per query.
The script analyses:

- multiple collections together
- reference maps
- relationship density
- schema fingerprints

3. Proactive Schema Drift Detection
Atlas tools detect issues after they impact queries.
This script detects issues before they appear in telemetry:

- arrays growing too large
- documents approaching size limits
- reference patterns becoming relational
- ingestion changes altering structure

This is valuable for ingestion pipelines and migrations.

4. High‑Cardinality Field Detection
Atlas does not warn about high‑cardinality fields unless they cause slow queries.
The script suggests embedding when reference density indicates over‑normalisation — even if no $lookup has occurred yet.

### Atlas Monitoring - Useful areas
1. Oversized documents
Atlas flags “bloated documents” when they cause slow queries or indexing issues.

2. Large / unbounded arrays
Atlas warns about “unbounded arrays” in Schema Suggestions. 

3. Embedding vs referencing hints
Atlas suggests embedding when $lookup is slow. The above script suggests embedding when reference density indicates over‑normalisation — even if no $lookup has occurred yet.

  ### Atlas Metrics
   #### Query Targeting
   Displays the ratio of Index keys scanned to documents returned. Which helps us determine if the indexes are being used efficiently.
   #### Scanned Objects
   Displays the Ratio of scanned objects or documents to the number of objects returned. For example, it represents the total number of documents the database engine had to look at in memory or disk to return your results.
   
If the Ratio of scanned objects is higher than what documents are returned. Like 100 objects vs 10documents (ratio of 10, 00:1).  The query could be looking at almost every document (like a collection scan). Often this means it lacks a proper index.
or an index could be used but is known as an insufficient index.
   
   #### OpCounters
   
   #### CPU Utilization
   #### Memory Utilization

## Too few - Under Utilization
## Indexes
## Executions timeouts

