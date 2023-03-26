import { useRouter } from 'next/router'
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { getAllDomains, getDomainKey, NameRegistryState, performReverseLookup } from "@bonfida/spl-name-service";
import { NftTokenAccount, useWalletNfts } from '@nfteyez/sol-rayz-react';
import { isValidPublicKeyAddress } from "@metaplex-foundation/js-next";
import { PublicKey, LAMPORTS_PER_SOL, TokenBalance, Transaction, TransactionInstruction, SystemProgram } from "@solana/web3.js";
import {
  QuestionMarkCircleIcon,
  CheckCircleIcon,
  ArrowCircleLeftIcon,
  ReplyIcon
} from '@heroicons/react/solid'

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import ReactTimeAgo from 'react-time-ago'
import InputEmoji from "react-input-emoji";

import { BuyButton } from "../../utils/buybutton"
import { randomWallets } from "../../utils/wallets"
import { Footer } from '../../utils/footer';
import { Animation } from "../../utils/Animation"
import Link from "next/link";
import { ConnectWallet, Loader } from "components";
import { NftCard } from '../../utils/NftCard';
import { BadgeCreator } from "../../utils/BadgeCreator"

import { BurnButton } from "utils/BurnButton";
import { BurnAllButton } from "utils/BurnAllButton";

import Modal from 'react-modal';
Modal.setAppElement("#__next");

import { TokenName } from "utils/TokenName";
import { CommercialAlert } from "utils/CommercialAlert";

