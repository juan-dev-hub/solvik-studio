import crypto from 'crypto';
import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.ENCRYPTION_SECRET || 'default-32-character-secret-key!!';

export class EncryptionService {
  static encrypt(text: string): string {
    try {
      const encrypted = CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
      return encrypted;
    } catch (error) {
      throw new Error('Encryption failed');
    }
  }

  static decrypt(encryptedText: string): string {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedText, SECRET_KEY);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      if (!decrypted) throw new Error('Decryption failed');
      return decrypted;
    } catch (error) {
      throw new Error('Decryption failed');
    }
  }

  static generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  static generateToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  static hashPassword(password: string): string {
    const bcrypt = require('bcryptjs');
    return bcrypt.hashSync(password, 12);
  }

  static verifyPassword(password: string, hash: string): boolean {
    const bcrypt = require('bcryptjs');
    return bcrypt.compareSync(password, hash);
  }
}