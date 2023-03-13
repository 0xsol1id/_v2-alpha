import { FC, useState, useEffect, useCallback, SetStateAction, Dispatch, useRef } from "react";
import useSWR from "swr";
import proxy from './proxy.png'

import { fetcher } from "utils/fetcher";
import { Metaplex, bundlrStorage, walletAdapterIdentity } from "@metaplex-foundation/js";
import { PublicKey } from "@solana/web3.js";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LegitOrScam } from './LegitOrScam';
import { SelectSendButton } from './SelectSendButton';
import { SingleBurnButton } from './SingleBurnButton';

import { LoadRarityFile } from 'utils/LoadRarityFiles'
const junks: any = LoadRarityFile(0)
const smb: any = LoadRarityFile(1)
const faces: any = LoadRarityFile(2)
const rektiez: any = LoadRarityFile(3)

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import loadable from '@loadable/component';
const ReactJson = loadable(() => import('react-json-view'));

import Zoom from 'react-img-zoom'
import Modal from 'react-modal';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import React from "react";
import { MagicEdenLogo } from "components";
import Link from "next/link";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
);

Modal.setAppElement("#__next");

function convertTimestamp(timestamp: any) {
  var d = new Date(timestamp * 1000), // Convert the passed timestamp to milliseconds
    yyyy = d.getFullYear(),
    mm = ('0' + (d.getMonth() + 1)).slice(-2),  // Months are zero based. Add leading 0.
    dd = ('0' + d.getDate()).slice(-2),         // Add leading 0.
    hh = d.getHours(),
    h = hh,
    min = ('0' + d.getMinutes()).slice(-2),     // Add leading 0.
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

  // ie: 2014-03-24, 3:00 PM
  time = yyyy + '-' + mm + '-' + dd + ' / ' + h + ':' + min + ' ' + ampm;
  return time;
}

type Props = {
  details: any;
  isConnectedWallet: boolean,
  onSelect: (id: string) => void;
  onTokenDetailsFetched?: (props: any) => unknown;
  setRefresh: Dispatch<SetStateAction<boolean>>
  toBurn: any;
  toSend: any;
  selectedMode: boolean;
  toBurnChange: any;
  toBurnDelete: any;
};

