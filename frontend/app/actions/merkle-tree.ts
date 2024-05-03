import MerkleTree from "merkletreejs";
import SHA256 from "crypto-js/sha256";



interface MerkleManager {
  get: () => MerkleTree | null;
  create: (leaves: string[]) => void;
  root: string | null;
  addLeaf: (leaf: string) => void;
  getProof: (leaf: string) => {
    position: "left" | "right";
    data: string;
  }[];
}

const createMerkleTreeManager = (): MerkleManager => {
  let merkleTree: MerkleTree | null = null;
  let root: string |  null = null;

  const get = () => merkleTree;

  const create = (leaves: string[]) => {

    merkleTree = new MerkleTree(
      leaves,
      SHA256,
      { hashLeaves: true }
    );

    root = merkleTree.getRoot().toString("hex");
  };

  const getProof = (leaf: string) => {
    if (!merkleTree) {
      throw new Error("Merkle tree not created");
    }
    const hashedLeaf = SHA256(leaf).toString();
    return merkleTree.getProof(hashedLeaf);
  };

  const addLeaf = (leaf: string) => {
    if (!merkleTree) {
      throw new Error("Merkle tree not created");
    }

    const hashedLeaf = SHA256(leaf);

    merkleTree.addLeaf(Buffer.from(leaf), true);
    root = merkleTree.getRoot().toString("hex");
    const proof = merkleTree.getProof(hashedLeaf.toString());
    return {
      leaf: hashedLeaf.toString(),
      proof
    }
  }

  return {
    get,
    getProof,
    create,
    root,
    addLeaf,
  };
};

export default createMerkleTreeManager;
