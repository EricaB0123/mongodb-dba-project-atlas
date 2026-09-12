# Development vs Enterprise Alignment

This project runs on a **development Atlas cluster** with an **Express API** handling ingestion.  
There is no separate “enterprise version.”  
Instead, the project demonstrates how development work can follow enterprise‑aligned patterns.

The goal is to show how a simple development setup can model the same concepts used in real Atlas ingestion pipelines.

---

## Development Setup (Atlas Cluster)

This is the environment used while building the ingestion API and validating the database structure.

**Characteristics**
- Development Atlas cluster  
- Express API for ingestion  
- Basic metadata validation  
- Simple RBAC (single app user)  
- Quick iteration  
- No CI/CD  
- No advanced monitoring  
- No schema drift checks  

**Purpose**
- Build ingestion routes  
- Validate metadata fields  
- Test controllers and models  
- Demonstrate collection creation and indexing  
- Show how ingestion behaves in a controlled environment  

This setup focuses on development convenience and clarity.

---

## Enterprise‑Aligned Patterns (Within the Same Project)

Although the project runs on a development cluster, several components mirror how Atlas is used in enterprise environments.

**Enterprise‑aligned elements**
- Atlas RBAC structure (clusterAdmin, dbaAdministrator, appUser)  
- OIDC‑style role separation  
- Metadata catalog design  
- Ingestion lifecycle (created → validated → ingested → archived)  
- Batch run tracking  
- Queue‑based ingestion structure  
- Schema audit foundations  
- Structural drift detection ideas  
- Relationship inference concepts  
- Monitoring gaps identified (Atlas reactive vs proactive checks)  
- CI/CD placeholders (Terraform, Vault, Jenkins)  

**Purpose**
- Show operational discipline  
- Demonstrate secure access control  
- Model ingestion governance  
- Highlight monitoring gaps  
- Show proactive schema stability concepts  
- Represent how Atlas is used in real ingestion pipelines  

These patterns demonstrate how development work can align with enterprise expectations.

---

## Why This Matters

**Development side shows:**
- You can build ingestion logic  
- You understand metadata structure  
- You can design collections and indexes  
- You can test ingestion behaviour locally  
- You can validate schema and payload structure  

**Enterprise‑aligned side shows:**
- You understand Atlas RBAC  
- You understand ingestion lifecycle  
- You understand schema drift  
- You understand monitoring gaps  
- You understand CI/CD patterns  
- You understand operational workflows  
- You understand service account lifecycle  

Together, they demonstrate partial MongoDB administrator capability with a clear path toward full data‑platform engineering.

---

## Summary

There is **one project**, running on a **development Atlas cluster**, but designed using **enterprise patterns**.

This demonstrates:
- ingestion  
- metadata  
- RBAC  
- schema audit  
- monitoring  
- CI/CD awareness  
- Atlas workflows  
- enterprise folder structure  

This is the progression from development → enterprise‑aligned MongoDB administration within a single project.
