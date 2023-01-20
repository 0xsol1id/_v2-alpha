import Link from "next/link";
import { FC } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

import { MainMenu } from "../mainmenu"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export const HomeView: FC = ({ }) => {
  const { publicKey } = useWallet();

  return (
    <div className="">
      <div className="">
        <div className="navbar sticky top-0 z-50 text-neutral-content flex justify-between bg-gray-900">
          <div>
            <MainMenu />
            <div className="card p-2 text-sm font-bold rounded-lg bg-base-300 md:block hidden"><img src="./fudility.png" /> V1.0_beta</div>
          </div>
          <WalletMultiButton />
        </div>
        <div className="hero min-h-16">
          <div className="text-center hero-content">
            <div className="">
              <img src="./logo2.png" alt="logo" />
              <p className="mb-5">
                This project is not promoting any kind of drug abuse nor are we making fun of people with an serious addiction.
                This is a homage to our beloved degenerated NFT scene! Especially in the Solana Ecosystem.
              </p>
            </div>
          </div>
        </div>
        {/*<Footer />*/}
      </div>
    </div>
  );
};