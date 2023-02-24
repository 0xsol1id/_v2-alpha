import React, { useEffect, useState } from 'react';
import { NameFT } from './NameFT';
import { Metaplex } from "@metaplex-foundation/js";
import { Connection, PublicKey } from "@solana/web3.js";

export const TokenName = (props: { mint: string }) => {

  const [isNFT, setIsNFT] = useState<boolean>()
  const [name, setName] = useState('')
  const [uri, setURI] = useState('')

  useEffect(() => {

    async function isNFT() {
      try {
        const mintPublickey = new PublicKey(props.mint);
        const connection = new Connection("https://compatible-smart-general.solana-mainnet.discover.quiknode.pro/9b4affb03539b7a422f5c636723e162c7a1b3afe/");
        // create an entry point to Metaplex SDK
        const metaplex = new Metaplex(connection);
        // get the nft object with the mint publickey address
        //const nft = await metaplex.nfts().findByMint({ mintAddress: mintPublickey });

        const response = await fetch(`https://fudility.xyz:3420/collectionname/${props.mint}`)
        const jsonData = await response.json()
        // get the name of the nft object
        const name = jsonData.name
        const logo: any = jsonData.image

        // test if the name is defined
        // if it is, it means it is the token is an nft so we set its name
        // if it's not, it means it's not an nft
        if (name != undefined) {
          setIsNFT(true)
          setName(name)
          setURI(logo)
        }
        else {
          setIsNFT(false)
        }

      }
      catch (error) {
        const err = (error as any)?.message;
        // the token is not an nft if there is no metadata account associated
        if (err.includes('No Metadata account could be found for the provided mint address')) {
          setIsNFT(false)
        }
      }
    }
    isNFT();
  }, []);

  return (
    <div>
      {isNFT == false &&
        <NameFT mint={props.mint} />
      }
      {isNFT == true &&
        <div className='flex justify-between'>
          <div><img className="font-pixel bg-gray-800 object-cover h-12 lg:h-12 rounded-lg mr-5" src={uri} /></div>
          <div className='font-pixel my-auto'>{name}</div>
        </div>
      }
    </div>
  )
}