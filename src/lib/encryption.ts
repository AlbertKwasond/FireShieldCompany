import crypto from 'crypto';

function getEncryptionKey() {
  const secretKey = process.env.ENCRYPTION_KEY ?? process.env.JWT_SECRET;
  if (!secretKey) {
    throw new Error(
      'FATAL: Neither ENCRYPTION_KEY nor JWT_SECRET is set. ' +
      'The application cannot start without a secure encryption key.'
    );
  }
  return crypto.scryptSync(secretKey, 'fireshield-enc-salt', 32);
}

const ALGORITHM = 'aes-256-gcm';

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(12); // 96-bit IV is standard for GCM
  const cipher = crypto.createCipheriv(ALGORITHM, getEncryptionKey(), iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag().toString('hex');
  
  // Return the IV, Encrypted Text, and Auth Tag separated by colons
  return `${iv.toString('hex')}:${encrypted}:${authTag}`;
}

export function decrypt(encryptedText: string): string | null {
  try {
    const parts = encryptedText.split(':');
    if (parts.length !== 3) {
      return null;
    }

    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    const authTag = Buffer.from(parts[2], 'hex');

    const decipher = crypto.createDecipheriv(ALGORITHM, getEncryptionKey(), iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption failed:', error);
    return null;
  }
}
