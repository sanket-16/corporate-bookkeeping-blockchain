import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import Navbar from "./components/Navbar.jsx";
import { ThemeProvider } from "./components/theme-provider";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { hardhat } from "wagmi/chains";
import { InjectedConnector } from "wagmi/connectors/injected";
import { publicProvider } from "wagmi/providers/public";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { Toaster } from "sonner";

const queryClient = new QueryClient();

const { chains, publicClient } = configureChains([hardhat], [publicProvider()]);

const config = createConfig({
  connectors: [
    new InjectedConnector({ chains }),
    new MetaMaskConnector({
      chains,
      options: {
        projectId: "...",
      },
    }),
  ],
  autoConnect: true,
  publicClient,
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <>
            <Navbar />
            <App />
            <Toaster />
          </>
        </ThemeProvider>
      </QueryClientProvider>
    </WagmiConfig>
  </React.StrictMode>
);
