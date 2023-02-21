import { FC, useState, useEffect } from "react";
import useSWR from "swr";
import { EyeOffIcon } from "@heroicons/react/outline";

import { fetcher } from "utils/fetcher";
import { Metaplex, bundlrStorage, walletAdapterIdentity, MetaplexFileTag, toMetaplexFileFromBrowser, MetaplexFile } from "@metaplex-foundation/js";
import { PublicKey } from "@solana/web3.js";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LegitOrScam } from '../../utils/LegitOrScam';
import { SelectBurnButton } from '../../utils/SelectBurnButton';
import { SelectSendButton } from '../../utils/SelectSendButton';

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
  toBurn: any;
  toSend: any;
};

export const CollageNftCard: FC<Props> = ({
  details,
  isConnectedWallet,
  onSelect,
  onTokenDetailsFetched = () => { },
  toBurn,
  toSend
}) => {
  const [fallbackImage, setFallbackImage] = useState(false);

  const { name, uri } = details?.data ?? {};

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

  useEffect(() => {
    //CheckRarity(`https://fudility.xyz:3420/rarity/${details.updateAuthority}/${tokenMintAddress}`)
    if (!error && !!data) {
      onTokenDetailsFetched(data);
    }
  }, [data, error]);

  const onImageError = () => setFallbackImage(true);
  const { image, description } = data ?? {};

  const tokenMintAddress = details.mint;
  const [rarityData, setRarityData] = useState<any>()

  //RARITY RANKING  
  async function CheckRarity(url: string) {
    try {
      const response = await fetch(url)
      setRarityData(await response.json())
    } catch (e) {
      console.log(e)
    }
  }

  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const wallet = useWallet();

  const creators = details.data?.creators;
  let firstCreator;
  if (creators != undefined) {
    firstCreator = details.data?.creators[0].address;
  }
  else {
    firstCreator = tokenMintAddress;
  }

  const [floor, setFloor] = useState("-")
  const handleChangeFloor = (val: string) => {
    setFloor(val)
    CalcProfit(val)
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
  async function CalcProfit(flo: string) {
    try {
      const sFee: number = parseFloat(details.data?.sellerFeeBasisPoints) / 100
      const mFee: number = 2
      const f: number = parseFloat(flo)
      var p: any = (f - (f / 100 * (sFee + mFee))).toFixed(3)
      handleChangeProfit(p.toString())
    } catch (e) {
      console.log(e)
    }
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
          console.log("yesser!!!!!")
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

  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  function toggleUpdateMetadataModal() {
    setIsUpdateOpen(!isUpdateOpen);
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

  return (
    <div className="text-center">
      <figure className="animation-pulse-color">
        {!fallbackImage && !error ? (
          <div>
            <a onClick={toggleModal} className="hover:cursor-pointer">
              <img
                src={image}
                onError={onImageError}
                className="object-cover rounded hover:border-2 border-primary"
              />
              {rarityData &&
                <div>
                  <span className="absolute top-[1rem] left-[1rem] bg-gray-900 bg-opacity-50 p-1 rounded">
                    <p className="font-pixel text-md text-center">#{rarityData?.Rank}</p>
                  </span>
                  <span className="absolute bottom-[1rem] right-[1rem] bg-gray-900 bg-opacity-50 bg-o p-1 rounded">
                    <p className="font-pixel text-md text-center">{rarityData?.Score}</p>
                  </span>
                </div>
              }
            </a>
          </div>
        ) : (
          // Fallback when preview isn't available. This could be broken image, video, or audio
          <div>
            <div className="w-auto flex items-center justify-center">
              <a onClick={toggleModal} className="hover:cursor-pointer">
                <img
                  src={image}
                  onError={onImageError}
                  className="object-cover rounded text-center"
                />
                <EyeOffIcon className="h-38 w-38 text-white" />
              </a>
            </div>
          </div>
        )}
      </figure>
      <Modal
        isOpen={isOpen}
        onRequestClose={toggleModal}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)'
          },
          content: {
            top: '58%',
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
        contentLabel="NFT Details"
      >
        <div className="flex justify-between mb-2">
          <div />
          <a href={`https://explorer.solana.com/address/${tokenMintAddress}`} target="_blank">
            <p className="font-pixel text-bold text-lg text-center hover:text-red-300">{name}</p>
          </a>
          <button className="font-pixel text-white btn btn-xs btn-primary" onClick={toggleModal}>X</button>
        </div>
        <div className="lg:grid lg:grid-cols-2 mb-3">
          {!fallbackImage && !error ? (
            <Zoom
              img={image}
              zoomScale={3}
              width={350}
              height={350}
              className="rounded"
              onError={onImageError}
            />
          ) : (
            <div className="w-auto h-48 flex items-center justify-center">
              <EyeOffIcon className="h-24 w-24 text-white" />
            </div>
          )}
          <div className="w-full grid content-center">
            <div className="lg:bg-gray-700 font-pixel rounded-lg p-2">
              <div className="bg-gray-700 font-pixel rounded-lg p-2 hidden lg:block">
                <div className="flex justify-between">
                  <p>Mint:</p>
                  <button className="hover:text-red-300" onClick={(e: any) => copyAddress(details.mint)}>
                    {(details.mint).slice(0, 5) + "..." + (details.mint).slice(-5)}
                  </button>
                </div>
                <div className="flex justify-between">
                  <p>Update Authority:</p>
                  <button className="hover:text-red-300" onClick={(e: any) => copyAddress(details.updateAuthority)}>
                    {(details.updateAuthority).slice(0, 5) + "..." + (details.updateAuthority).slice(-5)}
                  </button>
                </div>
                <div className="flex justify-between">
                  <p>Verified Creator:</p>
                  {details.data.creators != undefined &&
                    <button className="hover:text-red-300" onClick={(e: any) => copyAddress(details.data.creators[0].address)}>
                      {(details.data.creators[0].address).slice(0, 5) + "..." + (details.data.creators[0].address).slice(-5)}
                    </button>
                  }
                </div>
                <div className="flex justify-between">
                  <p>Creators:</p>
                  {details.data.creators != undefined &&
                    <div>{details.data.creators.length}</div>
                  }
                </div>
                <div className="flex justify-between">
                  <p>Royalties:</p>
                  <p>{(data?.seller_fee_basis_points) / 100}%</p>
                </div>
                <br />
                <div className="">
                  <a href={`${data?.external_url}`} target="_blank">
                    <p className="font-pixel text-bold text-center text-sm hover:text-red-300">{data?.external_url}</p>
                  </a>
                </div>
              </div>
              <div className="block lg:hidden">
                {collectionName != "-" ? (
                  <div className="text-center">{collectionName != undefined ? (
                    <button className="btn btn-primary">
                      <a href={`https://magiceden.io/marketplace/${collectionName}`} target="_blank">
                        <div className="flex">
                          <p className="font-pixel text-lg">View on Magic Eden</p>
                        </div>
                      </a>
                    </button>) : (
                    <p className="font-pixel bg-red-600 p-2 rounded-md">not on MagicEden</p>
                  )}</div>
                ) : (<LoadingSVG />)}
              </div>
            </div>

          </div>
        </div>

        <div className="hidden lg:block">
          <Tabs>
            <TabList>
              <Tab><h1 className="font-pixel">Attributes</h1></Tab>
              <Tab><h1 className="font-pixel">Token Data</h1></Tab>
              <Tab><h1 className="font-pixel">Metadata</h1></Tab>
              <Tab><h1 className="font-pixel">Recent Sales</h1></Tab>
              <Tab><h1 className="font-pixel">MagicEden Data</h1></Tab>
            </TabList>

            <TabPanel>
              <div className="grid grid-cols-3 gap-1 w-[50rem] h-44">
                {data?.attributes?.map((num: any, index: any) => (
                  <div key={index}>
                    <div className="bg-gray-700 font-pixel text-sm rounded p-1 flex justify-between h-full">
                      <div className="text-bold underline">{num.trait_type}:</div>
                      <div>{num.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </TabPanel>

            <TabPanel>
              <React.Fragment>
                <div className="overflow-auto h-44 w-[50rem] scrollbar text-xs rounded-lg">
                  {typeof document !== 'undefined' && ReactJson && <ReactJson src={details} theme="monokai" />}
                </div>
              </React.Fragment>
            </TabPanel>

            <TabPanel>
              <React.Fragment>
                <div className="overflow-auto h-44 w-[50rem] scrollbar text-xs mt-2 rounded-lg">
                  {typeof document !== 'undefined' && ReactJson && <ReactJson src={data} theme="monokai" />}
                </div>
              </React.Fragment>
            </TabPanel>

            <TabPanel>
              <div className="bg-gray-800 rounded h-44 w-[50rem] ">
                <Line options={options} data={chartData} height="60px" />
              </div>
            </TabPanel>

            <TabPanel>
              <div className="h-44 w-[50rem] p-2 bg-gray-700 rounded-lg">
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
            </TabPanel>
          </Tabs>
        </div>
      </Modal>
    </div>
  );
};

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