// Example field-level encryption helper for application-side protection

function encryptFields(document, key, fieldsToEncrypt) {
  const encrypted = { ...document };

  for (const field of fieldsToEncrypt) {
    if (Object.prototype.hasOwnProperty.call(encrypted, field) && encrypted[field] !== null && encrypted[field] !== undefined) {
      encrypted[field] = `${key}:${String(encrypted[field])}`;
    }
  }

  return encrypted;
}

module.exports = { encryptFields };