import { LoadRarityFile } from 'utils/LoadRarityFiles'
import { SideBar } from 'utils/sidebar';
import { UserIcon } from '@heroicons/react/solid';
import { HeartIcon } from '@heroicons/react/solid';
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
  const fudility = process.env.NEXT_PUBLIC_FUDILITY_BACKEND!
  const router = useRouter()
  const { key } = router.query
  const wallet: string | string[] = key !== undefined ? key : '';

  const [isConnectedWallet, setIsConnectedWallet] = useState(false)
  const { connection } = useConnection()

  const { nfts, isLoading, error } = useWalletNfts({
    publicAddress: key,
    connection,
  })

  const { publicKey } = useWallet();
  const owner = useWallet()

  const [message, setMessage] = useState(false)
  var valid = false
  function randomInt(low: number, high: number) {
    return Math.floor(Math.random() * (high - low) + low)
  }

  const [value, setValue] = useState("")
  const [commentValue, setCommentValue] = useState("")
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

  const [isOpen, setIsOpen] = useState(false);
  function toggleModal() {
    setIsOpen(!isOpen);
  }

  const [comments, setComments] = useState<any>([])
  const [hiddenComments, setHiddenComments] = useState<any>([])
  const addComment = (com: any) => {
    if (commentValue != "") {
      setCommentValue("")
      const user: any = publicKey?.toBase58()
      SendComment(fudility + `sendcomment/${key}/3/${walletUserAccountData.name}/${encodeURIComponent(com)}/${user}/${userAccountData.name}/${encodeURIComponent(userAccountData.pfp)}`)
      SendNotif(fudility + `sendnotif/${key}/1`)
    }
  }
  const addHiddenComment = (com: any) => {
    if (commentValue != "") {
      setCommentValue("")
      const user: any = publicKey?.toBase58()
      SendComment(fudility + `sendcomment/${key}/8/${walletUserAccountData.name}/${encodeURIComponent(com)}/${user}/${userAccountData.name}/${encodeURIComponent(userAccountData.pfp)}`)
      SendNotif(fudility + `sendnotif/${key}/1`)
    }
  }

  async function SendComment(uri: string) {
    try {
      const response = await fetch(uri)
      GetComments(fudility + `getcomments/${key}`)
      GetHiddenComments(fudility + `gethiddencomments/${key}`)
    } catch (e) {
      console.log(e)
    }
  }

  async function GetComments(uri: string) {
    try {
      const response = await fetch(uri)
      const jsonData = await response.json()
      setComments(jsonData)
    } catch (e) {
      console.log(e)
    }
  }

  async function GetHiddenComments(uri: string) {
    try {
      const response = await fetch(uri)
      const jsonData = await response.json()
      setHiddenComments(jsonData)
    } catch (e) {
      console.log(e)
    }
  }

  async function SendNotif(uri: string) {
    try {
      const response = await fetch(uri)
    } catch (e) {
      console.log(e)
    }
  }

  const [likeState, setLikeState] = useState<string>("notLiked")
  async function GetLike(uri: string) {
    try {
      const response = await fetch(uri)
      const jsonData = await response.json()
      console.log(jsonData)
      if (jsonData[0].user == publicKey?.toBase58())
        setLikeState("isLiked")
    } catch (e) {
      console.log(e)
    }
  }

  async function SendLike(uri: string) {
    try {
      const response = await fetch(uri)
      setLikeState("isLiked")
      GetWalletUserAccount(fudility + `user/${key}`)
      if (key == publicKey?.toBase58())
        GetUserAccount(fudility + `user/${publicKey?.toBase58()}`)
    } catch (e) {
      console.log(e)
    }
  }

  async function DisLike(uri: string) {
    try {
      const response = await fetch(uri)
      setLikeState("notLiked")
      GetWalletUserAccount(fudility + `user/${key}`)
      if (key == publicKey?.toBase58())
        GetUserAccount(fudility + `user/${publicKey?.toBase58()}`)
    } catch (e) {
      console.log(e)
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
    var isAtBottom = e.target.scrollHeight - e.target.scrollTop <= (e.target.clientHeight + 2)
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

  const [pfpImage, setPfpImage] = useState<string>("none")
  const addToPfpImage = (newNFTImage: string) => {
    ChangePfp(fudility + `changepfp/${key}/${userAccountData.name}/${encodeURIComponent(newNFTImage)}`)
    setPfpImage(newNFTImage)
  }

  async function ChangePfp(uri: string) {
    try {
      const response = await fetch(uri)
        .then((res) =>
          GetUserAccount(fudility + `user/${key}`)
        )
    } catch (e) {
      console.log(e)
    }
  }

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

  const [pfpMode, setPfpMode] = useState(false)
  const PfpMode = () => {
    if (pfpMode) {
      setPfpMode(false)
    }
    else
      setPfpMode(true)
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
        <div className="font-trash uppercase text-center text-2xl pt-16">
          No NFTs found in this wallet, BOZO
        </div>
      );
    }

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
        <div className='relative'>
          <img src="/static/images/commercial_block1.png" alt="tmp" className="hover:border-primary hover:cursor-pointer rounded bg-base-300 border-2 flex flex-wrap content-center" />
          <Link passHref href="/mint">
            <div className="hover:cursor-pointer absolute inset-0 text-center flex flex-col items-center justify-center opacity-0 hover:opacity-100 bg-opacity-90 duration-300 hover:border-2 border-primary rounded">
              <h1 className="tracking-wider font-trash uppercase bg-black bg-opacity-60 rounded p-3 border-2 border-opacity-20" >
                THIS IS NO NFT, IT`S A COMMERCIAL!!! CLICK TO MINT SOLJUNKS GEN2 NOW
              </h1>
            </div>
          </Link>
        </div>
        {selectedCollection == "Show all collections" ? (
          (nftList?.map((nft: any, index: any) => (
            <NftCard isConnectedWallet={isConnectedWallet} key={index} details={nft} onSelect={() => { }} toBurn={NFTstoBurn} toBurnChange={addNFTtoBurn} toBurnDelete={delNFTtoBurn} toSend={NFTstoSend} selectedMode={selectedMode} setRefresh={setRefresh} setPfpMode={PfpMode} pfpMode={pfpMode} toPfpImage={addToPfpImage} />
          )
          ))
        ) : (
          (nfts?.map((nft: any, index: any) => (
            (nft.updateAuthority == selectedCollection &&
              <NftCard isConnectedWallet={isConnectedWallet} key={index} details={nft} onSelect={() => { }} toBurn={NFTstoBurn} toBurnChange={addNFTtoBurn} toBurnDelete={delNFTtoBurn} toSend={NFTstoSend} selectedMode={selectedMode} setRefresh={setRefresh} setPfpMode={PfpMode} pfpMode={pfpMode} toPfpImage={addToPfpImage} />
            )
          )
          ))
        )
        }
        <Link passHref href="/mint"><img src="/static/images/commercial_block1.png" alt="tmp" className="hover:border-primary hover:cursor-pointer rounded bg-base-300 border-2 flex flex-wrap content-center" /></Link>
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

  const [walletUserAccountData, setwalletUserAccountData] = useState<any>({})
  async function GetWalletUserAccount(uri: string) {
    try {
      const response = await fetch(uri)
      const jsonData = await response.json()
      setwalletUserAccountData(jsonData)
      setPfpImage(jsonData.pfp)
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

  async function ClaimWallet(uri: string) {
    try {
      const response = await fetch(uri)
        .then((res) =>
          GetUserAccount(fudility + `user/${publicKey?.toBase58()}`)
        )
    } catch (e) {
      console.log(e)
    }
  }

  const [newName, setNewName] = useState<string>("")
  async function ChangeUserName(uri: string) {
    try {
      const response = await fetch(uri)
        .then((res) =>
          GetUserAccount(fudility + `user/${publicKey?.toBase58()}`)
        )
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    //Get User Account Data and Comments everytime the site reloads
    (async () => {
      //setLikeState("notLiked")
      GetLike(fudility + `getlike/${publicKey?.toBase58()}/${key}`)
      GetUserAccount(fudility + `user/${publicKey?.toBase58()}`)

      GetWalletUserAccount(fudility + `user/${key}`)
      GetComments(fudility + `getcomments/${key}`)
      GetHiddenComments(fudility + `gethiddencomments/${key}`)
    })();

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
    GetHistory(fudility + `history/${key}`)
    //getTransactions(walletPublicKey, 5)

    setPostNumber(35);
    setSelectedCollection("Show all collections")

    if (key == publicKey?.toBase58())
      setIsConnectedWallet(true)
    else
      setIsConnectedWallet(false)
  }, [wallet])


  useEffect(() => {
    (async () => {
      //setLikeState("notLiked")
      GetLike(fudility + `getlike/${publicKey?.toBase58()}/${key}`)
      GetUserAccount(fudility + `user/${publicKey?.toBase58()}`)

      GetWalletUserAccount(fudility + `user/${key}`)
      GetComments(fudility + `getcomments/${key}`)
      GetHiddenComments(fudility + `gethiddencomments/${key}`)
    })();
  }, [userAccountData.likes])

  useEffect(() => {
    setHistoryList(history.slice(0, historyNumber))
  }, [historyNumber])

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
            {isConnectedWallet &&
              <div className='flex justify-between font-trash uppercase border-2 rounded-lg border-opacity-20 p-3 mr-2'>
                <div className="flex justify-between">
                  {selectedMode ? (
                    <div className="flex justify-between items-center">
                      <input type="checkbox" className="toggle" onClick={selectMode} />
                      <p className="text-2xs text-center ml-2">BURN</p>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <input type="checkbox" className="toggle" onClick={selectMode} />
                      <p className="text-2xs text-center ml-2">VIEW</p>
                    </div>
                  )
                  }
                </div>
              </div>
            }
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
          <div className="col-span-7 scrollbar overflow-auto h-[80vh] border-2 border-opacity-20" onScroll={handleScroll}>
            <div className="font-trash uppercase navbar sticky top-0 z-10 text-neutral-content flex justify-between gap-2 bg-base-300 bg-opacity-50 backdrop-blur border-b-2 border-opacity-20">
              <div>
                <button onClick={() => router.back()}><ArrowCircleLeftIcon className='w-8 h-8 text-white' /></button>
                {pfpImage == "none" ? (
                  <QuestionMarkCircleIcon className="w-12 h-12" />
                ) : (
                  <img src={pfpImage} alt="tmp" className='w-12 h-12 rounded-full border-2 mr-2' />
                )}
                <div className=''>
                  <div className="flex justify between">
                    {key == publicKey?.toBase58() ? (
                      <div className='flex'>
                        {userAccountData.name}
                      </div>
                    ) : (
                      <div>
                        {walletUserAccountData.name}
                      </div>
                    )}
                    {key == publicKey?.toBase58() ? (
                      (userAccountData.claimed == "not yet" ? (<QuestionMarkCircleIcon className="h-6 w-6 text-red-500" />) : (<CheckCircleIcon className="h-6 w-6 text-green-500" />))
                    ) : (
                      (walletUserAccountData.claimed == "not yet" ? (<QuestionMarkCircleIcon className="h-6 w-6 text-red-500" />) : (<CheckCircleIcon className="h-6 w-6 text-green-500" />))
                    )
                    }
                    {publicKey && likeState != "isLiked" ? (
                      <div className='flex'>
                        <a onClick={() => SendLike(fudility + `sendlike/${publicKey.toBase58()}/${key}`)}>
                          <HeartIcon className="h-6 w-6 text-gray-500 ml-12 hover:text-red-500 hover:cursor-pointer" />
                        </a>
                      </div>
                    ) : (
                      <div className='flex'>
                        <a onClick={() => DisLike(fudility + `dislike/${publicKey?.toBase58()}/${key}`)}>
                          <HeartIcon className="h-6 w-6 ml-12 text-red-500 hover:text-gray-500 hover:cursor-pointer" />
                        </a>
                      </div>
                    )
                    }
                    {key == publicKey?.toBase58() ? (
                      <div className='ml-5'>Likes: {userAccountData.likes}</div>
                    ) : (
                      <div className='ml-5'>Likes: {walletUserAccountData.likes}</div>
                    )
                    }
                  </div>
                  <div className='flex justify-between'>
                    <div className='flex'>
                      <div className='text-gray-500 mr-5'>{key}</div>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="range"
                        max="12"
                        min="2"
                        value={columnsSize}
                        className="range range-xs w-28 range-primary tooltip tooltip-left font-trash uppercase" data-tip="Change Grid size"
                        onChange={(e) => { setcolumnsSize(parseInt(e.target.value)); setPostNumber(postNumber + postsPerPage) }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <select onChange={handleCollectionChange} className="select w-80 select-primary font-trash uppercase">
                <option>Show all collections</option>
                {collections?.map((num: any, index: any) => (
                  <option key={index}>{num}</option>
                ))
                }
              </select>
            </div>
            <div className="font-trash uppercase p-2 bg-base-300">
              {!error && isLoading ? (
                <div className="grid grid-flow-row auto-rows-max content-center h-full">
                  <Loader />
                </div>
              ) : (
                <NftList nfts={nfts} error={error} setRefresh={setRefresh} />
              )
              }

            </div>
          </div>

          {/* RIGHT BAR */}
          <div className="col-span-4 bg-base-300 h-full p-2">
            {!selectedMode &&
              <Tabs>
                <TabList>
                  <Tab><h1 className="font-trash uppercase">COMMENTS</h1></Tab>
                  <Tab><h1 className="font-trash uppercase">POSTS</h1></Tab>
                  <Tab><h1 className="font-trash uppercase">INFO</h1></Tab>
                  {isConnectedWallet ? (
                    <Tab><h1 className="font-trash uppercase">DASHBOARD</h1></Tab>
                  ) : (
                    <Tab><h1 className="font-trash uppercase">DM</h1></Tab>
                  )
                  }
                  <Tab><h1 className="font-trash uppercase">ME HISTORY</h1></Tab>
                </TabList>

                <TabPanel>
                  <div className="font-trash uppercase p-2 overflow-auto scrollbar h-[70vh]">
                    {comments.length > 0 ? (
                      (comments?.slice(0).reverse().map((num: any, index: any) => (
                        (num.type != "8" &&
                          <div key={index} id="Comments" className="bg-base-300 w-full rounded-lg p-2 mb-2 border-2 border-opacity-20">
                            <div className='grid grid-cols-10'>
                              <div className='col-span-1'>
                                <img src={num.writtenByPfp} alt="tmp" className='w-12 h-12 rounded-full border-2 mr-2' />
                              </div>
                              <div className='col-span-9'>
                                <div className="flex justify-between">
                                  <div className="flex mb-2 text-xs text-gray-500">
                                    <div className="font-trash uppercase w-full hover:text-red-500 hover:cursor-pointer">
                                      <Link passHref href={`/wallet/${num.writtenBy}`}>
                                        <div>{num.writtenBy.slice(0, 4)}...{num.writtenBy.slice(-4)}</div>
                                      </Link>
                                    </div>
                                  </div>
                                  <div className="text-right text-xs ml-10">
                                    <ReactTimeAgo date={num.time} locale="en-US" timeStyle="round" className="uppercase text-gray-500" />
                                  </div>
                                </div>
                                <div className='flex justify-between'>
                                  <h1 className="">{num.content}</h1>
                                  <button className="rounded hover:bg-gray-800 w-8 p-1 text-center">
                                    <Link passHref href={`/discussion/${num._id}`}>
                                      <ReplyIcon className="w-6 h-6" />
                                    </Link>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      )))) : (
                      <h1 className="text-center">Be the first who writes a comments on this</h1>
                    )
                    }
                  </div>
                  {publicKey ? (
                    <div className="bg-base-300 w-full font-trash flex justify-between mt-5 border-2 border-opacity-20 p-1 rounded-lg">
                      <InputEmoji
                        type="text"
                        value={commentValue}
                        onChange={setCommentValue}
                        placeholder="Write a Comment"
                        maxLength={150}
                        onEnter={() => addComment(commentValue)}
                        borderColor="#EAEAEA"
                        borderRadius={5}
                      />
                      <h1 className='grid items-center mr-3 text-xs'>{commentValue.length}/150</h1>
                      <button onClick={() => addComment(commentValue)} className="btn btn-secondary mr-2">Send</button>
                    </div>
                  ) : (
                    <h1 className="bg-base-300 w-full font-trash uppercase p-2 flex justify-between mt-5 border-2 border-opacity-20 text-center rounded-lg">connect your wallet to write comments</h1>
                  )
                  }
                </TabPanel>

                <TabPanel>
                  {/* POSTS */}
                </TabPanel>

                <TabPanel>
                  <div className={score <= 0 ? 'blur-sm' : ''}> {/* ---blur-sm---       wen junkScore is lower equal zero*/}
                    <div className="flex justify-between text-sm mx-2"><p className="font-trash uppercase">Public Key:&nbsp;</p><p className="font-trash uppercase">{walletUserAccountData?.pubKey}</p></div>
                    <div className="flex justify-between text-sm mx-2"><p className="font-trash uppercase">Claimed:&nbsp;</p><p className="font-trash uppercase">{walletUserAccountData.claimed}</p></div>
                    <div className="flex justify-between text-sm mx-2"><p className="font-trash uppercase">Name:&nbsp;</p><p className="font-trash uppercase">{walletUserAccountData.name}</p></div>
                    <div className="flex justify-between text-sm mx-2"><p className="font-trash uppercase">Score:&nbsp;</p><p className="font-trash uppercase">{walletUserAccountData.score}</p></div>
                    <div className="flex justify-between text-sm mx-2"><p className="font-trash uppercase">Created at:&nbsp;</p><p className="font-trash uppercase">{walletUserAccountData.time}</p></div>
                    <br />
                    <div className="flex justify-between text-sm mx-2"><p className="font-trash uppercase">Domain:&nbsp;</p><p className="font-trash uppercase">{domain}</p></div>
                    <div className="flex justify-between text-sm mx-2"><p className="font-trash uppercase mr-2">SOL:&nbsp;</p><p className="font-trash uppercase">{balance}◎</p></div>
                    <div className="flex justify-between text-sm mx-2"><p className="font-trash uppercase">Total NFTs:&nbsp;</p><p className="font-trash uppercase">{nfts.length}</p></div>
                    <div className="flex justify-between text-sm mx-2"><p className="font-trash uppercase">Collections:&nbsp;</p><p className="font-trash uppercase">{collections.length}</p></div>
                    <div className="flex justify-between text-sm mx-2"><p className="font-trash uppercase">NFT Value:&nbsp;</p><p className="font-trash uppercase">tba</p></div>
                    <br />
                    <p className="font-trash uppercase underline">$TRUK CLAIMING</p>
                    <div className="flex justify-between text-sm mx-2"><p className="font-trash uppercase">SolJunks GEN1:&nbsp;</p><p className="font-trash uppercase">{gen1Count}/{gen1Score.toFixed(0)}</p></div>
                    <div className="flex justify-between text-sm mx-2"><p className="font-trash uppercase">SolJunks GEN2:&nbsp;</p><p className="font-trash uppercase">{gen2Count}/{gen2Score.toFixed(0)}</p></div>
                    <div className="flex justify-between text-sm mx-2"><p className="font-trash uppercase">$olana Money Bu$ine$$:&nbsp;</p><p className="font-trash uppercase">{smbCount}/{smbScore.toFixed(0)}</p></div>
                    <div className="flex justify-between text-sm mx-2"><p className="font-trash uppercase">Faces of $MB:&nbsp;</p><p className="font-trash uppercase">{facesCount}/{facesScore.toFixed(0)}</p></div>
                    <div className="flex justify-between text-sm mx-2"><p className="font-trash uppercase">Lil Rektiez:&nbsp;</p><p className="font-trash uppercase">{rektiezCount}/{rektiezScore.toFixed(0)}</p></div>
                    <div className="flex justify-between text-sm mx-2"><p className="font-trash uppercase">HarrddyJunks:&nbsp;</p><p className="font-trash uppercase">{harrddyJunksCount}/{harrddyJunksScore.toFixed(0)}</p></div>
                    <br />
                    <div className="flex justify-between text-sm mx-2 uppercase"><p className="font-trash uppercase">Wallet Score:&nbsp;</p><p className="font-trash uppercase">{score.toFixed(0)}</p></div>
                    <div className="flex justify-between text-sm mx-2 uppercase"><p className="font-trash uppercase">$TRUK/Day:&nbsp;</p><p className="font-trash uppercase">{trukClaim.toFixed(2)}</p></div>
                  </div>
                </TabPanel>

                <TabPanel>
                  {isConnectedWallet ? (
                    <div className='flex justify-between font-trash uppercase'>
                      {userAccountData.claimed == "not yet" &&
                        <div className="border-2 rounded-lg border-opacity-20 w-full text-center">
                          <button onClick={() => ClaimWallet(fudility + `claimwallet/${key}/${userAccountData.name}`)} className="btn btn-ghost hover:bg-gray-800 w-full">
                            CLAIM WALLET NOW
                          </button>
                        </div>
                      }
                      {userAccountData.claimed != "not yet" &&
                        <div className='w-full'>
                          <div className='flex justify-between w-full gap-2'>
                            <div className="border-2 rounded-lg border-opacity-20 text-center p-2 flex flex-col justify-between">
                              <div className="">
                                <input
                                  type="input"
                                  maxLength={20}
                                  value={newName}
                                  placeholder="Type new Name"
                                  className="input input-bordered range-primary font-trash uppercase text-center"
                                  onChange={(e) => setNewName(e.target.value)}
                                />
                              </div>
                              <div className="border-2 rounded-lg border-opacity-20 mt-2 text-center">
                                <button onClick={() => ChangeUserName(fudility + `changename/${key}/${newName}/${userAccountData.name}`)} className="btn btn-ghost hover:bg-gray-800 w-full">
                                  CHANGE USER NAME
                                </button>
                              </div>
                            </div>
                            <div className="border-2 rounded-lg border-opacity-20 items-center text-center p-2 w-full">
                              {pfpImage == "none" ? (
                                <QuestionMarkCircleIcon className="w-24 h-24" />
                              ) : (
                                <img src={pfpImage} alt="" className='w-24 h-24 rounded-full border-2' />
                              )}
                              <div className="border-2 rounded-lg border-opacity-20 text-center">
                                <button onClick={() => PfpMode()} className="btn btn-ghost hover:bg-gray-800">
                                  {!pfpMode ? (
                                    <div>CHANGE PFP FROM WALLET</div>
                                  ) : (
                                    <div>CANCEL</div>
                                  )}
                                </button>
                              </div>
                            </div>
                            <div className="border-2 rounded-lg border-opacity-20 items-center text-center p-2 w-full">
                              <img src="/static/images/rude1.jpg" alt="" className='w-24 h-24 mask mask-hexagon-2 border-2' />
                              <div className="border-2 rounded-lg border-opacity-20 text-center">
                                <button onClick={toggleModal} className="btn btn-ghost hover:bg-gray-800">
                                  MINT BADGE
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="mt-2 border-2 rounded-lg border-opacity-20 w-full p-2">
                            <div className='overflow-auto h-[60vh] scrollbar border-2 rounded mt-1 mb-1 p-1 border-gray-800'>
                              {hiddenComments?.slice(0).reverse().map((num: any, index: any) => (
                                (num.type == 8 && num.writtenBy == publicKey?.toBase58() &&
                                  <div key={index} id="Comments" className="bg-base-300 w-full rounded-lg p-2 mb-2 border-2 border-opacity-20">
                                    <div className="flex justify-between">
                                      <div className="flex">
                                        <div className='border-2 rounded-lg border-opacity-20 mr-5'>
                                          YOU
                                        </div>
                                        <h1>said to</h1>
                                        <div className='ml-5 border-2 rounded-lg border-opacity-20 mr-5'>
                                          <button className="btn btn-ghost font-trash uppercase w-full hover:bg-gray-800 btn-xs">
                                            <Link passHref href={`/wallet/${num.pubKey}`}>
                                              <div>{num.pubKey.slice(0, 4)}...{num.pubKey.slice(-4)}</div>
                                            </Link>
                                          </button>
                                        </div>
                                      </div>
                                      <h1 className="text-right text-xs">{convertTimestamp(num.time)}</h1>
                                    </div>
                                    <div className='flex justify-between'>
                                      <h1 className="">{num.content}</h1>
                                      <button className="rounded hover:bg-gray-800 w-8 p-1 text-center">
                                        <Link passHref href={`/discussion/${num._id}`}>
                                          <ReplyIcon className="w-6 h-6" />
                                        </Link>
                                      </button>
                                    </div>
                                  </div>
                                )
                              ))
                              }
                              {comments.length > 0 ? (
                                (comments?.slice(0).reverse().map((num: any, index: any) => (
                                  (num.type == 8 && num.pubKey == publicKey?.toBase58() &&
                                    <div key={index} id="Comments" className="">
                                      <div className="flex justify-between">
                                        <div className="flex">
                                          <div className='border-2 rounded-lg border-opacity-20 mr-5'>
                                            <button className="btn btn-ghost font-trash uppercase w-full hover:bg-gray-800 btn-xs">
                                              <Link passHref href={`/wallet/${num.writtenBy}`}>
                                                <div>{num.writtenBy.slice(0, 4)}...{num.writtenBy.slice(-4)}</div>
                                              </Link>
                                            </button>
                                          </div>
                                          <h1>said to</h1>
                                          <div className='ml-5 border-2 rounded-lg border-opacity-20 mr-5'>
                                            YOU
                                          </div>
                                        </div>
                                        <h1 className="text-right text-xs">{convertTimestamp(num.time)}</h1>
                                      </div>
                                      <div className='flex justify-between'>
                                        <h1 className="">{num.content}</h1>
                                        <button className="rounded hover:bg-gray-800 w-8 p-1 text-center">
                                          <Link passHref href={`/discussion/${num._id}`}>
                                            <ReplyIcon className="w-6 h-6" />
                                          </Link>
                                        </button>
                                      </div>
                                    </div>
                                  )
                                )))) : (
                                <h1 className="text-center">No DM yet</h1>
                              )
                              }
                            </div>
                          </div>
                        </div>
                      }
                    </div>
                  ) : (
                    <div className="">
                      <div className='overflow-auto h-[70vh] scrollbar border-2 rounded mt-1 mb-1 p-1 border-gray-800'>
                        {comments.length > 0 ? (
                          (comments?.slice(0).reverse().map((num: any, index: any) => (
                            (num.type == 8 && num.writtenBy == publicKey?.toBase58() &&
                              <div key={index} id="Comments" className="bg-base-300 w-full rounded-lg p-2 mb-2 border-2 border-opacity-20">
                                <div className="flex justify-between">
                                  <div className="flex">
                                    <div className='border-2 rounded-lg border-opacity-20 mr-5'>
                                      <button className="btn btn-ghost font-trash uppercase w-full hover:bg-gray-800 btn-xs">
                                        <Link passHref href={`/wallet/${num.writtenBy}`}>
                                          <div>{num.writtenBy.slice(0, 4)}...{num.writtenBy.slice(-4)}</div>
                                        </Link>
                                      </button>
                                    </div>
                                    <h1>said to</h1>
                                    <div className='border-2 rounded-lg border-opacity-20 mr-5'>
                                      <button className="btn btn-ghost font-trash uppercase w-full hover:bg-gray-800 btn-xs">
                                        <Link passHref href={`/wallet/${num.pubKey}`}>
                                          <div>{num.pubKey.slice(0, 4)}...{num.pubKey.slice(-4)}</div>
                                        </Link>
                                      </button>
                                    </div>
                                  </div>
                                  <h1 className="text-right text-xs">{convertTimestamp(num.time)}</h1>
                                </div>
                                <div className='flex justify-between'>
                                  <h1 className="">{num.content}</h1>
                                  <button className="rounded hover:bg-gray-800 w-8 p-1 text-center">
                                    <Link passHref href={`/discussion/${num._id}`}>
                                      <ReplyIcon className="w-6 h-6" />
                                    </Link>
                                  </button>
                                </div>
                              </div>
                            )
                          )))) : (
                          <h1 className="text-center">No hidden comments yet</h1>
                        )
                        }
                      </div>
                      {publicKey ? (
                        <div className="bg-base-300 w-full font-trash uppercase flex justify-between mt-5">
                          <input
                            ref={inputRef}
                            type="text"
                            value={commentValue}
                            onChange={(e) => { setValue(e.target.value) }}
                            placeholder="write DM"
                            className="input w-full mr-5 input-bordered text-3xl"
                            maxLength={150} />
                          <h1 className='grid items-center mr-3 border-2 border-opacity-20 p-1 rounded-xl text-xs'>{commentValue.length}/150</h1>
                          <button onClick={() => addHiddenComment(inputRef.current?.value)} className="btn btn-secondary mr-2">Send</button>
                        </div>
                      ) : (
                        <h1 className="bg-base-300 w-full font-trash uppercase p-2 flex justify-between mt-5 border-2 border-opacity-20 text-center rounded-lg">connect your wallet to write comments</h1>
                      )
                      }
                    </div>
                  )
                  }
                </TabPanel>

                <TabPanel>
                  <div className="overflow-auto lg:h-[79.5vh] scrollbar p-1" onScroll={handleHistoryScroll}>
                    {historyList?.map((num: any, index: any) => (
                      <div key={index}>
                        {num.type != "bid" ? (
                          <div className="grid bg-gray-900 text-sm h-18 text-center rounded-lg mb-1 border-2 border-gray-800 p-2">
                            <div className='flex justify-between'>
                              <button className="flex bg-gray-900 justify-between hover:bg-gray-700 rounded-lg ml-1 font-trash tooltip tooltip-right w-48" data-tip="Show on ME">
                                <a href={`https://magiceden.io/item-details/${num.tokenMint}`} target="_blank" rel="noreferrer">
                                  <TokenName mint={num.tokenMint} />
                                </a>
                              </button>

                              {num.type == "buyNow" && num.buyer == key ? (
                                <p className="font-trash text-center rounded bg-green-600 w-48 my-auto p-2">BOUGHT for {num.price.toFixed(2)}◎</p>
                              ) : (
                                num.type == "list" ? (
                                  <p className="font-trash text-center rounded bg-yellow-400 w-48 my-auto p-2">LISTED for {num.price.toFixed(2)}◎</p>
                                ) : (
                                  num.type == "delist" ? (
                                    <p className="font-trash text-center rounded bg-gray-500 w-48 my-auto p-2">DELISTED for {num.price.toFixed(2)}◎</p>
                                  ) : (
                                    num.type == "buyNow" && num.seller == key ? (
                                      <p className="font-trash text-center rounded bg-red-600 w-48  my-auto p-2">SOLD for {num.price.toFixed(2)}◎</p>
                                    ) : (
                                      num.type == "cancelBid" ? (
                                        <p className="font-trash text-center rounded bg-blue-600 w-48 my-auto p-2">CANCELED for {num.price.toFixed(2)}◎</p>
                                      ) : (
                                        <p className="rounded w-40h-8 my-auto">{num.type}</p>
                                      )
                                    )
                                  )
                                )
                              )}
                              <p className="font-trash text-xs my-auto ml-2">
                                <ReactTimeAgo date={num.blockTime * 1000} locale="en-US" timeStyle="round" className="uppercase text-gray-500" />
                              </p>
                            </div>
                            <div className='mt-2'>
                              {num.type == "buyNow" && num.seller == key ? (
                                <div className="font-trash flex justify-between rounded items-center"><p className='mr-2 uppercase '>Bought by </p>
                                  <button className="btn bg-gray-700 btn-sm text-xs">
                                    <Link passHref href={`/wallet/${num.buyer}`}>
                                      {num.buyer}
                                    </Link>
                                  </button>
                                </div>
                              ) : (
                                null
                              )}
                              {num.type == "buyNow" && num.buyer == key ? (
                                <div className="font-trash flex justify-between rounded items-center"><p className='mr-2 uppercase '>Bought from </p>
                                  <button className="btn bg-gray-700 btn-sm text-xs">
                                    <Link passHref href={`/wallet/${num.seller}`}>
                                      {num.seller}
                                    </Link>
                                  </button>
                                </div>
                              ) : (
                                null
                              )}
                            </div>
                          </div>
                        ) : (null)}
                      </div>
                    ))}
                  </div>
                </TabPanel>
              </Tabs>
            }
            {selectedMode &&
              <div className="bg-base-300 p-2">
                <div className="flex justify-between">
                  <button onClick={toggleBurnAllModal} className="font-trash uppercase btn bg-red-500 w-full text-xl">
                    Burn The Whole Wallet At Once
                  </button>
                </div>
                <ul className="overflow-auto h-[70vh] scrollbar border-2 rounded mt-1 mb-1 p-1 border-gray-800">
                  {NFTstoBurnNames.map((num: any, index: any) => (
                    <li key={index} className="bg-gray-700 rounded-lg font-trash uppercase p-2 mb-1 flex justify-between items-center break">
                      <img src={NFTstoBurnImages[index]} className="h-16" alt="tmp" />
                      <h1 className="text-center">{num}</h1>
                      <button onClick={(e) => delNFTtoBurnByName(num)} className="btn bg-red-900 btn-sm">
                        x
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between">
                  <div>
                    <h1 className="font-trash uppercase">SELECTED: {NFTstoBurn.length}</h1>
                    <h1 className="font-trash uppercase">SOL: {(NFTstoBurn.length) * 0.01}</h1>
                  </div>
                  <BurnButton toBurn={NFTstoBurn} connection={connection} publicKey={publicKey} wallet={owner} setRefresh={setRefresh} />
                </div>
              </div>}
          </div>
        </div>

        {/*<CommercialAlert isDismissed={false} />
        <div className="hero my-auto lg:hidden block">
          <div className="text-center hero-content items-center">
            <div className="border-2 rounded-lg border-gray-700 bg-gray-700">
              <button className="btn btn-primary mb-3 font-trash uppercase w-full">
                <Link href={`/showme?wallet=${randomWallet}`}>Load random wallet</Link>
              </button>
              <input
                type="text"
                placeholder="WALLET / USER / DOMAIN / NFT"
                className="font-trash uppercase w-96 h-10 p-1 text-sm bg-base-200 text-center"
                value={value}
                onChange={onChange}
              />
              {message == true ? (
                <button className="btn btn-primary mb-3 font-trash uppercase w-full">
                  <Link href={`/showme?wallet=${value}`}>Load Wallet</Link>
                </button>
              ) : (
                <button className="bg-gray-700 mt-3 font-trash uppercase">not a valid wallet</button>
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
            <h1 className="font-trash uppercase">BURN WHOLE WALLET</h1>
            <button className="font-trash uppercase text-white btn btn-xs btn-primary text-right" onClick={toggleBurnAllModal}>X</button>
          </div>
          <div className="text-center">
            <h1 className="font-trash uppercase text-2xl">You are about to burn {AllNFTstoBurn.length} NFTs</h1>
            <h1 className="font-trash uppercase text-2xl">for approx. {(AllNFTstoBurn.length) * 0.01} SOL</h1>
            <img src="/static/images/burnAll.png" className="h-96 mb-3 mt-3" alt="tmp" />
            <BurnAllButton toBurn={AllNFTstoBurn} connection={connection} publicKey={publicKey} wallet={owner} setRefresh={setRefresh} />
          </div>
        </Modal>

        <Modal
          isOpen={isOpen}
          onRequestClose={toggleModal}
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
          contentLabel="BADGE WINDOW"
        >
          <div className='font-trash uppercase text-white flex justify-between mb-2'>
            <div>Create an official BADGE for your account</div>
            <button className="btn btn-xs btn-primary text-right" onClick={toggleModal}>X</button>
          </div>
          <BadgeCreator />
        </Modal>

      </div>
    </div>
  );
};

export default Wallet