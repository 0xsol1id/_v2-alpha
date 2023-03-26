import { FC, useEffect, useRef, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import { BuyButton } from "../../utils/buybutton"
import { randomWallets } from "../../utils/wallets"
import { Footer } from '../../utils/footer';
import { SideBar } from "../../utils/sidebar"
import { Animation } from "../../utils/Animation"
import Link from "next/link";
import { divideAmount, isValidPublicKeyAddress } from "@metaplex-foundation/js-next";
import { ConnectWallet } from "components";
import { getDomainKey, NameRegistryState } from "@bonfida/spl-name-service";
import { CommercialAlert } from "utils/CommercialAlert";
import { QuestionMarkCircleIcon } from "@heroicons/react/solid";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import ReactTimeAgo from 'react-time-ago'
import { UserIcon } from "@heroicons/react/solid";
import { ReplyIcon } from "@heroicons/react/solid";

export const HomeView: FC = ({ }) => {
  const fudility = process.env.NEXT_PUBLIC_FUDILITY_BACKEND!
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

  // This function will scroll the window to the top 
  const scrollRef = useRef<any>(null);
  const scrollToTop = () => {
    scrollRef.current.scrollTop = 0;
  };

  const [notifMode, setNotifMode] = useState(false)
  const CheckNotifs = () => {
    console.log(notifMode)
    setNotifMode(!notifMode)
    if (publicKey && userAccountData.notif == 1) {
      SendNotif(fudility + `sendnotif/${publicKey.toBase58()}/0`)
      GetUserAccount(fudility + `user/${publicKey.toBase58()}`)
    }
  };

  async function SendNotif(uri: string) {
    try {
      const response = await fetch(uri)
    } catch (e) {
      console.log(e)
    }
  }

  const [feed, setFeed] = useState<any>()
  const [eventType, setEventType] = useState<any>(0)
  const sortFeedBy = ["ALL", "New Users", "Account claimed", "Wallet Comment", "NFT Comment", "Discussion Comment", "Name Change", "PFP Change", "Notifs"]
  async function GetFeed(uri: string) {
    try {
      const response = await fetch(uri)
      const jsonData = await response.json()
      setFeed(jsonData)
      scrollToTop()
    } catch (e) {
      console.log(e)
    }
  }

  const [userType, setUserType] = useState<any>(0)
  const sortUserBy = ["ALL", "CLAIMED", "UNCLAIMED"]

  const [allUsers, setAllUsers] = useState<any>()
  async function GetAllUsers() {
    try {
      const response = await fetch("https://fudility.xyz:3420/getalluser")
      const jsonData = await response.json()
      setAllUsers(jsonData)
    } catch (e) {
      console.log(e)
    }
  }

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

    GetFeed(fudility + `getfeed`)
    GetAllUsers()
  }, [])

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
          <div className="flex">
            <div className="border-2 rounded-lg border-opacity-20 mr-2">
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
          <div className="col-span-7 scrollbar overflow-auto h-[80vh]" ref={scrollRef}>
            <div className="font-trash uppercase sticky top-0 z-40 bg-base-300 bg-opacity-50 backdrop-blur flex justify-between p-2 items-center border-2 border-opacity-20 rounded">
              <img src="/static/images/feedHeadline.png" alt="tmp" />
              <div className="">
                <div className="flex items-center">
                  <div className="text-xs mr-2">sort by</div>
                  <select
                    onChange={(e) => setEventType(e.target.selectedIndex)}
                    className="select w-40 select-primary select-xs font-trash uppercase">
                    {sortFeedBy.map((id: any, index: any) => (
                      <option key={index}>{id}</option>
                    ))}
                  </select>
                </div>
                {publicKey &&
                  (!notifMode ? (
                    <div className="border-2 border-opacity-20 rounded-lg mt-1">
                      <button onClick={CheckNotifs} className="btn btn-border-2 w-full ">
                        <div className="mr-5 text-4xl">notifs</div>
                        <div>
                          {userAccountData.notif == 1 &&
                            <span className="flex h-4 w-4">
                              <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-red-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
                            </span>
                          }
                        </div>
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-opacity-20 rounded-lg mt-1">
                      <button onClick={CheckNotifs} className="btn btn-border-2 w-full bg-gray-400">
                        <div className="mr-5 text-4xl text-red-500">notifs</div>
                        <div>
                          {userAccountData.notif == 1 &&
                            <span className="flex h-4 w-4">
                              <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-red-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
                            </span>
                          }
                        </div>
                      </button>
                    </div>
                  ))

                }
              </div>
              <button onClick={() => GetFeed(fudility + `getfeed`)} className="btn btn-ghost tooltip tooltip-left text-2xl" data-tip="Refresh Feed">
                <img src="/static/images/buttons/refresh.png" alt="tmp" />
              </button>
            </div>
            <div className="font-trash uppercase p-2">
              {feed?.sort((a: any, b: any) => { return b.time - a.time }).map((num: any, index: any) => (
                (notifMode && num.pubKey == publicKey?.toBase58() ? (
                  (num.eventType == 1 ? (
                    <div className="border-2 border-yellow-300 rounded-lg w-full mb-2 p-2">
                      <div className="flex">
                        <img src={num.pfp} alt="tmp" className='w-12 h-12 rounded-full border-2 mr-2' />
                        <div className="grid w-full">
                          <div className="block mb-5">
                            <div className="flex">
                              <Link key={index} passHref href={`/wallet/${num.pubKey}`}>
                                <div className="uppercase mr-5 text-xl hover:text-red-500 hover:cursor-pointer">{num.name}</div>
                              </Link>
                              <div className="text-gray-500">{num.pubKey.slice(0, 6)}...{num.pubKey.slice(-6)}</div>
                              <div className="text-gray-500 mr-2 ml-2">·</div>
                              <ReactTimeAgo date={num.time} locale="en-US" timeStyle="round" className="uppercase text-gray-500" />
                            </div>
                          </div>
                          <div className="uppercase text-left">New user account created - Welcome to the trash!</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    (num.eventType == 2 ? (
                      <div className="border-2 border-green-500 rounded-lg w-full mb-2 p-2">
                        <div className="flex">
                          <div className=""><QuestionMarkCircleIcon className="w-6 h-6 mr-2" /></div>
                          <div className="grid w-full">
                            <div className="block mb-5">
                              <div className="flex">
                                <Link key={index} passHref href={`/wallet/${num.pubKey}`}>
                                  <div className="uppercase mr-5 text-xl hover:text-red-500 hover:cursor-pointer">{num.name}</div>
                                </Link>
                                <div className="text-gray-500">{num.pubKey.slice(0, 6)}...{num.pubKey.slice(-6)}</div>
                                <div className="text-gray-500 mr-2 ml-2">·</div>
                                <ReactTimeAgo date={num.time} locale="en-US" timeStyle="round" className="uppercase text-gray-500" />
                              </div>
                            </div>
                            <div className="uppercase text-left">User claimed account</div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      (num.eventType == 3 ? (
                        <div className="border-2 border-red-500 rounded-lg w-full mb-2 p-2">
                          <div className="flex">
                            <div className=""><QuestionMarkCircleIcon className="w-6 h-6 mr-2" /></div>
                            <div className="grid w-full">
                              <div className="block mb-5">
                                <div className="flex">
                                  <Link key={index} passHref href={`/wallet/${num.authorPubKey}`}>
                                    <div className="uppercase mr-5 text-xl hover:text-red-500 hover:cursor-pointer">{num.authorName}</div>
                                  </Link>
                                  <div className="text-gray-500">{num.authorPubKey.slice(0, 6)}...{num.authorPubKey.slice(-6)}</div>
                                  <div className="text-gray-500 mr-2 ml-2">·</div>
                                  <ReactTimeAgo date={num.time} locale="en-US" timeStyle="round" className="uppercase text-gray-500" />
                                </div>
                              </div>
                              <div className="uppercase text-left mb-2 flex">Commented wallet '
                                <Link key={index} passHref href={`/wallet/${num.pubKey}`}>
                                  <div className="text-yellow-300 hover:text-red-500 hover:cursor-pointer">{num.name}</div>
                                </Link>'
                                <div className="text-gray-500 ml-2">({num.pubKey.slice(0, 6)}...{num.pubKey.slice(-6)})</div>:</div>
                              <div className="uppercase text-left border-2 border-opacity-20 rounded p-2">{num.content}</div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        (num.eventType == 4 ? (
                          <div className="border-2 border-purple-500 rounded-lg w-full mb-2 p-2">
                            <div className="flex">
                              <div className=""><QuestionMarkCircleIcon className="w-6 h-6 mr-2" /></div>
                              <div className="grid w-full">
                                <div className="block mb-5">
                                  <div className="flex">
                                    <Link key={index} passHref href={`/wallet/${num.authorPubKey}`}>
                                      <div className="uppercase mr-5 text-xl hover:text-red-500 hover:cursor-pointer">{num.authorName}</div>
                                    </Link>
                                    <div className="text-gray-500">{num.authorPubKey.slice(0, 6)}...{num.authorPubKey.slice(-6)}</div>
                                    <div className="text-gray-500 mr-2 ml-2">·</div>
                                    <ReactTimeAgo date={num.time} locale="en-US" timeStyle="round" className="uppercase text-gray-500" />
                                  </div>
                                </div>
                                <div className="uppercase text-left mb-2 flex">Commented the NFT '
                                  <Link key={index} passHref href={`/token/${num.pubKey}`}>
                                    <div className="text-yellow-300 hover:text-red-500 hover:cursor-pointer">{num.name}</div>
                                  </Link>'
                                  <div className="text-gray-500 ml-2">({num.pubKey.slice(0, 6)}...{num.pubKey.slice(-6)})</div>:</div>
                                <div className="uppercase text-left border-2 border-opacity-20 rounded p-2">{num.content}</div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          (num.eventType == 5 ? (
                            <div className="border-2 border-blue-500 rounded-lg w-full mb-2 p-2">
                              <div className="flex">
                                <div className=""><QuestionMarkCircleIcon className="w-6 h-6 mr-2" /></div>
                                <div className="grid w-full">
                                  <div className="block mb-5">
                                    <div className="flex">
                                      <Link key={index} passHref href={`/wallet/${num.authorPubKey}`}>
                                        <div className="uppercase mr-5 text-xl hover:text-red-500 hover:cursor-pointer">{num.authorName}</div>
                                      </Link>
                                      <div className="text-gray-500">{num.authorPubKey.slice(0, 6)}...{num.authorPubKey.slice(-6)}</div>
                                      <div className="text-gray-500 mr-2 ml-2">·</div>
                                      <ReactTimeAgo date={num.time} locale="en-US" timeStyle="round" className="uppercase text-gray-500" />
                                    </div>
                                  </div>
                                  <div className="uppercase text-left mb-2 flex hover:text-red-500 hover:cursor-pointer">Wrote into discussion for '
                                    <Link key={index} passHref href={`/discussion/${num.pubKey}`}>
                                      <div className="text-yellow-300 hover:text-red-500 hover:cursor-pointer">{num.pubKey}</div>
                                    </Link>'
                                    :</div>
                                  <div className="uppercase text-left border-2 border-opacity-20 rounded p-2">{num.content}</div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            (num.eventType == 6 ? (
                              <div className="border-2  border-indigo-500 rounded-lg w-full mb-2 p-2">
                                <div className="flex">
                                  <div className=""><QuestionMarkCircleIcon className="w-6 h-6 mr-2" /></div>
                                  <div className="grid w-full">
                                    <div className="block mb-5">
                                      <div className="flex">
                                        <Link key={index} passHref href={`/wallet/${num.pubKey}`}>
                                          <div className="uppercase mr-5 text-xl hover:text-red-500 hover:cursor-pointer">{num.name}</div>
                                        </Link>
                                        <div className="text-gray-500">{num.pubKey.slice(0, 6)}...{num.pubKey.slice(-6)}</div>
                                        <div className="text-gray-500 mr-2 ml-2">·</div>
                                        <ReactTimeAgo date={num.time} locale="en-US" timeStyle="round" className="uppercase text-gray-500" />
                                      </div>
                                    </div>
                                    <div className="text-left uppercase flex">User changed Name from <div className="text-yellow-300 ml-2 mr-2">{num.authorName}</div> to <div className="text-yellow-300 ml-2 mr-2">{num.name}</div></div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              (num.eventType == 7 ? (
                                <div className="border-2 border-pink-500 rounded-lg w-full mb-2 p-2">
                                  <div className="flex">
                                    <div className=""><QuestionMarkCircleIcon className="w-6 h-6 mr-2" /></div>
                                    <div className="grid w-full">
                                      <div className="block mb-5">
                                        <div className="flex">
                                          <Link key={index} passHref href={`/wallet/${num.pubKey}`}>
                                            <div className="uppercase mr-5 text-xl hover:text-red-500 hover:cursor-pointer">{num.name}</div>
                                          </Link>
                                          <div className="text-gray-500">{num.pubKey.slice(0, 6)}...{num.pubKey.slice(-6)}</div>
                                          <div className="text-gray-500 mr-2 ml-2">·</div>
                                          <ReactTimeAgo date={num.time} locale="en-US" timeStyle="round" className="uppercase text-gray-500" />
                                        </div>
                                      </div>
                                      <div className="flex items-center">
                                        USER CHANGED PFP INTO
                                        <img src={num.content} alt="" className="w-20 h-20 ml-5" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                null
                              ))
                            ))
                          ))
                        ))
                      ))
                    ))
                  ))
                ) : (
                  (!notifMode && (eventType <= 0 || num.eventType == eventType) ? (
                    (num.eventType == 1 ? (
                      <div className="border-2 border-yellow-300 rounded-lg w-full mb-2 p-2">
                        <div className="flex">
                          <img src={num.pfp} alt="tmp" className='w-12 h-12 rounded-full border-2 mr-2' />
                          <div className="grid w-full">
                            <div className="block mb-5">
                              <div className="flex">
                                <Link key={index} passHref href={`/wallet/${num.pubKey}`}>
                                  <div className="uppercase mr-5 text-xl hover:text-red-500 hover:cursor-pointer">{num.name}</div>
                                </Link>
                                <div className="text-gray-500">{num.pubKey.slice(0, 6)}...{num.pubKey.slice(-6)}</div>
                                <div className="text-gray-500 mr-2 ml-2">·</div>
                                <ReactTimeAgo date={num.time} locale="en-US" timeStyle="round" className="uppercase text-gray-500" />
                              </div>
                            </div>
                            <div className="uppercase text-left">New user account created - Welcome to the trash!</div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      (num.eventType == 2 ? (
                        <div className="border-2 border-green-500 rounded-lg w-full mb-2 p-2">
                          <div className="flex">
                            <div className=""><QuestionMarkCircleIcon className="w-6 h-6 mr-2" /></div>
                            <div className="grid w-full">
                              <div className="block mb-5">
                                <div className="flex">
                                  <Link key={index} passHref href={`/wallet/${num.pubKey}`}>
                                    <div className="uppercase mr-5 text-xl hover:text-red-500 hover:cursor-pointer">{num.name}</div>
                                  </Link>
                                  <div className="text-gray-500">{num.pubKey.slice(0, 6)}...{num.pubKey.slice(-6)}</div>
                                  <div className="text-gray-500 mr-2 ml-2">·</div>
                                  <ReactTimeAgo date={num.time} locale="en-US" timeStyle="round" className="uppercase text-gray-500" />
                                </div>
                              </div>
                              <div className="uppercase text-left">User claimed account</div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        (num.eventType == 3 ? (
                          <div className="border-2 border-red-500 rounded-lg w-full mb-2 p-2">
                            <div className="flex">
                              <img src={num.authorPfp} alt="tmp" className='w-12 h-12 rounded-full border-2 mr-2' />
                              <div className="grid w-full">
                                <div className="block mb-5">
                                  <div className="flex">
                                    <Link key={index} passHref href={`/wallet/${num.authorPubKey}`}>
                                      <div className="uppercase mr-5 text-xl hover:text-red-500 hover:cursor-pointer">{num.authorName}</div>
                                    </Link>
                                    <div className="text-gray-500">{num.authorPubKey.slice(0, 6)}...{num.authorPubKey.slice(-6)}</div>
                                    <div className="text-gray-500 mr-2 ml-2">·</div>
                                    <ReactTimeAgo date={num.time} locale="en-US" timeStyle="round" className="uppercase text-gray-500" />
                                  </div>
                                </div>
                                <div className="uppercase text-left mb-2 flex">Commented wallet '
                                  <Link key={index} passHref href={`/wallet/${num.pubKey}`}>
                                    <div className="text-yellow-300 hover:text-red-500 hover:cursor-pointer">{num.name}</div>
                                  </Link>'
                                  <div className="text-gray-500 ml-2">({num.pubKey.slice(0, 6)}...{num.pubKey.slice(-6)})</div>:</div>
                                <div className="flex">
                                  <div className="uppercase text-left border-2 border-opacity-20 rounded p-2 w-full">{num.content}</div>
                                  <button className="rounded hover:bg-gray-800 w-8 p-1 text-center">
                                    <Link passHref href={`/discussion/${num.contentId}`}>
                                      <ReplyIcon className="w-6 h-6" />
                                    </Link>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          (num.eventType == 4 ? (
                            <div className="border-2 border-purple-500 rounded-lg w-full mb-2 p-2">
                              <div className="flex">
                                <div className=""><QuestionMarkCircleIcon className="w-6 h-6 mr-2" /></div>
                                <div className="grid w-full">
                                  <div className="block mb-5">
                                    <div className="flex">
                                      <Link key={index} passHref href={`/wallet/${num.authorPubKey}`}>
                                        <div className="uppercase mr-5 text-xl hover:text-red-500 hover:cursor-pointer">{num.authorName}</div>
                                      </Link>
                                      <div className="text-gray-500">{num.authorPubKey.slice(0, 6)}...{num.authorPubKey.slice(-6)}</div>
                                      <div className="text-gray-500 mr-2 ml-2">·</div>
                                      <ReactTimeAgo date={num.time} locale="en-US" timeStyle="round" className="uppercase text-gray-500" />
                                    </div>
                                  </div>
                                  <div className="uppercase text-left mb-2 flex">Commented the NFT '
                                    <Link key={index} passHref href={`/token/${num.pubKey}`}>
                                      <div className="text-yellow-300 hover:text-red-500 hover:cursor-pointer">{num.name}</div>
                                    </Link>'
                                    <div className="text-gray-500 ml-2">({num.pubKey.slice(0, 6)}...{num.pubKey.slice(-6)})</div>:</div>
                                  <div className="uppercase text-left border-2 border-opacity-20 rounded p-2">{num.content}</div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            (num.eventType == 5 ? (
                              <div className="border-2 border-blue-500 rounded-lg w-full mb-2 p-2">
                                <div className="flex">
                                  <img src={num.authorPfp} alt="tmp" className='w-12 h-12 rounded-full border-2 mr-2' />
                                  <div className="grid w-full">
                                    <div className="block mb-5">
                                      <div className="flex">
                                        <Link key={index} passHref href={`/wallet/${num.authorPubKey}`}>
                                          <div className="uppercase mr-5 text-xl hover:text-red-500 hover:cursor-pointer">{num.authorName}</div>
                                        </Link>
                                        <div className="text-gray-500">{num.authorPubKey.slice(0, 6)}...{num.authorPubKey.slice(-6)}</div>
                                        <div className="text-gray-500 mr-2 ml-2">·</div>
                                        <ReactTimeAgo date={num.time} locale="en-US" timeStyle="round" className="uppercase text-gray-500" />
                                      </div>
                                    </div>
                                    <div className="uppercase text-left mb-2 flex">Wrote into discussion for '
                                      <Link key={index} passHref href={`/discussion/${num.pubKey}`}>
                                        <div className="text-yellow-300 hover:text-red-500 hover:cursor-pointer">{num.pubKey}</div>
                                      </Link>'
                                      :</div>
                                    <div className="flex">
                                      <div className="uppercase text-left border-2 border-opacity-20 rounded p-2 w-full">{num.content}</div>
                                      <button className="rounded hover:bg-gray-800 w-8 p-1 text-center">
                                        <Link passHref href={`/discussion/${num.pubKey}`}>
                                          <ReplyIcon className="w-6 h-6" />
                                        </Link>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              (num.eventType == 6 ? (
                                <div className="border-2  border-indigo-500 rounded-lg w-full mb-2 p-2">
                                  <div className="flex">
                                    <div className=""><QuestionMarkCircleIcon className="w-6 h-6 mr-2" /></div>
                                    <div className="grid w-full">
                                      <div className="block mb-5">
                                        <div className="flex">
                                          <Link key={index} passHref href={`/wallet/${num.pubKey}`}>
                                            <div className="uppercase mr-5 text-xl hover:text-red-500 hover:cursor-pointer">{num.name}</div>
                                          </Link>
                                          <div className="text-gray-500">{num.pubKey.slice(0, 6)}...{num.pubKey.slice(-6)}</div>
                                          <div className="text-gray-500 mr-2 ml-2">·</div>
                                          <ReactTimeAgo date={num.time} locale="en-US" timeStyle="round" className="uppercase text-gray-500" />
                                        </div>
                                      </div>
                                      <div className="text-left uppercase flex">User changed Name from <div className="text-yellow-300 ml-2 mr-2">{num.authorName}</div> to <div className="text-yellow-300 ml-2 mr-2">{num.name}</div></div>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                (num.eventType == 7 ? (
                                  <div className="border-2 border-pink-500 rounded-lg w-full mb-2 p-2">
                                    <div className="flex">
                                      <div className=""><QuestionMarkCircleIcon className="w-6 h-6 mr-2" /></div>
                                      <div className="grid w-full">
                                        <div className="block mb-5">
                                          <div className="flex">
                                            <Link key={index} passHref href={`/wallet/${num.pubKey}`}>
                                              <div className="uppercase mr-5 text-xl hover:text-red-500 hover:cursor-pointer">{num.name}</div>
                                            </Link>
                                            <div className="text-gray-500">{num.pubKey.slice(0, 6)}...{num.pubKey.slice(-6)}</div>
                                            <div className="text-gray-500 mr-2 ml-2">·</div>
                                            <ReactTimeAgo date={num.time} locale="en-US" timeStyle="round" className="uppercase text-gray-500" />
                                          </div>
                                        </div>
                                        <div className="flex items-center">
                                          USER CHANGED PFP INTO
                                          <img src={num.content} alt="" className="w-20 h-20 ml-5" />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  null
                                ))
                              ))
                            ))
                          ))
                        ))
                      ))
                    ))
                  ) : (
                    null
                  )
                  )
                )
                )
              ))}
            </div >
          </div >

          {/* RIGHT BAR */}
          < div className="col-span-4 bg-base-300 p-2 font-trash uppercase" >
            <div className="text-center">
              <img src="/static/images/exploreHeadline.png" alt="explore" />

            </div>
            <Tabs>

              <TabList>
                <Tab><h1 className="font-trash uppercase">USER</h1></Tab>
                <Tab><h1 className="font-trash uppercase">COLLECTIONS</h1></Tab>
                <Tab><h1 className="font-trash uppercase">GROUPS</h1></Tab>
                <Tab><h1 className="font-trash uppercase">ANNOUNCMENTS</h1></Tab>
              </TabList>


              <TabPanel>
                <div className="flex items-center">
                  <div className="text-xs mr-2">sort by</div>
                  <select
                    onChange={(e) => setUserType(e.target.selectedIndex)}
                    className="select w-40 select-primary select-xs font-trash uppercase">
                    {sortUserBy.map((id: any, index: any) => (
                      <option key={index}>{id}</option>
                    ))}
                  </select>
                </div>
                <div className="overflow-auto h-[46rem] scrollbar border-2 rounded mt-1 mb-1 p-1 border-gray-800">
                  {allUsers
                    ?.filter((user: any) => {
                      if (userType === 0) {
                        return true;
                      } else if (userType === 1) {
                        return user.claimed === "is claimed";
                      } else if (userType === 2) {
                        return user.claimed === "not yet";
                      }
                      return false;
                    })
                    .sort((a: any, b: any) => b.score - a.score)
                    .map((user: any, index: any) => (
                      <div key={index} className="border-2 rounded-lg border-opacity-20 w-full mb-2 hover:border-primary">
                        <button className="font-trash w-full hover:bg-gray-800 p-2 rounded-lg">
                          <Link passHref href={`/wallet/${user.pubKey}`}>
                            <div className="flex">
                              {user.pfp !== "none" ? (
                                <img src={user.pfp} alt="tmp" className='w-28 h-28 rounded-full border-2 mr-2' />
                              ) : (
                                <QuestionMarkCircleIcon className="ml-3 w-28 h-28 mr-5" />
                              )}
                              <div className="grid w-full">
                                <div className="flex justify-between uppercase">
                                  <div>User Name:</div>
                                  <div>{user.name}</div>
                                </div>
                                <div className="flex justify-between">
                                  <div className="uppercase">Public Key:</div>
                                  <div>{user.pubKey.slice(0, 6)}...{user.pubKey.slice(-6)}</div>
                                </div>
                                <div className="flex justify-between uppercase">
                                  <div>claimed:</div>
                                  <div>{user.claimed}</div>
                                </div>
                                <div className="flex justify-between uppercase">
                                  <div>LIKES:</div>
                                  <div>{user.likes}</div>
                                </div>
                              </div>
                            </div>
                          </Link>
                        </button>
                      </div>
                    ))}
                </div>
              </TabPanel>

              <TabPanel>
                <div className="overflow-auto h-[46rem] scrollbar border-2 rounded mt-1 mb-1 p-1 border-gray-800">
                  <div className="border-2 rounded-lg border-opacity-20 w-full mb-2 hover:border-primary p-2">
                    WELCOME!!! THIS IS A COLLECTION PROFILE!!! PNSQRT!!!
                  </div>
                </div>
              </TabPanel>

              <TabPanel>
                <div className="overflow-auto h-[46rem] scrollbar border-2 rounded mt-1 mb-1 p-1 border-gray-800">
                  <div className="border-2 rounded-lg border-opacity-20 w-full mb-2 hover:border-primary p-2">
                    WELCOME!!! THIS IS A GROUP!!! PNSQRT!!!
                  </div>
                </div>
              </TabPanel>

              <TabPanel>
                <div className="overflow-auto h-[70vh] scrollbar border-2 rounded mt-1 mb-1 p-1 border-gray-800">
                  <div className="border-2 rounded-lg border-opacity-20 w-full mb-2 hover:border-primary p-2">
                    WELCOME!!! THIS IS AN ANNOUNCMENT FROM YOUR BELOVED CREATORS OF THIS PLATTFORM: PNSQRT!!!
                  </div>
                </div>
              </TabPanel>
            </Tabs>
          </div >
        </div >

        <CommercialAlert isDismissed={false} />
        < Footer />
      </div >
    </div >
  );
};