export const NftCard: FC<Props> = ({
  details,
  isConnectedWallet,
  onSelect,
  onTokenDetailsFetched = () => { },
  setRefresh,
  toBurn,
  toSend,
  selectedMode,
  toBurnChange,
  toBurnDelete,
}) => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const wallet = useWallet();

  const [fallbackImage, setFallbackImage] = useState(false);

  const { uri } = details?.data ?? {};

  const { data, error } = useSWR(
    // uri || url ? getMetaUrl(details) : null,
    uri,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const updateAuthority = details.updateAuthority

  const burnThis: string[] = [details.mint]

  const onImageError = () => setFallbackImage(true);
  const { name, image } = data ?? {};

  const tokenMintAddress = details.mint;
  const [rarityData, setRarityData] = useState<any>()

  //RARITY RANKING  
  async function CheckRarity(id: number, mint: string) {
    if (id == 0) {
      setRarityData(junks[0].nfts.find((element: { MintHash: any; }) => element.MintHash === tokenMintAddress))
    }
    else if (id == 1) {
      setRarityData(smb[0].nfts.find((element: { MintHash: any; }) => element.MintHash === tokenMintAddress))
    }
    else if (id == 2) {
      setRarityData(faces[0].nfts.find((element: { MintHash: any; }) => element.MintHash === tokenMintAddress))
    }
    else if (id == 3) {
      setRarityData(rektiez[0].nfts.find((element: { MintHash: any; }) => element.MintHash === tokenMintAddress))
    }
  }

  useEffect(() => {
    if (updateAuthority == "EshFf23GMA55yKPCQm76KrhSyfp7RuAsjDDpHE7wTeDM") {
      CheckRarity(0, tokenMintAddress)
    }
    if (updateAuthority == "FEtQrCx12b9ebbTZq8Un11RNJUYxiDQF4zQCJctzRYH6") {
      CheckRarity(1, tokenMintAddress)
    }
    if (updateAuthority == "8DQoDXZvWrUHjp4DbjFTW8AhXsdTBgYVicwieJ6FzKVe") {
      CheckRarity(2, tokenMintAddress)
    }
    /*if (updateAuthority == "5XZrWyd6hmMcUScak7S2ef92rQW4hftkJDMDg6uYHssp") {
      CheckRarity(2, tokenMintAddress)
    }*/
    if (updateAuthority == "PnsQRTnqXBPshHpPj2kHWZwyrWABa5GTrPA6MDkwV4p") {
      CheckRarity(3, tokenMintAddress)
    }
    if (!error && !!data) {
      onTokenDetailsFetched(data);
    }
  }, [data, error]);

  const creators = details.data?.creators;
  let firstCreator;
  if (creators != undefined) {
    firstCreator = details.data?.creators[0].address;
  }
  else {
    firstCreator = tokenMintAddress;
  }

  const [collectionName, setcollectionName] = useState("-")
  const handleChangecollectionName = (val: string) => {
    if (collectionName != null) {
      GetpriceHistory(`https://fudility.xyz:3420/pricehistory/${val}`)
    }

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

  const [isOpen, setIsOpen] = useState(false);
  function toggleModal() {
    GetCollectionName(`https://fudility.xyz:3420/collectionname/${details.mint}`)
    setIsOpen(!isOpen);
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

  const copyAddress = async (val: any) => {
    await navigator.clipboard.writeText(val);
  }

  const [isSelected, setIsSelected] = useState(false);
  const handleIsSelectedChange = (val: boolean) => {
    setIsSelected(val);
  };

  const handleSelectChange = useCallback((nft, name, image) => {
    toBurnChange(nft, name, image)
  }, [toBurnChange])

  const handleSelectDelete = useCallback((nft, name, image) => {
    toBurnDelete(nft, name, image)
  }, [toBurnDelete])

  useEffect(() => {
    if (toBurn.includes(tokenMintAddress))
      handleIsSelectedChange(true)
    else
      handleIsSelectedChange(false)
  }, [toBurnChange])

  const [comments, setComments] = useState([
    {
      wallet: "4ZVYJvxt9b6fpRTpMTHQnE3jHWEmLx8wjLYYMBKAgNc9",
      timestamp: "1678181463",
      comment: "This NFT sucks, pls burn it!"
    },
  ])

  const addComment = (com: any) => {
    inputRef.current.value = ""
    const user: any = publicKey?.toBase58()
    const time: any = new Date().getTime() / 1000
    setComments(state => [...state, {
      wallet: user,
      timestamp: time,
      comment: com
    }])
  }

  const inputRef = useRef<any>(null);

  return (
    <div className="text-center">
      <figure className="animation-pulse-color">
        {!fallbackImage && !error ? (
          <div className="relative ">
            <a href="#" className="relative">
              <div className="flex flex-wrap content-center w-full h-full">
                <img src={image} className="mx-auto rounded" alt="" />
              </div>
            </a>
            {!selectedMode ? (
              <Link passHref href={`/token/${tokenMintAddress}`}>
                <div className="hover:cursor-pointer absolute inset-0 text-center flex flex-col items-center justify-center opacity-0 hover:opacity-100 bg-opacity-90 duration-300 hover:border-2 border-primary rounded">
                  <h1 className="tracking-wider font-pixel bg-black bg-opacity-60 rounded p-3 text-xs border-2 border-opacity-20" >
                    {name ? (
                      <div>
                        <p className="font-pixel text-2xs lg:text-md text-center">{name}</p>

                      </div>
                    ) : (
                      <p>...no name...</p>
                    )}
                  </h1>
                </div>
              </Link>
            ) : (
              <div>
                {!isSelected &&
                  <a onClick={() => { handleSelectChange(tokenMintAddress, name, image) }} className="hover:cursor-pointer absolute inset-0 text-center flex flex-col items-center justify-center opacity-0 hover:opacity-100 bg-opacity-90 duration-300 hover:border-2 border-primary rounded tooltip" data-tip="Select to burn">
                    {publicKey && isConnectedWallet &&
                      <img src="/static/images/sol.png" className='tracking-wider text-9xl w-full h-full' alt="tmp" />
                    }
                  </a>
                }
                {isSelected &&
                  <a onClick={() => { handleSelectDelete(tokenMintAddress, name, image) }} className="hover:cursor-pointer absolute inset-0 text-center flex flex-col items-center justify-center hover:border-2 border-primary rounded">
                    {publicKey && isConnectedWallet &&
                      <img src="/static/images/sol.png" className='bg-red-900 bg-opacity-70 text-9xl w-full h-full' alt="tmp"></img>
                    }
                  </a>
                }
              </div>
            )}
          </div>
        ) : (
          // Fallback when preview isn't available. This could be broken image, video, or audio
          <div>
            <div className="relative ">
              <a href="#" className="relative">
                <div className="flex flex-wrap content-center">
                  <img src={proxy.src} className="mx-auto rounded bg-gray-900" alt="" />
                </div>
              </a>
              <a onClick={toggleModal} className="hover:cursor-pointer absolute inset-0 text-center flex flex-col items-center justify-center opacity-0 hover:opacity-100 bg-opacity-90 duration-300 hover:border-2 border-primary rounded">
                <div>
                  <h1 className="tracking-wider font-pixel bg-black bg-opacity-40 rounded p-1 text-xs border-2 border-opacity-20" >
                    {name ? (
                      <p>{name}</p>
                    ) : (
                      <p>...no name...</p>
                    )}
                  </h1>
                </div>
              </a>
            </div>
          </div>
        )}
      </figure>
    </div>
  );
};