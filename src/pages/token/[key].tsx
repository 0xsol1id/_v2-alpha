import { useRouter } from 'next/router'
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { fetcher } from "utils/fetcher";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Metaplex, bundlrStorage, walletAdapterIdentity } from "@metaplex-foundation/js";
import { getAllDomains, getDomainKey, NameRegistryState, performReverseLookup } from "@bonfida/spl-name-service";
import { NftTokenAccount, useWalletNfts } from '@nfteyez/sol-rayz-react';
import { divideAmount, isValidPublicKeyAddress, Nft } from "@metaplex-foundation/js-next";
import { PublicKey, LAMPORTS_PER_SOL, TokenBalance, Transaction, TransactionInstruction, SystemProgram } from "@solana/web3.js";

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import { MainMenu } from "../../utils/mainmenu"
import { randomWallets } from "../../utils/wallets"
import { Footer } from '../../utils/footer';
import Link from "next/link";
import { ConnectWallet } from "components";
import Modal from 'react-modal';
import Zoom from 'react-img-zoom'
import { SingleBurnButton } from '../../utils/SingleBurnButton';

import { CommercialAlert } from "utils/CommercialAlert";

import { LoadRarityFile } from '../../utils/LoadRarityFiles'
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

function randomInt(low: number, high: number) {
  return Math.floor(Math.random() * (high - low) + low)
}

