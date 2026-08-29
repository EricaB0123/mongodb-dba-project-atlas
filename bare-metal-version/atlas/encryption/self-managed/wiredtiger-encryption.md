# WiredTiger Encryption

## Overview

WiredTiger is the default storage engine for MongoDB and supports encrypted storage for data and logs when properly configured with the operating system or a supported key management layer.

## Key Topics

- Data files may be encrypted at the storage layer.
- Encryption keys must be protected and rotated securely.
- Recovery procedures must include the required key material and validation steps.

## Operational Guidance

- Ensure the backing storage and filesystem encryption configuration are aligned.
- Test backup and restore procedures with encryption enabled.
- Restrict access to key material and configuration files.
- Review audit trails for key access and decryption events.

## Security Checklist

- [ ] Key material secured in a properly managed vault or HSM
- [ ] Storage backend encryption validated
- [ ] Restoration process tested
- [ ] Access restricted to approved operators
