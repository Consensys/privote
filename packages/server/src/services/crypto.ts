import {
  packPoint,
  unpackPoint,
  mulPointEscalar,
  Point,
  addPoint,
} from "@zk-kit/baby-jubjub";
import crypto from "crypto";
import { config } from "../config.ts";

// generates babyjubjub key pair that is compatible with our zokrates implementation
export const generateKeyPair = () => {
  const Base8: Point<bigint> = [
    16540640123574156134436876038791482806971768689494387082833631921987005038935n,
    20819045374670962167435360035096875258406992893633759881276124905556507972311n,
  ];

  const privateKey = BigInt(`0x${crypto.randomBytes(32).toString("hex")}`);

  console.log("Voter Private Key: ", privateKey);

  const publicKey = packPoint(mulPointEscalar(Base8, privateKey));
  console.log("Voter Public Key: ", mulPointEscalar(Base8, privateKey));
  return {
    privateKey,
    publicKey,
  };
};

export const encryptData = (
  data: string,
  privateKey: bigint,
  voterPublicKey: bigint,
  trustedPartyKey: bigint
) => {
  console.log(trustedPartyKey);
  // Compute the shared secret by multiplying the trusted party's public key by the private key.
  const unpackedKey = unpackPoint(trustedPartyKey);
  if (!unpackedKey) {
    throw new Error("Invalid key");
  }
  const sharedSecretPoint = mulPointEscalar(unpackedKey, privateKey);

  let sharedSecret = sharedSecretPoint[0].toString(16);

  // Pad the shared secret with zeros to make it 32 bytes long.
  while (sharedSecret.length < 64) {
    sharedSecret = "0" + sharedSecret;
  }

  const cipher = crypto.createCipheriv(
    "aes-256-ctr",
    Buffer.from(sharedSecret, "hex"), // Use the first 32 bytes of the shared secret as the key.
    Buffer.alloc(16, 0) // Use a zero-filled buffer as the IV.
  );
  let encrypted = cipher.update(data, "utf8", "hex");
  encrypted += cipher.final("hex");
  console.log("Encrypted Data: ", encrypted);

  // Just testing if the decryption works
  const decrypt = decryptData(
    encrypted,
    BigInt(config.privateKey),
    voterPublicKey
  );
  console.log("Decrypted Data: ", decrypt);
  return encrypted;
};

export const decryptData = (
  encryptedData: string,
  privateKey: bigint,
  trustedPartyPublicKey: bigint
) => {
  const unpackedKey = unpackPoint(trustedPartyPublicKey);
  if (!unpackedKey) {
    throw new Error("Invalid key");
  }
  console.log("Unpacked voter Key: ", unpackedKey);
  const sharedSecretPoint = mulPointEscalar(unpackedKey, privateKey);

  let sharedSecret = sharedSecretPoint[0].toString(16);

  // Pad the shared secret with zeros to make it 32 bytes long.
  while (sharedSecret.length < 64) {
    sharedSecret = "0" + sharedSecret;
  }

  const decipher = crypto.createDecipheriv(
    "aes-256-ctr",
    Buffer.from(sharedSecret, "hex"), // Use the first 32 bytes of the shared secret as the key.
    Buffer.alloc(16, 0) // Use a zero-filled buffer as the IV.
  );
  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

// const PrivatekeyAdmin =
//   98262104851790831542716006225436060031243305046421189020975565188213908270518n;
// const PublickeyAdmin =
//   58088083289004362178188597057333575585958125571420035197075328158217482063009n;

// const PrivatekeyVoter =
//   58131427580962851638314863764085094059373589394615978376799735263415636374186n;
// const PublickeyVoter =
//   4779406068737596324390673638494859277407636822681195103012896713178746099344n;

// export const test = async () => {
//   const encrypted = await encryptData(
//     "MOnawada oi karane",
//     PrivatekeyVoter,
//     PublickeyAdmin
//   );
//   const decrypted = await decryptData(
//     encrypted,
//     PrivatekeyAdmin,
//     PublickeyVoter
//   );

//   console.log("Encrypted:", encrypted);
//   console.log("Decrypted:", decrypted);
// };

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
