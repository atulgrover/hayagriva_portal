import crypto from 'crypto';

export interface AirgapPackOptions {
  licenseKey: string;
  hardwareFingerprint: string;
  items: any[];
  secret?: string;
  expiresInDays?: number;
}

export interface VerifyAirgapOptions {
  licenseKey: string;
  hardwareFingerprint: string;
  secret?: string;
}

const DEFAULT_SECRET = process.env.OFFLINE_TOKEN_SECRET || 'hayagriva_offline_token_hmac_secret_key_2026';

function deriveKey(secret: string, licenseKey: string, hardwareFingerprint: string): Buffer {
  return crypto
    .createHmac('sha256', secret)
    .update(`${licenseKey.trim()}:${hardwareFingerprint.trim()}`)
    .digest();
}

/**
 * Generates an encrypted, hardware-bound .hpack binary package.
 */
export function generateAirgapPack(options: AirgapPackOptions): Buffer {
  const secret = options.secret || DEFAULT_SECRET;
  const licenseKey = options.licenseKey.trim();
  const hardwareFingerprint = options.hardwareFingerprint.trim();

  const headerObj = {
    format: 'HPACK_V1',
    licenseKey,
    hardwareFingerprint,
    generatedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + (options.expiresInDays || 365) * 86400000).toISOString(),
    itemCount: options.items.length,
  };

  const headerBuffer = Buffer.from(JSON.stringify(headerObj), 'utf8');
  const headerHmac = crypto.createHmac('sha256', secret).update(headerBuffer).digest();

  // AES-256-GCM Payload Encryption
  const key = deriveKey(secret, licenseKey, hardwareFingerprint);
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

  const payloadBuffer = Buffer.from(JSON.stringify(options.items), 'utf8');
  const ciphertext = Buffer.concat([cipher.update(payloadBuffer), cipher.final()]);
  const authTag = cipher.getAuthTag();

  // Binary Envelope Layout:
  // [4 bytes Header Len] + [Header JSON] + [32 bytes Header HMAC] + [12 bytes IV] + [16 bytes Auth Tag] + [Ciphertext]
  const lengthBuffer = Buffer.alloc(4);
  lengthBuffer.writeUInt32BE(headerBuffer.length, 0);

  return Buffer.concat([
    lengthBuffer,
    headerBuffer,
    headerHmac,
    iv,
    authTag,
    ciphertext,
  ]);
}

/**
 * Verifies and decrypts an .hpack binary package using local license and hardware fingerprint.
 */
export function verifyAndDecryptAirgapPack(packBuffer: Buffer, options: VerifyAirgapOptions): { success: boolean; items: any[]; header: any } {
  const secret = options.secret || DEFAULT_SECRET;
  const expectedLicense = options.licenseKey.trim();
  const expectedFingerprint = options.hardwareFingerprint.trim();

  if (packBuffer.length < 4 + 32 + 12 + 16) {
    throw new Error('Invalid .hpack archive: buffer truncated');
  }

  const headerLength = packBuffer.readUInt32BE(0);
  let offset = 4;

  const headerBuffer = packBuffer.subarray(offset, offset + headerLength);
  offset += headerLength;

  const headerHmac = packBuffer.subarray(offset, offset + 32);
  offset += 32;

  // 1. Verify Header HMAC
  const computedHmac = crypto.createHmac('sha256', secret).update(headerBuffer).digest();
  if (!crypto.timingSafeEqual(headerHmac, computedHmac)) {
    throw new Error('Invalid .hpack archive: signature verification failed');
  }

  const header = JSON.parse(headerBuffer.toString('utf8'));

  // 2. Verify Hardware Fingerprint & License Binding
  if (header.licenseKey !== expectedLicense) {
    throw new Error(`License mismatch: archive is bound to ${header.licenseKey}, current is ${expectedLicense}`);
  }

  if (header.hardwareFingerprint !== expectedFingerprint) {
    throw new Error(`Hardware fingerprint mismatch: archive is bound to ${header.hardwareFingerprint}, device is ${expectedFingerprint}`);
  }

  // 3. Decrypt AES-256-GCM Payload
  const iv = packBuffer.subarray(offset, offset + 12);
  offset += 12;

  const authTag = packBuffer.subarray(offset, offset + 16);
  offset += 16;

  const ciphertext = packBuffer.subarray(offset);

  const key = deriveKey(secret, expectedLicense, expectedFingerprint);
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  const items = JSON.parse(decrypted.toString('utf8'));

  return {
    success: true,
    items,
    header,
  };
}
