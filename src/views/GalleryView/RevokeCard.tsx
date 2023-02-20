import { FC } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { TokenName } from "utils/TokenName";
import { SelectRevokeButton } from "utils/SelectRevokeButton";

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
    <div className="grid grid-cols-3 rounded-lg bg-gray-900 justify-between mb-1 p-1 text-center align-middle">
      <div className="flex"><TokenName mint={mint} /></div>
      <h2 className="card-title text-sm text-center">{mint}</h2>
      <div className="sm:flex justify-center">
        <SelectRevokeButton tokenMintAddress={mint} connection={connection} publicKey={publicKey} toRevoke={toRevoke} />
        <a target="_blank" className="btn text-xs bg-[#9945FF] hover:bg-[#7a37cc] uppercase" href={"https://solscan.io/token/" + { mint }}>🔎</a>
      </div>
    </div>
  );
};
