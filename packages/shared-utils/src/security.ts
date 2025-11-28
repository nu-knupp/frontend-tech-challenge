import crypto from "crypto";
import { Transaction } from "@banking/shared-types";

const DEFAULT_ENCRYPTION_KEY =
  process.env.NODE_ENV === "production"
    ? undefined
    : "dev-only-3frnt-secret-key-change-me";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // 96-bit IV for GCM
const SENSITIVE_FIELDS: Array<
  keyof Pick<Transaction, "observation" | "file" | "fileName">
> = ["observation", "file", "fileName"];

const getEncryptionKey = () => {
  const rawKey =
    process.env.ENCRYPTION_KEY || process.env.NEXT_PUBLIC_ENCRYPTION_KEY;

  if (!rawKey) {
    if (DEFAULT_ENCRYPTION_KEY) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          "[security] ENCRYPTION_KEY não definido. Usando chave insegura de desenvolvimento."
        );
      }
      return crypto
        .createHash("sha256")
        .update(DEFAULT_ENCRYPTION_KEY)
        .digest()
        .subarray(0, 32);
    }
    throw new Error(
      "ENCRYPTION_KEY não definido. Configure uma chave de 32 caracteres para produção."
    );
  }

  if (rawKey.length < 32) {
    return crypto.createHash("sha256").update(rawKey).digest().subarray(0, 32);
  }

  return Buffer.from(rawKey).subarray(0, 32);
};

const encryptionKey = getEncryptionKey();

export const encryptValue = (
  value?: string | null
): string | null | undefined => {
  if (value === undefined || value === null || value === "") {
    return value;
  }

  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, encryptionKey, iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return `${iv.toString("hex")}.${authTag.toString("hex")}.${encrypted.toString(
    "hex"
  )}`;
};

export const decryptValue = (
  value?: string | null
): string | null | undefined => {
  if (value === undefined || value === null || value === "") {
    return value;
  }

  const parts = value.split(".");
  if (parts.length !== 3) {
    return value;
  }

  try {
    const [ivHex, authTagHex, encryptedHex] = parts;
    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      encryptionKey,
      Buffer.from(ivHex, "hex")
    );
    decipher.setAuthTag(Buffer.from(authTagHex, "hex"));
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(encryptedHex, "hex")),
      decipher.final(),
    ]);
    return decrypted.toString("utf8");
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[security] Falha ao descriptografar dado sensível. Retornando valor original.",
        error
      );
    }
    return value;
  }
};

type EncryptOptions = {
  forceSecureFlag?: boolean;
};

export const encryptTransactionPayload = <T extends Partial<Transaction>>(
  payload: T,
  options: EncryptOptions = {}
): T & { secure?: boolean } => {
  const clone: any = { ...payload };
  let mutated = false;

  for (const field of SENSITIVE_FIELDS) {
    const rawValue = clone[field];

    if (rawValue === undefined) {
      continue;
    }

    if (rawValue === null) {
      clone[field] = null;
      continue;
    }

    const encrypted = encryptValue(String(rawValue));
    if (encrypted && encrypted !== rawValue) {
      clone[field] = encrypted;
      mutated = true;
    }
  }

  if (mutated || options.forceSecureFlag) {
    clone.secure = true;
  }

  return clone;
};

export const decryptTransactionPayload = <T extends Transaction>(transaction: T): T => {
  if (!transaction.secure) {
    return transaction;
  }

  const clone: any = { ...transaction };

  for (const field of SENSITIVE_FIELDS) {
    const rawValue = clone[field];

    if (typeof rawValue === "string" && rawValue.length > 0) {
      const decrypted = decryptValue(rawValue);
      if (typeof decrypted === "string") {
        clone[field] = decrypted;
      }
    }
  }

  return clone;
};

