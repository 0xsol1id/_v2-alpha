import type { NextPage } from "next";
import Head from "next/head";
import * as anchor from "@project-serum/anchor";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { MintView } from "../views";
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'
const options = {
  // you can also just use 'bottom center'
  position: positions.BOTTOM_CENTER,
  timeout: 5000,
  offset: '20px',
  // you can also just use 'scale'
  transition: transitions.SCALE
}

const candyMachineId = new anchor.web3.PublicKey(
  process.env.NEXT_PUBLIC_CANDY_MACHINE_ID!
);

const rpcHost = process.env.NEXT_PUBLIC_SOLANA_RPC_HOST!;
const connection = new anchor.web3.Connection(rpcHost);

const txTimeout = 60000; // milliseconds (confirm this works for your project)

const Mint: NextPage = (props) => {
  return (
    <div>
      <AlertProvider template={AlertTemplate} {...options}>
        <Head>
          <title>MINT GEN2 DEGEN</title>
          <meta name="description" content="Mint mint mint up to 69 together!" />
        </Head>
        <MintView
          candyMachineId={candyMachineId}
          connection={connection}
          txTimeout={txTimeout}
          rpcHost={rpcHost} />
      </AlertProvider>
    </div>
  );
};

export default Mint;
