# KMS and BYOK Overview

## Overview

Customer-managed keys allow organizations to retain control over encryption keys used by MongoDB Atlas and other managed services. This is commonly referred to as Bring Your Own Key (BYOK).

## Why Use BYOK

- Greater control over key material
- Easier alignment with compliance standards
- Better auditing and separation of duties
- Support for centralized key lifecycle governance

## Typical Flow

1. Create or import an encryption key in the KMS.
2. Configure the cloud provider or Atlas integration.
3. Grant the service principal or identity access to the key.
4. Validate that the deployment uses the key for encryption at rest.
5. Monitor key activity and rotation events.

## Considerations

- Ensure key policies grant the minimum required permissions.
- Keep the KMS region aligned with the deployment region when required.
- Maintain disaster recovery procedures for key accessibility.
- Include operational ownership for rotation, revocation, and emergency access.

## Security Principles

- Least privilege
- Segregation of duties
- Key rotation and auditability
- Secure storage of key metadata and credentials
