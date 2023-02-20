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

import { MagicEdenLogo } from "components";

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

  const creators = details.data.creators;
  let firstCreator;
  if (creators != undefined) {
    firstCreator = details.data.creators[0].address;
  }
  else {
    firstCreator = tokenMintAddress;
  }

  return (
    <div className="">
      <figure className="animation-pulse-color mb-1">
        {!fallbackImage && !error ? (
          <div>
            <img
              src={image}
              onError={onImageError}
              className="bg-gray-800 object-cover rounded"
            />
          </div>
        ) : (
          // Fallback when preview isn't available. This could be broken image, video, or audio
          <div>
            <div className="w-auto flex items-center justify-center">
              <img
                src={image}
                onError={onImageError}
                className="object-cover rounded text-center"
              />
              <EyeOffIcon className="h-25 w-25 text-white" />
            </div>
          </div>
        )}
      </figure>
    </div>
  );
};