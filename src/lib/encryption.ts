import crypto from 'crypto';

// The secret key for encryption. 
// We use scryptSync to ensure it's exactly 32 bytes (256 bits) long, regardless of the JWT_SECRET length.
const secretKey = process.env.JWT_SECRET || 'default_secret_key_for_development_only';
const ENCRYPTION_KEY = crypto.scryptSync(secretKey, 'salt', 32); 

const ALGORITHM = 'aes-256-gcm';

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(12); // 96-bit IV is standard for GCM
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  
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

    const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption failed:', error);
    return null;
  }
}
