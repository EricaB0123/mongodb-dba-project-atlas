# KMS API Examples

## Example: AWS KMS

```bash
aws kms create-key --description "MongoDB Atlas encryption key" --key-usage ENCRYPT_DECRYPT --origin AWS_KMS
```

## Example: Azure Key Vault

```bash
az keyvault key create --vault-name my-vault --name mongodb-atlas-key --kty RSA --size 2048
```

## Example: Google Cloud KMS

```bash
gcloud kms keys create mongodb-atlas-key \
  --location us-central1 \
  --keyring mongodb-keyring \
  --purpose encryption
```

## Notes

- Replace sample names with real environment values.
- Use secure identity bindings and role assignments.
- Keep KMS policy changes reviewed by the appropriate security team.
- Validate each integration in a non-production environment before rollout.

## Example JSON Policy Snippet

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowKeyUse",
      "Effect": "Allow",
      "Action": [
        "kms:Encrypt",
        "kms:Decrypt",
        "kms:DescribeKey"
      ],
      "Resource": "*"
    }
  ]
}
```
