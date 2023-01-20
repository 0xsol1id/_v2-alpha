import { FC } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import { TokenIcon } from "utils/TokenIcon";
import { TokenName } from "utils/TokenName";
import { SelectRevokeButton } from "utils/SelectRevokeButton";
import {DelegatedAddress} from "utils/delegatedAddress"


type Props = {
  mint: string;
  toRevoke: any;
};

export const RevokeCard: FC<Props> = ({
  mint,
  toRevoke,

}) => {

  const { connection } = useConnection();

  const { publicKey } = useWallet();

  return (
    <div className="rounded-lg bg-gray-900">
      <figure className="min-h-16 animation-pulse-color">
        <TokenIcon mint={mint}/>
      </figure>
      <div className="card-body h-20 sm:h-16 mb-4">
        <h2 className="card-title text-sm text-left">
          <TokenName mint={mint} />
        </h2>
      <DelegatedAddress tokenMintAddress={mint} connection={connection} publicKey={publicKey} />
      </div>
      <div className="sm:flex justify-center">
        <SelectRevokeButton tokenMintAddress={mint} connection={connection} publicKey={publicKey} toRevoke={toRevoke} />
        <a target="_blank" className="btn text-xs bg-[#9945FF] hover:bg-[#7a37cc] uppercase" href={"https://solscan.io/token/" + mint}>🔎</a>
      </div>
    </div>
  );
};