const Token = () => {
  const router = useRouter()
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const owner = useWallet();

  const metaplex = Metaplex.make(connection)
    .use(walletAdapterIdentity(owner))
    .use(bundlrStorage());

  const { key } = router.query
  const tokenMint: string | string[] = key !== undefined ? key : '';

  const [refresh, setRefresh] = useState(false)

  const [fallbackImage, setFallbackImage] = useState(false);
  //get the nft object of the NFT
  const [details, setDetails] = useState<any>()
  const [uri, setUri] = useState('');
  const [updateAuthority, setUpdateAuthority] = useState('');
  const [tokenMintAddress, setTokenMintAddress] = useState('');
  const [image, setImage] = useState<any>()
  const [verifiedCreator, setVerifiedCreator] = useState('');
  const [rarityData, setRarityData] = useState<any>()
  const [traitData, setTraitData] = useState<any>()
  const [burnThis, setBurnThis] = useState<string[]>([])
  const getMetadata = async () => { 
    try {
      const mintPublickey = new PublicKey(tokenMint);
      //get the nft object of the NFT
      const nft = await metaplex.nfts().findByMint({ mintAddress: mintPublickey })
      setDetails(nft)
      setUri(nft.uri)
      setVerifiedCreator(nft.creators[0].address.toBase58())
      setUpdateAuthority(nft.updateAuthorityAddress.toBase58())
      setTokenMintAddress(nft.address.toBase58())
      setImage(nft.json?.image)
      GetCollectionName(`https://fudility.xyz:3420/collectionname/${nft.address.toBase58()}`)
      setBurnThis([nft.address.toBase58()])

      if (nft.updateAuthorityAddress.toBase58() == "EshFf23GMA55yKPCQm76KrhSyfp7RuAsjDDpHE7wTeDM") {
        setRarityData(junks[0].nfts.find((element: { MintHash: any; }) => element.MintHash === nft.address.toBase58()))
        setTraitData(junks[0].traitOccurence[0])
      }
      if (nft.updateAuthorityAddress.toBase58() == "FEtQrCx12b9ebbTZq8Un11RNJUYxiDQF4zQCJctzRYH6") {
        setRarityData(smb[0].nfts.find((element: { MintHash: any; }) => element.MintHash === nft.address.toBase58()))
        setTraitData(smb[0].traitOccurence[0])
      }
      if (nft.updateAuthorityAddress.toBase58() == "8DQoDXZvWrUHjp4DbjFTW8AhXsdTBgYVicwieJ6FzKVe") {
        setRarityData(faces[0].nfts.find((element: { MintHash: any; }) => element.MintHash === nft.address.toBase58()))
        setTraitData(faces[0].traitOccurence[0])
      }
      /*if (updateAuthority == "5XZrWyd6hmMcUScak7S2ef92rQW4hftkJDMDg6uYHssp") {
        CheckRarity(2, tokenMintAddress)
      }*/
      if (nft.updateAuthorityAddress.toBase58() == "PnsQRTnqXBPshHpPj2kHWZwyrWABa5GTrPA6MDkwV4p") {
        setRarityData(rektiez[0].nfts.find((element: { MintHash: any; }) => element.MintHash === nft.address.toBase58()))
        setTraitData(rektiez[0].traitOccurence)
      }
    }
    catch (error) {
      const err = (error as any)?.message;
      console.log(err)
    }
  }

  const onImageError = () => setFallbackImage(true);
  //const { name, image } = data ?? {};

  const [floor, setFloor] = useState("-")
  const handleChangeFloor = (val: string) => {
    setFloor(val)
  }
  async function CheckFloor(url: string) {
    try {
      const response = await fetch(url)
      const jsonData = await response.json()
      handleChangeFloor((parseFloat(jsonData?.floorPrice) / 1000000000).toString())
      handleChangeListed(jsonData?.listedCount.toString())
      handleChangeVolume((parseFloat(jsonData?.volumeAll) / 1000000000).toFixed(2).toString())
    } catch (e) {
      console.log(e)
    }
  }

  const [profit, setProfit] = useState("-")
  const handleChangeProfit = (val: string) => {
    setProfit(val)
  }

  const [collectionName, setcollectionName] = useState("-")
  const handleChangecollectionName = (val: string) => {
    if (collectionName != null) {
      CheckFloor(`https://fudility.xyz:3420/checkfloor/${val}`)
      GetpriceHistory(`https://fudility.xyz:3420/pricehistory/${val}`)
    }
    else
      handleChangeFloor("NaN")

    setcollectionName(val)
  }
  async function GetCollectionName(url: string) {
    try {
      const response = await fetch(url)
      const jsonData = await response.json()
      handleChangecollectionName(jsonData?.collection)
    } catch (e) {
      console.log(e)
    }
  }

  const [listed, setListed] = useState("-")
  const handleChangeListed = (val: string) => {
    setListed(val)
  }
  const [volume, setVolume] = useState("-")
  const handleChangeVolume = (val: string) => {
    setVolume(val)
  }

  const [priceHistory, setpriceHistory] = useState([])
  const handleChangepriceHistory = (val: []) => {
    setpriceHistory(val)
  }
  const [labelHistory, setLabelHistory] = useState([11, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 11, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 11, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 11, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 11, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 11, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 11, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 11, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 11, 1, 1, 1, 1, 1, 1])
  const handleChangeLabelHistory = (val: []) => {
    setLabelHistory(val)
  }
  async function GetpriceHistory(url: string) {
    try {
      var prices: any = []
      var label: any = []
      const response = await fetch(url)
      const jsonData = await response.json()

      jsonData?.forEach((element: any) => {
        if (element.type == "buyNow") {
          prices.push(element.price)
          label.push(convertTimestamp(element.blockTime))
        }
      });
      handleChangepriceHistory(prices.reverse())
      handleChangeLabelHistory(label.reverse())
    } catch (e) {
      console.log("PNSQRT: " + e)
      console.log("PNSQRT")
    }
  }

  //const [chartData, setChartData] = useState({});
  var labels = [11, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 11, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false //This will do the task
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 10,
          beginAtZero: true,
          display: false
        }
      },
      y: {
        grid: {
          color: 'rgba(17,17,17,1)',
          lineWidth: 0.5
        },
        ticks: {
          color: 'white'
        }
      }
    },
    drawOnChartArea: true,
  };
  var chartData = {
    labels: labelHistory,
    datasets: [
      {
        label: 'Sold for',
        data: priceHistory,
        borderColor: 'rgb(121, 62, 249, 1)',
        backgroundColor: 'rgba(250, 250, 250, 0.75)',
      },
    ],
  }

  //Update Metadata  

  const [NFTAddress, setNFTAddress] = useState('');
  const [NFTName, setNFTName] = useState('');
  const [NFTSymbol, setNFTSymbol] = useState('');
  const [NFTuri, setNFTuri] = useState('');
  const [NFTSellerFee, setNFTSellerFee] = useState(0);
  const [NFTDescription, setNFTDescription] = useState('');
  const [NFTImage, setNFTImage] = useState('');
  const [isUpdateAuthority, setIsUpdateAuthority] = useState<boolean>(false);
  const [errorUpdate, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [newName, setNewName] = useState('');
  const [newSymbol, setNewSymbol] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newRoyalties, setNewRoyalties] = useState('');
  const [newImageURI, setNewImageURI] = useState('');
  const [newAnimationURI, setNewAnimationURI] = useState('');
  const [newExternalURL, setNewExternalURL] = useState('');
  const [attributesList, setAttributesList] = useState([{ trait_type: "", value: "" }]);

  const [imageFormat, setImageFormat] = useState('png');
  const [animationFormat, setAnimationFormat] = useState('mp4');

  // allow to fetch the current metadata of the NFT
  const fetchMetadata = async () => {

    setError('')

    try {
      const mintPublickey = new PublicKey(tokenMintAddress);
      //get the nft object of the NFT
      const nft = await metaplex.nfts().findByMint({ mintAddress: mintPublickey })
      //get the update authority of the NFT
      const authority = nft.updateAuthorityAddress.toBase58()
      // get the current NFT name
      const name = nft.name
      setNFTName(name)
      console.log(nft.name)
      // get the current NFT symbol
      const symbol = nft.symbol
      setNFTSymbol(symbol)
      // get the current NFT uri
      const uri = nft.uri
      setNFTuri(uri)
      // get the current NFT seller fee
      const sellerFee = nft.sellerFeeBasisPoints
      setNFTSellerFee(sellerFee)
      // get the current NFT description
      const description = nft.json?.description
      if (description != undefined && description != '') {
        setNFTDescription(description)
      }
      else {
        setNFTDescription('No description provided for this NFT')
      }

      // get the current NFT image
      const image = nft.json?.image
      if (image != undefined) {
        setNFTImage(image)
      }

      // check if the user is the update authority of the NFT
      if (authority == publicKey?.toBase58()) {
        setIsUpdateAuthority(true)
      }
      else {
        setIsUpdateAuthority(false)
      }

    }

    catch (error) {
      const err = (error as any)?.message;
      console.log(err)
      setError(err)
    }
  }

  // allow to reset the states
  const reset = () => {
    setNFTAddress('')
    setNFTName('')
    setNFTDescription('')
    setNFTImage('')
    setError('')
    setIsUpdateAuthority(false)
    setNewName('')
    setNewDescription('')
    setNewRoyalties('')
    setNewSymbol('')
    setNewImageURI('')
    setNewAnimationURI('')
    setNewExternalURL('')
    setAttributesList([{ trait_type: "", value: "" }])
    setSuccess(false)
    setIsUpdating(false)
  }

  // handle when the user changes an attribute field
  const handleAttributesChange = (e: any, index: any) => {
    const { name, value } = e.target;
    const list: any = [...attributesList];
    list[index][name] = value;
    setAttributesList(list);
  };

  // handle when the user deletes an attribute field
  const handleRemoveClick = (index: any) => {
    const list = [...attributesList];
    list.splice(index, 1);
    setAttributesList(list);
  };

  //handle when the user adds an attribute field
  const handleAddClick = () => {
    setAttributesList([...attributesList, { trait_type: "", value: "" }]);
  };


  // allow to update the NFT metadata
  const update = async () => {
    try {
      setIsUpdating(true)
      setSuccess(false)
      setError('')
      const mintPublickey = new PublicKey(NFTAddress);
      // get the current NFT metadata
      const nft = await metaplex.nfts().findByMint({ mintAddress: mintPublickey })
      const jsonMetadata = nft.json

      // define the object which contains the current NFT metadata
      const newMetadata = { ...jsonMetadata }
      // define the object which contains the files attached to the NFT
      const newFiles: any[] = []

      let newOnChainName: string = NFTName
      let newOnChainSymbol: string = NFTSymbol
      let newOnChainuri: string = NFTuri
      let newOnChainSellerFee: number = NFTSellerFee

      // if a field is not empty, we change its value in the appropriate object
      if (newName != '') {
        newMetadata.name = newName
        newOnChainName = newName
      }

      if (newSymbol != '') {
        newMetadata.symbol = newSymbol
        newOnChainSymbol = newSymbol

      }

      if (newDescription != '') {
        newMetadata.description = newDescription
      }

      if (newRoyalties != '') {
        newMetadata.seller_fee_basis_points = parseFloat(newRoyalties) * 100
        newOnChainSellerFee = parseFloat(newRoyalties) * 100
      }

      if (newImageURI != '') {
        newMetadata.image = newImageURI + '?ext=' + imageFormat
        newFiles.push({
          uri: newImageURI + '?ext=' + imageFormat,
          type: "image/" + imageFormat
        })
      }
      else {
        const currentfiles = jsonMetadata!.properties?.files
        if (currentfiles != undefined) {
          for (let i = 0; i < currentfiles.length; i++) {
            if (currentfiles[i]['type']?.includes('image/')) {
              newFiles.push(currentfiles[i])
            }
          }
        }
      }

      if (newAnimationURI != '') {
        newMetadata['animation_url'] = newAnimationURI + '?ext=' + animationFormat
        let animationType: string = ''

        if (animationFormat == 'mp4' || animationFormat == 'mov') {
          animationType = "video/"
        }

        else if (animationFormat == 'glb' || animationFormat == 'gltf') {
          animationType = "model/"
        }

        newFiles.push({
          uri: newAnimationURI + '?ext=' + animationFormat,
          type: animationType + animationFormat
        })
      }
      else {
        const currentfiles = jsonMetadata!.properties?.files
        if (currentfiles != undefined) {
          for (let i = 0; i < currentfiles.length; i++) {
            if (currentfiles[i]['type']?.includes('video/') || currentfiles[i]['type']?.includes('model/')) {
              newFiles.push(currentfiles[i])
            }
          }
        }
      }

      if (newExternalURL != '') {
        newMetadata.external_url = newExternalURL
      }

      if (newFiles.length != 0) {
        newMetadata.properties!.files = newFiles
      }

      // define the object which will contains the new attributes
      const Attributes: any[] = []

      // allow to filter the fields where information is missing
      for (let i = 0; i < attributesList.length; i++) {
        if (attributesList[i]['trait_type'] != '' && attributesList[i]['value'] != '') {
          Attributes.push(attributesList[i])
        }
      }

      if (Attributes.length != 0) {
        newMetadata.attributes = Attributes
      }

      // upload the new NFT metadata and get the new uri
      const { uri: newUri } = await metaplex
        .nfts()
        .uploadMetadata(newMetadata);

      if (newUri) {
        console.log(newUri)
        newOnChainuri = newUri

      }

      // update the NFT metadata with the new uri
      const updatedNft = await metaplex
        .nfts()
        .update({
          nftOrSft: nft,
          name: newOnChainName,
          symbol: newOnChainSymbol,
          uri: newOnChainuri,
          sellerFeeBasisPoints: newOnChainSellerFee,
        });

      if (updatedNft) {
        fetchMetadata()
        setIsUpdating(false)
        setSuccess(true)
        console.log('success')
      }
    }
    catch (error) {
      const err = (error as any)?.message;
      console.log(err)
      setError(err)
      setIsUpdating(false)
    }
  }

  const copyAddress = async (val: any) => {
    await navigator.clipboard.writeText(val);
  }

  const inputRef = useRef<any>(null);

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

  const [value, setValue] = useState("")
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

  useEffect(() => {
    getMetadata()
  }, []);

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
            </div>
          </div>

          {/* CONTENT */}
          <div className="col-span-2 border-2 border-opacity-20">
            <div className="font-pixel navbar sticky top-0 z-40 text-neutral-content flex justify-between gap-2 bg-gray-900 bg-opacity-50 backdrop-blur border-b-2 border-opacity-20">
              <div className=''>
                <button onClick={() => router.back()}>🔙</button>
                <div className="">
                  <img src='/static/images/heads/1.png' className="w-8 h-8 mr-5" alt="tmp" />
                </div>
                <div className='grid'>
                  {details?.name}
                  <div className='flex justify-between'>
                    <h1 className='text-xs'>{key}</h1>
                  </div>
                  <div className='flex justify-between'>
                    <div className='flex'>
                    </div>
                  </div>
                </div>
              </div>
              <SingleBurnButton toBurn={burnThis} connection={connection} publicKey={publicKey} wallet={owner} setRefresh={setRefresh} />
            </div>
            <div className="font-pixel p-2 text-center">              
            <img src={details?.json.image} alt="tmp" className='w-5/6' />
            </div>
          </div>

          {/* RIGHT BAR */}
          <div className="col-span-1 bg-gray-900 h-full p-2">
            <Tabs>
              <TabList>
                <Tab><h1 className="font-pixel">INFO</h1></Tab>
                <Tab><h1 className="font-pixel">ATTRIBUTES</h1></Tab>
                <Tab><h1 className="font-pixel">COMMENTS</h1></Tab>
                <Tab><h1 className="font-pixel">UPDATE</h1></Tab>
              </TabList>

              <TabPanel>
                <div className="w-full grid content-center">
                  <div className="font-pixel rounded-lg p-3">
                    <div className="bg-gray-700 font-pixel rounded-lg p-2 hidden lg:block">{/* DESKTOP VIEW */}
                      <div className="flex justify-between">
                        <p>Mint:</p>
                        <button className="hover:text-red-300" onClick={(e: any) => copyAddress(tokenMintAddress)}>
                          {(tokenMintAddress).slice(0, 5) + "..." + (tokenMintAddress).slice(-5)}
                        </button>
                      </div>
                      <div className="flex justify-between">
                        <p>Update Authority:</p>
                        <button className="hover:text-red-300" onClick={(e: any) => copyAddress(updateAuthority)}>
                          {(updateAuthority).slice(0, 5) + "..." + (updateAuthority).slice(-5)}
                        </button>
                      </div>
                      <div className="flex justify-between">
                        <p>Verified Creator:</p>
                        {verifiedCreator != undefined &&
                          <button className="hover:text-red-300" onClick={(e: any) => copyAddress(verifiedCreator)}>
                            {verifiedCreator.slice(0, 5) + "..." + verifiedCreator.slice(-5)}
                          </button>
                        }
                      </div>
                      <div className="flex justify-between">
                        <p>Royalties:</p>
                        <p>{(details?.sellerFeeBassisPoints) / 100}%</p>
                      </div>
                      <br />
                      <div className="">
                        <a href={`${details?.external_url}`} target="_blank">
                          <p className="font-pixel text-bold text-center text-sm hover:text-red-300">{details?.json.external_url}</p>
                        </a>
                      </div>
                    </div><div className="mt-2 p-2 bg-gray-700 rounded-lg">
                      <div className="text-center text-white">
                        <div className="flex justify-between mb-2">
                          <h1 className="font-pixel">Floor:</h1>
                          {floor != "-" ? (<h1 className="font-pixel">{floor}◎</h1>) : (<LoadingSVG />)}
                        </div>
                      </div>
                      <div className="text-center text-white">
                        <div className="flex justify-between mb-2">
                          <h1 className="font-pixel">Listed:</h1>
                          {listed != "-" ? (<h1 className="font-pixel">{listed}</h1>) : (<LoadingSVG />)}
                        </div>
                        <div className="flex justify-between mb-2">
                          <h1 className="font-pixel">Total Volume:</h1>
                          {volume != "-" ? (<h1 className="font-pixel">{volume}◎</h1>) : (<LoadingSVG />)}
                        </div>
                      </div>
                      {collectionName != "-" ? (
                        <div className="text-center">{collectionName != undefined ? (
                          <button className="btn btn-primary">
                            <a href={`https://magiceden.io/marketplace/${collectionName}`} target="_blank">
                              <div className="flex">
                                <p className="font-pixel text-lg">View Collection on Magic Eden</p>
                              </div>
                            </a>
                          </button>) : (
                          <p className="font-pixel bg-red-600 p-2 rounded-md">not on MagicEden</p>
                        )}</div>
                      ) : (<LoadingSVG />)}
                    </div>
                    {rarityData &&
                      <div className="bg-gray-700 rounded mt-3 p-2">
                        <div className="flex justify-between">
                          <p>Rarity Rank:</p>
                          <p>{rarityData?.Rank}</p>
                        </div>
                        <div className="flex justify-between">
                          <p>Rarity Score:</p>
                          <p>{rarityData?.Score}</p>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              </TabPanel>

              <TabPanel>
                <div className="grid gap-1">
                  {details && details.json.attributes?.map && details?.json.attributes?.map((num: any, index: any) => (
                    <div key={index}>
                      <div className="bg-gray-700 font-pixel rounded p-1 flex justify-between h-full">
                        <div className="text-bold underline">{num.trait_type}:</div>
                        <div>{num.value}</div>
                      </div>
                      {rarityData &&
                        <div>
                          <h1></h1>
                        </div>
                      }
                    </div>
                  ))}
                </div>
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

              <TabPanel>
                <div className="w-full text-center">
                  {NFTName == '' &&
                    <div className="hero items-center h-[40rem]">
                      <button className="btn btn-primary text-4xl font-pixel text-white" onClick={fetchMetadata}>Check for Authority</button>
                    </div>
                  }
                  <div className='flex'>
                    {NFTName != '' &&
                      <div className="mx-auto">
                        {!isUpdateAuthority &&
                          <div>
                            <div className="text-white font-pixel text-3xl mb-5" >You are not the update authority for this NFT</div>
                          </div>
                        }
                      </div>
                    }
                    {isUpdateAuthority == true &&
                      <div className="mx-auto">
                        <div className="mx-auto font-pixel text-3xl">Fill in the inputs you want to update</div>
                        <div className="flex flex-col m-auto">
                          <div className='flex justify-between'>
                            <label className="underline flex font-pixel">Name</label>
                            <input className="font-pixel my-[1%] md:w-[350px] text-left text-black pl-1 border-2 border-black"
                              type="text"
                              placeholder="Name of the asset"
                              maxLength={32}
                              onChange={(e) => setNewName(e.target.value)}
                            /></div>
                          <div className='flex justify-between'>
                            <label className="underline flex font-pixel">Symbol</label>
                            <input className="font-pixel my-[1%] md:w-[350px] text-left text-black pl-1 border-2 border-black"
                              type="text"
                              placeholder="Symbol of the asset"
                              maxLength={11}
                              onChange={(e) => setNewSymbol(e.target.value)}
                            /></div>
                          <div className='flex justify-between'>
                            <label className="underline flex font-pixel">Description</label>
                            <input className="font-pixel my-[1%] md:w-[350px] text-left text-black pl-1 border-2 border-black"
                              type="text"
                              placeholder="Description of the asset"
                              onChange={(e) => setNewDescription(e.target.value)}
                            /></div>
                          <div className='flex justify-between'>
                            <label className="underline flex font-pixel">Royalties</label>
                            <input className="font-pixel my-[1%] md:w-[350px] text-left text-black pl-1 border-2 border-black"
                              type="text"
                              placeholder="Percentage"
                              onChange={(e) => setNewRoyalties(e.target.value)}
                            /></div>
                          <div className="flex justify-between">
                            <div className="mr-2 flex">
                              <label className="underline flex font-pixel">Image URI</label>
                              <div className="ml-5">
                                <label className="flex font-pixel text-lg">Format</label>
                                <select className="text-black border-2 border-black rounded-lg font-pixel" value={imageFormat} onChange={(e) => setImageFormat(e.target.value)}>
                                  <option className="font-pixel text-lg" value="png">png</option>
                                  <option className="font-pixel text-lg" value="jpeg">jpg</option>
                                  <option className="font-pixel text-lg" value="gif">gif</option>
                                </select>
                              </div>
                            </div>
                            <input className="font-pixel my-[1%] md:w-[350px] text-left text-black pl-1 border-2 border-black"
                              type="text"
                              placeholder="URI pointing to the asset's logo"
                              onChange={(e) => setNewImageURI(e.target.value)}
                            />

                          </div>
                          <div className="flex justify-between">
                            <div className="mr-2 flex">
                              <label className="underline flex font-pixel">Animation URI</label>
                              <div className="ml-5">
                                <label className="flex font-pixel text-lg">Format</label>
                                <select className="text-black border-2 border-black rounded-lg font-pixel" value={animationFormat} onChange={(e) => setAnimationFormat(e.target.value)}>
                                  <option className="font-pixel text-lg" value="mp4">mp4</option>
                                  <option className="font-pixel text-lg" value="mov">mov</option>
                                  <option className="font-pixel text-lg" value="glb">glb</option>
                                  <option className="font-pixel text-lg" value="gltf">gltf</option>
                                </select>
                              </div>
                            </div>
                            <input className="font-pixel my-[1%] md:w-[350px] text-left text-black pl-1 border-2 border-black"
                              type="text"
                              placeholder="URI pointing to the asset's animation"
                              onChange={(e) => setNewAnimationURI(e.target.value)}
                            />
                          </div>
                          <div className='flex justify-between'>
                            <label className="underline flex font-pixel">External URL</label>
                            <input className="font-pixel my-[1%] md:w-[480px] text-left text-black pl-1 border-2 border-black"
                              type="text"
                              placeholder="URL pointing to an external URL defining the asset"
                              onChange={(e) => setNewExternalURL(e.target.value)}
                            /></div>
                          <div className="">
                            <div className="flex justify-between mt-3 mb-1">
                              <div className="underline flex font-pixel text-2xl">Attributes</div>
                              <button className="btn btn-primary btn-sm text-xs font-pixel" onClick={handleAddClick}>ADD</button>
                            </div>
                            <div className=' overflow-auto h-40 border'>
                              {attributesList.map((x, i) => {
                                return (
                                  <div className="md:flex items-center mt-2">
                                    <div className="flex flex-col mx-2">
                                      <input
                                        className="font-pixel my-1 md:w-[230px] text-left text-black pl-1 border-2 border-black"
                                        name="trait_type"
                                        type="text"
                                        placeholder="type"
                                        value={x.trait_type}
                                        onChange={e => handleAttributesChange(e, i)}
                                      />
                                    </div>
                                    <div className="flex flex-col mx-2">
                                      <input
                                        className="font-pixel my-1 md:w-[230px] text-left text-black pl-1 border-2 border-black"
                                        name="value"
                                        type="text"
                                        placeholder="value"
                                        value={x.value}
                                        onChange={e => handleAttributesChange(e, i)}
                                      />
                                    </div>
                                    <button className="btn btn-secondary btn-sm font-pixel bg-[#414e63] hover:bg-[#2C3B52]" onClick={() => handleRemoveClick(i)}>x</button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          {!isUpdating ?
                            <button className="btn btn-primary btn-xl mt-3 font-pixel text-2xl text-white" onClick={update} >update</button>
                            : <button className="mt-[30px] mx-auto text-white font-pixel text-xl bg-[#414e63] hover:bg-[#2C3B52] w-[160px] h-[35px] rounded-full shadow-xl border uppercase cursor-not-allowed" >
                              <svg role="status" className="inline mr-3 w-4 h-4 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                              </svg>updating...</button>}
                        </div>
                      </div>
                    }
                  </div>
                  {success && <div className="font-pixel mt-[1%]">✅ Metadata successfuly updated!</div>}
                  {errorUpdate != '' && <div className="font-pixel mt-[1%]">❌ Ohoh.. An error occurs: {errorUpdate}</div>}
                </div>
              </TabPanel>
            </Tabs>
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

export default Token

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