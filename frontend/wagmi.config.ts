import { http, createConfig } from "wagmi";
import { lineaTestnet, mainnet,hardhat, linea } from "wagmi/chains";
import { metaMask } from "wagmi/connectors";

export const config = createConfig({
  chains: [mainnet, linea, hardhat, lineaTestnet],
  multiInjectedProviderDiscovery: true,
  ssr: true,
  transports: {
    [mainnet.id]: http(),
    [linea.id]: http(),
    [lineaTestnet.id]: http(),
    [hardhat.id]: http(),
  },
});