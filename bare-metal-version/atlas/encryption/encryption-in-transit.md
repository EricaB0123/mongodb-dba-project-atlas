# Encryption in Transit

## Overview

Encryption in transit protects data while it is moving between clients, applications, and MongoDB services. This typically uses TLS/SSL to encrypt network traffic.

## MongoDB Transport Security

- TLS certificates authenticate the server and optionally the client.
- MongoDB clients can enforce certificate validation.
- Network boundaries should still be restricted with firewall and security groups.

## Typical Configuration

- Enable TLS on the MongoDB listener.
- Use valid certificates from a trusted CA or internal PKI.
- Require mutual TLS where appropriate for higher trust models.
- Rotate certificates in a controlled, monitored process.

## Best Practices

- Avoid plaintext or unencrypted connections for production.
- Restrict ports to authorized application and management systems.
- Monitor certificate expiry and renewal reminders.
- Keep TLS versions and cipher suites aligned with security baselines.

## Example TLS Flow

```
Application -> MongoDB: TLS handshake
Application -> MongoDB: Encrypted data exchange
MongoDB -> Application: Encrypted response
```
