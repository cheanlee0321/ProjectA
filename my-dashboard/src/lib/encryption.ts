import crypto from 'crypto'

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'fallback_key'
// 為了避免環境變數讀取到多餘空白導致長度不正確，我們使用 scryptSync 動態生成穩定的 32 byte 金鑰
const key = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32)
const ALGORITHM = 'aes-256-cbc'

export function encrypt(text: string) {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)
  let encrypted = cipher.update(text)
  encrypted = Buffer.concat([encrypted, cipher.final()])
  return {
    iv: iv.toString('hex'),
    encryptedData: encrypted.toString('hex'),
  }
}

export function decrypt(text: string, ivHex: string) {
  const iv = Buffer.from(ivHex, 'hex')
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
  let decrypted = decipher.update(Buffer.from(text, 'hex'))
  decrypted = Buffer.concat([decrypted, decipher.final()])
  return decrypted.toString()
}
