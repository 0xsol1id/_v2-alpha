import { FC, useEffect, useState } from "react";
import useSWR from "swr";
import { EyeOffIcon } from "@heroicons/react/outline";
import { fetcher } from "utils/fetcher";
import { MagicEdenLogo } from "components";
import { LegitOrScam } from '../../utils/LegitOrScam';

type CollectionProps = {
  ua: string
  uri: string
  mint: string
  onTokenDetailsFetched?: (props: any) => unknown;
};

export const CollectionCard: FC<CollectionProps> = ({
  ua,
  uri,
  mint,
  onTokenDetailsFetched = () => { },
}) => {
  const [fallbackImage, setFallbackImage] = useState(false);
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
    if (!error && !!data) {
      onTokenDetailsFetched(data);
    }
  }, [data, error]);

  const onImageError = () => setFallbackImage(true);
  const [shortUpdateAuthority, setShortUpdateAuthority] = useState("")
  const { image, external_url } = data ?? {};

  const [collectionName, setcollectionName] = useState("")
  const handleChangecollectionName = (val: string) => {
    setcollectionName(val)
  }
  async function GetCollectionName(url: string) {
    try {
      const response = await fetch(url)
      const jsonData = await response.json()
      if (jsonData.collection)
        handleChangecollectionName(jsonData.collection)
      else
        setShortUpdateAuthority(ua.slice(0, 3) + "..." + ua.slice(-3))
    } catch (e) {
      console.log(e)
    }
  }

  const test = () => {

  }

  useEffect(() => {
    GetCollectionName(`https://fudility.xyz:3420/collectionname/${mint}`)
  }, []);

  return (
    <div className="rounded bg-gray-900 p-1 border-2 border-gray-700 text-center">
      <figure className="animation-pulse-color mb-1">
        {!fallbackImage && !error ? (
          <div>
            <button onClick={test} className="btn btn-ghost h-44 p-1 tooltip tooltip-top font-pixel" data-tip="Show details">
              <img
                src={image}
                onError={onImageError}
                className="bg-gray-800 object-cover rounded h-40"
              />
            </button>
          </div>
        ) : (
          // Fallback when preview isn't available. This could be broken image, video, or audio
          <div>
            <div className="w-auto flex items-center justify-center">
              <button onClick={test} className="btn btn-ghost h-44 w-40 p-0 tooltip tooltip-top font-pixel" data-tip="Show details">
                <img
                  src={image}
                  onError={onImageError}
                  className="object-cover rounded text-center"
                />
                <EyeOffIcon className="h-38 w-38 text-white" />
              </button>
            </div>
          </div>
        )}
      </figure>
      <h2 className="font-pixel text-sm mb-2">
        {collectionName.replace(/_/g, " ").toUpperCase()}
        {shortUpdateAuthority}

      </h2>
      <div className="flex justify-center font-pixel text-xs min-h-20">
        {/*shortenUA*/}
        {external_url &&
          <a target="_blank" className="btn btn-ghost btn-xs tooltip tooltip-top font-pixel" data-tip="Show Website" href={external_url}>🔗</a>
        }
        {collectionName &&
          <a target="_blank" className="btn btn-ghost btn-xs tooltip tooltip-top font-pixel" data-tip="Show on ME" href={`https://magiceden.io/marketplace/${collectionName}`}><MagicEdenLogo/></a>
        }
      </div>
    </div>
  );
};
