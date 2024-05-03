import hre from "hardhat";
import crypto from "crypto";

export const generateEcdhKeyPair = () => {
  const ecdh = crypto.createECDH("secp256k1");
  const publicKey = ecdh.generateKeys("hex");
  const privateKey = ecdh.getPrivateKey("hex");

  return { publicKey, privateKey };
};

async function main() {
  const { publicKey, privateKey } = generateEcdhKeyPair();

  const priviaContact = await hre.viem.deployContract("PrivoteContract", [
    publicKey,
  ]);

  console.log(`Privia contract deployed to ${priviaContact.address}`);
  console.log(`This is the private ECDH: ${privateKey}`);
  console.log(`This is the public ECDH: ${publicKey}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
