/* Already have a user Created. 
   This script adds an existing user by altering the user, to the testReadInsertRole created in rbac/roles.
*/

use admin;

db.grantRolesToUser(
  "srv########",                      <----- left user name blank on purpose.
  [
    { role: "testReadInsertRole", db: "admin" }
  ]
);

