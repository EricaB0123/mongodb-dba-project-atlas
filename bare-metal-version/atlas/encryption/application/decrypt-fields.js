// Example field-level decryption helper for application-side protection

function decryptFields(document, key, fieldsToDecrypt) {
  const decrypted = { ...document };

  for (const field of fieldsToDecrypt) {
    if (Object.prototype.hasOwnProperty.call(decrypted, field) && typeof decrypted[field] === 'string') {
      const prefix = `${key}:`;
      if (decrypted[field].startsWith(prefix)) {
        decrypted[field] = decrypted[field].slice(prefix.length);
      }
    }
  }

  return decrypted;
}

module.exports = { decryptFields };
