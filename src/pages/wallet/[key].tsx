import { useRouter } from 'next/router'
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { getAllDomains, getDomainKey, NameRegistryState, performReverseLookup } from "@bonfida/spl-name-service";
import { NftTokenAccount, useWalletNfts } from '@nfteyez/sol-rayz-react';
import { divideAmount, isValidPublicKeyAddress } from "@metaplex-foundation/js-next";
import { PublicKey, LAMPORTS_PER_SOL, TokenBalance, Transaction, TransactionInstruction, SystemProgram } from "@solana/web3.js";

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import { MainMenu } from "../../utils/mainmenu"
import { randomWallets } from "../../utils/wallets"
import { Footer } from '../../utils/footer';
import Link from "next/link";
import { ConnectWallet, Loader } from "components";
import { NftCard } from '../../utils/NftCard';

import { BurnButton } from "utils/BurnButton";
import { BurnAllButton } from "utils/BurnAllButton";
import Modal from 'react-modal';

import { TokenName } from "utils/TokenName";
import { CommercialAlert } from "utils/CommercialAlert";

import { LoadRarityFile } from 'utils/LoadRarityFiles'
const junks: any = LoadRarityFile(0)
const smb: any = LoadRarityFile(1)
const faces: any = LoadRarityFile(2)
const rektiez: any = LoadRarityFile(3)
const harrddyjunks: any = LoadRarityFile(4)

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

