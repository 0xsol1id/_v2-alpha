import { Dispatch, FC, ReactNode, SetStateAction, useEffect, useState } from "react";

import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { resolveToWalletAddrress, isValidSolanaAddress } from "@nfteyez/sol-rayz";
import { useWalletNfts, NftTokenAccount } from "@nfteyez/sol-rayz-react";
import { isValidPublicKeyAddress } from "@metaplex-foundation/js-next";
import { Metaplex, bundlrStorage, walletAdapterIdentity, MetaplexFileTag, toMetaplexFileFromBrowser, MetaplexFile } from "@metaplex-foundation/js";

import { ASSOCIATED_TOKEN_PROGRAM_ID, Token, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { PublicKey, LAMPORTS_PER_SOL, Transaction, TransactionInstruction, SystemProgram } from "@solana/web3.js";
import { getDomainKey, getHashedName, getNameAccountKey, getTwitterRegistry, NameRegistryState, transferNameOwnership, getAllDomains, performReverseLookup, getFavoriteDomain } from "@bonfida/spl-name-service";

import { BurnButton } from "utils/BurnButton";
import { BurnAllButton } from "utils/BurnAllButton";
import { NftCard } from "./NftCard";
import { useWalletTokens } from "../../utils/useWalletTokens"
import { CloseButton } from "utils/CloseButton";
import { RevokeButton } from "utils/RevokeButton";
import { useWalletDelegated } from "utils/useWalletDelegated";

import { CreateTokenButton } from '../../utils/CreateTokenButton';
import html2canvas from 'html2canvas';
import downloadjs from 'downloadjs';
import Modal from 'react-modal';
import Papa from "papaparse";

import { Loader, SelectAndConnectWalletButton, MagicEdenLogo, ConnectWallet } from "components";
import { Footer } from 'views/footer';
import { fetcher } from 'utils/fetcher';
import { MainMenu } from "../mainmenu"
import { SocialsAndInfo } from "../SocialsAndInfos"
import { randomWallets } from "../wallets"
import React from "react";

import { LoadRarityFile } from 'utils/LoadRarityFiles'
import { TokenName } from "utils/TokenName";
const junks: any = LoadRarityFile(0)
const smb: any = LoadRarityFile(1)
const faces: any = LoadRarityFile(2)
const rektiez: any = LoadRarityFile(3)
const harrddyjunks: any = LoadRarityFile(4)

Modal.setAppElement("#__next");

var walletPublicKey = randomWallets[randomInt(0, randomWallets.length)].Wallet //start with a random wallet from the list

//const NFTstoBurn: string[] = []
const NFTstoSend: string[] = []

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

export const GalleryView: FC = ({ }) => {
  var postsPerPage = 20;
  const [postNumber, setPostNumber] = useState(35);
  const handleScroll = (e: any) => {
    var isAtBottom = e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight
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

  const [randomState, setRandomState] = useState(true)
  const timer = () => {
    setTimeout(() => {
      setRandomState(true);
    }, 10000);
  }

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

  const [isConnectedWallet, setIsConnectedWallet] = useState(false)
  const { connection } = useConnection()
  const queryParameters = new URLSearchParams(window.location.search)
  const walletParam: any = queryParameters.get("wallet")
  const collectionParam: any = queryParameters.get("collection")

  const [openTab, setOpenTab] = useState(1)
  const [walletToParsePublicKey, setWalletToParsePublicKey] =
    useState<string>(walletParam == "" ? walletPublicKey : walletParam)

  const { publicKey } = useWallet()
  const wallet = useWallet()

  const [message, setMessage] = useState(false)
  var valid = false

  const [refresh, setRefresh] = useState(false)

  const { nfts, isLoading, error } = useWalletNfts({
    publicAddress: walletToParsePublicKey,
    connection,
  })

  const { tokens } = useWalletTokens({
    publicAddress: walletToParsePublicKey,
    connection,
    type: 'empty'
  });

  /*const { splTokens } = useWalletTokens({
    publicAddress: walletToParsePublicKey,
    connection,
    type: 'spl'
  });*/

  const { delegatedTokens } = useWalletDelegated({
    publicAddress: walletToParsePublicKey,
    connection,
  });

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

  let errorMessage
  if (error) {
    errorMessage = error.message
  }


  const getQuery = () => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search);
    }
    return new URLSearchParams();
  };

  const getQueryStringVal = (key: string): string | null => {
    return getQuery().get(key);
  };

  const useQueryParam = (
    key: string,
    defaultVal: string
  ): [string, (val: string) => void] => {
    const [query, setQuery] = useState(getQueryStringVal(key) || defaultVal);

    const updateUrl = (newVal: string) => {
      setQuery(newVal);

      const query = getQuery();

      if (newVal.trim() !== '') {
        query.set(key, newVal);
      } else {
        query.delete(key);
      }

      // This check is necessary if using the hook with Gatsby
      if (typeof window !== 'undefined') {
        const { protocol, pathname, host } = window.location;
        const newUrl = `${protocol}//${host}${pathname}?${query.toString()}`;
        window.history.pushState({}, '', newUrl);
      }
    };

    return [query, updateUrl];
  };

  const [search, setSearch] = useQueryParam('wallet', '');
  const [search2, setSearch2] = useQueryParam('collection', '');

  const [columnsSize, setcolumnsSize] = useState(7);

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
    const [nftList, setNftList] = useState(nfts.slice(0, postNumber))

    return (
      <div className="rounded" id="collage">
        <div className={`${columnsSize == 12 ? "lg:grid-cols-12" :
          columnsSize == 11 ? "lg:grid-cols-11" :
            columnsSize == 10 ? "lg:grid-cols-10" :
              columnsSize == 9 ? "lg:grid-cols-9" :
                columnsSize == 8 ? "lg:grid-cols-8" :
                  columnsSize == 7 ? "lg:grid-cols-7" :
                    columnsSize == 6 ? "lg:grid-cols-6" :
                      columnsSize == 5 ? "lg:grid-cols-5" :
                        columnsSize == 4 ? "lg:grid-cols-4" :
                          columnsSize == 3 ? "lg:grid-cols-3" : "grid-cols-2"} grid-cols-2 grid gap-1 p-2`}>
          {selectedCollection == "Show all collections" ? (
            (nftList?.map((nft: any, index: any) => (
              (nft.data.sellerFeeBasisPoints == 0 && nft.primarySaleHappened == 0) ? (
                null //DON´T VIEW SPL TOKENS
              ) : (
                <NftCard isConnectedWallet={isConnectedWallet} key={index} details={nft} onSelect={() => { }} toBurn={NFTstoBurn} toBurnChange={addNFTtoBurn} toBurnDelete={delNFTtoBurn} toSend={NFTstoSend} selectedMode={selectedMode} setRefresh={setRefresh} />
              )
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
      </div>
    );
  };

  type MobileListProps = {
    nfts: NftTokenAccount[];
    error?: Error;
    setRefresh: Dispatch<SetStateAction<boolean>>
  };

  const MobileList = ({ nfts, error, setRefresh }: MobileListProps) => {
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

    return (
      <div className="rounded" id="collage">
        <div className={`${columnsSize == 12 ? "lg:grid-cols-12" :
          columnsSize == 11 ? "lg:grid-cols-11" :
            columnsSize == 10 ? "lg:grid-cols-10" :
              columnsSize == 9 ? "lg:grid-cols-9" :
                columnsSize == 8 ? "lg:grid-cols-8" :
                  columnsSize == 7 ? "lg:grid-cols-7" :
                    columnsSize == 6 ? "lg:grid-cols-6" :
                      columnsSize == 5 ? "lg:grid-cols-5" :
                        columnsSize == 4 ? "lg:grid-cols-4" :
                          columnsSize == 3 ? "lg:grid-cols-3" : "grid-cols-2"} grid-cols-2 grid gap-1 p-2`}>
          {nfts?.map((nft: any, index: React.Key | null | undefined) => (
            selectedCollection == "Show all collections" || nft.updateAuthority == selectedCollection ? (
              (nft.data.sellerFeeBasisPoints == 0 && nft.primarySaleHappened == 0) ? (
                null
              ) : (
                <NftCard isConnectedWallet={isConnectedWallet} key={index} details={nft} onSelect={() => { }} toBurn={NFTstoBurn} toBurnChange={addNFTtoBurn} toBurnDelete={delNFTtoBurn} toSend={NFTstoSend} selectedMode={selectedMode} setRefresh={setRefresh} />
              )
            ) : (null)
          ))}
        </div>
      </div>
    );
  };

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

  const getInitialState = () => {
    const value = "Show all collections";
    return value;
  };

  const [selectedCollection, setSelectedCollection] = useState<string>(getInitialState);

  const handleCollectionChange = (e: any) => {
    setSelectedCollection(e.target.value)
  };

  const CollectionObject = (m: any) => {
    const [collectionName, setcollectionName] = useState("-")
    const handleChangeCollectionName = (val: string) => {
      setcollectionName(val)
    }
    async function GetCollectionName(url: string) {
      try {
        const response = await fetch(url)
        const jsonData = await response.json()
        handleChangeCollectionName(jsonData?.collection)
      } catch (e) {
        console.log(e)
      }
    }
    useEffect(() => {
      GetCollectionName(`https://fudility.xyz:3420/collectionname/${m.mint}`)
    }, [])

    return (
      <option>{collectionName}</option>
    )
  }

  const [rarityData, setRarityData] = useState<any>()
  const [value, setValue] = useState(walletToParsePublicKey);

  const onChange = async () => {
    setPostNumber(35)
    setOpenTab(1)
    const val = value
    if (val.includes(".sol")) {
      const { pubkey } = await getDomainKey(val.trim());
      const { registry, nftOwner } = await NameRegistryState.retrieve(
        connection,
        pubkey
      );
      const address = registry.owner.toString()
      if (value == registry.owner.toString())
        setIsConnectedWallet(true)
      else
        setIsConnectedWallet(false)

      setWalletToParsePublicKey(address)
      walletPublicKey = address
    }
    else {
      const address = await resolveToWalletAddrress({ text: val.trim() })
      if (value == publicKey?.toBase58())
        setIsConnectedWallet(true)
      else
        setIsConnectedWallet(false)
      setWalletToParsePublicKey(address)
      walletPublicKey = address
    }
  };

  const onChangeME = async (address: any) => {
    setPostNumber(35)
    setOpenTab(1)
    if (value == publicKey?.toBase58())
      setIsConnectedWallet(true)
    else
      setIsConnectedWallet(false)
    setWalletToParsePublicKey(address)
    walletPublicKey = address
    setValue(address)
  };

  const randomWallet = () => {
    setPostNumber(35)
    setRandomState(false)
    timer()
    setOpenTab(1)
    var wallet = randomWallets[randomInt(0, randomWallets.length)]
    if (value == publicKey?.toBase58())
      setIsConnectedWallet(true)
    else
      setIsConnectedWallet(false)
    setWalletToParsePublicKey(wallet.Wallet)
    walletPublicKey = wallet.Wallet
    setValue(wallet.Wallet)
  };

  const onUseWalletClick = () => {
    setPostNumber(35)
    if (publicKey) {
      setOpenTab(1)
      setIsConnectedWallet(true)
      setWalletToParsePublicKey(publicKey?.toBase58())
      walletPublicKey = publicKey?.toBase58()
      setValue(publicKey?.toBase58())
    }
  };

  {/*const getTransactions = async (address: PublicKeyInitData, numTx: any) => {
    const pubKey = new PublicKey(address);
    let transactionList = await connection.getSignaturesForAddress(pubKey, { limit: numTx });

    let signatureList = transactionList.map((transaction: { signature: any }) => transaction.signature);
    let transactionDetails = await connection.getParsedTransactions(signatureList, { maxSupportedTransactionVersion: 0 });
    transactionList.forEach((transaction: any, i: number) => {
      console.log(transaction)
      const date = new Date(transaction.blockTime * 1000);
      const transactionInstructions = transactionDetails[i]?.transaction.message.instructions;
      console.log(`Transaction No: ${i + 1}`);
      console.log(`Signature: ${transaction.signature}`);
      console.log(`Fee: ${(transactionDetails[i]?.meta?.fee)}`);
      console.log(`Time: ${date}`);
      console.log(`Status: ${transaction.confirmationStatus}`);
      transactionInstructions?.forEach((instruction, n) => {
        console.log(`---Instructions ${n + 1}: ${instruction.programId.toString()}`);
      })
      console.log(("-").repeat(20));
    })
  }*/}

  const [isOpen, setIsOpen] = useState(false);
  function toggleModal() {
    setIsOpen(!isOpen);
  }

  const [isBattleOpen, setIsBattleOpen] = useState(false);
  function toggleBattleModal() {
    setIsBattleOpen(!isBattleOpen);
  }

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  function toggleUploadModal() {
    setIsUploadOpen(!isUploadOpen);
  }

  const [isBurnAllOpen, setIsBurnAllOpen] = useState(false);
  function toggleBurnAllModal() {
    setIsBurnAllOpen(!isBurnAllOpen);
  }

  //Message related
  const bg1 = './message_bg1.png';
  const bg2 = './message_bg2.png';
  const bg3 = './message_bg3.png';
  const bgs = { bg1, bg2, bg3 }
  const [selectedBG, setSelectedBG] = useState(bgs.bg1)

  const [username, setUsername] = useState('')
  // const [NFTImage, setNFTImage] = useState('');
  const [isGenerated, setIsGenerated] = useState(false);
  const [sending, setSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const metaplex = Metaplex.make(connection)
    .use(walletAdapterIdentity(wallet))
    .use(bundlrStorage());

  //Generate the design of the NFT message
  const generateImg = async () => {
    const canvas = await html2canvas(document.getElementById('canvas')!, {
      scale: 2
    });
    const img = canvas.toDataURL('image/png');
    return img;
  };

  const HandleUsernameChange = async (e: any) => {
    setUsername(e.target.value);
    setIsGenerated(false);
    setErrorMsg('');
    setIsSent(false);
  };

  const CreateAndSendNFT = async () => {
    try {
      setSending(true)
      const image = await generateImg();
      const _name = "SolJunksNFT BashMail"
      const description = `Send to you via SOLJUNKS.IO's WalletStalker by ${walletToParsePublicKey}`;
      const { uri } = await metaplex.nfts().uploadMetadata({
        name: _name,
        description: description,
        image: image,
        external_url: "https://soljunks.io/"
      });
      if (uri) {
        const { nft } = await metaplex.nfts().create({
          name: _name,
          uri: uri,
          sellerFeeBasisPoints: 0,
          tokenOwner: new PublicKey(walletToParsePublicKey),
        });

        if (nft) {
          setSending(false);
          setIsSent(true);
          setIsGenerated(false);
        };
      };
    }

    catch (errorMsg) {
      setSending(false);
      const err = (errorMsg as any)?.message;
      if (err.includes('could not find mint')) {
        setErrorMsg('The mint address seems to be wrong, verify it');
      }
      else if (err.includes('Invalid name account provided')) {
        setErrorMsg('This solana domain name does not exist')
      }
    }
  };

  const [fileUploadIsSelected, setFileUploadIsSelected] = useState(false)
  const [fileUpload, setUploadFile] = useState<Readonly<{
    buffer: Buffer;
    fileName: string;
    displayName: string;
    uniqueName: string;
    contentType: string | null;
    extension: string | null;
    tags: MetaplexFileTag[];
  }>>()
  const [fileUploadName, setUploadFileName] = useState('');
  const [uri, setUri] = useState('');
  const [uploadingArweave, setArweaveUploading] = useState(false);
  const [uploadCost, setUploadCost] = useState<number>();
  const [errorUpload, setErrorUpload] = useState('');

  const metaplexUpload = Metaplex.make(connection)
    .use(walletAdapterIdentity(wallet))
    .use(bundlrStorage());

  let _fileUpload: MetaplexFile;

  const handleUploadFileChange = async (event: any) => {
    setFileUploadIsSelected(true);
    setUri('');
    setErrorUpload('');
    setArweaveUploading(false);
    const browserFile = event.target.files[0];
    _fileUpload = await toMetaplexFileFromBrowser(browserFile);
    setUploadFile(_fileUpload);
    setUploadFileName(_fileUpload.displayName);
    const getUploadCost = await (await metaplexUpload.storage().getUploadPriceForFile(_fileUpload)).basisPoints.toString(10)
    const cost = parseInt(getUploadCost, 10)
    setUploadCost(cost / LAMPORTS_PER_SOL)
  }

  const UploadFile = async () => {
    try {
      setErrorUpload('');
      setArweaveUploading(true);
      if (fileUpload) {
        const uri = await metaplexUpload.storage().upload(fileUpload);
        console.log(uri);
        if (uri) {
          setUri(uri);
          setFileUploadIsSelected(false);
          setArweaveUploading(false);
        }
      }
    }
    catch (error) {
      const err = (error as any)?.message;
      setErrorUpload(err);
      setArweaveUploading(false);
    }
  }

  const copyWalletAddress = async () => {
    await navigator.clipboard.writeText(value);
  }

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
        const user = new PublicKey(walletToParsePublicKey)
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
        fetch("https://compatible-smart-general.solana-mainnet.discover.quiknode.pro/9b4affb03539b7a422f5c636723e162c7a1b3afe/", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(
            { "jsonrpc": "2.0", "id": 1, "method": "getBalance", "params": [value] }
          )
        }).then(res => res.json())
          .then(json => {
            handleChangeBalance((json.result?.value / LAMPORTS_PER_SOL).toFixed(3))
          });
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
    GetHistory(`https://fudility.xyz:3420/history/${walletToParsePublicKey}`)
    //getTransactions(walletPublicKey, 5)

    //CHANGE URL
    setSearch(walletToParsePublicKey)
    setSearch2("")
  }, [walletToParsePublicKey])

  useEffect(() => {
    if (value == publicKey?.toBase58())
      setIsConnectedWallet(true)
    else
      setIsConnectedWallet(false)
  }, [publicKey])

  useEffect(() => {
    setHistoryList(history.slice(0, historyNumber))
  }, [historyNumber])

  const saveCollage = async () => {
    const canvas = await html2canvas(document.getElementById('collage')!);
    const img = canvas.toDataURL('image/png');

    downloadjs(img, 'download.png', 'image/png');
  };

  return (
    <div className="flex flex-wrap flex-col md:flex-row items-center h-screen w-full">
      <div className="">
        <div className="hidden lg:block navbar sticky top-0 z-0 justify-between text-neutral-content bg-gray-900 w-screen">
          <div className="flex justify-between"><div>
            <MainMenu />
          </div> {/*desktop view*/}
            <div className="flex border-2 rounded-lg border-gray-700 bg-gray-700">
              {randomState &&
                <button onClick={randomWallet} className="bg-primary hover:bg-gray-800 rounded-l-md tooltip tooltip-left h-10 w-12 font-pixel" data-tip="Show a random wallet">🤷‍♂️</button>
              }
              {!randomState &&
                <div className="bg-gray-800 rounded-l-md h-10 w-12 font-pixel countdown grid items-center text-center">🚫</div>
              }
              <input
                type="text"
                placeholder="Enter Wallet Address"
                className="font-pixel w-96 h-10 p-1 text-sm bg-base-200 text-center"
                value={value}
                onChange={(e) => { setValue(e.target.value) }}
              />
              <div className="tooltip tooltip-left font-pixel" data-tip="Load wallet">
                <button onClick={onChange} className="bg-primary hover:bg-gray-800 rounded-r-md h-10 w-12">
                  👁️
                </button>
              </div>
              {/*<div className="tooltip tooltip-left" data-tip="Refresh Wallet">
              <button onClick={refreshWallet} className="btn btn-primary text-lg">
                🗘
              </button>
            </div>*/}
              <button onClick={copyWalletAddress} className="ml-2 bg-primary hover:bg-gray-800 rounded h-10 w-12 tooltip tooltip-left" data-tip="Copy wallet">
                💾
              </button>
            </div>

            <div className="flex gap-2 items-center bg-gray-700 rounded-xl p-2">
              <input
                type="range"
                max="12"
                min="2"
                value={columnsSize}
                className="range w-32 range-primary tooltip tooltip-left font-pixel" data-tip="Change Grid size"
                onChange={(e) => { setcolumnsSize(parseInt(e.target.value)); setPostNumber(postNumber + postsPerPage) }}
              />
              <p className="font-pixel text-xs">{columnsSize}</p>
            </div>

            <select onChange={handleCollectionChange} className="select w-80 select-primary font-pixel">
              <option>Show all collections</option>
              {collections?.map((num: any, index: any) => (
                <option>{num}</option>
              ))
              }
            </select>

            {publicKey ? (
              <div className="flex items-center">
                <div className="font-pixel tooltip tooltip-left" data-tip="Show Your wallet">
                  <SelectAndConnectWalletButton
                    onUseWalletClick={onUseWalletClick}
                  />
                </div>
                <ConnectWallet />
              </div>
            ) : (
              <ConnectWallet />
            )}
          </div>

        </div>
        <div className="">
          <div className="tab-content" id="tabs-tabContent">
            {error && errorMessage != "Invalid address: " ? (
              <div className="grid grid-flow-row auto-rows-max content-center h-[54rem] w-screen">
                <h1>Error Occures</h1>
                {(error as any)?.message}
              </div>
            ) : null}
            {!error && isLoading &&
              <div className="grid grid-flow-row auto-rows-max content-center h-[54rem] w-screen">
                <Loader />
              </div>
            }

            {!error && !isLoading && !refresh &&
              <div className="lg:flex min-w-screen">
                <ul className="space-y-2 bg-gray-900 p-1 lg:hidden block sticky top-0 z-50">
                  <div className="flex justify-between">
                    <div className="flex">
                      <div className="font-pixel">
                        <button onClick={randomWallet} className="btn btn-primary btn-sm">
                          🤷‍♂️
                        </button>
                      </div>
                      <div className="">
                        <button onClick={onChange} className="btn btn-primary btn-sm ml-1">
                          👁️
                        </button>
                      </div>
                      <div className="">
                        <button onClick={copyWalletAddress} className="btn btn-primary btn-sm ml-1 mr-2">
                          💾
                        </button>
                      </div>
                    </div>
                    <div>
                      {publicKey &&
                        <div className="flex">
                          <button onClick={toggleModal} className="btn btn-primary btn-sm mr-1">
                            ✉️
                          </button>
                          <SelectAndConnectWalletButton
                            onUseWalletClick={onUseWalletClick}
                          />
                        </div>
                      }
                    </div>
                    <ConnectWallet />
                  </div>

                  <input
                    type="text"
                    placeholder="Enter Wallet Address"
                    className="font-pixel input input-bordered h-6 w-full bg-base-200"
                    value={value}
                    onChange={(e) => { setValue(e.target.value) }}
                  />
                  <li className="">
                    <div className="">
                      {/*<DomainName />*/}
                      <div className="flex justify-between">
                        <div className="flex justify-between text-sm ml-2">
                          <p className="font-pixel mr-2">SOL:&nbsp;</p><p className="font-pixel">{balance}◎</p>
                        </div>
                        {/*<div className="flex justify-between text-sm ml-2"><p className="font-pixel">Total SPLs:&nbsp;</p><p className="font-pixel">{tokens.length}</p></div>*/}
                        <div className="flex justify-between text-sm ml-2"><p className="font-pixel">NFTs:&nbsp;</p><p className="font-pixel">{nfts.length}</p></div>
                        <div className="flex justify-between text-sm ml-2 uppercase"><p className="font-pixel">Score:&nbsp;</p><p className="font-pixel">{score.toFixed(0)}</p></div>
                      </div>
                    </div>
                  </li>
                </ul>
                <ul className="space-y-2 bg-gray-900 h-[54rem] p-2 hidden lg:block">
                  <li className="">
                    <div className='flex'>
                      <div className="dropdown dropdown-right tooltip tooltip-right font-pixel" data-tip="Wallet Info">
                        <div tabIndex={0} className="btn btn-primary font-pixel w-16">INFO</div>
                        <ul tabIndex={0} className="menu dropdown-content bg-base-300 rounded border border-gray-500 w-[20rem]">
                          <div className="flex justify-between text-sm mx-2 text-center"><p className="font-pixel">Domain:&nbsp;</p><p className="font-pixel">{domain}</p></div>
                          <div className="flex justify-between text-sm mx-2">
                            <p className="font-pixel mr-2">SOL:&nbsp;</p><p className="font-pixel">{balance}◎</p>
                          </div>
                          {/*<div className="flex justify-between text-sm ml-2"><p className="font-pixel">Total SPLs:&nbsp;</p><p className="font-pixel">{tokens.length}</p></div>*/}
                          <br />
                          <div className="flex justify-between text-sm mx-2"><p className="font-pixel">Total NFTs:&nbsp;</p><p className="font-pixel">{nfts.length}</p></div>
                          <div className="flex justify-between text-sm mx-2"><p className="font-pixel">Collections:&nbsp;</p><p className="font-pixel">{collections.length}</p></div>
                          <div className="flex justify-between text-sm mx-2"><p className="font-pixel">NFT Value:&nbsp;</p><p className="font-pixel">tba</p></div>
                          <br />
                          <div className="flex justify-between text-sm mx-2"><p className="font-pixel">SolJunks GEN1:&nbsp;</p><p className="font-pixel">{gen1Count}/{gen1Score.toFixed(0)}</p></div>
                          <div className="flex justify-between text-sm mx-2"><p className="font-pixel">SolJunks GEN2:&nbsp;</p><p className="font-pixel">{gen2Count}/{gen2Score.toFixed(0)}</p></div>
                          <div className="flex justify-between text-sm mx-2"><p className="font-pixel">$olana Money Bu$ine$$:&nbsp;</p><p className="font-pixel">{smbCount}/{smbScore.toFixed(0)}</p></div>
                          <div className="flex justify-between text-sm mx-2"><p className="font-pixel">Faces of $MB:&nbsp;</p><p className="font-pixel">{facesCount}/{facesScore.toFixed(0)}</p></div>
                          <div className="flex justify-between text-sm mx-2"><p className="font-pixel">Lil Rektiez:&nbsp;</p><p className="font-pixel">{rektiezCount}/{rektiezScore.toFixed(0)}</p></div>
                          <div className="flex justify-between text-sm mx-2"><p className="font-pixel">HarrddyJunks:&nbsp;</p><p className="font-pixel">{harrddyJunksCount}/{harrddyJunksScore.toFixed(0)}</p></div>
                          <br />
                          <div className="flex justify-between text-sm mx-2 uppercase"><p className="font-pixel">Wallet Score:&nbsp;</p><p className="font-pixel">{score.toFixed(0)}</p></div>
                          <div className="flex justify-between text-sm mx-2 uppercase"><p className="font-pixel">$TRUK/Day:&nbsp;</p><p className="font-pixel">{trukClaim.toFixed(2)}</p></div>
                        </ul>
                      </div>
                    </div>
                  </li>
                  <li>
                    {isConnectedWallet &&
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
                    }
                  </li>
                  <li>
                    <button
                      onClick={() => setOpenTab(1)}
                      className="btn btn-primary rounded-lg tooltip tooltip-right font-pixel w-16" data-tip="View NFTs"
                    >NFT</button>
                  </li>
                  <li>
                    <button
                      onClick={() => setOpenTab(2)}
                      className="btn btn-primary rounded-lg tooltip tooltip-right font-pixel w-16" data-tip="View ME History"
                    ><MagicEdenLogo /></button>
                  </li>
                  <div className="w-full">
                    {isConnectedWallet ? (
                      <div>
                        {tokens.length > 0 ? (
                          <div className="mt-2 mb-2">
                            <CloseButton toClose={tokens} connection={connection} publicKey={publicKey} wallet={wallet} setRefresh={setRefresh} />
                          </div>
                        ) : (
                          <div className="mt-2 mb-2">
                            <div className="btn btn-primary tooltip tooltip-right rounded-lg" data-tip="No empty account to close">0</div>
                          </div>
                        )
                        }
                        {delegatedTokens.length > 0 ? (
                          <div>
                            <RevokeButton toRevoke={delegatedTokens} connection={connection} publicKey={publicKey} wallet={wallet} setRefresh={setRefresh} />
                          </div>
                        ) : (
                          <div className="mt-2 mb-2">
                            <div className="btn btn-primary tooltip tooltip-right rounded-lg" data-tip="No delegated Auhtoritys to revoke">0</div>
                          </div>
                        )
                        }
                      </div>
                    ) : (
                      <div />
                    )}
                  </div>
                  {publicKey ? (
                    <div className='mt-8'>
                      <li>
                        <button onClick={toggleModal} className="font-pixel btn btn-primary rounded-lg mb-2 tooltip tooltip-right w-16 text-2xl" data-tip="Send message">
                          ✉️
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => setOpenTab(3)}
                          className="btn btn-primary rounded-lg tooltip tooltip-right font-pixel w-16 mb-2 text-2xl" data-tip="View NFTs"
                        >💰</button>
                      </li>
                      <li>
                        <button onClick={toggleUploadModal} className="btn btn-primary rounded-lg tooltip tooltip-right font-pixel w-16 mb-2 text-2xl" data-tip="Upload">
                          📤
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => setOpenTab(4)}
                          className="btn btn-primary rounded tooltip tooltip-right font-pixel w-16 mb-2 text-2xl" data-tip="Transfer"
                        >🔁</button>
                      </li>
                      <SocialsAndInfo />
                    </div>
                  ) : (
                    <div>
                    </div>
                  )}
                </ul>
                {!selectedMode ? (
                  <div className="w-full">
                    <div className={openTab === 1 ? "block" : "hidden"}>
                      <div className="overflow-auto lg:h-[54rem] scrollbar hidden lg:block" onScroll={handleScroll}>
                        <NftList nfts={nfts} error={error} setRefresh={setRefresh} />
                      </div>
                      <div className="overflow-auto lg:h-[54rem] scrollbar lg:hidden block" onScroll={handleScroll}>
                        <MobileList nfts={nfts} error={error} setRefresh={setRefresh} />
                      </div>
                    </div>
                    <div className={openTab === 2 ? "block" : "hidden"}>
                      <div className="overflow-auto lg:h-[54rem] scrollbar hidden lg:block p-1" onScroll={handleHistoryScroll}>
                        {historyList?.map((num: any, index: any) => (
                          <div key={index}>
                            {num.type != "bid" ? (
                              <div className="grid grid-cols-4 bg-gray-900 text-sm justify-between h-18 text-center rounded-lg mb-1 border-2 border-gray-800">
                                <div className='my-auto p-1'>
                                  <button className="flex bg-gray-900 justify-between hover:bg-gray-700 rounded-lg ml-1 font-pixel tooltip tooltip-right w-48" data-tip="Show on ME">
                                    <a href={`https://magiceden.io/item-details/${num.tokenMint}`} target="_blank">
                                      <TokenName mint={num.tokenMint} />
                                    </a>
                                  </button>
                                </div>
                                {num.type == "buyNow" && num.buyer == walletToParsePublicKey ? (
                                  <p className="font-pixel text-center rounded bg-green-600 w-48 my-auto p-2">BOUGHT for {num.price.toFixed(2)}◎</p>
                                ) : (
                                  num.type == "list" ? (
                                    <p className="font-pixel text-center rounded bg-yellow-400 w-48 my-auto p-2">LISTED for {num.price.toFixed(2)}◎</p>
                                  ) : (
                                    num.type == "delist" ? (
                                      <p className="font-pixel text-center rounded bg-gray-500 w-48 my-auto p-2">DELISTED for {num.price.toFixed(2)}◎</p>
                                    ) : (
                                      num.type == "buyNow" && num.seller == walletToParsePublicKey ? (
                                        <p className="font-pixel text-center rounded bg-red-600 w-48  my-auto p-2">SOLD for {num.price.toFixed(2)}◎</p>
                                      ) : (
                                        num.type == "cancelBid" ? (
                                          <p className="font-pixel text-center rounded bg-blue-600 w-48 my-auto p-2">CANCELED for {num.price.toFixed(2)}◎</p>
                                        ) : (
                                          <p className="rounded w-40h-8 my-auto">{num.type}</p>
                                        )
                                      )
                                    )
                                  )
                                )}
                                <div className='flex justify-between my-auto'>
                                  <p className="font-pixel text-xs my-auto ml-2">{convertTimestamp(num.blockTime)}</p>
                                </div>
                                <div className='flex justify-between'>
                                  {num.type == "buyNow" && num.seller == walletToParsePublicKey ? (
                                    <p className="font-pixel flex uppercase text-xs rounded my-auto"><p className='mr-2'>Bought by: </p>
                                      <button onClick={() => onChangeME(num.buyer)} className="btn bg-gray-700 btn-sm text-xs">
                                        {num.buyer}
                                      </button>
                                    </p>
                                  ) : (
                                    null
                                  )}
                                  {num.type == "buyNow" && num.buyer == walletToParsePublicKey ? (
                                    <p className="font-pixel flex uppercase text-xs rounded my-auto"><p className='mr-2'>Bought by: </p>
                                      <button onClick={() => onChangeME(num.seller)} className="btn bg-gray-700 btn-sm text-xs">
                                        {num.seller}
                                      </button>
                                    </p>
                                  ) : (
                                    null
                                  )}
                                </div>
                              </div>
                            ) : (null)}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className={openTab === 3 ? "block" : "hidden"}>
                      <CreatePonziView />
                    </div>
                    <div className={openTab === 4 ? "block" : "hidden"}>
                      <MultiSenderView />
                    </div>
                  </div >
                ) : (
                  <div className="col-span-8 w-full">
                    <div className="grid grid-cols-5">
                      <div className="col-span-4">
                        <div className={openTab === 1 ? "block" : "hidden"}>
                          <div className="overflow-auto lg:h-[54rem] scrollbar" onScroll={handleScroll} style={{ overflowY: 'scroll' }}>
                            <NftList nfts={nfts} error={error} setRefresh={setRefresh} />
                          </div>
                        </div>
                        <div className={openTab === 2 ? "block" : "hidden"}>
                          <div className="rounded h-[54rem] mr-2 overflow-auto min-w-full p-2 scrollbar">
                            {history?.map((num: any, index: any) => (
                              <div key={index}>
                                {num.type != "bid" ? (
                                  <div className="grid grid-cols-4 bg-gray-900 text-sm justify-between h-14 text-center rounded-lg mb-1 border-2 border-gray-800">
                                    <div className='my-auto p-1'>
                                      <button className="flex bg-gray-900 justify-between hover:bg-gray-700 rounded-lg ml-1 font-pixel tooltip tooltip-right w-48" data-tip="Show on ME">
                                        <a href={`https://magiceden.io/item-details/${num.tokenMint}`} target="_blank">
                                          {/*<TokenName mint={num.tokenMint} />*/}
                                        </a>
                                      </button>
                                    </div>
                                    {num.type == "buyNow" && num.buyer == walletToParsePublicKey ? (
                                      <p className="font-pixel text-center rounded bg-green-600 w-48 my-auto">BUY for {num.price.toFixed(2)}◎</p>
                                    ) : (
                                      num.type == "list" ? (
                                        <p className="font-pixel text-center rounded bg-yellow-400 w-48 my-auto">LIST for {num.price.toFixed(2)}◎</p>
                                      ) : (
                                        num.type == "delist" ? (
                                          <p className="font-pixel text-center rounded bg-gray-500 w-48 my-auto">DELIST for {num.price.toFixed(2)}◎</p>
                                        ) : (
                                          num.type == "buyNow" && num.seller == walletToParsePublicKey ? (
                                            <p className="font-pixel text-center rounded bg-red-600 w-48  my-auto">SELL for {num.price.toFixed(2)}◎</p>
                                          ) : (
                                            num.type == "cancelBid" ? (
                                              <p className="font-pixel text-center rounded bg-blue-600 w-48 my-auto">CANCEL for {num.price.toFixed(2)}◎</p>
                                            ) : (
                                              <p className="rounded w-40h-8 my-auto">{num.type}</p>
                                            )
                                          )
                                        )
                                      )
                                    )}
                                    <div className='flex justify-between my-auto'>
                                      <p className="font-pixel text-xs my-auto ml-2">{convertTimestamp(num.blockTime)}</p>
                                    </div>
                                    <div className='flex justify-between'>
                                      {num.type == "buyNow" && num.seller == walletToParsePublicKey ? (
                                        <p className="font-pixel flex uppercase text-xs rounded my-auto"><p className='mr-2'>Bought by: </p>
                                          <button onClick={() => onChangeME(num.buyer)} className="btn bg-gray-700 btn-sm text-xs">
                                            {num.buyer}
                                          </button>
                                        </p>
                                      ) : (
                                        null
                                      )}
                                      {num.type == "buyNow" && num.buyer == walletToParsePublicKey ? (
                                        <p className="font-pixel flex uppercase text-xs rounded my-auto"><p className='mr-2'>Bought by: </p>
                                          <button onClick={() => onChangeME(num.seller)} className="btn bg-gray-700 btn-sm text-xs">
                                            {num.seller}
                                          </button>
                                        </p>
                                      ) : (
                                        null
                                      )}
                                    </div>
                                  </div>
                                ) : (null)}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className={openTab === 3 ? "block" : "hidden"}>
                          <CreatePonziView />
                        </div>
                        <div className={openTab === 4 ? "block" : "hidden"}>
                          <MultiSenderView />
                        </div>
                      </div >
                      <div className="bg-gray-900 p-2">
                        <div className="flex justify-between">
                          <BurnButton toBurn={NFTstoBurn} connection={connection} publicKey={publicKey} wallet={wallet} setRefresh={setRefresh} />
                          <button onClick={toggleBurnAllModal} className="font-pixel btn btn-primary">
                            Burn ALL
                          </button>
                        </div>
                        <ul className="overflow-auto h-[47rem] scrollbar border-2 rounded mt-1 mb-1 p-1 border-gray-800">
                          {NFTstoBurnNames.map((num: any, index: any) => (
                            <li className="bg-gray-700 rounded-lg font-pixel p-2 mb-1 flex justify-between items-center break">
                              <img src={NFTstoBurnImages[index]} className="h-16" />
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
                      </div>
                    </div>
                  </div>
                )}
              </div>
            }
          </div>
        </div >

        <Modal
          isOpen={isOpen}
          onRequestClose={toggleModal}
          style={{
            overlay: {
              backgroundColor: 'rgba(0, 0, 0, 0.75)'
            },
            content: {
              top: '55%',
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
          contentLabel="BASHMAIL SENDER"
        >
          <button className="font-pixel text-white btn btn-xs btn-primary text-right" onClick={toggleModal}>X</button>
          <div className="text-center">
            <h1 className="font-pixel lg:text-2xl">Send a NFT Message</h1>
            <div>
              <form className="mt-[5%] mb-[3%]">
                <input className="font-pixel mb-[1%] text-black pl-1 border-1 border-black sm:w-[520px] w-[320px] text-center h-12"
                  type="text"
                  required
                  placeholder="Message"
                  maxLength={300}
                  onChange={HandleUsernameChange}
                />
                <div className='font-pixel'>{username.length}/300</div>
              </form>
              <div className="flex justify-center mt-4">
                <div className="sm:w-[350px] sm:h-[350px] w-[150px] h-[150px] container" id="canvas">
                  <div className="relative">
                    <img src={selectedBG} alt='' /><br />
                    <h2 className="font-pixel absolute text-sm text-gray-900 top-4 left-1/2 -translate-x-1/2 break-words w-64"><strong>{username}</strong></h2>
                  </div>
                </div>
              </div>

              <div className='mt-8'>
                <button className='font-pixel btn btn-sm btn-secondary mr-2' onClick={() => setSelectedBG(bgs.bg1)}>BG 1</button>
                <button className='font-pixel btn btn-sm btn-secondary mr-2' onClick={() => setSelectedBG(bgs.bg2)}>BG 2</button>
                <button className='font-pixel btn btn-sm btn-secondary' onClick={() => setSelectedBG(bgs.bg3)}>BG 3</button>
              </div>

              {sending == false &&
                <button className="font-pixel mt-4 btn btn-primary uppercase"
                  onClick={CreateAndSendNFT}>Send NFT Message
                </button>}

              {sending == true &&
                <button className="mt-4 btn btn-primary uppercase">
                  <svg role="status" className="inline mr-3 w-4 h-4 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                  </svg>Sending </button>}

              {errorMsg != '' && <div className="mt-[1%]">❌ Ohoh.. An error occurs: {errorMsg}</div>}


              {isSent &&
                <div className="font-pixel text-xl mt-[5%]">
                  ✅ Successfuly sent!
                </div>}

            </div>
          </div>
        </Modal>

        <Modal
          isOpen={isBattleOpen}
          onRequestClose={toggleBattleModal}
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

          <button className="font-pixel text-white btn btn-xs btn-primary text-right" onClick={toggleBattleModal}>X</button>
          <div className="text-center">
            <h1 className="font-pixel text-2xl">UNDER CONSTRUCTION</h1>

          </div>
        </Modal>

        <Modal
          isOpen={isUploadOpen}
          onRequestClose={toggleUploadModal}
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
          contentLabel="Upload WINDOW"
        >

          <button className="font-pixel text-white btn btn-xs btn-primary text-right" onClick={toggleUploadModal}>X</button>
          <div className="text-center">
            <h1 className="mb-5 text-5xl font-pixel">
              Upload File To Arweave
            </h1>
            <div>
              <form className="mt-[20%] mb-[3%]">
                <label htmlFor="fileUpload" className="btn btn-primary text-white font-spixel text-xl hover:cursor-pointer">
                  Select file
                  <input id="fileUpload" type="file" name="file" onChange={handleUploadFileChange} className="hidden" />
                </label>
              </form>
              {fileUploadName != '' && uri == '' && uploadCost &&
                <div className="text-white font-pixel text-xl mb-[3%]">
                  You will upload <strong>{fileUploadName}</strong> for {uploadCost} SOL
                </div>
              }
              {fileUploadIsSelected && uploadingArweave == false &&
                <button className="text-white font-pixel text-xl rounded-full shadow-xl bg-[#414e63] hover:bg-[#2C3B52] border w-[160px] h-[40px] mb-[3%] uppercase" onClick={UploadFile}>Upload
                </button>
              }
              {uploadingArweave == true &&
                <button className="text-white font-pixel text-xl rounded-full shadow-xl bg-[#2C3B52] border w-[160px] h-[40px] mb-[3%] uppercase" onClick={UploadFile}>
                  <svg role="status" className="inline mr-3 w-4 h-4 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                  </svg>Uploading </button>}

              {errorUpload != '' && <div>❌ Ohoh.. An error occurs: {errorUpload}</div>}

              {uri !== '' &&
                <div className="font-pixel text-xl mb-[2%]">
                  ✅ Successfuly uploaded! <br />Don't forget to copy the following link:
                </div>}
              <div className="font-pixel text-xl underline">
                <a target="_blank" rel="noreferrer" href={uri}> {uri}</a>
              </div>
            </div>

          </div>
        </Modal>

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
            <img src="./burnAll.png" className="h-96 mb-3 mt-3" />
            <BurnAllButton toBurn={AllNFTstoBurn} connection={connection} publicKey={publicKey} wallet={wallet} setRefresh={setRefresh} />
          </div>
        </Modal>
      </div >
      <Footer />
    </div >
  );
};

const CreatePonziView = ({ }) => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const { publicKey } = useWallet();

  const [quantity, setQuantity] = useState(0);
  const [decimals, setDecimals] = useState(9);
  const [tokenName, setTokenName] = useState('')
  const [symbol, setSymbol] = useState('')
  const [metadataURL, setMetadataURL] = useState('')
  const [isChecked, setIsChecked] = useState(false);
  const [metadataMethod, setMetadataMethod] = useState('upload')
  const [tokenDescription, setTokenDescription] = useState('')
  const [file, setFile] = useState<Readonly<{
    buffer: Buffer;
    fileName: string;
    displayName: string;
    uniqueName: string;
    contentType: string | null;
    extension: string | null;
    tags: MetaplexFileTag[];
  }>>()
  const [fileName, setFileName] = useState('')

  const handleFileChange = async (event: any) => {
    const browserFile = event.target.files[0];
    const _file = await toMetaplexFileFromBrowser(browserFile);
    setFile(_file);
    setFileName(_file.fileName)
  }

  return (
    <div className="md:w-[600px] mx-auto text-center">
      <div className="md:w-[480px] flex flex-col m-auto mb-12">
        <div className="my-2 uppercase underline flex font-pixel text-2xl text-center">Create your own scam token</div>
        <div className='flex justify-between'>
          <label className="flex font-pixel">Token Name</label>
          <input className="my-[1%] md:w-[200px] text-left input input-bordered font-pixel"
            type="text"
            placeholder="Token Name"
            onChange={(e) => setTokenName(e.target.value)}
          />
        </div>

        <div className='flex justify-between'>
          <label className="flex font-pixel">Symbol</label>
          <input className="my-[1%] md:w-[200px] text-left input input-bordered font-pixel"
            type="text"
            placeholder="Symbol"
            onChange={(e) => setSymbol(e.target.value)}
          />
        </div>

        <div className='flex justify-between'>
          <label className="flex font-pixel">Number of tokens to mint</label>
          <input className="my-[1%] md:w-[200px] text-left input input-bordered font-pixel"
            type="number"
            min="0"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
          />
        </div>

        <div className='flex justify-between'>
          <label className="flex font-pixel">Number of decimals</label>
          <input className="my-[1%] md:w-[200px] text-left input input-bordered font-pixel"
            type="number"
            min="0"
            value={decimals}
            onChange={(e) => setDecimals(parseInt(e.target.value))}
          />
        </div>

        <div className="mt-5 mb-2 uppercase underline flex font-pixel text-2xl"></div>
        <div className="flex justify-center mb-4">
          <label className="mx-2">Enable freeze authority</label>
          <input className="mx-2"
            type="checkbox"
            checked={isChecked}
            onChange={(e) => setIsChecked(!isChecked)}
          />
        </div>

        <div className="mt-5 mb-2 uppercase underline flex font-pixel text-2xl">Metadata</div>
        <div className="flex justify-center">
          {metadataMethod == 'url' ?
            <button className="btn btn-primary mr-4">Use an existing medatata URL</button>
            : <button className="btn btn-secondary mr-4" onClick={() => { setMetadataMethod('url'), setTokenDescription('') }}>Use an existing medatata URL</button>
          }
          {metadataMethod == 'upload' ?
            <button className="btn btn-primary">Create the metadata</button>
            : <button className="btn btn-secondary" onClick={() => { setMetadataMethod('upload'), setMetadataURL(''), setFile(undefined), setFileName('') }}>Create the metadata</button>}
        </div>

        {metadataMethod == 'url' &&
          <div>
            <div>
              <label className="mt-2 flex font-pixel">Metadata Url</label>
              <input className="my-[1%] md:w-[480px] text-left input input-bordered font-pixel"
                type="text"
                placeholder="Metadata Url"
                onChange={(e) => setMetadataURL(e.target.value)}
              />
            </div>

          </div>
        }

        {metadataMethod == 'upload' &&
          <div>
            <div className=''>
              <label className="mt-2 flex font-pixel">Description</label>
              <input className="my-[1%] md:w-[480px] text-left input input-bordered font-pixel"
                type="text"
                placeholder="Description of the token"
                onChange={(e) => setTokenDescription(e.target.value)}
              />
            </div>
            <div>
              <label className="mt-2 flex"></label>
              <label htmlFor="file" className="text-white font-pixel rounded-full shadow-xl bg-[#414e63] border px-2 py-1 h-[40px] uppercase hover:bg-[#2C3B52] hover:cursor-pointer">
                Upload image
                <input
                  id="file"
                  type="file"
                  name="file"
                  accept="image/*, video/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }} />
              </label>
              {fileName != '' && <div className="mt-2" >{fileName}</div>}
            </div>
          </div>
        }
      </div>
      <CreateTokenButton connection={connection} publicKey={publicKey} wallet={wallet} quantity={quantity} decimals={decimals} isChecked={isChecked} tokenName={tokenName} symbol={symbol} metadataURL={metadataURL} description={tokenDescription} file={file} metadataMethod={metadataMethod} />
    </div>
  );
};


//----------------------------------------------------------SENDER VIEW----------------------------------------------------------------------------------------------------------------------------------



const MultiSenderView = ({ }) => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [walletToParsePublicKey, setWalletToParsePublicKey] =
    useState<string>(walletPublicKey);
  const { publicKey } = useWallet();

  const onUseWalletClick = () => {
    if (publicKey) {
      setWalletToParsePublicKey(publicKey?.toBase58());
    }
  };

  const [nbToken, setNbToken] = useState('');
  const [CurrencyType, setCurrencyType] = useState('');
  const [mintAddress, setMintAddress] = useState('');
  const [ReceiverAddress, setReceiverAddress] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [isSOLChecked, setIsSOLChecked] = useState(false);
  const [Error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [signature, setSignature] = useState('')

  const [quantity, setQuantity] = useState<number>();
  const [quantity1, setQuantity1] = useState<number>();
  const [quantity2, setQuantity2] = useState<number>();
  const [quantity3, setQuantity3] = useState<number>();
  const [quantity4, setQuantity4] = useState<number>();
  const [quantity5, setQuantity5] = useState<number>();
  const [quantity6, setQuantity6] = useState<number>();
  const [quantity7, setQuantity7] = useState<number>();
  const [quantity8, setQuantity8] = useState<number>();
  const [quantity9, setQuantity9] = useState<number>();
  const [quantity10, setQuantity10] = useState<number>();

  const [receiver1, setReceiver1] = useState('');
  const [receiver2, setReceiver2] = useState('');
  const [receiver3, setReceiver3] = useState('');
  const [receiver4, setReceiver4] = useState('');
  const [receiver5, setReceiver5] = useState('');
  const [receiver6, setReceiver6] = useState('');
  const [receiver7, setReceiver7] = useState('');
  const [receiver8, setReceiver8] = useState('');
  const [receiver9, setReceiver9] = useState('');
  const [receiver10, setReceiver10] = useState('');

  const [token1, setToken1] = useState('');
  const [token2, setToken2] = useState('');
  const [token3, setToken3] = useState('');
  const [token4, setToken4] = useState('');
  const [token5, setToken5] = useState('');
  const [token6, setToken6] = useState('');
  const [token7, setToken7] = useState('');
  const [token8, setToken8] = useState('');
  const [token9, setToken9] = useState('');
  const [token10, setToken10] = useState('');

  const [csvFileName, setCsvFileName] = useState('')
  const [csvFileIsUploaded, setCsvFileIsUploaded] = useState(false)
  const [csvData, setCsvData] = useState<any[]>([]);
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [csvSendingSuccess, setCsvSendingSuccess] = useState(false)

  const [currentTx, setCurrentTx] = useState<number>(0);
  const [totalTx, setTotalTx] = useState<number>(0);


  // allow to reset the states
  const reset = () => {
    setIsChecked(false);
    setIsSOLChecked(false);
    setError('');
    setSignature('');
    setMintAddress('');
    setQuantity(undefined);
    setQuantity1(undefined);
    setQuantity2(undefined);
    setQuantity3(undefined);
    setQuantity4(undefined);
    setQuantity5(undefined);
    setQuantity6(undefined);
    setQuantity7(undefined);
    setQuantity8(undefined);
    setQuantity9(undefined);
    setQuantity10(undefined);
    setReceiver1('');
    setReceiver2('');
    setReceiver3('');
    setReceiver4('');
    setReceiver5('');
    setReceiver6('');
    setReceiver7('');
    setReceiver8('');
    setReceiver9('');
    setReceiver10('');
    setToken1('');
    setToken2('');
    setToken3('');
    setToken4('');
    setToken5('');
    setToken6('');
    setToken7('');
    setToken8('');
    setToken9('');
    setToken10('');
    setCsvFileName('');
    setCsvFileIsUploaded(false);
    setCurrentTx(0);
    setTotalTx(0);
    setCsvSendingSuccess(false);
  }


  // allow to check if the sender has enough tokens in his wallet
  // return true in this case
  const checkBalance = async (Receivers: string[], Amounts: (number | undefined)[], mintAddress: string) => {

    let Balance: number | null

    // SPL TOKEN CASE

    if (CurrencyType == 'SPL') {
      const mint = new PublicKey(mintAddress);

      // get the owner's token account of the token to send in order to get the token balance
      const ownerTokenAccount = await Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        mint,
        publicKey!,
      );

      // determine the balance of the token to send
      const getBalance = await connection.getTokenAccountBalance(ownerTokenAccount);
      Balance = getBalance.value.uiAmount;
    }

    // SOL CASE
    else {
      Balance = (await connection.getBalance(publicKey!)) / LAMPORTS_PER_SOL;
    };

    let sendAmount: number = 0;

    // determine the quantity of token that the user wants to send
    if (!isChecked) {
      // in the case where the user wants to send different amount
      for (let i = 0; i < Amounts.length; i++) {
        sendAmount += Amounts[i]!
      };
    }
    // in the case where the user wants to send the same amount to everybody
    else {
      sendAmount = quantity! * Receivers.length;
    }

    if (sendAmount <= Balance!) {
      return true
    };
  };

  const checkBalanceMulti = async (Tokens: string[], Amounts: (number | undefined)[]) => {

    if (isSOLChecked) {
      const SOLBalance = (await connection.getBalance(publicKey!)) / LAMPORTS_PER_SOL;

      if (SOLBalance < quantity!) {
        return false
      }

    }


    for (let i = 0; i < Tokens.length; i++) {
      const ownerTokenAccount = await Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        new PublicKey(Tokens[i]),
        publicKey!,
      );

      const getBalance = await connection.getTokenAccountBalance(ownerTokenAccount);
      const Balance = getBalance.value.uiAmount;
      if (Balance! < Amounts[i]!) {
        return false
      }
    }
    return true


  }

  const checkBalanceCsv = async (CsvData: any[], CsvHeaders: never[]) => {
    try {
      // list that includes all the different tokens that the user wants to send
      const TokenList: string[] = []
      // list that includes the corresponding amount to send
      const CorrespondingAmount: number[] = []

      for (let i = 0; i < CsvData.length; i++) {
        const tokenAddress = CsvHeaders[1]
        const amount = CsvHeaders[2]
        if (TokenList.includes(CsvData[i][tokenAddress])) {
          const indice = TokenList.indexOf(CsvData[i][tokenAddress])
          CorrespondingAmount[indice] += parseFloat(CsvData[i][amount])
        }
        else {
          TokenList.push(CsvData[i][tokenAddress])
          CorrespondingAmount.push(parseFloat(CsvData[i][amount]))
        }
      }
      console.log(TokenList)
      console.log(CorrespondingAmount)

      for (let i = 0; i < TokenList.length; i++) {
        const token = TokenList[i].toString()
        const amountToSend = CorrespondingAmount[i]
        if (token != 'So11111111111111111111111111111111111111112' && !token.includes('.sol')) {
          console.log(i + "/" + TokenList.length + ": " + token)
          const mint = new PublicKey(token)
          // get the owner's token account of the token to send in order to get balance
          const ownerTokenAccount = await Token.getAssociatedTokenAddress(
            ASSOCIATED_TOKEN_PROGRAM_ID,
            TOKEN_PROGRAM_ID,
            mint,
            publicKey!,
          );

          // determine the balance of the token to send
          const getBalance = await connection.getTokenAccountBalance(ownerTokenAccount);
          const Balance = getBalance.value.uiAmount;
          if (Balance! < amountToSend) {
            setError('You do not have enough ' + token)
            return false
          }

        }

        else if (token.includes('.sol')) {
          return checkDomainOwnership([token])
        }

        else {
          const Balance = (await connection.getBalance(publicKey!)) / LAMPORTS_PER_SOL;
          if (Balance! < amountToSend) {
            setError("You do not have enough SOL")
            return false
          }
        }

      }

      return true
    }
    catch (error) {
      const err = (error as any)?.message;
      console.log(error)
      setError(err)
      if (err.includes('Invalid public key input')) {
        setError("Invalid address! Please verify the token addresses and receiver's addresses")
      }

    }

  }

  // allow to check if the user owns the solana domain it wants to transfer
  const checkDomainOwnership = async (Domains: string[]) => {


    for (let i = 0; i < Domains.length; i++) {
      const domainName = Domains[i].replace(".sol", "")

      // get the key of the domain name
      const { pubkey } = await getDomainKey(domainName);

      // get the owner 
      const owner = await NameRegistryState.retrieve(
        connection,
        pubkey
      );
      const ownerAddress = owner.registry.owner.toBase58();
      if (ownerAddress != publicKey?.toBase58()) {
        setError('You are not the owner of ' + Domains[i])
        return false
      }
    }
    return true
  }



  // allow to multi send one token to multiple wallets
  const SendOnClick = async () => {
    if (publicKey) {
      setError('');
      setSignature('');

      // init temp lists in order to clean them and remove the inputs with no value
      const _Receivers = [receiver1, receiver2, receiver3, receiver4, receiver5, receiver6, receiver7, receiver8, receiver9, receiver10];
      const _Amounts = [quantity1, quantity2, quantity3, quantity4, quantity5, quantity6, quantity6, quantity7, quantity8, quantity9, quantity10];
      const Receivers: string[] = [];
      const Amounts: (number | undefined)[] = [];

      if (!isChecked) {
        for (let i = 0; i < _Receivers.length; i++) {
          if (_Receivers[i] != '' && _Amounts[i] != undefined) {
            Receivers.push(_Receivers[i]);
            Amounts.push(_Amounts[i]);
          }
        };
      }
      else {
        for (let i = 0; i < _Receivers.length; i++) {
          if (_Receivers[i] != '') {
            Receivers.push(_Receivers[i]);
          }
        }
      }

      // check if the sender has enough tokens
      const enoughToken = await checkBalance(Receivers, Amounts, mintAddress)
      if (enoughToken) {

        try {
          setIsSending(true)

          let Tx = new Transaction()

          //SPL TOKEN CASE

          if (CurrencyType == 'SPL') {
            const mint = new PublicKey(mintAddress);

            // get the owner's token account of the token to send in order to get the number of decimals
            const ownerTokenAccount = await Token.getAssociatedTokenAddress(
              ASSOCIATED_TOKEN_PROGRAM_ID,
              TOKEN_PROGRAM_ID,
              mint,
              publicKey,
            );

            // determine the number of decimals of the token to send
            const balance = await connection.getTokenAccountBalance(ownerTokenAccount)
            const decimals = balance.value.decimals

            for (let i = 0; i < Receivers.length; i++) {
              // determine the token account pubkey of the user
              const source_account = await Token.getAssociatedTokenAddress(
                ASSOCIATED_TOKEN_PROGRAM_ID,
                TOKEN_PROGRAM_ID,
                mint,
                publicKey,
              );

              let destPubkey: PublicKey;

              // check if it is a SOL domain name
              if (Receivers[i].includes('.sol')) {
                const hashedName = await getHashedName(Receivers[i].replace(".sol", ""));
                const nameAccountKey = await getNameAccountKey(
                  hashedName,
                  undefined,
                  new PublicKey("58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx") // SOL TLD Authority
                );
                const owner = await NameRegistryState.retrieve(
                  connection,
                  nameAccountKey
                );
                destPubkey = owner.registry.owner;

              }

              // check if it is a twitter handle
              else if (Receivers[i].includes('@')) {
                const handle = Receivers[i].replace("@", "")
                const registry = await getTwitterRegistry(connection, handle);
                destPubkey = registry.owner;

              }
              else {
                destPubkey = new PublicKey(Receivers[i]);
              }

              // determine the token account pubkey of the receiver
              const destination_account = await Token.getAssociatedTokenAddress(
                ASSOCIATED_TOKEN_PROGRAM_ID,
                TOKEN_PROGRAM_ID,
                mint,
                destPubkey
              );

              // get the info of the destination account
              const account = await connection.getAccountInfo(destination_account)

              if (account == null) {
                // if account == null it means that it doesn't exist
                // we have to create it
                // create associate token account instruction
                const createIx = Token.createAssociatedTokenAccountInstruction(
                  ASSOCIATED_TOKEN_PROGRAM_ID,
                  TOKEN_PROGRAM_ID,
                  mint,
                  destination_account,
                  destPubkey,
                  publicKey
                )

                let transferIx: TransactionInstruction;

                if (!isChecked) {
                  // create transfer token instruction
                  transferIx = Token.createTransferInstruction(
                    TOKEN_PROGRAM_ID,
                    source_account,
                    destination_account,
                    publicKey,
                    [],
                    Amounts[i]! * 10 ** decimals
                  )
                }
                else {
                  transferIx = Token.createTransferInstruction(
                    TOKEN_PROGRAM_ID,
                    source_account,
                    destination_account,
                    publicKey,
                    [],
                    quantity! * 10 ** decimals
                  )
                }
                // Add the instructions in a transaction
                Tx.add(createIx, transferIx);


              }

              else {

                let transferIx: TransactionInstruction;

                if (!isChecked) {

                  // create transfer token instruction
                  transferIx = Token.createTransferInstruction(
                    TOKEN_PROGRAM_ID,
                    source_account,
                    destination_account,
                    publicKey,
                    [],
                    Amounts[i]! * 10 ** decimals
                  )
                }
                else {
                  transferIx = Token.createTransferInstruction(
                    TOKEN_PROGRAM_ID,
                    source_account,
                    destination_account,
                    publicKey,
                    [],
                    quantity! * 10 ** decimals
                  )
                }

                // Add the instructions in a transaction
                Tx.add(transferIx);
              }
            }
          }
          // SOL CASE
          else {
            for (let i = 0; i < Receivers.length; i++) {

              let transferSOLIx: TransactionInstruction;

              let destPubkey: PublicKey;

              // check if it is a SOL domain name
              if (Receivers[i].includes('.sol')) {
                const hashedName = await getHashedName(Receivers[i].replace(".sol", ""));
                const nameAccountKey = await getNameAccountKey(
                  hashedName,
                  undefined,
                  new PublicKey("58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx") // SOL TLD Authority
                );
                const owner = await NameRegistryState.retrieve(
                  connection,
                  nameAccountKey
                );
                destPubkey = owner.registry.owner;

              }

              // check if it is a twitter handle
              else if (Receivers[i].includes('@')) {
                const handle = Receivers[i].replace("@", "")
                const registry = await getTwitterRegistry(connection, handle);
                destPubkey = registry.owner;

              }
              else {
                destPubkey = new PublicKey(Receivers[i]);
              }

              if (!isChecked) {

                transferSOLIx = SystemProgram.transfer({
                  fromPubkey: publicKey,
                  toPubkey: destPubkey,
                  lamports: Amounts[i]! * LAMPORTS_PER_SOL,
                })
              }
              else {
                transferSOLIx = SystemProgram.transfer({
                  fromPubkey: publicKey,
                  toPubkey: destPubkey,
                  lamports: quantity! * LAMPORTS_PER_SOL,
                })
              };

              Tx.add(transferSOLIx);
            }
          }


          //send the transaction
          const sendSignature = await wallet.sendTransaction(Tx, connection);
          // wait the confirmation
          const confirmed = await connection.confirmTransaction(sendSignature, 'processed');


          if (confirmed) {
            const signature = sendSignature.toString();
            setIsSending(false);
            setSignature(signature)
          }

        } catch (error) {
          const err = (error as any)?.message;
          setError(err);
          setIsSending(false);
        }
      }
      else {
        setError('Not enough token in wallet')
      }
    }
  };

  // allow to multi send multiple tokens to one wallet
  const SendOnClickMulti = async () => {
    if (publicKey) {
      setError('');
      setSignature('');

      // init temp lists in order to clean them and remove the inputs with no value
      const _Tokens = [token1, token2, token3, token4, token5, token6, token7, token8, token9, token10];
      const _Amounts = [quantity1, quantity2, quantity3, quantity4, quantity5, quantity6, quantity6, quantity7, quantity8, quantity9, quantity10];
      const Tokens: string[] = [];
      const Amounts: (number | undefined)[] = [];

      for (let i = 0; i < _Tokens.length; i++) {
        if (_Tokens[i] != '' && _Amounts[i] != undefined) {
          Tokens.push(_Tokens[i]);
          Amounts.push(_Amounts[i]);
        }
      };
      const enoughToken = await checkBalanceMulti(Tokens, Amounts)
      if (enoughToken) {

        try {
          setIsSending(true)

          let destPubkey: PublicKey;

          // check if it is a SOL domain name
          if (ReceiverAddress.includes('.sol')) {
            const hashedName = await getHashedName(ReceiverAddress.replace(".sol", ""));
            const nameAccountKey = await getNameAccountKey(
              hashedName,
              undefined,
              new PublicKey("58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx") // SOL TLD Authority
            );
            const owner = await NameRegistryState.retrieve(
              connection,
              nameAccountKey
            );
            destPubkey = owner.registry.owner;

          }
          // check if it is a twitter handle
          else if (ReceiverAddress.includes('@')) {
            const handle = ReceiverAddress.replace("@", "")
            const registry = await getTwitterRegistry(connection, handle);
            destPubkey = registry.owner;

          }
          else {
            destPubkey = new PublicKey(ReceiverAddress);
          }


          let Tx = new Transaction()

          for (let i = 0; i < Tokens.length; i++) {

            // determine the token account pubkey of the user
            // allow to get the number of decimals
            const source_account = await Token.getAssociatedTokenAddress(
              ASSOCIATED_TOKEN_PROGRAM_ID,
              TOKEN_PROGRAM_ID,
              new PublicKey(Tokens[i]),
              publicKey,
            );

            // determine the number of decimals of the token to send
            const balance = await connection.getTokenAccountBalance(source_account)
            const decimals = balance.value.decimals

            // determine the token account pubkey of the receiver
            const destination_account = await Token.getAssociatedTokenAddress(
              ASSOCIATED_TOKEN_PROGRAM_ID,
              TOKEN_PROGRAM_ID,
              new PublicKey(Tokens[i]),
              destPubkey
            );

            // get the info of the destination account
            const account = await connection.getAccountInfo(destination_account)

            if (account == null) {
              // if account == null it means that it doesn't exist
              // we have to create it
              // create associate token account instruction
              const createIx = Token.createAssociatedTokenAccountInstruction(
                ASSOCIATED_TOKEN_PROGRAM_ID,
                TOKEN_PROGRAM_ID,
                new PublicKey(Tokens[i]),
                destination_account,
                destPubkey,
                publicKey
              )

              // create transfer token instruction
              const transferIx = Token.createTransferInstruction(
                TOKEN_PROGRAM_ID,
                source_account,
                destination_account,
                publicKey,
                [],
                Amounts[i]! * 10 ** decimals
              )

              // Add the instructions in a transaction
              Tx.add(createIx, transferIx);
            }
            else {
              // create transfer token instruction
              const transferIx = Token.createTransferInstruction(
                TOKEN_PROGRAM_ID,
                source_account,
                destination_account,
                publicKey,
                [],
                Amounts[i]! * 10 ** decimals
              )
              Tx.add(transferIx);
            }
          }
          if (isSOLChecked) {
            const transferSOLIx = SystemProgram.transfer({
              fromPubkey: publicKey,
              toPubkey: destPubkey,
              lamports: quantity! * LAMPORTS_PER_SOL,
            })

            Tx.add(transferSOLIx)
          }
          //send the transaction
          const sendSignature = await wallet.sendTransaction(Tx, connection);
          // wait the confirmation
          const confirmed = await connection.confirmTransaction(sendSignature, 'processed');


          if (confirmed) {
            const signature = sendSignature.toString();
            setIsSending(false);
            setSignature(signature)
          }
        }

        catch (error) {
          const err = (error as any)?.message;
          setError(err);
          setIsSending(false);
        }

      }
      else {
        setError('Not enough token in wallet')
      }

    }
  }

  // allow to multi send solana domains
  const SendOnClickDomain = async () => {
    if (publicKey) {
      setError('');
      setSignature('');

      // init temp lists in order to clean them and remove the inputs with no value
      const _Domains = [token1, token2, token3, token4, token5, token6, token7, token8, token9, token10];
      const Domains: string[] = [];

      for (let i = 0; i < _Domains.length; i++) {
        if (_Domains[i] != '') {
          Domains.push(_Domains[i]);

        }
      };
      const isOwner = await checkDomainOwnership(Domains);

      if (isOwner) {

        try {
          setIsSending(true)

          let destPubkey: PublicKey;

          // check if it is a SOL domain name
          if (ReceiverAddress.includes('.sol')) {
            const hashedName = await getHashedName(ReceiverAddress.replace(".sol", ""));
            const nameAccountKey = await getNameAccountKey(
              hashedName,
              undefined,
              new PublicKey("58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx") // SOL TLD Authority
            );
            const owner = await NameRegistryState.retrieve(
              connection,
              nameAccountKey
            );
            destPubkey = owner.registry.owner;

          }
          // check if it is a twitter handle
          else if (ReceiverAddress.includes('@')) {
            const handle = ReceiverAddress.replace("@", "")
            const registry = await getTwitterRegistry(connection, handle);
            destPubkey = registry.owner;

          }
          else {
            destPubkey = new PublicKey(ReceiverAddress);
          }


          let Tx = new Transaction()

          for (let i = 0; i < Domains.length; i++) {

            const ix = await transferNameOwnership(
              connection,
              Domains[i].replace(".sol", ""),
              destPubkey,
              undefined,
              new PublicKey("58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx") // SOL TLD Authority
            );

            Tx.add(ix)

          }
          //send the transaction
          const sendSignature = await wallet.sendTransaction(Tx, connection);
          // wait the confirmation
          const confirmed = await connection.confirmTransaction(sendSignature, 'processed');


          if (confirmed) {
            const signature = sendSignature.toString();
            setIsSending(false);
            setSignature(signature)
          }
        }

        catch (error) {
          const err = (error as any)?.message;
          setError(err);
          setIsSending(false);
        }
      }

    }
  }

  // allow to multi send tokens using a CSV file
  const SendOnClickCsv = async () => {
    const enoughToken = await checkBalanceCsv(csvData, csvHeaders).then()
    if (publicKey) {
      if (enoughToken) {

        try {
          setCurrentTx(0);
          setTotalTx(0);
          setIsSending(true);
          setError('');
          setCsvSendingSuccess(false);
          // define the number of transfers done in one Tx
          const nbPerTx = 6

          // calculate the number of Tx to do
          let nbTx: number
          if (csvData.length % 6 == 0) {
            nbTx = csvData.length / nbPerTx
          }
          else {
            nbTx = Math.floor(csvData.length / nbPerTx) + 1;
          }

          setTotalTx(nbTx);

          for (let i = 0; i < nbTx; i++) {

            // Create a transaction
            let Tx = new Transaction()

            let bornSup: number

            if (i == nbTx - 1) {
              bornSup = csvData.length
            }

            else {
              bornSup = 6 * (i + 1)
            }

            // for each csv line
            for (let j = 6 * i; j < bornSup; j++) {


              const destAddress = csvData[j][csvHeaders[0]]
              console.log(destAddress)
              let destPubkey: PublicKey;
              // check if it is a SOL domain name
              if (destAddress.includes('.sol')) {
                const hashedName = await getHashedName(destAddress.replace(".sol", ""));
                const nameAccountKey = await getNameAccountKey(
                  hashedName,
                  undefined,
                  new PublicKey("58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx") // SOL TLD Authority
                );
                const owner = await NameRegistryState.retrieve(
                  connection,
                  nameAccountKey
                );
                destPubkey = owner.registry.owner;
              }
              // check if it is a twitter handle
              else if (destAddress.includes('@')) {
                const handle = destAddress.replace("@", "")
                const registry = await getTwitterRegistry(connection, handle);
                destPubkey = registry.owner;

              }
              else {
                destPubkey = new PublicKey(destAddress);
              }

              const token = csvData[j][csvHeaders[1]]
              const amount = parseFloat(csvData[j][csvHeaders[2]])

              if (token == 'So11111111111111111111111111111111111111112') {
                const transferSOLIx = SystemProgram.transfer({
                  fromPubkey: publicKey,
                  toPubkey: destPubkey,
                  lamports: amount * LAMPORTS_PER_SOL,

                })

                Tx.add(transferSOLIx)

              }

              else if (token.includes('.sol')) {
                const ix = await transferNameOwnership(
                  connection,
                  token.replace(".sol", ""),
                  destPubkey,
                  undefined,
                  new PublicKey("58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx") // SOL TLD Authority
                );

                Tx.add(ix)
              }
              else {

                const mint = new PublicKey(token)
                // determine the token account pubkey of the user
                const source_account = await Token.getAssociatedTokenAddress(
                  ASSOCIATED_TOKEN_PROGRAM_ID,
                  TOKEN_PROGRAM_ID,
                  mint,
                  publicKey,
                );

                // determine the number of decimals of the token to send
                const balance = await connection.getTokenAccountBalance(source_account)
                const decimals = balance.value.decimals
                // determine the token account pubkey of the receiver
                const destination_account = await Token.getAssociatedTokenAddress(
                  ASSOCIATED_TOKEN_PROGRAM_ID,
                  TOKEN_PROGRAM_ID,
                  mint,
                  destPubkey
                );

                // get the info of the destination account
                const account = await connection.getAccountInfo(destination_account)

                if (account == null) {
                  // if account == null it means that it doesn't exist
                  // we have to create it
                  // create associate token account instruction
                  const createIx = Token.createAssociatedTokenAccountInstruction(
                    ASSOCIATED_TOKEN_PROGRAM_ID,
                    TOKEN_PROGRAM_ID,
                    mint,
                    destination_account,
                    destPubkey,
                    publicKey
                  )

                  // create transfer token instruction
                  const transferIx = Token.createTransferInstruction(
                    TOKEN_PROGRAM_ID,
                    source_account,
                    destination_account,
                    publicKey,
                    [],
                    amount * 10 ** decimals
                  )

                  // Add the instructions in a transaction
                  Tx.add(createIx, transferIx);
                }

                else {
                  // create transfer token instruction
                  const transferIx = Token.createTransferInstruction(
                    TOKEN_PROGRAM_ID,
                    source_account,
                    destination_account,
                    publicKey,
                    [],
                    amount * 10 ** decimals
                  )
                  // Add the instructions in a transaction
                  Tx.add(transferIx);
                }
              }

            }

            // incremente the current transaction
            setCurrentTx(i + 1)

            // send the transaction
            const signature = await wallet.sendTransaction(Tx, connection);

            // get the confirmation of the transaction
            const confirmed = await connection.confirmTransaction(signature, 'processed');
            console.log('success')

          }
          setIsSending(false)
          setCsvSendingSuccess(true)
        }
        catch (error) {
          setIsSending(false)
          console.log(error)
          const err = (error as any)?.message;
          console.log(err)
          if (err.includes('Invalid public key input')) {
            setError("Invalid address! Please verify the token addresses and receiver's addresses")
          }
          else {
            setError(err)
          }
        }
      }

    }

  }

  const handleFileChange = async (event: any) => {
    setError('')
    setCsvSendingSuccess(false)
    const csvFile = event.target.files[0];
    const fileName = csvFile['name']
    setCsvFileName(fileName)
    const fileType = csvFile['type']

    if (fileType != 'text/csv') {
      setError('It is not a CSV file!')
    }
    else {
      setCsvFileIsUploaded(true)
      Papa.parse(event.target.files[0], {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          const rowsArray: any = [];


          // Iterating data to get column name
          results.data.map((d: any) => {
            rowsArray.push(Object.keys(d));
          });

          // Parsed Data Response in array format
          // @ts-ignore
          setCsvData(results.data);

          // get the headers of the CSV file
          setCsvHeaders(rowsArray[0]);
        },
      });
    }
  }

  return (
    <div className="text-center pt-2">
      <div className="hero min-h-16 p-0">
        <div className="text-center hero-content w-full">
          <div className="w-full">
            {nbToken == '' && CurrencyType == '' &&
              <div>
                <div className="p-2 border-2 rounded-lg bg-gray-900">
                  <h1 className="font-pixel mb-5 text-5xl underline">
                    Multi Send Token
                  </h1>
                  <h3 className="font-pixel text-xl pb-5" >Supports public address, .sol domain name and Twitter handle with @</h3>
                </div>

                <div className="border-2">
                  <button className="btn btn-primary font-pixel m-5" onClick={() => { setNbToken('one'); reset() }}>
                    Send one token to multiple receivers
                  </button>
                  <button className="font-pixel btn btn-primary m-5" onClick={() => { setNbToken('multi'); reset() }}>
                    Send multiple tokens to one receiver
                  </button>
                  <button className="font-pixel btn btn-primary m-5" onClick={() => { setCurrencyType('domain'); reset() }}>
                    Transfer multiple Solana domains name to one receiver
                  </button>
                  <button className="font-pixel btn btn-primary m-5" onClick={() => { setCurrencyType('csv'); reset() }}>
                    Use a CSV file to multi send tokens and solana domains
                  </button>
                </div>
              </div>
            }

            {nbToken != '' && CurrencyType == '' &&
              <div className="flex">
                <button className="btn btn-primary font-pixel "
                  onClick={() => { setNbToken(''); setCurrencyType('') }}>← Back</button>
              </div>
            }
            {CurrencyType != '' &&
              <div className="flex">
                <button className="btn btn-primary font-pixel "
                  onClick={() => { setCurrencyType('') }}>← Back</button>
              </div>
            }

            {nbToken == 'one' &&
              <div>
                {CurrencyType == '' &&
                  <div>
                    <div className="p-2 border-2 rounded-lg bg-gray-900">
                      <h1 className="font-pixel mb-5 text-5xl underline">
                        SEND SOL
                      </h1>
                    </div>
                    <div className="max-w-4xl mx-auto">
                      <button className="btn btn-primary font-pixel m-5" onClick={() => { setCurrencyType('SOL'); reset() }}>
                        Send SOL to multiple receivers
                      </button>

                      <button className="btn btn-primary font-pixel m-5" onClick={() => { setCurrencyType('SPL'); reset() }}>
                        Send one SPL token type to multiple receivers
                      </button>
                    </div>
                  </div>
                }

                <div>
                  {/* form when SOL is selected */}
                  {CurrencyType == 'SOL' &&
                    <div>
                      <form className="">
                        <div className="flex justify-center mb-[2%] p-2 ">
                          <div className="my-auto mx-2 font-pixel">Send same SOL amount</div>
                          <input className="my-auto mx-2"
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => { setIsChecked(!isChecked); setQuantity(undefined) }}
                          />
                          {isChecked &&
                            <div className="flex items-center">
                              <input className="w-[150px] mx-4 input input-bordered"
                                type="number"
                                step="any"
                                min="0"
                                required
                                placeholder="Amount"
                                onChange={(e) => setQuantity(parseFloat(e.target.value))}
                                style={{
                                  borderRadius:
                                    "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                                }}
                              /></div>
                          }

                        </div>

                        <div>

                          <input className="mb-[1%] md:w-[480px] text-center mx-4 input input-bordered font-pixel"
                            type="text"
                            required
                            placeholder="Receiver #1"
                            onChange={(e) => setReceiver1(e.target.value)}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />

                          {!isChecked &&
                            <input className="sm:mb-[1%] mb-2 w-[150px] mx-4 input input-bordered font-pixel"
                              type="number"
                              step="any"
                              min="0"
                              required
                              placeholder="Amount #1"
                              onChange={(e) => setQuantity1(parseFloat(e.target.value))}
                              style={{
                                borderRadius:
                                  "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                              }}
                            />}

                        </div>

                        <div>

                          <input className="mb-[1%] md:w-[480px] text-center mx-4 input input-bordered font-pixel"
                            type="text"
                            required
                            placeholder="Receiver #2"
                            onChange={(e) => setReceiver2(e.target.value)}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />

                          {!isChecked && <input className="sm:mb-[1%] mb-2 w-[150px] mx-4 input input-bordered font-pixel"
                            type="number"
                            step="any"
                            min="0"
                            required
                            placeholder="Amount #2"
                            onChange={(e) => setQuantity2(parseFloat(e.target.value))}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />}
                        </div>
                        <div>

                          <input className="mb-[1%] md:w-[480px] text-center mx-4 input input-bordered font-pixel"
                            type="text"
                            required
                            placeholder="Receiver #3"
                            onChange={(e) => setReceiver3(e.target.value)}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />

                          {!isChecked && <input className="sm:mb-[1%] mb-2 w-[150px] mx-4 input input-bordered font-pixel"
                            type="number"
                            step="any"
                            min="0"
                            required
                            placeholder="Amount #3"
                            onChange={(e) => setQuantity3(parseFloat(e.target.value))}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />}
                        </div>

                        <div>

                          <input className="mb-[1%] md:w-[480px] text-center mx-4 input input-bordered font-pixel"
                            type="text"
                            required
                            placeholder="Receiver #4"
                            onChange={(e) => setReceiver4(e.target.value)}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />

                          {!isChecked && <input className="sm:mb-[1%] mb-2 w-[150px] mx-4 input input-bordered font-pixel"
                            type="number"
                            step="any"
                            min="0"
                            required
                            placeholder="Amount #4"
                            onChange={(e) => setQuantity4(parseFloat(e.target.value))}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />}
                        </div>

                        <div>

                          <input className="mb-[1%] md:w-[480px] text-center mx-4 input input-bordered font-pixel"
                            type="text"
                            required
                            placeholder="Receiver #5"
                            onChange={(e) => setReceiver5(e.target.value)}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />

                          {!isChecked && <input className="sm:mb-[1%] mb-2 w-[150px] mx-4 input input-bordered font-pixel"
                            type="number"
                            step="any"
                            min="0"
                            required
                            placeholder="Amount #5"
                            onChange={(e) => setQuantity5(parseFloat(e.target.value))}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />}
                        </div>

                        <div>

                          <input className="mb-[1%] md:w-[480px] text-center mx-4 input input-bordered font-pixel"
                            type="text"
                            required
                            placeholder="Receiver #6"
                            onChange={(e) => setReceiver6(e.target.value)}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />

                          {!isChecked && <input className="sm:mb-[1%] mb-2 w-[150px] mx-4 input input-bordered font-pixel"
                            type="number"
                            step="any"
                            min="0"
                            required
                            placeholder="Amount #6"
                            onChange={(e) => setQuantity6(parseFloat(e.target.value))}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />}
                        </div>

                        <div>

                          <input className="mb-[1%] md:w-[480px] text-center mx-4 input input-bordered font-pixel"
                            type="text"
                            required
                            placeholder="Receiver #7"
                            onChange={(e) => setReceiver7(e.target.value)}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />

                          {!isChecked && <input className="sm:mb-[1%] mb-2 w-[150px] mx-4 input input-bordered font-pixel"
                            type="number"
                            step="any"
                            min="0"
                            required
                            placeholder="Amount #7"
                            onChange={(e) => setQuantity7(parseFloat(e.target.value))}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />}
                        </div>

                        <div>

                          <input className="mb-[1%] md:w-[480px] text-center mx-4 input input-bordered font-pixel"
                            type="text"
                            required
                            placeholder="Receiver #8"
                            onChange={(e) => setReceiver8(e.target.value)}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />

                          {!isChecked && <input className="sm:mb-[1%] mb-2 w-[150px] mx-4 input input-bordered font-pixel"
                            type="number"
                            step="any"
                            min="0"
                            required
                            placeholder="Amount #8"
                            onChange={(e) => setQuantity8(parseFloat(e.target.value))}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />}
                        </div>

                        <div>

                          <input className="mb-[1%] md:w-[480px] text-center mx-4 input input-bordered font-pixel"
                            type="text"
                            required
                            placeholder="Receiver #9"
                            onChange={(e) => setReceiver9(e.target.value)}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />

                          {!isChecked && <input className="sm:mb-[1%] mb-2 w-[150px] mx-4 input input-bordered font-pixel"
                            type="number"
                            step="any"
                            min="0"
                            required
                            placeholder="Amount #9"
                            onChange={(e) => setQuantity9(parseFloat(e.target.value))}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />}
                        </div>

                        <div>

                          <input className="mb-[1%] md:w-[480px] text-center mx-4 input input-bordered font-pixel"
                            type="text"
                            required
                            placeholder="Receiver #10"
                            onChange={(e) => setReceiver10(e.target.value)}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />

                          {!isChecked && <input className="sm:mb-[1%] mb-2 w-[150px] mx-4 input input-bordered font-pixel"
                            type="number"
                            step="any"
                            min="0"
                            required
                            placeholder="Amount #10"
                            onChange={(e) => setQuantity10(parseFloat(e.target.value))}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />}
                        </div>
                      </form>
                    </div>
                  }

                  {/* form when SPL is selected */}
                  {CurrencyType == 'SPL' &&
                    <div>
                      <form className="mt-2">
                        <div className="flex justify-between">
                          <input className="mb-[2%] md:w-[480px] text-center mx-4 input input-bordered font-pixel"
                            type="text"
                            required
                            placeholder="Token Mint Address"
                            onChange={(e) => setMintAddress(e.target.value)}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />
                          <div className="flex justify-center mb-[2%]">
                            <div className="my-auto mx-2 font-pixel">Send same token amount</div>
                            <input className="my-auto mx-2"
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => setIsChecked(!isChecked)}
                            />
                            {isChecked &&
                              <div className="flex items-center">
                                <input className="sm:mb-[1%] mb-2 w-[150px] mx-4 input input-bordered font-pixel"
                                  type="number"
                                  step="any"
                                  min="0"
                                  required
                                  placeholder="Amount"
                                  onChange={(e) => setQuantity(parseFloat(e.target.value))}
                                  style={{
                                    borderRadius:
                                      "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                                  }}
                                /></div>
                            }
                          </div>
                        </div>

                        <div>

                          <input className="mb-[1%] md:w-[480px] text-center mx-4 input input-bordered font-pixel"
                            type="text"
                            required
                            placeholder="Receiver #1"
                            onChange={(e) => setReceiver1(e.target.value)}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />

                          {!isChecked &&
                            <input className="sm:mb-[1%] mb-2 w-[150px] mx-4 input input-bordered font-pixel"
                              type="number"
                              step="any"
                              min="0"
                              required
                              placeholder="Amount #1"
                              onChange={(e) => setQuantity1(parseFloat(e.target.value))}
                              style={{
                                borderRadius:
                                  "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                              }}
                            />}

                        </div>

                        <div>

                          <input className="mb-[1%] md:w-[480px] text-center mx-4 input input-bordered font-pixel"
                            type="text"
                            required
                            placeholder="Receiver #2"
                            onChange={(e) => setReceiver2(e.target.value)}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />

                          {!isChecked && <input className="sm:mb-[1%] mb-2 w-[150px] mx-4 input input-bordered font-pixel"
                            type="number"
                            step="any"
                            min="0"
                            required
                            placeholder="Amount #2"
                            onChange={(e) => setQuantity2(parseFloat(e.target.value))}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />}
                        </div>
                        <div>

                          <input className="mb-[1%] md:w-[480px] text-center mx-4 input input-bordered font-pixel"
                            type="text"
                            required
                            placeholder="Receiver #3"
                            onChange={(e) => setReceiver3(e.target.value)}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />

                          {!isChecked && <input className="sm:mb-[1%] mb-2 w-[150px] mx-4 input input-bordered font-pixel"
                            type="number"
                            step="any"
                            min="0"
                            required
                            placeholder="Amount #3"
                            onChange={(e) => setQuantity3(parseFloat(e.target.value))}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />}
                        </div>

                        <div>

                          <input className="mb-[1%] md:w-[480px] text-center mx-4 input input-bordered font-pixel"
                            type="text"
                            required
                            placeholder="Receiver #4"
                            onChange={(e) => setReceiver4(e.target.value)}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />

                          {!isChecked && <input className="sm:mb-[1%] mb-2 w-[150px] mx-4 input input-bordered font-pixel"
                            type="number"
                            step="any"
                            min="0"
                            required
                            placeholder="Amount #4"
                            onChange={(e) => setQuantity4(parseFloat(e.target.value))}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />}
                        </div>

                        <div>

                          <input className="mb-[1%] md:w-[480px] text-center mx-4 input input-bordered font-pixel"
                            type="text"
                            required
                            placeholder="Receiver #5"
                            onChange={(e) => setReceiver5(e.target.value)}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />

                          {!isChecked && <input className="sm:mb-[1%] mb-2 w-[150px] mx-4 input input-bordered font-pixel"
                            type="number"
                            step="any"
                            min="0"
                            required
                            placeholder="Amount #5"
                            onChange={(e) => setQuantity5(parseFloat(e.target.value))}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />}
                        </div>

                        <div>

                          <input className="mb-[1%] md:w-[480px] text-center mx-4 input input-bordered font-pixel"
                            type="text"
                            required
                            placeholder="Receiver #6"
                            onChange={(e) => setReceiver6(e.target.value)}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />

                          {!isChecked && <input className="sm:mb-[1%] mb-2 w-[150px] mx-4 input input-bordered font-pixel"
                            type="number"
                            step="any"
                            min="0"
                            required
                            placeholder="Amount #6"
                            onChange={(e) => setQuantity6(parseFloat(e.target.value))}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />}
                        </div>

                        <div>

                          <input className="mb-[1%] md:w-[480px] text-center mx-4 input input-bordered font-pixel"
                            type="text"
                            required
                            placeholder="Receiver #7"
                            onChange={(e) => setReceiver7(e.target.value)}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />

                          {!isChecked && <input className="sm:mb-[1%] mb-2 w-[150px] mx-4 input input-bordered font-pixel"
                            type="number"
                            step="any"
                            min="0"
                            required
                            placeholder="Amount #7"
                            onChange={(e) => setQuantity7(parseFloat(e.target.value))}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />}
                        </div>

                        <div>

                          <input className="mb-[1%] md:w-[480px] text-center mx-4 input input-bordered font-pixel"
                            type="text"
                            required
                            placeholder="Receiver #8"
                            onChange={(e) => setReceiver8(e.target.value)}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />

                          {!isChecked && <input className="sm:mb-[1%] mb-2 w-[150px] mx-4 input input-bordered font-pixel"
                            type="number"
                            step="any"
                            min="0"
                            required
                            placeholder="Amount #8"
                            onChange={(e) => setQuantity8(parseFloat(e.target.value))}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />}
                        </div>

                        <div>

                          <input className="mb-[1%] md:w-[480px] text-center mx-4 input input-bordered font-pixel"
                            type="text"
                            required
                            placeholder="Receiver #9"
                            onChange={(e) => setReceiver9(e.target.value)}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />

                          {!isChecked && <input className="sm:mb-[1%] mb-2 w-[150px] mx-4 input input-bordered font-pixel"
                            type="number"
                            step="any"
                            min="0"
                            required
                            placeholder="Amount #9"
                            onChange={(e) => setQuantity9(parseFloat(e.target.value))}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />}
                        </div>

                        <div>

                          <input className="mb-[1%] md:w-[480px] text-center mx-4 input input-bordered font-pixel"
                            type="text"
                            required
                            placeholder="Receiver #10"
                            onChange={(e) => setReceiver10(e.target.value)}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />

                          {!isChecked && <input className="sm:mb-[1%] mb-2 w-[150px] mx-4 input input-bordered font-pixel"
                            type="number"
                            step="any"
                            min="0"
                            required
                            placeholder="Amount #10"
                            onChange={(e) => setQuantity10(parseFloat(e.target.value))}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />}
                        </div>
                      </form>
                    </div>}

                  {!isSending && CurrencyType != '' &&
                    <button className="font-pixel btn btn-primary" onClick={SendOnClick}>Send</button>
                  }
                  {isSending && CurrencyType != '' &&
                    <button className="font-pixel btn btn-primary">
                      <svg role="status" className="inline mr-3 w-4 h-4 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                      </svg>Sending</button>}


                  {signature != '' && <div className="font-pixel text-xl mt-4">
                    ✅ Successfuly sent! Check it <a target="_blank" href={'https://solscan.io/tx/' + signature}><strong className="underline">here</strong></a>
                  </div>
                  }


                  {Error != '' && <div className="mt-4 font-pixel text-xl">❌ {Error}</div>}
                </div>
              </div>
            }

            {nbToken == 'multi' &&
              <div>

                <form className="">
                  <input className="mb-[2%] md:w-[480px] text-center mx-4 input input-bordered font-pixel"
                    type="text"
                    required
                    placeholder="Receiver Address"
                    onChange={(e) => setReceiverAddress(e.target.value)}
                    style={{
                      borderRadius:
                        "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                    }}
                  />
                  <div className="flex justify-center mb-[2%]">
                    <div className="my-auto mx-2">Send SOL</div>
                    <input className="my-auto mx-2"
                      type="checkbox"
                      checked={isSOLChecked}
                      onChange={(e) => { setIsSOLChecked(!isSOLChecked); setQuantity(undefined) }}
                    />
                    {isSOLChecked &&
                      <div className="flex items-center">
                        <input className="mb-[1%] w-[150px] mx-4 input input-bordered font-pixel"
                          type="number"
                          step="any"
                          min="0"
                          required
                          placeholder="Amount"
                          onChange={(e) => setQuantity(parseFloat(e.target.value))}
                          style={{
                            borderRadius:
                              "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                          }}
                        /></div>
                    }
                  </div>

                  <div>
                    <input className="mb-[1%] md:w-[480px] text-center mx-4 input input-bordered font-pixel"
                      type="text"
                      required
                      placeholder="Token Mint Address #1"
                      onChange={(e) => setToken1(e.target.value)}
                      style={{
                        borderRadius:
                          "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                      }}
                    />

                    <input className="sm:mb-[1%] mb-2 w-[150px] mx-4 input input-bordered font-pixel"
                      type="number"
                      step="any"
                      min="0"
                      required
                      placeholder="Amount #1"
                      onChange={(e) => setQuantity1(parseFloat(e.target.value))}
                      style={{
                        borderRadius:
                          "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                      }}
                    />
                  </div>

                  <div>
                    <input className="mb-[1%] md:w-[480px] text-center mx-4 input input-bordered font-pixel"
                      type="text"
                      required
                      placeholder="Token Mint Address #2"
                      onChange={(e) => setToken2(e.target.value)}
                      style={{
                        borderRadius:
                          "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                      }}
                    />
                    <input className="sm:mb-[1%] mb-2 w-[150px] mx-4 input input-bordered font-pixel"
                      type="number"
                      step="any"
                      min="0"
                      required
                      placeholder="Amount #2"
                      onChange={(e) => setQuantity2(parseFloat(e.target.value))}
                      style={{
                        borderRadius:
                          "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                      }}
                    />
                  </div>
                  <div>
                    <input className="mb-[1%] md:w-[480px] text-center mx-4 input input-bordered font-pixel"
                      type="text"
                      required
                      placeholder="Token Mint Address #3"
                      onChange={(e) => setToken3(e.target.value)}
                      style={{
                        borderRadius:
                          "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                      }}
                    />

                    <input className="sm:mb-[1%] mb-2 w-[150px] mx-4 input input-bordered font-pixel"
                      type="number"
                      step="any"
                      min="0"
                      required
                      placeholder="Amount #3"
                      onChange={(e) => setQuantity3(parseFloat(e.target.value))}
                      style={{
                        borderRadius:
                          "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                      }}
                    />
                  </div>
                  <div>
                    <input className="mb-[1%] md:w-[480px] text-center mx-4 input input-bordered font-pixel"
                      type="text"
                      required
                      placeholder="Token Mint Address #4"
                      onChange={(e) => setToken4(e.target.value)}
                      style={{
                        borderRadius:
                          "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                      }}
                    />

                    <input className="sm:mb-[1%] mb-2 w-[150px] mx-4 input input-bordered font-pixel"
                      type="number"
                      step="any"
                      min="0"
                      required
                      placeholder="Amount #4"
                      onChange={(e) => setQuantity4(parseFloat(e.target.value))}
                      style={{
                        borderRadius:
                          "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                      }}
                    />
                  </div>
                  <div>

                    <input className="mb-[1%] md:w-[480px] text-center mx-4 input input-bordered font-pixel"
                      type="text"
                      required
                      placeholder="Token Mint Address #5"
                      onChange={(e) => setToken5(e.target.value)}
                      style={{
                        borderRadius:
                          "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                      }}
                    />

                    <input className="sm:mb-[1%] mb-2 w-[150px] mx-4 input input-bordered font-pixel"
                      type="number"
                      step="any"
                      min="0"
                      required
                      placeholder="Amount #5"
                      onChange={(e) => setQuantity5(parseFloat(e.target.value))}
                      style={{
                        borderRadius:
                          "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                      }}
                    />
                  </div>

                  <div>

                    <input className="mb-[1%] md:w-[480px] text-center mx-4 input input-bordered font-pixel"
                      type="text"
                      required
                      placeholder="Token Mint Address #6"
                      onChange={(e) => setToken6(e.target.value)}
                      style={{
                        borderRadius:
                          "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                      }}
                    />

                    <input className="sm:mb-[1%] mb-2 w-[150px] mx-4 input input-bordered font-pixel"
                      type="number"
                      step="any"
                      min="0"
                      required
                      placeholder="Amount #6"
                      onChange={(e) => setQuantity6(parseFloat(e.target.value))}
                      style={{
                        borderRadius:
                          "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                      }}
                    />
                  </div>

                  <div>

                    <input className="mb-[1%] md:w-[480px] text-center mx-4 input input-bordered font-pixel"
                      type="text"
                      required
                      placeholder="Token Mint Address #7"
                      onChange={(e) => setToken7(e.target.value)}
                      style={{
                        borderRadius:
                          "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                      }}
                    />

                    <input className="sm:mb-[1%] mb-2 w-[150px] mx-4 input input-bordered font-pixel"
                      type="number"
                      step="any"
                      min="0"
                      required
                      placeholder="Amount #7"
                      onChange={(e) => setQuantity7(parseFloat(e.target.value))}
                      style={{
                        borderRadius:
                          "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                      }}
                    />
                  </div>

                  <div>

                    <input className="mb-[1%] md:w-[480px] text-center mx-4 input input-bordered font-pixel"
                      type="text"
                      required
                      placeholder="Token Mint Address #8"
                      onChange={(e) => setToken8(e.target.value)}
                      style={{
                        borderRadius:
                          "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                      }}
                    />

                    <input className="sm:mb-[1%] mb-2 w-[150px] mx-4 input input-bordered font-pixel"
                      type="number"
                      step="any"
                      min="0"
                      required
                      placeholder="Amount #8"
                      onChange={(e) => setQuantity8(parseFloat(e.target.value))}
                      style={{
                        borderRadius:
                          "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                      }}
                    />
                  </div>

                  <div>

                    <input className="sm:mb-[1%] mb-2 md:w-[480px] text-center mx-4 input input-bordered font-pixel"
                      type="text"
                      required
                      placeholder="Token Mint Address #9"
                      onChange={(e) => setToken9(e.target.value)}
                      style={{
                        borderRadius:
                          "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                      }}
                    />

                    <input className="mb-[1%] w-[150px] mx-4 input input-bordered font-pixel"
                      type="number"
                      step="any"
                      min="0"
                      required
                      placeholder="Amount #9"
                      onChange={(e) => setQuantity9(parseFloat(e.target.value))}
                      style={{
                        borderRadius:
                          "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                      }}
                    />
                  </div>

                  <div>

                    <input className="sm:mb-[1%] mb-2 md:w-[480px] text-center mx-4 input input-bordered font-pixel"
                      type="text"
                      required
                      placeholder="Token Mint Address #10"
                      onChange={(e) => setToken10(e.target.value)}
                      style={{
                        borderRadius:
                          "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                      }}
                    />

                    <input className="mb-[1%] w-[150px] mx-4 input input-bordered font-pixel"
                      type="number"
                      step="any"
                      min="0"
                      required
                      placeholder="Amount #10"
                      onChange={(e) => setQuantity10(parseFloat(e.target.value))}
                      style={{
                        borderRadius:
                          "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                      }}
                    />
                  </div>
                </form>

                {!isSending &&
                  <button className="btn btn-primary font-pixel" onClick={SendOnClickMulti}>Send</button>
                }
                {isSending &&
                  <button className="btn-primary font-pixel">
                    <svg role="status" className="inline mr-3 w-4 h-4 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                    </svg>Sending</button>}


                {signature != '' &&
                  <div className="font-pixel text-xl mt-4">
                    ✅ Successfuly sent! Check it <a target="_blank" href={'https://solscan.io/tx/' + signature}><strong className="underline">here</strong></a>
                  </div>
                }

                {Error != '' && <div className="mt-4 font-pixel text-xl">❌ {Error}</div>}
              </div>}

            {CurrencyType == 'domain' &&
              <div>

                <h1 className="font-bold mb-5 text-3xl uppercase">Domains sending</h1>
                <form className="mt-[3%] mb-[2%]">

                  <input className="mb-[2%] md:w-[480px] text-center mx-4 input input-bordered font-pixel"
                    type="text"
                    required
                    placeholder="Receiver Address"
                    onChange={(e) => setReceiverAddress(e.target.value)}
                    style={{
                      borderRadius:
                        "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                    }}
                  />

                  <div>
                    <input className="mb-[1%] md:w-[480px] text-center mx-4 input input-bordered font-pixel"
                      type="text"
                      required
                      placeholder=".sol domain name #1"
                      onChange={(e) => setToken1(e.target.value)}
                      style={{
                        borderRadius:
                          "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                      }}
                    />
                  </div>

                  <div>
                    <input className="mb-[1%] md:w-[480px] text-center mx-4 input input-bordered font-pixel"
                      type="text"
                      required
                      placeholder=".sol domain name #2"
                      onChange={(e) => setToken2(e.target.value)}
                      style={{
                        borderRadius:
                          "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                      }}
                    />
                  </div>

                  <div>
                    <input className="mb-[1%] md:w-[480px] text-center mx-4 input input-bordered font-pixel"
                      type="text"
                      required
                      placeholder=".sol domain name #3"
                      onChange={(e) => setToken3(e.target.value)}
                      style={{
                        borderRadius:
                          "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                      }}
                    />
                  </div>

                  <div>
                    <input className="mb-[1%] md:w-[480px] text-center mx-4 input input-bordered font-pixel"
                      type="text"
                      required
                      placeholder=".sol domain name #4"
                      onChange={(e) => setToken4(e.target.value)}
                      style={{
                        borderRadius:
                          "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                      }}
                    />
                  </div>

                  <div>
                    <input className="mb-[1%] md:w-[480px] text-center mx-4 input input-bordered font-pixel"
                      type="text"
                      required
                      placeholder=".sol domain name #5"
                      onChange={(e) => setToken5(e.target.value)}
                      style={{
                        borderRadius:
                          "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                      }}
                    />
                  </div>

                  <div>
                    <input className="mb-[1%] md:w-[480px] text-center mx-4 input input-bordered font-pixel"
                      type="text"
                      required
                      placeholder=".sol domain name #6"
                      onChange={(e) => setToken6(e.target.value)}
                      style={{
                        borderRadius:
                          "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                      }}
                    />
                  </div>

                  <div>
                    <input className="mb-[1%] md:w-[480px] text-center mx-4 input input-bordered font-pixel"
                      type="text"
                      required
                      placeholder=".sol domain name #7"
                      onChange={(e) => setToken7(e.target.value)}
                      style={{
                        borderRadius:
                          "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                      }}
                    />
                  </div>

                  <div>
                    <input className="mb-[1%] md:w-[480px] text-center mx-4 input input-bordered font-pixel"
                      type="text"
                      required
                      placeholder=".sol domain name #8"
                      onChange={(e) => setToken8(e.target.value)}
                      style={{
                        borderRadius:
                          "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                      }}
                    />
                  </div>

                  <div>
                    <input className="sm:mb-[1%] mb-2 md:w-[480px] text-center mx-4 input input-bordered font-pixel"
                      type="text"
                      required
                      placeholder=".sol domain name #9"
                      onChange={(e) => setToken9(e.target.value)}
                      style={{
                        borderRadius:
                          "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                      }}
                    />
                  </div>

                  <div>
                    <input className="sm:mb-[1%] mb-2 md:w-[480px] text-center mx-4 input input-bordered font-pixel"
                      type="text"
                      required
                      placeholder=".sol domain name #10"
                      onChange={(e) => setToken10(e.target.value)}
                      style={{
                        borderRadius:
                          "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                      }}
                    />
                  </div>
                </form>

                {!isSending &&
                  <button className="text-white font-pixel text-xl bg-[#414e63] hover:bg-[#2C3B52] w-[160px] rounded-full shadow-xl border" onClick={SendOnClickDomain}>Send</button>
                }
                {isSending &&
                  <button className="text-white font-pixel text-xl bg-[#414e63] hover:bg-[#2C3B52] w-[160px] rounded-full shadow-xl border">
                    <svg role="status" className="inline mr-3 w-4 h-4 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                    </svg>Sending</button>}


                {signature != '' &&
                  <div className="font-pixel text-xl mt-4">
                    ✅ Successfuly sent! Check it <a target="_blank" href={'https://solscan.io/tx/' + signature + '?cluster=devnet'}><strong className="underline">here</strong></a>
                  </div>
                }

                {Error != '' && <div className="mt-4 font-pixel text-xl">❌ {Error}</div>}
              </div>}

            {CurrencyType == 'csv' &&
              <div>

                <h1 className="font-bold mb-5 text-3xl uppercase">Upload CSV file</h1>
                <div className="font-pixel text-xl">The file has to respect the following order:<br /> <strong>receiver's address, token address, amount to send</strong></div>
                <form className="mt-[5%] mb-4">
                  <label htmlFor="file" className="text-white font-pixel text-xl rounded-full shadow-xl bg-[#414e63] border px-6 py-2 h-[40px] mb-[3%] uppercase hover:bg-[#2C3B52] hover:cursor-pointer">
                    Select file
                    <input
                      id="file"
                      type="file"
                      name="file"
                      accept=".csv"
                      onChange={handleFileChange}
                      style={{ display: 'none' }} />
                  </label>
                </form>

                {csvFileName != '' &&
                  <div className="text-white font-pixel text-xl mb-2">{csvFileName} uploaded!</div>
                }

                {!isSending && csvFileIsUploaded &&
                  <button className="mt-4 text-white font-pixel text-xl bg-[#414e63] hover:bg-[#2C3B52] w-[160px] rounded-full shadow-xl border" onClick={SendOnClickCsv}>Send</button>
                }
                {isSending &&
                  <button className="mt-4 text-white font-pixel text-xl bg-[#414e63] hover:bg-[#2C3B52] w-[160px] rounded-full shadow-xl border">
                    <svg role="status" className="inline mr-3 w-4 h-4 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                    </svg>Sending</button>}


                {csvSendingSuccess &&
                  <div className="font-pixel text-xl mt-4">
                    ✅ Successfuly sent!
                  </div>
                }

                {isSending && currentTx != 0 && totalTx != 0 &&
                  <div className='font-pixel mt-4 mb-2 text-xl'>Please confirm Tx: {currentTx}/{totalTx}</div>

                }

                {Error != '' && <div className="mt-4 font-pixel text-xl">❌ {Error}</div>}
              </div>}

          </div>
        </div>
      </div>
    </div>
  );
};