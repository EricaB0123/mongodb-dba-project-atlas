/**
 * appUser.js
 *
 * Atlas RBAC User: appUser
 *
 * Purpose:
 * - Least‑privilege application user used by the Express ingestion API.
 * - Demonstrates secure ingestion patterns using minimal permissions.
 *
 * Role Mapping:
 * - role: "testReadInsertRole"
 * - db: "admin"
 *
 * Notes:
 * - The actual user is created directly in Atlas.
 * - This file documents how the user is mapped to the custom role.
 * - The ingestion API uses this user to insert/read documents in the test database.
 */

module.exports = {
  user: "srvTestAppUser",   // your actual Atlas username
  role: "testReadInsertRole",
  database: "admin",
  description: "Least‑privilege application user for ingestion API testing."
};
