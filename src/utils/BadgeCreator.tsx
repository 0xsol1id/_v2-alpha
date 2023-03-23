import { FC, useState } from "react"
import { useWallet, useConnection } from "@solana/wallet-adapter-react"
import { Metaplex, bundlrStorage, walletAdapterIdentity } from "@metaplex-foundation/js"
import { PublicKey } from "@solana/web3.js"
import html2canvas from 'html2canvas'

export const BadgeCreator: FC = ({ }) => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const wallet = useWallet();
  const owner: any = publicKey?.toBase58()

  //RUDECANS
  const rcbg1 = '/static/images/rudecans_layer/bg/blue.png';
  const rcbg2 = '/static/images/rudecans_layer/bg/grey.png';
  const rcbg3 = '/static/images/rudecans_layer/bg/invertedsolana.png';
  const rcbg4 = '/static/images/rudecans_layer/bg/pink.png';
  const rcbg5 = '/static/images/rudecans_layer/bg/red.png';
  const rcbg6 = '/static/images/rudecans_layer/bg/solana.png';
  const rcbg7 = '/static/images/rudecans_layer/bg/turqoise.png';
  const rcbg8 = '/static/images/rudecans_layer/bg/violet.png';
  const rcbg9 = '/static/images/rudecans_layer/bg/yellow.png';
  const rcbg10 = '/static/images/rudecans_layer/bg/alpine.png';
  const rcbg11 = '/static/images/rudecans_layer/bg/bars.png';
  const rcbg12 = '/static/images/rudecans_layer/bg/beach.png';
  const rcbg13 = '/static/images/rudecans_layer/bg/case.png';
  const rcbg14 = '/static/images/rudecans_layer/bg/club.png';
  const rcbg15 = '/static/images/rudecans_layer/bg/desert.png';
  const rcbg16 = '/static/images/rudecans_layer/bg/detroit.png';
  const rcbg17 = '/static/images/rudecans_layer/bg/dump1.png';
  const rcbg18 = '/static/images/rudecans_layer/bg/fallen.png';
  const rcbg19 = '/static/images/rudecans_layer/bg/ghosttown.png';
  const rcbg20 = '/static/images/rudecans_layer/bg/harbour.png';
  const rcbg21 = '/static/images/rudecans_layer/bg/hollywood.png';
  const rcbg22 = '/static/images/rudecans_layer/bg/home.png';
  const rcbg23 = '/static/images/rudecans_layer/bg/hood.png';
  const rcbg24 = '/static/images/rudecans_layer/bg/house.png';
  const rcbg25 = '/static/images/rudecans_layer/bg/kakaberg.png';
  const rcbg26 = '/static/images/rudecans_layer/bg/moon.png';
  const rcbg27 = '/static/images/rudecans_layer/bg/nsfw.png';
  const rcbg28 = '/static/images/rudecans_layer/bg/oilpng';
  const rcbg29 = '/static/images/rudecans_layer/bg/palace.png';
  const rcbg30 = '/static/images/rudecans_layer/bg/plane.png';
  const rcbg31 = '/static/images/rudecans_layer/bg/radioactive.png';
  const rcbg32 = '/static/images/rudecans_layer/bg/redplanet.png';
  const rcbg33 = '/static/images/rudecans_layer/bg/red.png';
  const rcbg34 = '/static/images/rudecans_layer/bg/solana.png';
  const rcbg35 = '/static/images/rudecans_layer/bg/somewhere.png';
  const rcbg36 = '/static/images/rudecans_layer/bg/southcentral.png';
  const rcbg37 = '/static/images/rudecans_layer/bg/square.png';
  const rcbg38 = '/static/images/rudecans_layer/bg/thorne.png';
  const rcbg39 = '/static/images/rudecans_layer/bg/trains.png';
  const rcbg40 = '/static/images/rudecans_layer/bg/grey.png';
  const rcbg41 = '/static/images/rudecans_layer/bg/invertedsolana.png';
  const rcbgs = [rcbg1, rcbg2, rcbg3, rcbg4, rcbg5, rcbg6, rcbg7, rcbg8, rcbg9, rcbg10, rcbg11, rcbg12, rcbg13, rcbg14, rcbg15, rcbg16, rcbg17, rcbg18, rcbg19, rcbg20, rcbg21, rcbg22, rcbg23, rcbg24, rcbg25, rcbg26, rcbg27, rcbg28, rcbg29, rcbg30, rcbg31, rcbg32, rcbg33, rcbg34, rcbg35, rcbg36, rcbg37, rcbg38, rcbg39, rcbg40, rcbg41]
  const [selectedRudeCansBG, setselectedRudeCansBG] = useState(rcbgs[9])
  const nextRudeCansBG = async () => {
    const currentIndex = rcbgs.indexOf(selectedRudeCansBG);
    const nextRudeCansIndex = (currentIndex + 1) % rcbgs.length;
    setselectedRudeCansBG(rcbgs[nextRudeCansIndex])
  }
  const prevRudeCansBG = async () => {
    const currentIndex = rcbgs.indexOf(selectedRudeCansBG);
    const nextRudeCansIndex = (currentIndex - 1) % rcbgs.length;
    if (nextRudeCansIndex < 0)
      setselectedRudeCansBG(rcbgs[rcbgs.length - 1])
    else
      setselectedRudeCansBG(rcbgs[nextRudeCansIndex])
  }

  const rcbody1 = '/static/images/rudecans_layer/body/blue.png';
  const rcbody2 = '/static/images/rudecans_layer/body/curved.png';
  const rcbody3 = '/static/images/rudecans_layer/body/green.png';
  const rcbody4 = '/static/images/rudecans_layer/body/invertedsol.png';
  const rcbody5 = '/static/images/rudecans_layer/body/purple.png';
  const rcbody6 = '/static/images/rudecans_layer/body/red.png';
  const rcbody7 = '/static/images/rudecans_layer/body/silver.png';
  const rcbody8 = '/static/images/rudecans_layer/body/sol.png';
  const rcbody9 = '/static/images/rudecans_layer/body/yellow.png';
  const rcbodies = [rcbody1, rcbody2, rcbody3, rcbody4, rcbody5, rcbody6, rcbody7, rcbody8, rcbody9]
  const [selectedRudeCansBody, setselectedRudeCansBody] = useState(rcbodies[8])
  const nextRudeCansBody = async () => {
    const currentIndex = rcbodies.indexOf(selectedRudeCansBody);
    const nextRudeCansIndex = (currentIndex + 1) % rcbodies.length;
    setselectedRudeCansBody(rcbodies[nextRudeCansIndex])
  }
  const prevRudeCansBody = async () => {
    const currentIndex = rcbodies.indexOf(selectedRudeCansBody);
    const nextRudeCansIndex = (currentIndex - 1) % rcbodies.length;
    if (nextRudeCansIndex < 0)
      setselectedRudeCansBody(rcbodies[rcbodies.length - 1])
    else
      setselectedRudeCansBG(rcbodies[nextRudeCansIndex])
  }

  const rcmouth1 = '/static/images/rudecans_layer/mouth/fake.png';
  const rcmouth2 = '/static/images/rudecans_layer/mouth/greendot.png';
  const rcmouth3 = '/static/images/rudecans_layer/mouth/nevertalk.png';
  const rcmouth4 = '/static/images/rudecans_layer/mouth/notalking.png';
  const rcmouth5 = '/static/images/rudecans_layer/mouth/opentetris.png';
  const rcmouth6 = '/static/images/rudecans_layer/mouth/opened.png';
  const rcmouth7 = '/static/images/rudecans_layer/mouth/recycle.png';
  const rcmouth8 = '/static/images/rudecans_layer/mouth/tetris.png';
  const rcmouth9 = '/static/images/rudecans_layer/mouth/toomuch.png';
  const rcmouths = [rcmouth1, rcmouth2, rcmouth3, rcmouth4, rcmouth5, rcmouth6, rcmouth7, rcmouth8, rcmouth9]
  const [selectedRudeCansMouth, setselectedRudeCansMouth] = useState(rcmouths[8])
  const nextRudeCansMouth = async () => {
    const currentIndex = rcmouths.indexOf(selectedRudeCansMouth);
    const nextRudeCansIndex = (currentIndex + 1) % rcmouths.length;
    setselectedRudeCansMouth(rcmouths[nextRudeCansIndex])
  }
  const prevRudeCansMouth = async () => {
    const currentIndex = rcmouths.indexOf(selectedRudeCansMouth);
    const nextRudeCansIndex = (currentIndex - 1) % rcmouths.length;
    if (nextRudeCansIndex < 0)
      setselectedRudeCansMouth(rcmouths[rcmouths.length - 1])
    else
      setselectedRudeCansMouth(rcmouths[nextRudeCansIndex])
  }

  const fist1 = '/static/images/rudecans_layer/fists/blood.png';
  const fist2 = '/static/images/rudecans_layer/fists/fackfinga.png';
  const fist3 = '/static/images/rudecans_layer/fists/fight.png';
  const fist4 = '/static/images/rudecans_layer/fists/fist.png';
  const fist5 = '/static/images/rudecans_layer/fists/fuckfinga.png';
  const fist6 = '/static/images/rudecans_layer/fists/fuckfingadouble.png';
  const fist7 = '/static/images/rudecans_layer/fists/none.png';
  const fist8 = '/static/images/rudecans_layer/fists/rolin.png';
  const fist9 = '/static/images/rudecans_layer/fists/spliff.png';
  const fist10 = '/static/images/rudecans_layer/fists/thugfinga.png';
  const fists = [fist1, fist2, fist3, fist4, fist5, fist6, fist7, fist8, fist9, fist10]
  const [selectedRudeCansFists, setselectedRudeCansFists] = useState(fists[0])
  const nextRudeCansFists = async () => {
    const currentIndex = fists.indexOf(selectedRudeCansFists);
    const nextRudeCansIndex = (currentIndex + 1) % fists.length;
    setselectedRudeCansFists(fists[nextRudeCansIndex])
  }
  const prevRudeCansFists = async () => {
    const currentIndex = fists.indexOf(selectedRudeCansFists);
    const nextRudeCansIndex = (currentIndex - 1) % fists.length;
    if (nextRudeCansIndex < 0)
      setselectedRudeCansFists(fists[fists.length - 1])
    else
      setselectedRudeCansFists(fists[nextRudeCansIndex])
  }

  const rceye1 = '/static/images/rudecans_layer/eyes/baked.png';
  const rceye2 = '/static/images/rudecans_layer/eyes/bored.png';
  const rceye3 = '/static/images/rudecans_layer/eyes/cry.png';
  const rceye4 = '/static/images/rudecans_layer/eyes/frightend.png';
  const rceye5 = '/static/images/rudecans_layer/eyes/green.png';
  const rceye6 = '/static/images/rudecans_layer/eyes/laser.png';
  const rceye7 = '/static/images/rudecans_layer/eyes/morebored.png';
  const rceye8 = '/static/images/rudecans_layer/eyes/normal.png';
  const rceye9 = '/static/images/rudecans_layer/eyes/straight.png';
  const rceye10 = '/static/images/rudecans_layer/eyes/tee.png';
  const rceyes = [rceye1, rceye2, rceye3, rceye4, rceye5, rceye6, rceye7, rceye8, rceye9, rceye10]
  const [selectedRudeCansEye, setselectedRudeCansEye] = useState(rceyes[8])
  const nextRudeCansEyes = async () => {
    const currentIndex = rceyes.indexOf(selectedRudeCansEye);
    const nextRudeCansIndex = (currentIndex + 1) % rceyes.length;
    setselectedRudeCansEye(rceyes[nextRudeCansIndex])
  }
  const prevRudeCansEyes = async () => {
    const currentIndex = rceyes.indexOf(selectedRudeCansEye);
    const nextRudeCansIndex = (currentIndex - 1) % rceyes.length;
    if (nextRudeCansIndex < 0)
      setselectedRudeCansEye(rceyes[rceyes.length - 1])
    else
      setselectedRudeCansEye(rceyes[nextRudeCansIndex])
  }

  const daylight1 = '/static/images/rudecans_layer/daylight/day.png';
  const daylight2 = '/static/images/rudecans_layer/daylight/night.png';
  const daylights = [daylight1, daylight2]
  const [selectedRudeCansDaylight, setselectedRudeCansDaylight] = useState(daylights[0])
  const nextRudeCansDaylight = async () => {
    const currentIndex = daylights.indexOf(selectedRudeCansDaylight);
    const nextRudeCansIndex = (currentIndex + 1) % daylights.length;
    setselectedRudeCansDaylight(daylights[nextRudeCansIndex])
  }
  const prevRudeCansDaylight = async () => {
    const currentIndex = daylights.indexOf(selectedRudeCansDaylight);
    const nextRudeCansIndex = (currentIndex - 1) % daylights.length;
    if (nextRudeCansIndex < 0)
      setselectedRudeCansDaylight(daylights[daylights.length - 1])
    else
      setselectedRudeCansDaylight(daylights[nextRudeCansIndex])
  }

  const proberty1 = '/static/images/rudecans_layer/prob/agenda.png';
  const proberty2 = '/static/images/rudecans_layer/prob/apec.png';
  const proberty3 = '/static/images/rudecans_layer/prob/apple.png';
  const proberty4 = '/static/images/rudecans_layer/prob/balenciaga.png';
  const proberty5 = '/static/images/rudecans_layer/prob/bearmarket.png';
  const proberty6 = '/static/images/rudecans_layer/prob/bodybag.png';
  const proberty7 = '/static/images/rudecans_layer/prob/burn.png';
  const proberty8 = '/static/images/rudecans_layer/prob/burningearth.png';
  const proberty9 = '/static/images/rudecans_layer/prob/clown.png';
  const proberty10 = '/static/images/rudecans_layer/prob/coke.png';
  const proberty11 = '/static/images/rudecans_layer/prob/disney.png';
  const proberty12 = '/static/images/rudecans_layer/prob/earth.png';
  const proberty13 = '/static/images/rudecans_layer/prob/facebook.png';
  const proberty14 = '/static/images/rudecans_layer/prob/fifa.png';
  const proberty15 = '/static/images/rudecans_layer/prob/franke.png';
  const proberty16 = '/static/images/rudecans_layer/prob/frankeCopy.png';
  const proberty17 = '/static/images/rudecans_layer/prob/granddaddySchwab.png';
  const proberty18 = '/static/images/rudecans_layer/prob/instagram.png';
  const proberty19 = '/static/images/rudecans_layer/prob/lidnotfinished.png';
  const proberty20 = '/static/images/rudecans_layer/prob/magicalparadise.png';
  const proberty21 = '/static/images/rudecans_layer/prob/moneyman.png';
  const proberty22 = '/static/images/rudecans_layer/prob/none.png';
  const proberty23 = '/static/images/rudecans_layer/prob/pfizer.png';
  const proberty24 = '/static/images/rudecans_layer/prob/rainbow.png';
  const proberty25 = '/static/images/rudecans_layer/prob/sam.png';
  const proberty26 = '/static/images/rudecans_layer/prob/silverlidclosed.png';
  const probertys = [proberty1, proberty2, proberty3, proberty4, proberty5, proberty6, proberty7, proberty8, proberty9, proberty10, proberty11, proberty12, proberty13, proberty14, proberty15, proberty16, proberty17, proberty18, proberty19, proberty20, proberty21, proberty22, proberty23, proberty24, proberty25, proberty26]
  const [selectedRudeCansProberty, setselectedRudeCansProberty] = useState(probertys[9])
  const nextRudeCansProberty = async () => {
    const currentIndex = probertys.indexOf(selectedRudeCansProberty);
    const nextRudeCansIndex = (currentIndex + 1) % probertys.length;
    setselectedRudeCansProberty(probertys[nextRudeCansIndex])
  }
  const prevRudeCansProberty = async () => {
    const currentIndex = probertys.indexOf(selectedRudeCansProberty);
    const nextRudeCansIndex = (currentIndex - 1) % probertys.length;
    if (nextRudeCansIndex < 0)
      setselectedRudeCansProberty(probertys[probertys.length - 1])
    else
      setselectedRudeCansProberty(probertys[nextRudeCansIndex])
  }

  //MINT
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

  const CreateAndSendNFT = async () => {
    try {
      setSending(true)
      const image = await generateImg();
      const _name = "SolJunksNFT BashMail"
      const description = `PNSQRT`;
      const { uri } = await metaplex.nfts().uploadMetadata({
        name: _name,
        description: description,
        image: image,
        external_url: "https://soljunks.io/",
        code: "test1234"
      });
      console.log(uri)
      if (uri) {
        const { nft } = await metaplex.nfts().create({
          name: _name,
          uri: uri,
          sellerFeeBasisPoints: 0,
          tokenOwner: new PublicKey(owner),
          isMutable: false,
        });

        console.log(nft)
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
  }

  return (
    <div className="flex">
      <div className='grid grid-cols-3'>
        {/*TOOLBAR MEMEMAKER*/}
        <div className="gap-4 bg-gray-900 col-span-2">
          <div className='mt-4'>

            <div className="p-2">
              <div className="row-span-1 grid grid-cols-5 text-center mb-2">
                <button className="font-trash uppercase btn btn-primary btn-sm rounded col-span-1" onClick={() => prevRudeCansBG()}>⏪</button>
                <h1 className="font-trash uppercase col-span-3">Change Background</h1>
                <button className="font-trash uppercase btn btn-primary btn-sm rounded col-span-1" onClick={() => nextRudeCansBG()}>⏩</button>
              </div>

              <div className="row-span-1 grid grid-cols-5 text-center mb-2">
                <button className="font-trash uppercase btn btn-primary btn-sm rounded col-span-1" onClick={() => prevRudeCansBody()}>⏪</button>
                <h1 className="font-trash uppercase col-span-3">Change Body</h1>
                <button className="font-trash uppercase btn btn-primary btn-sm rounded col-span-1" onClick={() => nextRudeCansBody()}>⏩</button>
              </div>

              <div className="row-span-1 grid grid-cols-5 text-center mb-2">
                <button className="font-trash uppercase btn btn-primary btn-sm rounded col-span-1" onClick={() => prevRudeCansMouth()}>⏪</button>
                <h1 className="font-trash uppercase col-span-3">Change Mouth</h1>
                <button className="font-trash uppercase btn btn-primary btn-sm rounded col-span-1" onClick={() => nextRudeCansMouth()}>⏩</button>
              </div>

              <div className="row-span-1 grid grid-cols-5 text-center mb-2">
                <button className="font-trash uppercase btn btn-primary btn-sm rounded col-span-1" onClick={() => prevRudeCansFists()}>⏪</button>
                <h1 className="font-trash uppercase col-span-3">Change Fists</h1>
                <button className="font-trash uppercase btn btn-primary btn-sm rounded col-span-1" onClick={() => nextRudeCansFists()}>⏩</button>
              </div>

              <div className="row-span-1 grid grid-cols-5 text-center mb-2">
                <button className="font-trash uppercase btn btn-primary btn-sm rounded col-span-1" onClick={() => prevRudeCansEyes()}>⏪</button>
                <h1 className="font-trash uppercase col-span-3">Change Eyes</h1>
                <button className="font-trash uppercase btn btn-primary btn-sm rounded col-span-1" onClick={() => nextRudeCansEyes()}>⏩</button>
              </div>

              <div className="row-span-1 grid grid-cols-5 text-center mb-2">
                <button className="font-trash uppercase btn btn-primary btn-sm rounded col-span-1" onClick={() => prevRudeCansProberty()}>⏪</button>
                <h1 className="font-trash uppercase col-span-3">Change Proberty</h1>
                <button className="font-trash uppercase btn btn-primary btn-sm rounded col-span-1" onClick={() => nextRudeCansProberty()}>⏩</button>
              </div>

              <div className="row-span-1 grid grid-cols-5 text-center mb-2">
                <button className="font-trash uppercase btn btn-primary btn-sm rounded col-span-1" onClick={() => prevRudeCansDaylight()}>⏪</button>
                <h1 className="font-trash uppercase col-span-3">Change Daylight</h1>
                <button className="font-trash uppercase btn btn-primary btn-sm rounded col-span-1" onClick={() => nextRudeCansDaylight()}>⏩</button>
              </div>
            </div>

            <div className="p-2">
              <div className="mt-4 text-center">
                {sending == false &&
                  <button className="font-trash uppercase btn btn-primary btn-lg text-3xl w-full mb-2"
                    onClick={CreateAndSendNFT}>Mint now
                  </button>}

                {sending &&
                  <button className="font-trash uppercase btn btn-primary btn-lg text-3xl w-full mb-2">
                    <svg role="status" className="inline mr-3 w-4 h-4 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                    </svg>Minting</button>}

                {errorMsg != '' &&
                  <div className="mt-[1%] w-full">❌ Ohoh.. An error occurs: {errorMsg}
                  </div>
                }

                {sending &&
                  <div className="font-trash uppercase text-xs mt-[5%] w-full">
                    There will come up 4 TX to approve
                  </div>}

                {isSent &&
                  <div className="font-trash uppercase text-xl mt-[5%] w-full">
                    ✅ Successfully minted!
                  </div>}
              </div>
            </div>
          </div>         
        </div>
      </div>
       {/* MEME CANVAS - START */}
       <div className={`w-[400px] h-[400px] container text-center border-1 border-black`} id="canvas">
            <div className="relative">
              {/* BG */}
              <img src={selectedRudeCansBG} alt='' />
              {/* Layer 1 */}
              <span className="absolute top-0 left-0 ">
                <img src={selectedRudeCansBody} alt='' />
              </span>
              {/* Layer 2 */}
              <span className="absolute top-0 left-0">
                <img src={selectedRudeCansMouth} alt='' />
              </span>
              {/* Layer 3 */}
              <span className="absolute top-0 left-0">
                <img src={selectedRudeCansFists} alt='' />
              </span>
              {/* Layer 4 */}
              <span className="absolute top-0 left-0">
                <img src={selectedRudeCansEye} alt='' />
              </span>
              {/* Layer 5 */}
              <span className="absolute top-0 left-0">
                <img src={selectedRudeCansProberty} alt='' />
              </span>
              {/* Layer 6 */}
              <span className="absolute top-0 left-0">
                <img src={selectedRudeCansDaylight} alt='' />
              </span>
            </div>
          </div>
    </div>
  );
};