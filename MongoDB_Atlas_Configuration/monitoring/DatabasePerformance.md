# MongoDB Atlas Monitoring (Enterprise Scaffolding)

This folder represents the **monitoring foundation** for the Atlas‑centric operational platform.  
It is intentionally scaffolded — mirroring how enterprise teams begin monitoring design before full automation is implemented.

The goal of this module is to bridge the gap between **Atlas reactive telemetry** and **proactive structural monitoring**, especially around schema drift, ingestion health, and relationship inference.

---

## Current Monitoring Concepts

### Connections and Cursors
Atlas provides metrics for:
- active connections  
- open cursors  
- cursor timeouts  

These help identify application‑side issues such as:
- connection storms  
- unclosed cursors  
- inefficient pagination  

### Excess — Application Structure Issues
High cursor counts or excessive connections often indicate:
- poor connection pooling  
- chatty application behaviour  
- inefficient query patterns  

---

# Atlas Monitoring Tools (Reactive)

Atlas provides several built‑in monitoring tools:

- **Metrics Dashboard**  
- **Performance Advisor**  
- **Schema Suggestions**  
- **Performance Insights**

These tools are **reactive** — they rely on:
- slow query telemetry  
- sampled documents  
- index usage patterns  
- aggregation execution behaviour  

They highlight issues **after** they begin affecting performance.

---

# The Performance Gap: Structural Drift Detection

Atlas does **not** detect schema drift or relationship drift.  
This is where the **custom schema audit + drift detection** work in this project becomes valuable.

### Atlas Does *Not* Have:

#### 1. Relationship Pattern Detection (1:1, 1:N, N:M)
Atlas cannot infer relationship types from real data distribution.

Useful structural signals:
- distinct reference ID counts  
- relationship classification  
- PK/FK drift detection  

#### 2. Cross‑Collection Structural Analysis
Atlas tools operate **per collection** or **per query**.

Custom audit logic analyzes:
- multiple collections together  
- reference maps  
- relationship density  
- schema fingerprints  

#### 3. Proactive Schema Drift Detection
Atlas detects issues **after** they impact queries.

Custom audit logic detects drift **before** telemetry changes:
- arrays growing too large  
- documents approaching size limits  
- reference patterns becoming relational  
- ingestion changes altering structure  

This is especially valuable for:
- ingestion pipelines  
- migrations  
- evolving datasets  

#### 4. High‑Cardinality Field Detection
Atlas only warns when cardinality causes slow queries.

Custom audit logic identifies:
- high‑cardinality fields  
- over‑normalisation  
- embedding opportunities  
- reference‑density anomalies  

---

# Atlas Monitoring — Useful Areas

### Oversized Documents
Atlas flags “bloated documents” when they cause slow queries or indexing issues.

### Large / Unbounded Arrays
Atlas warns about “unbounded arrays” in Schema Suggestions.

### Embedding vs Referencing Hints
Atlas suggests embedding when `$lookup` is slow.  
Custom audit logic suggests embedding when **reference density** indicates over‑normalisation — even if no `$lookup` has occurred yet.

---

# Atlas Metrics Overview

### Query Targeting
Shows the ratio of:
- index keys scanned  
- documents returned  

Helps determine index efficiency.

### Scanned Objects
Shows the ratio of:
- scanned objects  
- returned objects  

High ratios (e.g., 100 scanned vs 10 returned) indicate:
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

Useful for workload profiling.

### CPU Utilization
Shows cluster CPU pressure and workload saturation.

### Memory Utilization
Shows working set fit and memory pressure.

---

# Under‑Utilization Signals

- Too few connections  
- Low CPU usage  
- Minimal scanned objects  
- Idle OpCounters  

Often indicates:
- over‑provisioned cluster  
- under‑used indexes  
- inefficient workload distribution  

---

# Indexes

Monitoring helps identify:
- unused indexes  
- insufficient indexes  
- redundant indexes  
- index contention  

---

# Execution Timeouts

Timeouts often indicate:
- slow queries  
- insufficient indexes  
- large scans  
- memory pressure  
- schema drift causing unexpected query patterns  

---

# Future Monitoring Additions

This folder will eventually include:

- ingestion health checks  
- schema drift scoring  
- relationship density dashboards  
- cardinality heatmaps  
- drift → Dynatrace event automation  
- batch lifecycle visualizations  
- proactive ingestion anomaly detection  

For now, this folder contains **documentation scaffolding** that aligns with the broader automation roadmap.

---

# Related Work

- [Automation Schema Performance](../../Automation%20Ideas/Automation_Schema_Performance.md)  
- [Schema Audit Foundations](../../automation-schema-performance/)  
- [Batch Monitoring](../../docs/batch-monitoring.md)

