import React from 'react';
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from "react";
import InputEmoji from "react-input-emoji";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { getDomainKey, NameRegistryState, performReverseLookup } from "@bonfida/spl-name-service";
import { isValidPublicKeyAddress } from "@metaplex-foundation/js-next";
import ReactTimeAgo from 'react-time-ago'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
TimeAgo.addLocale(en)

import { BuyButton } from "../../utils/buybutton"
import { randomWallets } from "../../utils/wallets"
import { Footer } from '../../utils/footer';
import { Animation } from "../../utils/Animation"
import Link from "next/link";
import { ConnectWallet } from "components";

import { CommercialAlert } from "utils/CommercialAlert";

import { ArrowCircleLeftIcon } from '@heroicons/react/solid';
import { SideBar } from 'utils/sidebar';
import { UserIcon } from '@heroicons/react/solid';

function convertTimestamp(timestamp: any) {
  var d = new Date(timestamp * 1000),
    yyyy = d.getFullYear(),
    mm = ('0' + (d.getMonth() + 1)).slice(-2),
    dd = ('0' + d.getDate()).slice(-2),
    hh = d.getHours(),
    h = hh,
    min = ('0' + d.getMinutes()).slice(-2),
    sec = ('0' + d.getSeconds()).slice(-2),
    ampm = 'AM',
    time;

  if (hh > 12) {
    h = hh - 12;
    ampm = 'PM';
  } else if (hh === 12) {
    h = 12;
    ampm = 'PM';
  } else if (hh == 0) {
    h = 12;
  }

  time = dd + '.' + mm + '.' + yyyy + ' / ' + h + ':' + min + ':' + sec + ' ' + ampm;
  return time;
}

function randomInt(low: number, high: number) {
  return Math.floor(Math.random() * (high - low) + low)
}

