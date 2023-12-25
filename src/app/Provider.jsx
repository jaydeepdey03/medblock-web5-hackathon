"use client";

import {WagmiConfig, createConfig, configureChains} from "wagmi";
import {avalancheFuji, polygonMumbai} from "@wagmi/core/chains";
import {ThemeProvider as NextThemesProvider} from "next-themes";
import {publicProvider} from "wagmi/providers/public";
import {InjectedConnector} from "wagmi/connectors/injected";

const {chains, publicClient, webSocketPublicClient} = configureChains(
  [polygonMumbai, avalancheFuji],
  [publicProvider()]
);

const config = createConfig({
  autoConnect: true,
  connectors: [new InjectedConnector({chains})],
  publicClient,
  webSocketPublicClient,
});

export function ThemeProvider({children, ...props}) {
  return (
    <WagmiConfig config={config}>
      <NextThemesProvider {...props}>{children}</NextThemesProvider>
    </WagmiConfig>
  );
}
