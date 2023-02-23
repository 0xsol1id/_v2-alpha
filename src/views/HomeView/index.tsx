import { FC, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

import { MainMenu } from "../mainmenu"
import { randomWallets } from "../wallets"
import { Footer } from '../footer';
import Link from "next/link";
import { isValidPublicKeyAddress } from "@metaplex-foundation/js-next";
import { ConnectWallet } from "components";

export const HomeView: FC = ({ }) => {
  const { publicKey } = useWallet();

  const [message, setMessage] = useState(false)
  var valid = false
  function randomInt(low: number, high: number) {
    return Math.floor(Math.random() * (high - low) + low)
  }

  const [value, setValue] = useState("")
  var randomWallet = randomWallets[randomInt(0, randomWallets.length)].Wallet //start with a random wallet from the list

  const onChange = async (e: any) => {
    setValue(e.target.value)
    valid = isValidPublicKeyAddress(e.target.value)
    setMessage(valid)
  };

  return (
    <div className="min-h-full">
      <div className="">
        <div className="navbar sticky top-0 z-50 text-neutral-content flex justify-between bg-gray-900">
          <MainMenu />
          <div className="border-2 rounded-lg border-gray-700 bg-gray-700 hidden lg:block">
            <button className="bg-primary hover:bg-gray-800 rounded-l-md tooltip tooltip-left h-10 w-12" data-tip="Show a random wallet">
              <Link href={`/showme?wallet=${randomWallet}`}>🤷‍♂️ </Link>
            </button>
            <input
              type="text"
              placeholder="Enter Wallet Address"
              className="font-pixel w-96 h-10 p-1 text-sm bg-base-200 text-center"
              value={value}
              onChange={onChange}
            />
            {message == true ? (
              <div className="tooltip tooltip-right" data-tip="Load wallet">
                <button className="bg-primary hover:bg-gray-800 rounded-r-md h-10 w-12">
                  <Link href={`/showme?wallet=${value}`}>👁️</Link>
                </button>
              </div>
            ) : (
              <div className="tooltip tooltip-right" data-tip="no valid wallet">
                <button className="bg-gray-700 hover:bg-gray-800 rounded-r-md h-10 w-12">👁️</button>
              </div>
            )
            }
          </div>
          <div>
            <div>
              {publicKey ?
                <button className="btn btn-primary mr-2 block">
                  <Link href={`/showme?wallet=${publicKey?.toBase58()}`}>
                    <img src="./profil.png" className="w-6 h-6" />
                    </Link>                    
                    <p className="font-pixel text-2xs">{(publicKey?.toBase58()).slice(0, 4)}</p>
                </button>
                : null}
            </div>
            <ConnectWallet />
          </div>
        </div>
        <div className="hero my-auto">
          <div className="text-center hero-content items-center">

            <div className="border-2 rounded-lg border-gray-700 bg-gray-700 lg:hidden block">
              <button className="btn btn-primary mb-3 font-pixel w-full">
                <Link href={`/showme?wallet=${randomWallet}`}>Load random wallet</Link>
              </button>
              <input
                type="text"
                placeholder="Enter Wallet Address"
                className="font-pixel w-96 h-10 p-1 text-sm bg-base-200 text-center"
                value={value}
                onChange={onChange}
              />
              {message == true ? (
                <button className="btn btn-primary mb-3 font-pixel w-full">
                  <Link href={`/showme?wallet=${value}`}>Load Wallet</Link>
                </button>
              ) : (
                <button className="bg-gray-700 mt-3 font-pixel">not a valid wallet</button>
              )
              }
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};