const Wallet = () => {
  const router = useRouter()
  const { key } = router.query
  const wallet: string | string[] = key !== undefined ? key : '';

  const [isConnectedWallet, setIsConnectedWallet] = useState(false)
  const { connection } = useConnection()

  const { nfts, isLoading, error } = useWalletNfts({
    publicAddress: key,
    connection,
  })

  const [test, setTest] = useState()

  const { publicKey } = useWallet();
  const owner = useWallet()

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

  const [comments, setComments] = useState([
    {
      wallet: "4ZVYJvxt9b6fpRTpMTHQnE3jHWEmLx8wjLYYMBKAgNc9",
      timestamp: "1678181463",
      comment: "This NFT sucks, pls burn it!"
    },
    {
      wallet: "873o93bkjGIlkjblk7558GBVKLH9856987097HGJIKBHI",
      timestamp: "1678181463",
      comment: "This NFT sucks, pls burn it!"
    },
    {
      wallet: "pnsqrt.sol",
      timestamp: "1678181463",
      comment: "This NFT sucks, pls burn it!"
    },
    {
      wallet: "zickezacke.sol",
      timestamp: "1678181463",
      comment: "This NFT sucks, pls burn it!"
    },
  ])

  const addComment = (com: any) => {
    if (inputRef.current.value != "") {
      setValue("")
      const user: any = publicKey?.toBase58()
      const time: any = new Date().getTime() / 1000
      setComments(state => [...state, {
        wallet: user,
        timestamp: time,
        comment: com
      }])
    }
  }
  const inputRef = useRef<any>(null);

  const [isBurnAllOpen, setIsBurnAllOpen] = useState(false);
  function toggleBurnAllModal() {
    setIsBurnAllOpen(!isBurnAllOpen);
  }

  const [refresh, setRefresh] = useState(false)
  var postsPerPage = 20;
  const [postNumber, setPostNumber] = useState(35);
  const handleScroll = (e: any) => {
    var isAtBottom = e.target.scrollHeight - e.target.scrollTop <= (e.target.clientHeight + 1)
    //console.log(isAtBottom + "_" + e.target.clientHeight + "-" + (e.target.scrollHeight - e.target.scrollTop))
    if (isAtBottom && postNumber < nfts.length) {
      // Load next posts   
      setPostNumber(postNumber + postsPerPage)
    }
  }

  var historysPerPage = 25;
  const [historyNumber, setHistoryNumber] = useState(historysPerPage);
  const handleHistoryScroll = (e: any) => {
    var isAtBottom = e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight
    if (isAtBottom && historyNumber < history.length) {
      // Load next posts   
      setHistoryNumber(historyNumber + historysPerPage)
    }
  }

  const [history, setHistory] = useState([])
  const [historyList, setHistoryList] = useState([])
  const handleChangeHistory = (val: []) => {
    setHistory(val)
    setHistoryList(val.slice(0, historyNumber))
  }
  async function GetHistory(url: string) {
    try {
      const response = await fetch(url)
      const jsonData = await response.json()
      handleChangeHistory(jsonData)
    } catch (e) {
      console.log(e)
    }
  }

  const [columnsSize, setcolumnsSize] = useState(4);
  const [selectedCollection, setSelectedCollection] = useState<string>("Show all collections");

  const handleCollectionChange = (e: any) => {
    setSelectedCollection(e.target.value)
  };

  const NFTstoSend: string[] = []

  var AllNFTstoBurn: string[] = []
  const [NFTstoBurn, setNFTstoBurn] = useState<string[]>([])
  const [NFTstoBurnNames, setNFTstoBurnNames] = useState<string[]>([])
  const [NFTstoBurnImages, setNFTstoBurnImages] = useState<string[]>([])

  const addNFTtoBurn = (newNFT: string, newNFTName: string, newNFTImage: string) => {
    setNFTstoBurn(state => [...state, newNFT])
    setNFTstoBurnNames(state => [...state, newNFTName])
    setNFTstoBurnImages(state => [...state, newNFTImage])
  }

  const delNFTtoBurn = (newNFT: string, newNFTName: string, newNFTImage: string) => {
    var array1 = [...NFTstoBurn]
    var array2 = [...NFTstoBurnNames]
    var array3 = [...NFTstoBurnImages]
    const tmp1 = array1.splice(array1.indexOf(newNFT), 1)
    const tmp2 = array2.splice(array2.indexOf(newNFTName), 1)
    const tmp3 = array3.splice(array3.indexOf(newNFTImage), 1)
    setNFTstoBurn(array1)
    setNFTstoBurnNames(array2)
    setNFTstoBurnImages(array3)
  }

  const delNFTtoBurnByName = (newNFTName: string) => {
    var array1 = [...NFTstoBurn]
    var array2 = [...NFTstoBurnNames]
    var array3 = [...NFTstoBurnImages]
    const index = array2.indexOf(newNFTName)
    const tmp1 = array1.splice(index, 1)
    const tmp2 = array2.splice(index, 1)
    const tmp3 = array3.splice(index, 1)
    setNFTstoBurn(array1)
    setNFTstoBurnNames(array2)
    setNFTstoBurnImages(array3)
  }

  const [selectedMode, setSelectedMode] = useState(false)
  const selectMode = () => {
    if (selectedMode) {
      setNFTstoBurn([])
      setNFTstoBurnNames([])
      setNFTstoBurnImages([])
      setSelectedMode(false)
    }
    else
      setSelectedMode(true)
  }


  type NftListProps = {
    nfts: NftTokenAccount[];
    error?: Error;
    setRefresh: Dispatch<SetStateAction<boolean>>
  };

  const NftList = ({ nfts, error, setRefresh }: NftListProps) => {
    if (error) {
      return null;
    }

    if (!nfts?.length) {
      return (
        <div className="font-pixel text-center text-2xl pt-16">
          No NFTs found in this wallet
        </div>
      );
    }

    const [commercial, setCommercial] = useState(false);

    const [nftList, setNftList] = useState(nfts.slice(0, postNumber))

    return (
      <div className={`${columnsSize == 12 ? "lg:grid-cols-12" :
        columnsSize == 11 ? "lg:grid-cols-11" :
          columnsSize == 10 ? "lg:grid-cols-10" :
            columnsSize == 9 ? "lg:grid-cols-9" :
              columnsSize == 8 ? "lg:grid-cols-8" :
                columnsSize == 7 ? "lg:grid-cols-7" :
                  columnsSize == 6 ? "lg:grid-cols-6" :
                    columnsSize == 5 ? "lg:grid-cols-5" :
                      columnsSize == 4 ? "lg:grid-cols-4" :
                        columnsSize == 3 ? "lg:grid-cols-3" : "grid-cols-2"} grid-cols-2 grid gap-1`}>

        {selectedCollection == "Show all collections" ? (
          (nftList?.map((nft: any, index: any) => (
            (index % 20 == 0 ? (
              <Link key={index} passHref href="/mint"><img src="/static/images/commercial_block1.png" alt="tmp" className="hover:border-primary hover:cursor-pointer rounded bg-gray-900 border-2 flex flex-wrap content-center" /></Link>
            ) : (
              <NftCard isConnectedWallet={isConnectedWallet} key={index} details={nft} onSelect={() => { }} toBurn={NFTstoBurn} toBurnChange={addNFTtoBurn} toBurnDelete={delNFTtoBurn} toSend={NFTstoSend} selectedMode={selectedMode} setRefresh={setRefresh} />
            ))
          )
          ))
        ) : (
          (nfts?.map((nft: any, index: any) => (
            (nft.updateAuthority == selectedCollection &&
              <NftCard isConnectedWallet={isConnectedWallet} key={index} details={nft} onSelect={() => { }} toBurn={NFTstoBurn} toBurnChange={addNFTtoBurn} toBurnDelete={delNFTtoBurn} toSend={NFTstoSend} selectedMode={selectedMode} setRefresh={setRefresh} />
            )
          )
          ))
        )
        }
      </div>
    );
  };




  var gen1Count: number = 0
  var gen2Count: number = 0
  var smbCount: number = 0
  var facesCount: number = 0
  var rektiezCount: number = 0
  var harrddyJunksCount: number = 0
  var gen1Score: number = 0
  var gen2Score: number = 0
  var smbScore: number = 0
  var facesScore: number = 0
  var rektiezScore: number = 0
  var harrddyJunksScore: number = 0
  var score: number = 0
  var trukClaim: number = 0

  let collections: any[] = []
  let collectionsUri: any[] = []
  let collectionsMint: any[] = []
  let collectionsNames: any[] = []

  nfts.forEach(async (element: any) => {
    AllNFTstoBurn.push(element.mint)
    if (element.updateAuthority == "EshFf23GMA55yKPCQm76KrhSyfp7RuAsjDDpHE7wTeDM") {
      gen1Count++
      gen1Score += parseFloat(junks[0].nfts.find((el: { MintHash: any; }) => el.MintHash === element.mint).Score)
    }
    if (element.updateAuthority == "FEtQrCx12b9ebbTZq8Un11RNJUYxiDQF4zQCJctzRYH6") {
      smbCount++
      smbScore += parseFloat(smb[0].nfts.find((el: { MintHash: any; }) => el.MintHash === element.mint).Score)
    }
    if (element.updateAuthority == "8DQoDXZvWrUHjp4DbjFTW8AhXsdTBgYVicwieJ6FzKVe") {
      facesCount++
      facesScore += parseFloat(faces[0].nfts.find((el: { MintHash: any; }) => el.MintHash === element.mint).Score)
    }
    if (element.updateAuthority == "5XZrWyd6hmMcUScak7S2ef92rQW4hftkJDMDg6uYHssp") {
      gen2Count++
      gen2Score += 6.9
    }
    if (element.updateAuthority == "PnsQRTnqXBPshHpPj2kHWZwyrWABa5GTrPA6MDkwV4p") {
      rektiezCount++
      rektiezScore += parseFloat(rektiez[0].nfts.find((el: { MintHash: any; }) => el.MintHash === element.mint).Score)
    }
    if (element.updateAuthority == "G14Wu9xSqL2yLHCrQHqajvhK7zApwdEM6iWhbBxcFQXS") {
      harrddyJunksCount++
      harrddyJunksScore += 6969
    }
    if (!collections.includes(element.updateAuthority)) {
      collections.push(element.updateAuthority)
      collectionsUri.push(element.data.uri)
      collectionsMint.push(element.mint)
      collectionsNames.push(element.data.name)
    }
  });

  //CLAIM FORMULA
  score = (gen1Score +
    smbScore +
    facesScore +
    rektiezScore +
    harrddyJunksScore)
  trukClaim = score / 69

  const [domain, setDomain] = useState("loading...")
  const handleChangeDomain = (val: string) => {
    setDomain(val)
  }

  const [balance, setBalance] = useState("")
  const handleChangeBalance = (val: string) => {
    setBalance(val)
  }

  useEffect(() => {
    //DOMAIN
    (async () => {
      try {
        handleChangeDomain("loading...")
        const user = new PublicKey(wallet)
        const domains = await getAllDomains(connection, user);
        handleChangeDomain(await performReverseLookup(connection, domains[0]) + ".sol")
      } catch (err) {
        console.log("DOMAIN ERROR:" + err)
        handleChangeDomain("no domain found")
      }
    })();

    //BALANCE
    (async () => {
      try {
        const user = new PublicKey(wallet)
        const balance = await connection.getBalance(user)
        handleChangeBalance((balance / LAMPORTS_PER_SOL).toFixed(3))
      } catch (e) {
        console.log("BALANCE ERROR:" + e)
      }

    })();

    //ENTERED WALLET = CONNECTED WALLET???
    if (value == publicKey?.toBase58())
      setIsConnectedWallet(true)
    else
      setIsConnectedWallet(false)

    //ME HISTORY
    setHistoryList([])
    GetHistory(`https://fudility.xyz:3420/history/${key}`)
    //getTransactions(walletPublicKey, 5)

    setPostNumber(35);
    setSelectedCollection("Show all collections")

    if (key == publicKey?.toBase58())
      setIsConnectedWallet(true)
    else
      setIsConnectedWallet(false)
  }, [wallet])

  useEffect(() => {
    setHistoryList(history.slice(0, historyNumber))
  }, [historyNumber])

  return (
    <div className="min-h-full">
      <div className="">
        <div className="navbar sticky top-0 z-40 text-neutral-content flex justify-between bg-gray-900">
          <MainMenu />
          <div className="border-2 rounded-lg border-gray-700 bg-gray-700 hidden lg:block">
            <button className="bg-primary hover:bg-gray-800 rounded-l-md tooltip tooltip-left h-10 w-12" data-tip="Show a random wallet">
              <Link passHref href={`/wallet/${randomWallet}`}>🤷‍♂️ </Link>
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
                  <Link passHref href={`/wallet/${value}`}>👁️</Link>
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
                  <Link passHref href="/">Home</Link>
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
                  <Link passHref href="/mint">MINT NOW</Link>
                </button>
              </div>
            </div>

            {/* PROFILE */}
            <div id="sidebar" className="grid justify-items-end">
              {isConnectedWallet &&
                <div className="flex justify-between w-1/2">
                  <div className="flex justify-between ml-2">
                    {selectedMode ? (
                      <div>
                        <input type="checkbox" className="toggle font-pixel" onClick={selectMode} />
                        <p className="text-2xs font-pixel text-center">BURN</p>
                      </div>
                    ) : (
                      <div>
                        <input type="checkbox" className="toggle font-pixel" onClick={selectMode} />
                        <p className="text-2xs font-pixel text-center">VIEW</p>
                      </div>
                    )
                    }
                  </div>
                  <div className="border-2 rounded-lg border-opacity-10">
                    {publicKey ?
                      <button className="btn btn-ghost rounded-sm hover:bg-gray-800 w-full">
                        <Link passHref href={`/wallet/${publicKey?.toBase58()}`}>
                          <img src="/static/images/profil.png" className="w-8 h-8" alt="tmp"/>
                        </Link>

                      </button>
                      : <div className="font-pixel text-center">connect wallet</div>
                    }
                  </div>
                </div>
              }
              {!isConnectedWallet &&
                <div className="w-1/2 border-2 rounded-lg border-opacity-10">
                  {publicKey ?
                    <button className="btn btn-ghost rounded-sm hover:bg-gray-800 w-full">
                      <Link passHref href={`/wallet/${publicKey?.toBase58()}`}>
                        <div className='w-full flex justify-between items-center'>
                          <img src="/static/images/profil.png" className="w-8 h-8" alt="tmp" />
                          <p className="font-pixel text-2xs">{(publicKey?.toBase58()).slice(0, 4)}...{(publicKey?.toBase58()).slice(-4)}</p>
                        </div>
                      </Link>

                    </button>
                    : <div className="font-pixel text-center">connect wallet</div>
                  }
                </div>
              }
            </div>
          </div>

          {/* CONTENT */}
          <div className="col-span-2 scrollbar overflow-auto h-[90vh] border-2 border-opacity-20" onScroll={handleScroll}>
            <div className="font-pixel navbar sticky top-0 z-40 text-neutral-content flex justify-between gap-2 bg-gray-900 bg-opacity-50 backdrop-blur border-b-2 border-opacity-20">
              <div>
                <button onClick={() => router.back()}>🔙</button>
                <div className="">
                  <img src='/static/images/heads/1.png' className="w-8 h-8 mr-5" alt="tmp" />
                </div>
                <div className='grid'>
                  {key}
                  <div className='flex justify-between'>
                    <div className='flex'>
                      <div className="flex text-sm "><p className="font-pixel">NFTs:&nbsp;</p><p className="font-pixel">{nfts.length}</p></div>
                      <div className="flex text-sm ml-5 uppercase"><p className="font-pixel">Score:&nbsp;</p><p className="font-pixel">{score.toFixed(0)}</p></div>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="range"
                        max="12"
                        min="2"
                        value={columnsSize}
                        className="range range-xs w-28 range-primary tooltip tooltip-left font-pixel" data-tip="Change Grid size"
                        onChange={(e) => { setcolumnsSize(parseInt(e.target.value)); setPostNumber(postNumber + postsPerPage) }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <select onChange={handleCollectionChange} className="select w-80 select-primary font-pixel">
                <option>Show all collections</option>
                {collections?.map((num: any, index: any) => (
                  <option key={index}>{num}</option>
                ))
                }
              </select>
            </div>
            <div className="font-pixel p-2">
              
            {!error && isLoading ? (
              <div className="grid grid-flow-row auto-rows-max content-center h-full">
                <Loader />
              </div>
              ):(
                <NftList nfts={nfts} error={error} setRefresh={setRefresh} />
              )
            }
              
            </div>
          </div>

          {/* RIGHT BAR */}
          <div className="col-span-1 bg-gray-900 h-full p-2">
            {!selectedMode &&
              <Tabs>
                <TabList>
                  <Tab><h1 className="font-pixel">INFO</h1></Tab>
                  <Tab><h1 className="font-pixel">COMMENTS</h1></Tab>
                </TabList>

                <TabPanel>
                  <div className="flex justify-between text-sm mx-2"><p className="font-pixel">Public Key:&nbsp;</p><p className="font-pixel">{key}</p></div>
                  <br />
                  <div className="flex justify-between text-sm mx-2"><p className="font-pixel">Domain:&nbsp;</p><p className="font-pixel">{domain}</p></div>
                  <div className="flex justify-between text-sm mx-2"><p className="font-pixel mr-2">SOL:&nbsp;</p><p className="font-pixel">{balance}◎</p></div>
                  <div className="flex justify-between text-sm mx-2"><p className="font-pixel">Total NFTs:&nbsp;</p><p className="font-pixel">{nfts.length}</p></div>
                  <div className="flex justify-between text-sm mx-2"><p className="font-pixel">Collections:&nbsp;</p><p className="font-pixel">{collections.length}</p></div>
                  <div className="flex justify-between text-sm mx-2"><p className="font-pixel">NFT Value:&nbsp;</p><p className="font-pixel">tba</p></div>
                  <br />
                  <p className="font-pixel underline">$TRUK CLAIMING</p>
                  <div className="flex justify-between text-sm mx-2"><p className="font-pixel">SolJunks GEN1:&nbsp;</p><p className="font-pixel">{gen1Count}/{gen1Score.toFixed(0)}</p></div>
                  <div className="flex justify-between text-sm mx-2"><p className="font-pixel">SolJunks GEN2:&nbsp;</p><p className="font-pixel">{gen2Count}/{gen2Score.toFixed(0)}</p></div>
                  <div className="flex justify-between text-sm mx-2"><p className="font-pixel">$olana Money Bu$ine$$:&nbsp;</p><p className="font-pixel">{smbCount}/{smbScore.toFixed(0)}</p></div>
                  <div className="flex justify-between text-sm mx-2"><p className="font-pixel">Faces of $MB:&nbsp;</p><p className="font-pixel">{facesCount}/{facesScore.toFixed(0)}</p></div>
                  <div className="flex justify-between text-sm mx-2"><p className="font-pixel">Lil Rektiez:&nbsp;</p><p className="font-pixel">{rektiezCount}/{rektiezScore.toFixed(0)}</p></div>
                  <div className="flex justify-between text-sm mx-2"><p className="font-pixel">HarrddyJunks:&nbsp;</p><p className="font-pixel">{harrddyJunksCount}/{harrddyJunksScore.toFixed(0)}</p></div>
                  <br />
                  <div className="flex justify-between text-sm mx-2 uppercase"><p className="font-pixel">Wallet Score:&nbsp;</p><p className="font-pixel">{score.toFixed(0)}</p></div>
                  <div className="flex justify-between text-sm mx-2 uppercase"><p className="font-pixel">$TRUK/Day:&nbsp;</p><p className="font-pixel">{trukClaim.toFixed(2)}</p></div>
                </TabPanel>

                <TabPanel>
                  <div className="font-pixel p-2 overflow-auto scrollbar h-[45rem]">
                    {comments?.slice(0).reverse().map((num: any, index: any) => (
                      <div key={index} id="Comments" className="bg-gray-900 w-full rounded-lg p-2 mb-2 border-2 border-opacity-10">
                        <div className="flex justify-between">
                          <div className="flex">
                            <div className='border-2 rounded-lg border-opacity-10 mr-5'>
                              <button className="btn btn-ghost font-pixel w-full hover:bg-gray-800 btn-xs">{num.wallet.slice(0, 4)}...{num.wallet.slice(-4)}</button>
                            </div>
                            <h1>said:</h1>
                          </div>
                          <h1 className="text-right text-xs">{convertTimestamp(num.timestamp)}</h1>
                        </div>
                        <h1 className="">{num.comment}</h1>
                      </div>
                    ))}
                  </div>
                  {publicKey ? (
                    <div className="bg-gray-900 w-full font-pixel flex justify-between mt-5">
                      <input
                        ref={inputRef}
                        type="text"
                        value={value}
                        onChange={(e) => { setValue(e.target.value) }}
                        placeholder="write comment"
                        className="input w-full mr-5 input-bordered"
                        maxLength={150} />
                      <h1 className='grid items-center mr-3 border-2 border-opacity-20 p-1 rounded-xl text-xs'>{value.length}/150</h1>
                      <button onClick={() => addComment(inputRef.current?.value)} className="btn btn-secondary mr-2">Send</button>
                    </div>
                  ) : (
                    <h1 className="bg-gray-900 w-full font-pixel p-2 flex justify-between mt-5 border-2 border-opacity-20 text-center rounded-lg">connect your wallet to write comments</h1>
                  )
                  }
                </TabPanel>
              </Tabs>
            }
            {selectedMode &&
              <div className="bg-gray-900 p-2">
                <div className="flex justify-between">
                  <BurnButton toBurn={NFTstoBurn} connection={connection} publicKey={publicKey} wallet={owner} setRefresh={setRefresh} />
                  <button onClick={toggleBurnAllModal} className="font-pixel btn btn-primary">
                    Burn ALL
                  </button>
                </div>
                <ul className="overflow-auto h-[47rem] scrollbar border-2 rounded mt-1 mb-1 p-1 border-gray-800">
                  {NFTstoBurnNames.map((num: any, index: any) => (
                    <li key={index} className="bg-gray-700 rounded-lg font-pixel p-2 mb-1 flex justify-between items-center break">
                      <img src={NFTstoBurnImages[index]} className="h-16" alt="tmp" />
                      <h1 className="text-center">{num}</h1>
                      <button onClick={(e) => delNFTtoBurnByName(num)} className="btn btn-ghost">
                        x
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between">
                  <h1 className="font-pixel">SELECTED: {NFTstoBurn.length}</h1>
                  <h1 className="font-pixel">SOL: {(NFTstoBurn.length) * 0.01}</h1>
                </div>
              </div>}
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
        <Modal
          isOpen={isBurnAllOpen}
          onRequestClose={toggleBurnAllModal}
          style={{
            overlay: {
              backgroundColor: 'rgba(0, 0, 0, 0.75)'
            },
            content: {
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              marginRight: '-50%',
              transform: 'translate(-50%, -50%)',
              color: 'white',
              backgroundColor: 'rgba(45, 45, 65, 1)'
            },

          }}
          ariaHideApp={false}
          contentLabel="BATTLE WINDOW"
        >
          <div className="flex justify-between">
            <div></div>
            <h1 className="font-pixel">BURN WHOLE WALLET</h1>
            <button className="font-pixel text-white btn btn-xs btn-primary text-right" onClick={toggleBurnAllModal}>X</button>
          </div>
          <div className="text-center">
            <h1 className="font-pixel text-2xl">You are about to burn {AllNFTstoBurn.length} NFTs...</h1>
            <img src="/static/images/burnAll.png" className="h-96 mb-3 mt-3" alt="tmp" />
            <BurnAllButton toBurn={AllNFTstoBurn} connection={connection} publicKey={publicKey} wallet={owner} setRefresh={setRefresh} />
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Wallet