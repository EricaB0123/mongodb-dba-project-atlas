/**
 * Cluster Administrator Role
 * Purpose: Provide cluster-level administrative permissions
 * Scope: Entire cluster (not limited to a single database)
 */

use admin;

db.createRole({
  role: "clusterAdminRole",
  privileges: [
    {
      resource: { cluster: true },
      actions: [
        "addShard",
        "removeShard",
        "enableSharding",
        "flushRouterConfig",
        "getShardMap",
        "getShardVersion",
        "listShards",
        "replSetConfigure",
        "replSetGetConfig",
        "replSetGetStatus",
        "replSetInitiate",
        "replSetResizeOplog",
        "replSetStepDown",
        "replSetSyncFrom",
        "setFeatureCompatibilityVersion",
        "setParameter",
        "serverStatus",
        "connPoolStats",
        "top",
        "listDatabases"
      ]
    }
  ],
  roles: []
});

