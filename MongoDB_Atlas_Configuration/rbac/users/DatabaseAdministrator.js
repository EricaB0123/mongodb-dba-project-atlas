
/**
 * DatabaseAdministrator.js
 * 
 * Atlas RBAC User: dbaAdministrator
 * 
 * Purpose:
 * - Operational DBA persona for schema management, ingestion oversight,
 *   index creation, metadata validation, and monitoring.
 * 
 * Role Mapping:
 * - role: "dbaAdministrator"
 * - db: "admin"
 * 
 * Notes:
 * - Has full read/write on admin DB and test DB.
 * - Used for validating ingestion behaviour and schema audit workflows.
 * - Mirrors enterprise DBA roles with elevated but controlled privileges.
 */

module.exports = {
  user: "dbaAdministrator",
  role: "dbaAdministrator",
  database: "admin",
  description: "Operational DBA role for schema, ingestion, and monitoring."
};
