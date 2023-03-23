import React from "react";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { ConnectionProvider } from "@solana/wallet-adapter-react";

import "tailwindcss/tailwind.css";
import "../styles/globals.css";
import "../styles/App.css"; 
import '../styles/tabs.css';

// set custom RPC server endpoint for the final website
// const endpoint = "https://explorer-api.devnet.solana.com";
// const endpoint = "http://127.0.0.1:8899";
// const endpoint = "https://ssc-dao.genesysgo.net";
// const endpoint = "https://solport.genesysgo.net";
// const endpoint = "https://solana-api.projectserum.com";
// const endpoint = "https://api.mainnet-beta.solana.com";
// const endpoint = "https://try-rpc.mainnet.solana.blockdaemon.tech";
// const endpoint = "https://solana-mainnet.g.alchemy.com/v2/p5DCRRBHKVxuF7b6CfaS0YDyXaialE_Z"
// const endpoint = "https://rpc.helius.xyz/?api-key=f487e56d-0026-4fbb-8f4e-bb069306360f"
const endpoint = "https://compatible-smart-general.solana-mainnet.discover.quiknode.pro/9b4affb03539b7a422f5c636723e162c7a1b3afe/"

const WalletProvider = dynamic(
  () => import("../contexts/ClientWalletProvider"),
  {
    ssr: false, 
  }
);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="">      
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider>
        <Component {...pageProps} />
      </WalletProvider>
    </ConnectionProvider>
    </div>
  );
}

export default MyApp;