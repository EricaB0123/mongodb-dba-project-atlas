# Database Performance Metrics

## Connections and Cursors
Basic operational checks. Useful for identifying:
- too many open cursors  
- connection spikes  
- application structure issues  

## Excess – Application Structure Issues
Some performance issues come from how the application is structured rather than the database itself.

---

Atlas Monitoring tools include Metrics, Performance Advisor, Schema Suggestions, and Performance Insights.  
They are **reactive**, meaning they report issues only after they start affecting performance (slow queries, high load, etc).

There is a performance gap with Atlas monitoring around **structural drift detection** — mainly relationship inference and embedding vs referencing validation based on real data distribution, not query behaviour.

---

I've started looking into areas that could help performance further:  
[Database Design Extract Script Idea](https://github.com/EricaB0123/mongodb-dba-project-atlas/blob/main/Automation%20Ideas/Automation_Schema_Performance.md)

This compares what Atlas currently offers vs what deeper structural analysis could provide.

---

## Atlas Does NOT Have

### 1. Relationship Pattern Detection (1:1, 1:N, N:M)
Atlas does not infer relationship types from real data.

Helpful signals would include:
- counts of distinct reference IDs  
- classification of relationship behaviour  
- flags for relational drift (PK/FK patterns)  

### 2. Cross‑Collection Structural Analysis
Atlas tools work per collection or per query.

The script idea analyses:
- multiple collections together  
- reference maps  
- relationship density  
- schema fingerprints  

This helps understand how collections relate to each other, which Atlas does not show.

### 3. Proactive Schema Drift Detection
Atlas detects issues **after** they impact queries.

The script idea detects issues **before** they appear in telemetry:
- arrays growing too large  
- documents approaching size limits  
- reference patterns becoming relational  
- ingestion changes altering structure  

This is valuable for ingestion pipelines and migrations.

### 4. High‑Cardinality Field Detection
Atlas does not warn about high‑cardinality fields unless they cause slow queries.

The script idea suggests embedding when reference density indicates over‑normalisation — even if no `$lookup` has occurred yet.

---

## Atlas Monitoring – Useful Areas

### 1. Oversized Documents
Atlas flags “bloated documents” when they cause slow queries or indexing issues.

### 2. Large / Unbounded Arrays
Atlas warns about “unbounded arrays” in Schema Suggestions.

### 3. Embedding vs Referencing Hints
Atlas suggests embedding when `$lookup` is slow.  
The script idea suggests embedding earlier, based on reference density.

---

## Atlas Metrics

### Query Targeting
Shows how efficiently indexes are used (index keys scanned vs documents returned).

### Scanned Objects
Shows how many documents MongoDB had to scan vs how many it returned.

High ratios (e.g., 100 scanned vs 10 returned) usually mean:
- collection scans  
- insufficient indexes  
- poor query patterns  

### OpCounters
Tracks:
- inserts  
- updates  
- deletes  
- queries  
- commands  

Useful for understanding workload behaviour.

### CPU Utilization
Shows cluster CPU pressure.

### Memory Utilization
Shows working set fit and memory pressure.

---

## Too Few – Under Utilization
Signals include:
- low CPU  
- low memory usage  
- minimal scanned objects  
- idle OpCounters  

Often indicates:
- over‑provisioned cluster  
- under‑used indexes  
- inefficient workload distribution  

---

## Indexes
Monitoring helps identify:
- unused indexes  
- insufficient indexes  
- redundant indexes  
- index contention  

---

## Execution Timeouts
Timeouts often indicate:
- slow queries  
- missing indexes  
- large scans  
- memory pressure  
- schema drift changing query behaviour
