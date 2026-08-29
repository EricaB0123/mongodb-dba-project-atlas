# Key Rotation

## Purpose

Key rotation reduces the risk of long-lived encryption keys being compromised or reused beyond their intended lifecycle. Rotation must be planned and tested carefully.

## Rotation Strategy

1. Confirm the key version and current usage scope.
2. Generate or import a new active key.
3. Update the service configuration or KMS references.
4. Re-encrypt or re-wrap existing data if required by the implementation.
5. Validate access to old and new keys during a controlled transition.
6. Retire old keys only after verification and retention requirements are met.

## Operational Tips

- Rotate according to policy and risk tolerance.
- Document emergency procedures and rollback points.
- Monitor certificate and key expiry notifications.
- Keep evidence of successful validation and audits.

## Common Failure Modes

- Service downtime due to missing key access
- Partial data access issues during rotation windows
- Misconfigured permission changes in KMS or vault platforms
- Failure to update backup or snapshot restore paths
