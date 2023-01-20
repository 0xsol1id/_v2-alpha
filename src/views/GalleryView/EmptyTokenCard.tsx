import { FC, useState, useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { SelectCloseButton } from '../../utils/SelectCloseButton';
import { TokenIconEA } from "utils/TokenIconEA";
import { TokenNameEA } from "utils/TokenNameEA";
import {getMintFromTokenAccount} from "utils/getMintFromTokenAccount"
import { Metaplex } from "@metaplex-foundation/js";


type Props = {
  account: string;
  toClose: any;
  isConnectedWallet: boolean;
};

export const EmptyTokenCard: FC<Props> = ({
  account,
  toClose,
  isConnectedWallet,
}) => {


  const wallet = useWallet();
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const metaplex = new Metaplex(connection);

  // get the mint address of the token account
  const mint = getMintFromTokenAccount({account, connection})

  return (
    <div className="grid grid-cols-4 rounded-lg bg-gray-900 justify-between mb-1 p-1 text-center align-middle">
      <figure className="max-h-12 max-w-12 animation-pulse-color">
        <TokenIconEA account={account} connection={connection} metaplex={metaplex} />
      </figure>
        <TokenNameEA account={account} connection={connection} metaplex={metaplex} />
      <div className="sm:flex justify-center">
        <SelectCloseButton tokenAccount={account} connection={connection} publicKey={publicKey} toClose={toClose} isConnectedWallet={isConnectedWallet} />
        <a target="_blank" className="btn bg-[#9945FF] hover:bg-[#7a37cc] uppercase " href={"https://solscan.io/token/" + mint}>🔎</a>
      </div>
    </div>
  );
};
