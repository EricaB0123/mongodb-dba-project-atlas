
/**
 * clusteradmin.js
 * 
 * Atlas RBAC User: clusterAdmin
 * 
 * Purpose:
 * - Full administrative control over the Atlas cluster.
 * - Used for cluster‑level operations, role creation, user creation,
 *   and administrative validation tasks.
 * 
 * Role Mapping:
 * - role: "clusterAdmin"
 * - db: "admin"
 * 
 * Notes:
 * - This user is NOT used for ingestion.
 * - Mirrors enterprise AD/OIDC cluster‑level admin personas.
 */

module.exports = {
  user: "clusterAdmin",
  role: "clusterAdmin",
  database: "admin",
  description: "Full cluster administrator for Atlas operational tasks."
};
