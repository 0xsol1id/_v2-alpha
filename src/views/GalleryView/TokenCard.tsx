import { FC, useState } from "react";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { SelectBurnButton } from '../../utils/SelectBurnButton';
import { TokenIcon } from "utils/TokenIcon";
import { TokenName } from "utils/TokenName";

type Props = {
  mint: string;
  details: any;
  toBurn: any;
  isConnectedWallet: boolean;
};

export const TokenCard: FC<Props> = ({
  mint,
  details,
  toBurn,
  isConnectedWallet,
}) => {
  const { name, uri } = details?.data ?? {};
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  return (
    <div className="grid grid-cols-3 rounded-lg bg-gray-900 justify-between mb-1 p-1 text-center align-middle">
        <h2 className="card-title text-sm text-center">
        {mint}
        </h2>
        <h2 className="card-title text-sm text-left">{name}</h2>
      <div className="sm:flex justify-center">
        <SelectBurnButton isConnectedWallet={isConnectedWallet} tokenMintAddress={mint} connection={connection} publicKey={publicKey} toBurn={toBurn} />
        <a target="_blank" className="btn text-xs bg-[#9945FF] hover:bg-[#7a37cc]" href={"https://solscan.io/token/" + mint}>🔎</a>
      </div>
    </div>
  );
};
