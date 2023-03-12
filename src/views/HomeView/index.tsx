import { FC, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import { MainMenu } from "../mainmenu"
import { randomWallets } from "../wallets"
import { Footer } from '../footer';
import Link from "next/link";
import { divideAmount, isValidPublicKeyAddress } from "@metaplex-foundation/js-next";
import { ConnectWallet } from "components";
import { getDomainKey, NameRegistryState } from "@bonfida/spl-name-service";
import { CommercialAlert } from "utils/CommercialAlert";

import Video from "./landing.mp4";

export const HomeView: FC = ({ }) => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();

  const [message, setMessage] = useState(false)
  var valid = false
  function randomInt(low: number, high: number) {
    return Math.floor(Math.random() * (high - low) + low)
  }

  const [value, setValue] = useState("")
  var randomWallet = randomWallets[randomInt(0, randomWallets.length)].Wallet //start with a random wallet from the list

  const onChange = async (e: any) => {
    const val = e.target.value
    if (val.includes(".sol")) {
      const { pubkey } = await getDomainKey(val.trim());
      const { registry, nftOwner } = await NameRegistryState.retrieve(
        connection,
        pubkey
      );
      const address = registry.owner.toString()
      setValue(address)
      valid = isValidPublicKeyAddress(address)
      setMessage(valid)
    }
    else {
      setValue(e.target.value)
      valid = isValidPublicKeyAddress(e.target.value)
      setMessage(valid)
    }
  };

  return (
    <div className="min-h-full">
      <div className="">
        <div className="navbar sticky top-0 z-40 text-neutral-content flex justify-between bg-gray-900">
          <MainMenu />
          <div className="border-2 rounded-lg border-gray-700 bg-gray-700 hidden lg:block">
            <button className="bg-primary hover:bg-gray-800 rounded-l-md tooltip tooltip-left h-10 w-12" data-tip="Show a random wallet">
              <Link href={`/wallet/${randomWallet}`}>🤷‍♂️ </Link>
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
                  <Link href={`/wallet/${value}`}>👁️</Link>
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
            <ConnectWallet />
          </div>
        </div>

        <div className="grid grid-cols-4">
          {/* SIDEBAR */}
          <div className="col-span-1 bg-gray-900 flex flex-col justify-between p-10">
            <div id="sidebar" className="grid justify-items-end gap-5">
              <div className="w-1/2 border-2 rounded-lg border-opacity-10">
                <button className="btn btn-ghost font-pixel w-full">
                  <Link href="/">Home</Link>
                </button>
              </div>
              <div className="w-1/2 border-2 rounded-lg border-opacity-10">
                <button className="btn btn-ghost font-pixel w-full hover:bg-gray-800">Explore</button>
              </div>
              <div className="w-1/2 border-2 rounded-lg border-opacity-10">
                <button className="btn btn-ghost font-pixel w-full hover:bg-gray-800">Tools</button>
              </div>
              <div className="w-1/2 border-2 rounded-lg border-opacity-10">
                <button className="btn btn-ghost font-pixel w-full hover:bg-gray-800">
                  <Link href="/mint">MINT NOW</Link>
                </button>
              </div>
            </div>

            {/* PROFILE */}
            <div id="sidebar" className="grid justify-items-end">
              <div className="w-1/2">
                {publicKey ?
                  <button className="btn btn-primary w-full flex justify-between">
                    <Link href={`/showme?wallet=${publicKey?.toBase58()}`}>
                      <img src="./profil.png" className="w-8 h-8" />
                    </Link>
                    <p className="font-pixel text-2xs">{(publicKey?.toBase58()).slice(0, 6)}...{(publicKey?.toBase58()).slice(-6)}</p>
                  </button>
                  : <div className="font-pixel">connect wallet</div>
                }
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <div className="col-span-2 scrollbar overflow-auto h-[90vh]">
            <div className="font-pixel navbar sticky top-0 z-40 text-neutral-content flex justify-between bg-gray-900 bg-opacity-50 backdrop-blur">
              START PAGE
            </div>
            <div className="font-pixel p-2">
              {randomWallets?.map((num: any, index: any) => (
                <div className="border-2 border-opacity-20 mb-2 rounded-lg">
                  <button className="btn btn-ghost btn-sm text-xl w-full bg-gray-900 hover:bg-gray-800">
                    <Link href={`/wallet/${num.Wallet}`}>
                     <div>WATCH "{num.Wallet}" NOW</div> 
                    </Link></button>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT BAR */}
          <div className="col-span-1 bg-gray-900 h-full p-2">
            <video className='w-full' autoPlay muted loop><source src={'./landing.mp4'} type='video/mp4' /></video>
          </div>
        </div>

        {/*<CommercialAlert isDismissed={false} />
        <div className="hero my-auto lg:hidden block">
          <div className="text-center hero-content items-center">
            <div className="border-2 rounded-lg border-gray-700 bg-gray-700">
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
        <div className="hidden lg:hero">
          <video className='hero-content' autoPlay muted loop><source src={'./landing.mp4'} type='video/mp4' /></video>
            </div>*/}
        <Footer />
      </div>
    </div>
  );
};