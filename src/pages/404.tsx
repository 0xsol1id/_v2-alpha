import { ConnectWallet } from "components"
import { Footer } from 'utils/footer';
import Link from "next/link"
import { BuyButton } from "utils/buybutton"
import { SideBar } from "utils/sidebar"
import { Animation } from "utils/Animation"
import { randomWallets } from "utils/wallets"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { useState } from "react"
import { getDomainKey, NameRegistryState } from "@bonfida/spl-name-service"
import { isValidPublicKeyAddress } from "@metaplex-foundation/js-next";

// pages/404.js
export default function Custom404() {
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
      <div className="navbar sticky top-0 z-40 text-neutral-content flex justify-between bg-base-300">
        <BuyButton />
        <div className="border-2 rounded-lg border-gray-700 w-6/12 text-center">
          <button className="hover:bg-gray-900 bg-base-300 rounded-l-md tooltip tooltip-left h-10 w-12" data-tip="Show a random wallet">
            <Link passHref href={`/wallet/${randomWallet}`}>
              <img src="/static/images/buttons/random.png" alt="" />
            </Link>
          </button>
          <input
            type="text"
            placeholder="WALLET / USER / DOMAIN / NFT"
            className="font-trash w-[50rem] h-10 p-1 bg-base-200 text-center m-1 rounded text-2xl"
            value={value}
            onChange={onChange}
          />
          {message == true ? (
            <div className="tooltip tooltip-right" data-tip="Load wallet">
              <button className="hover:bg-primary bg-base-300 rounded-r-md h-10 w-12">
                <Link href={`/wallet/${value}`}>
                  <img src="/static/images/buttons/checkwallet.png" alt="" />
                </Link>
              </button>
            </div>
          ) : (
            <div className="tooltip tooltip-right" data-tip="no valid input">
              <button className="hover:bg-primary bg-base-300 rounded-r-md h-10 w-12">
                <img src="/static/images/buttons/checkwallet.png" alt="" />
              </button>
            </div>
          )
          }
        </div>
        <div>
          <ConnectWallet />
        </div>
      </div>

      <div className="grid grid-cols-12">
        {/* SIDEBAR */}
        <div className="col-span-1 bg-base-300 flex flex-col justify-between">
          <SideBar />
          <div className="p-2 text-center">
            <Animation images={["trashcan.png", "trashcan2.png"]} maxFrame={2} intervall={500} />
          </div>

          {/* PROFILE */}
          <div id="sidebar" className="grid justify-items-end">
            {publicKey ?
              <div>
                <div className="border-2 rounded-lg border-opacity-10 mb-2 font-trash uppercase bg-primary">
                  <button className="btn btn-ghost rounded-lg hover:bg-gray-800 w-full">
                    <Link passHref href={`/wallet/${publicKey?.toBase58()}`}>
                      <div className='text-center'>
                        <div className="animate-pulse text-xl">new notifs</div>
                      </div>
                    </Link>
                  </button>
                </div>
                <div className="border-2 rounded-lg border-opacity-10">
                  <button className="btn btn-ghost rounded-sm hover:bg-gray-800 w-full">
                    <Link passHref href={`/wallet/${publicKey?.toBase58()}`}>
                      <div className='w-full flex justify-between items-center'>
                        <img src="/static/images/profil.png" className="w-8 h-8" alt="tmp" />
                        <p className="font-trash uppercase text-2xs">{(publicKey?.toBase58()).slice(0, 4)}...{(publicKey?.toBase58()).slice(-4)}</p>
                      </div>
                    </Link>
                  </button>
                </div>
              </div> :
              <div className="font-trash uppercase text-center">connect wallet</div>
            }
          </div>
        </div>

        {/* CONTENT */}
        <div className="col-span-7">
         404 - page not found
        </div >

        {/* RIGHT BAR */}
        < div className="col-span-4 bg-base-300 p-2 font-trash uppercase" >
          
        </div >
      </div >
      < Footer />
    </div >
  </div >
  )
}
