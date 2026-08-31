# Encryption at Rest

## Overview

Encryption at rest protects data stored on disk, including database files, backups, and snapshots. In MongoDB deployments, this is commonly implemented through encrypted storage, file system encryption, or Atlas-managed encryption features.

## Key Concepts

- Data is encrypted while persisted on disk.
- Encryption keys are managed separately from the encrypted data.
- Keys must be protected using a secure KMS or HSM-backed workflow.
- Recovery and rotation depend on secure key management practices.

## MongoDB Atlas

MongoDB Atlas provides built-in encryption at rest using cloud KMS providers and key management services. The service can be configured to use customer-managed keys (CMK) or provider-managed processes depending on the deployment model.

## Recommended Controls

- Use strong, audit-friendly key lifecycle controls.
- Restrict access to KMS credentials and key material.
- Enable logging and monitoring for key usage.
- Validate backups and snapshots are encrypted and recoverable.

## Checklist

- [ ] Encryption at rest enabled for all production clusters
- [ ] Key access restricted to appropriate identities
- [ ] Rotation policy documented and tested
- [ ] Backup and restore validation performed
