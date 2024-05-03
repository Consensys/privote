
import "@nomicfoundation/hardhat-toolbox-viem";
import "@nomicfoundation/hardhat-viem";
import { network, viem } from "hardhat";
import { walletActions } from "viem";

const config = {
  solidity: "0.8.24",
  networks: {
    localhost: {
      chainId: 31337,
      url: "http://127.0.0.1:8545/",
    },
    "linea-testnet": {
      chainId: 59140,
      url: `https://linea-goerli.infura.io/v3/2XIxqbP9VIKNwExz861Ss0f7pwn`,
      accounts: ["024b63cc384f8dd3bb738362d90fb7a123e168334bf8744e08e343325ab93480"],
    },
  },
};

export default config;
