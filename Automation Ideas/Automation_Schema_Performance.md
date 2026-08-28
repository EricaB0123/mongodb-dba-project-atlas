### Schema Audit Script

#### Overview

This script is designed to give me a practical, data‑driven view of how collections relate to each other based on what’s actually stored in the database. It analyses document structures and reference IDs to work out whether a relationship behaves like 1:1, 1:N, or N:M, and flags any embedded arrays that have grown past 100 items.

It also checks for oversized documents, large arrays, and high‑cardinality fields. From there, it provides guidance on whether embedding or referencing is still appropriate, especially if the current pattern is drifting away from MongoDB’s recommended design practices.

The main purpose is to act as a guardrail during migrations, ingestion changes, or routine schema reviews. Atlas has great tools like Performance Advisor and Data Modeling, but they’re reactive — they rely on query telemetry and only highlight issues once they start affecting performance.

This script is proactive. It helps me validate that the schema still aligns with how the application consumes data and catches structural drift early — especially cases where the model starts becoming overly normalized or rigid, similar to traditional relational PK/FK patterns. The aim is to ensure embedding vs referencing decisions haven’t silently shifted in a way that could cause performance degradation later.

#### What the Script Does
- Relationship Detection  
Determines whether a collection pair behaves as 1:1, 1:N, or N:M based on reference distribution and document counts.
- Embedded Array Analysis  
Flags any documents containing embedded arrays with more than 100 items, a common early indicator of performance drift.
- High‑Cardinality Field Checks  
Identifies fields with excessive distinct values that may impact indexing or query performance.
- Oversized Document Detection  
Highlights documents approaching MongoDB’s 16MB limit or showing signs of unbounded growth.
- Embedding vs Referencing Recommendations  
Suggests whether embedding or referencing is more appropriate based on observed patterns, array growth, and relationship density.

## Demonstration 

