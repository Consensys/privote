import crypto from "crypto";


export const generateEcdhKeyPair = async () => {
  const ecdh = crypto.createECDH("bab");
  const publicKey = ecdh.generateKeys("hex");
  const privateKey = ecdh.getPrivateKey("hex");

  return { publicKey, privateKey };
};

export const getPublicKeyFromPrivateKey = (privateKey: string) => {
  const ecdh = crypto.createECDH("secp256k1");
  ecdh.setPrivateKey(privateKey, "hex");
  const publicKey = ecdh.getPublicKey("hex");
  return publicKey;
};

export const encryptData = async (
  data: string,
  privateKey: string,
  trustedPartyKey: string
) => {
  const ecdh = crypto.createECDH("secp256k1");
  ecdh.setPrivateKey(privateKey, "hex");
  const sharedSecret = ecdh.computeSecret(trustedPartyKey, "hex");

  const cipher = crypto.createCipheriv(
    "aes-256-ctr",
    sharedSecret,
    Buffer.alloc(16, 0)
  );
  let encrypted = cipher.update(data, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

export const decryptData = async (
  encryptedData: string,
  privateKey: string,
  trustedPartyKey: string
) => {
  const ecdh = crypto.createECDH("secp256k1");
  ecdh.setPrivateKey(privateKey, "hex");
  const sharedSecret = ecdh.computeSecret(trustedPartyKey, "hex");
  const decipher = crypto.createDecipheriv(
    "aes-256-ctr",
    sharedSecret,
    Buffer.alloc(16, 0)
  );
  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

export const encryptOwnData = async (data: string, privateKey: string) => {
  const key = Buffer.from(privateKey, "hex");
  const cipher = crypto.createCipheriv("aes-256-ctr", key, Buffer.alloc(16, 0));
  let encrypted = cipher.update(data, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

export const decryptOwnData = async (
  encryptedData: string,
  privateKey: string
) => {
  const key = Buffer.from(privateKey, "hex");
  const decipher = crypto.createDecipheriv(
    "aes-256-ctr",
    key,
    Buffer.alloc(16, 0)
  );
  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};