const Discussion = () => {
  const fudility = process.env.NEXT_PUBLIC_FUDILITY_BACKEND!
  const router = useRouter()
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const owner = useWallet();
  const [isConnectedWallet, setIsConnectedWallet] = useState(false)

  const { key } = router.query

  const [refresh, setRefresh] = useState(false)

  const copyAddress = async (val: any) => {
    await navigator.clipboard.writeText(val);
  }

  const inputRef = useRef<any>(null);

  const [discussion, setDiscussion] = useState<any>([])
  const [courseOfDiscussion, setCourseOfDiscussion] = useState<any>([])

  const addDiscussion = (com: any) => {
    if (commentValue != "") {
      setCommentValue("")
      const user: any = publicKey?.toBase58()
      const n = "no name"
      if (discussion[0].type == 8)
        SendDiscussion(fudility + `senddiscussion/${key}/9/${n}/${encodeURIComponent(com)}/${user}/${userAccountData.name}/${encodeURIComponent(userAccountData.pfp)}`)
      else
        SendDiscussion(fudility + `senddiscussion/${key}/5/${n}/${encodeURIComponent(com)}/${user}/${userAccountData.name}/${encodeURIComponent(userAccountData.pfp)}`)
      SendNotif(fudility + `sendnotif/${key}/1`)
      setCourseOfDiscussion((state: any) => [...state, {
        pubKey: key,
        type: "discussion",
        content: com,
        writtenBy: user,
        time: Date.now()
      }])
    }
  }

  async function SendNotif(uri: string) {
    try {
      const response = await fetch(uri)
    } catch (e) {
      console.log(e)
    }
  }

  async function SendDiscussion(uri: string) {
    try {
      const response = await fetch(uri)
    } catch (e) {
      console.log(e)
    }
  }

  async function GetDiscussion(uri: string) {
    try {
      const response = await fetch(uri)
      const jsonData = await response.json()
      console.log(jsonData)
      setDiscussion(jsonData)
    } catch (e) {
      console.log(e)
    }
  }

  async function GetCourseOfDiscussion(uri: string) {
    try {
      const response = await fetch(uri)
      const jsonData = await response.json()
      setCourseOfDiscussion(jsonData)
    } catch (e) {
      console.log(e)
    }
  }

  const [value, setValue] = useState("")
  const [commentValue, setCommentValue] = useState("")
  var randomWallet = randomWallets[randomInt(0, randomWallets.length)].Wallet //start with a random wallet from the list
  const [message, setMessage] = useState(false)
  var valid = false
  function randomInt(low: number, high: number) {
    return Math.floor(Math.random() * (high - low) + low)
  }
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

  const [userAccountData, setUserAccountData] = useState<any>({})
  async function GetUserAccount(uri: string) {
    try {
      const response = await fetch(uri)
      const jsonData = await response.json()
      setUserAccountData(jsonData)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    if (publicKey)
      GetUserAccount(fudility + `user/${publicKey.toBase58()}`)

    GetDiscussion(fudility + `getdiscussion/${key}`)
    GetCourseOfDiscussion(fudility + `getcourseofdiscussion/${key}`)
  }, [userAccountData.likes]);

  return (
    <div className="min-h-full">
      <div className="">
        <div className="navbar sticky top-0 z-40 text-neutral-content flex justify-between bg-base-300">
          <BuyButton />
          <div className="border-2 rounded-lg border-gray-700 w-5/12 text-center">
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
                  <Link passHref href={`/wallet/${value}`}>
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
          <div className="flex">
            <div className="border-2 rounded-lg border-opacity-20">
              <button className="btn btn-ghost rounded-sm hover:bg-gray-800 w-full">
                <Link passHref href={`/wallet/${publicKey?.toBase58()}`}>
                  <div className='w-full flex justify-between items-center'>
                    <UserIcon className="w-8 h-8" />
                  </div>
                </Link>
              </button>
            </div>
            <ConnectWallet />
          </div>
        </div>

        <div className="grid grid-cols-12">
          {/* SIDEBAR */}
          <div className="col-span-1 bg-base-300 flex flex-col justify-between">
            <SideBar />
            <div className="p-2 text-center">
              <Animation images={["trashcan.png", "trashcan2.png"]} maxFrame={2} interval={500} />
            </div>
          </div>

          {/* CONTENT */}
          <div className="col-span-11 mr-5">
            <div className="scrollbar overflow-auto h-[75vh] border-2 border-opacity-20 ">
              <div className="font-trash navbar sticky top-0 z-40 text-neutral-content flex justify-between gap-2 bg-base-300 bg-opacity-50 backdrop-blur border-b-2 border-opacity-20">
                <div className=''>
                  <button onClick={() => router.back()}><ArrowCircleLeftIcon className='w-8 h-8 text-white mr-2' /></button>
                  <div>DISCUSSION #{key}</div>
                </div>
              </div>

              <div className='block justify-items-end'>

                {discussion.length > 0 &&
                  <div id="Comments" className="p-2 border-b-2 border-opacity-20 font-trash uppercase bg-gray-900 bg-opacity-10">
                    <div className="flex justify-between">
                      <div className="flex">
                        <div className="font-trash uppercase hover:text-red-500 hover:cursor-pointer">
                          <Link passHref href={`/wallet/${discussion[0]?.writtenBy}`}>
                            <div>{discussion[0]?.writtenBy.slice(0, 4)}...{discussion[0]?.writtenBy.slice(-4)}</div>
                          </Link>
                        </div>
                        <h1 className='ml-2'>said:</h1>
                      </div>
                      <ReactTimeAgo date={discussion[0]?.time} locale="en-US" timeStyle="round" className="uppercase text-gray-500" />
                    </div>
                    <h1 className="">{discussion[0]?.content}</h1>
                  </div>
                }

                {courseOfDiscussion.length > 0 ? (
                  (courseOfDiscussion?.slice(0).map((num: any, index: any) => (
                    (num.writtenBy != publicKey?.toBase58() ? (
                      <div key={index} id="Comments" className="bg-base-300 rounded-lg p-2 mb-2 border-2 border-opacity-20 w-1/2 m-2 font-trash uppercase">
                        <div className="flex justify-between">
                          <div className="flex">
                            <div className="font-trash uppercase w-full hover:text-red-500 hover:cursor-pointer">
                              <Link passHref href={`/wallet/${num.writtenBy}`}>
                                <div>{num.writtenBy.slice(0, 4)}...{num.writtenBy.slice(-4)}</div>
                              </Link>
                            </div>
                            <h1 className='ml-2'>said:</h1>
                          </div>
                          <ReactTimeAgo date={num.time} locale="en-US" timeStyle="round" className="uppercase text-gray-500" />
                        </div>
                        <h1 className="">{num.content}</h1>
                      </div>
                    ) : (
                      <div key={index} className='flex font-trash uppercase'>
                        <div className='w-1/2 '></div>
                        <div id="Comments" className="bg-base-200 rounded-lg p-2 mb-2 border-2 border-opacity-20 w-1/2 m-2">
                          <div className="flex justify-between">
                            <div className="flex">
                              <div className="font-trash uppercase w-full hover:text-red-500 hover:cursor-pointer">
                                <Link passHref href={`/wallet/${num.writtenBy}`}>
                                  <div>{num.writtenBy.slice(0, 4)}...{num.writtenBy.slice(-4)}</div>
                                </Link>
                              </div>
                              <h1 className='ml-2'>said:</h1>
                            </div>
                            <ReactTimeAgo date={num.time} locale="en-US" timeStyle="round" className="uppercase text-gray-500" />
                          </div>
                          <h1 className="">{num.content}</h1>
                        </div>
                      </div>
                    ))

                  )))) : (
                  <h1 className="text-center font-trash uppercase">Be the first who writes a comments on this</h1>
                )
                }
              </div>
            </div>
            {publicKey ? (
              <div className="bg-base-300 w-full font-trash flex justify-between mt-5 border-2 border-opacity-20 p-1 rounded-lg">
                <InputEmoji
                  type="text"
                  value={commentValue}
                  onChange={setCommentValue}
                  placeholder="Write a Comment"
                  maxLength={150}
                  onEnter={() => addDiscussion(commentValue)}
                  borderColor="#EAEAEA"
                  borderRadius={5}
                />
                <h1 className='grid items-center mr-3 text-xs'>{commentValue.length}/150</h1>
                <button onClick={() => addDiscussion(commentValue)} className="btn btn-secondary mr-2">Send</button>
              </div>
            ) : (
              <h1 className="bg-base-300 w-full font-trash uppercase p-2 flex justify-between mt-5 border-2 border-opacity-20 text-center rounded-lg">connect your wallet to write comments</h1>
            )
            }
          </div>
        </div>

        <CommercialAlert isDismissed={false} />
        <Footer />
      </div>
    </div>
  );
};

export default Discussion

const LoadingSVG = ({ }) => {
  return (
    <div>
      <svg role="status" className="inline mr-3 w-4 h-4 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
      </svg>
    </div>
  )
}