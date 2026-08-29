# Encryption Local Notes

This folder contains local-only encryption and key management notes that are intentionally excluded from Git tracking.

## Purpose

These files are kept locally for environment-specific configuration and security-sensitive material such as:

- self-managed MongoDB TLS settings
- local KMS and KMIP notes
- application-level encryption examples
- key rotation guidance
- local encryption policy samples

## Files Included

- atlas/encryption/encryption-at-rest.md
- atlas/encryption/encryption-in-transit.md
- atlas/encryption/kms-api-examples.md
- atlas/encryption/kms-byok-overview.md
- atlas/encryption/self-managed/mongod.conf
- atlas/encryption/self-managed/kmip-overview.md
- atlas/encryption/self-managed/wiredtiger-encryption.md
- atlas/encryption/self-managed/key-rotation.md
- atlas/encryption/application/encrypt-fields.js
- atlas/encryption/application/decrypt-fields.js
- atlas/encryption/application/encryption-policy.json

