/**
 * RBAC Script: Application User for 'test' Database
 * Permissions: find, insert (least privilege)
 * Author: Erica
 * This role ONLY allows reading and inserting data into the
 * 'test' database. No updates, no deletes, no drops, no admin.
 */

use admin;
db.createRole({
  role: "testReadInsertRole",
  privileges: [
    {
      resource: { db: "test", collection: "" },
      actions: ["insert"]
    }
  ],
  roles: [
    { role: "read", db: "test" }   // inherit built-in read-only role
  ]
});


print("Application RBAC for 'test' database created successfully.");

