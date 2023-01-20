import Link from "next/link";
import { FC, useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";

import { MainMenu } from "../mainmenu"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Metaplex, bundlrStorage, walletAdapterIdentity, MetaplexFileTag, toMetaplexFileFromBrowser, MetaplexFile } from "@metaplex-foundation/js";
import { PublicKey } from "@solana/web3.js";
import html2canvas from 'html2canvas';
import downloadjs from 'downloadjs';

export const MemeView: FC = ({ }) => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const wallet = useWallet();

  //MemeGenerator related
  const [theme, setTheme] = useState(1)
  const nextGen2Theme = async () => {
    if (theme < 2) {
      setTheme(theme + 1)
    }
    else {
      setTheme(1)
    }
  }
  const prevTheme = async () => {
    if (theme > 1) {
      setTheme(theme - 1)
    }
    else {
      setTheme(2)
    }
  }

  const [page, setPage] = useState(1)
  const nextGen2Page = async () => {
    if (page < 8) {
      setPage(page + 1)
    }
    else {
      setPage(1)
    }
  }
  const prevGen2Page = async () => {
    if (page > 1) {
      setPage(page - 1)
    }
    else {
      setPage(8)
    }
  }

  const [rcpage, setRudeCansPage] = useState(1)
  const nextRudeCansPage = async () => {
    if (rcpage < 7) {
      setRudeCansPage(rcpage + 1)
    }
    else {
      setRudeCansPage(1)
    }
  }

  const prevRudeCansPage = async () => {
    if (rcpage > 1) {
      setRudeCansPage(rcpage - 1)
    }
    else {
      setRudeCansPage(7)
    }
  }

  //GEN2
  const bg1 = './gen2_layer/bg/blue.png';
  const bg2 = './gen2_layer/bg/grey.png';
  const bg3 = './gen2_layer/bg/invertedsolana.png';
  const bg4 = './gen2_layer/bg/pink.png';
  const bg5 = './gen2_layer/bg/red.png';
  const bg6 = './gen2_layer/bg/solana.png';
  const bg7 = './gen2_layer/bg/turqoise.png';
  const bg8 = './gen2_layer/bg/violet.png';
  const bg9 = './gen2_layer/bg/yellow.png';
  const bgs = [bg1, bg2, bg3, bg4, bg5, bg6, bg7, bg8, bg9]
  const [selectedGen2BG, setselectedGen2BG] = useState(bgs[8])
  const nextGen2BG = async () => {
    const currentIndex = bgs.indexOf(selectedGen2BG);
    const nextGen2Index = (currentIndex + 1) % bgs.length;
    setselectedGen2BG(bgs[nextGen2Index])
  }

  const body1 = './gen2_layer/body/bro.png';
  const body2 = './gen2_layer/body/ese.png';
  const body3 = './gen2_layer/body/illness.png';
  const body4 = './gen2_layer/body/invertedsolana.png';
  const body5 = './gen2_layer/body/invisiblerich.png';
  const body6 = './gen2_layer/body/multipleillness.png';
  const body7 = './gen2_layer/body/solana.png';
  const body8 = './gen2_layer/body/whitetrash.png';
  const body9 = './gen2_layer/body/none.png';
  const bodies = [body1, body2, body3, body4, body5, body6, body7, body8, body9]
  const [selectedGen2Body, setselectedGen2Body] = useState(bodies[8])
  const nextGen2Body = async () => {
    const currentIndex = bodies.indexOf(selectedGen2Body);
    const nextGen2Index = (currentIndex + 1) % bodies.length;
    setselectedGen2Body(bodies[nextGen2Index])
  }

  const dna1 = './gen2_layer/dna/$SOLwarrior.png';
  const dna2 = './gen2_layer/dna/420boi.png';
  const dna3 = './gen2_layer/dna/agent47.png';
  const dna4 = './gen2_layer/dna/blood.png';
  const dna5 = './gen2_layer/dna/burner.png';
  const dna6 = './gen2_layer/dna/chapo.png';
  const dna7 = './gen2_layer/dna/crip.png';
  const dna8 = './gen2_layer/dna/escobar.png';
  const dna9 = './gen2_layer/dna/ese.png';
  const dna10 = './gen2_layer/dna/fisherman.png';
  const dna11 = './gen2_layer/dna/gamer.png';
  const dna12 = './gen2_layer/bdna/heisenberg.png';
  const dna13 = './gen2_layer/dna/king.png';
  const dna14 = './gen2_layer/dna/metaboi.png';
  const dna15 = './gen2_layer/dna/nakedtruth.png';
  const dna16 = './gen2_layer/dna/pissedpants.png';
  const dna17 = './gen2_layer/dna/pnsqrtboi.png';
  const dna18 = './gen2_layer/dna/scarface.png';
  const dna19 = './gen2_layer/dna/soljunkboi.png';
  const dna20 = './gen2_layer/dna/soljunkgirl.png';
  const dna21 = './gen2_layer/dna/soljunkgirlblonde.png';
  const dnas = [dna1, dna2, dna3, dna4, dna5, dna6, dna7, dna8, dna9, dna10, dna11, dna12, dna13, dna14, dna15, dna16, dna17, dna18, dna19, dna20, dna21]
  const [selectedGen2DNA, setselectedGen2DNA] = useState(dnas[14])
  const nextGen2DNA = async () => {
    const currentIndex = dnas.indexOf(selectedGen2DNA);
    const nextGen2Index = (currentIndex + 1) % dnas.length;
    setselectedGen2DNA(dnas[nextGen2Index])
  }

  const mouth1 = './gen2_layer/mouth/blunt.png';
  const mouth2 = './gen2_layer/mouth/cigarette.png';
  const mouth3 = './gen2_layer/mouth/normal.png';
  const mouth4 = './gen2_layer/mouth/opened.png';
  const mouth5 = './gen2_layer/mouth/rottenteeth.png';
  const mouth6 = './gen2_layer/mouth/sad.png';
  const mouth7 = './gen2_layer/mouth/shineywhiteteeth.png';
  const mouth8 = './gen2_layer/mouth/vapoballon.png';
  const mouth9 = './gen2_layer/mouth/none.png';
  const mouths = [mouth1, mouth2, mouth3, mouth4, mouth5, mouth6, mouth7, mouth8, mouth9]
  const [selectedGen2Mouth, setselectedGen2Mouth] = useState(mouths[8])
  const nextGen2Mouth = async () => {
    const currentIndex = mouths.indexOf(selectedGen2Mouth);
    const nextGen2Index = (currentIndex + 1) % mouths.length;
    setselectedGen2Mouth(mouths[nextGen2Index])
  }

  const eye1 = './gen2_layer/eyes/alien.png';
  const eye2 = './gen2_layer/eyes/bluelaser.png';
  const eye3 = './gen2_layer/eyes/bullish.png';
  const eye4 = './gen2_layer/eyes/enlightend.png';
  const eye5 = './gen2_layer/eyes/heisenberg.png';
  const eye6 = './gen2_layer/eyes/heisenstoned.png';
  const eye7 = './gen2_layer/eyes/left.png';
  const eye8 = './gen2_layer/eyes/metaglasses.png';
  const eye9 = './gen2_layer/eyes/none.png';
  const eye10 = './gen2_layer/eyes/normal.png';
  const eye11 = './gen2_layer/eyes/red.png';
  const eye12 = './gen2_layer/eyes/redlaser.png';
  const eye13 = './gen2_layer/eyes/right.png';
  const eye14 = './gen2_layer/eyes/soltear.png';
  const eye15 = './gen2_layer/eyes/stoner.png';
  const eye16 = './gen2_layer/eyes/tee.png';
  const eyes = [eye1, eye2, eye3, eye4, eye5, eye6, eye7, eye8, eye9, eye10, eye11, eye12, eye13, eye14, eye15, eye16]
  const [selectedGen2Eye, setselectedGen2Eye] = useState(eyes[8])
  const nextGen2Eyes = async () => {
    const currentIndex = eyes.indexOf(selectedGen2Eye);
    const nextGen2Index = (currentIndex + 1) % eyes.length;
    setselectedGen2Eye(eyes[nextGen2Index])
  }

  const chain1 = './gen2_layer/chains/$SOLCross.png';
  const chain2 = './gen2_layer/chains/2chainz.png';
  const chain3 = './gen2_layer/chains/gold.png';
  const chain4 = './gen2_layer/chains/inforthetech.png';
  const chain5 = './gen2_layer/chains/none.png';
  const chain6 = './gen2_layer/chains/silver.png';
  const chain7 = './gen2_layer/chains/silvergoldcross.png';
  const chain8 = './gen2_layer/chains/solchain.png';
  const chains = [chain1, chain2, chain3, chain4, chain5, chain6, chain7, chain8]
  const [selectedGen2Chain, setselectedGen2Chain] = useState(chains[4])
  const nextGen2Chain = async () => {
    const currentIndex = chains.indexOf(selectedGen2Chain);
    const nextGen2Index = (currentIndex + 1) % chains.length;
    setselectedGen2Chain(chains[nextGen2Index])
  }

  const object1 = './gen2_layer/object/ak.png';
  const object2 = './gen2_layer/object/axe.png';
  const object3 = './gen2_layer/object/bat.png';
  const object4 = './gen2_layer/object/bloodybat.png';
  const object5 = './gen2_layer/object/bloodyknife.png';
  const object6 = './gen2_layer/object/bloodymarill.png';
  const object7 = './gen2_layer/object/bottle.png';
  const object8 = './gen2_layer/object/burner.png';
  const object9 = './gen2_layer/object/butcher.png';
  const object10 = './gen2_layer/object/granade.png';
  const object11 = './gen2_layer/object/gun.png';
  const object12 = './gen2_layer/bobject/hammer.png';
  const object13 = './gen2_layer/object/knife.png';
  const object14 = './gen2_layer/object/lean.png';
  const object15 = './gen2_layer/object/lid.png';
  const object16 = './gen2_layer/object/lucille.png';
  const object17 = './gen2_layer/object/machinegun.png';
  const object18 = './gen2_layer/object/molotov.png';
  const object19 = './gen2_layer/object/none.png';
  const object20 = './gen2_layer/object/plunger.png';
  const object21 = './gen2_layer/object/scepter.png';
  const object22 = './gen2_layer/object/solwarrior.png';
  const object23 = './gen2_layer/object/sword.png';
  const object24 = './gen2_layer/object/taser.png';
  const objects = [object1, object2, object3, object4, object5, object6, object7, object8, object9, object10, object11, object12, object13, object14, object15, object16, object17, object18, object19, object20, object21, object22, object23, object24]
  const [selectedGen2Object, setselectedGen2Object] = useState(objects[18])
  const nextGen2Object = async () => {
    const currentIndex = objects.indexOf(selectedGen2Object);
    const nextGen2Index = (currentIndex + 1) % objects.length;
    setselectedGen2Object(objects[nextGen2Index])
  }

  const prob1 = './gen2_layer/probs/0,00.png';
  const prob2 = './gen2_layer/probs/0,01.png';
  const prob3 = './gen2_layer/probs/420.png';
  const prob4 = './gen2_layer/probs/1000SOL.png';
  const prob5 = './gen2_layer/probs/deadtrash.png';
  const prob6 = './gen2_layer/probs/fckwl.png';
  const prob7 = './gen2_layer/probs/gm.png';
  const prob8 = './gen2_layer/probs/gn.png';
  const prob9 = './gen2_layer/probs/lean.png';
  const prob10 = './gen2_layer/probs/none.png';
  const prob11 = './gen2_layer/probs/rug.png';
  const prob12 = './gen2_layer/probs/tarde.png';
  const prob13 = './gen2_layer/probs/temporaryg.png';
  const prob14 = './gen2_layer/probs/theeye.png';
  const prob15 = './gen2_layer/probs/truk.png';
  const prob16 = './gen2_layer/probs/truktruktruklettering.png';
  const probs = [prob1, prob2, prob3, prob4, prob5, prob6, prob7, prob8, prob9, prob10, prob11, prob12, prob13, prob14, prob15, prob16]
  const [selectedGen2Prob, setselectedGen2Prob] = useState(probs[9])
  const nextGen2Prob = async () => {
    const currentIndex = probs.indexOf(selectedGen2Prob);
    const nextGen2Index = (currentIndex + 1) % probs.length;
    setselectedGen2Prob(probs[nextGen2Index])
  }

  //RUDECANS
  const rcbg1 = './rudecans_layer/bg/blue.png';
  const rcbg2 = './rudecans_layer/bg/grey.png';
  const rcbg3 = './rudecans_layer/bg/invertedsolana.png';
  const rcbg4 = './rudecans_layer/bg/pink.png';
  const rcbg5 = './rudecans_layer/bg/red.png';
  const rcbg6 = './rudecans_layer/bg/solana.png';
  const rcbg7 = './rudecans_layer/bg/turqoise.png';
  const rcbg8 = './rudecans_layer/bg/violet.png';
  const rcbg9 = './rudecans_layer/bg/yellow.png';
  const rcbg10 = './rudecans_layer/bg/alpine.png';
  const rcbg11 = './rudecans_layer/bg/bars.png';
  const rcbg12 = './rudecans_layer/bg/beach.png';
  const rcbg13 = './rudecans_layer/bg/case.png';
  const rcbg14 = './rudecans_layer/bg/club.png';
  const rcbg15 = './rudecans_layer/bg/desert.png';
  const rcbg16 = './rudecans_layer/bg/detroit.png';
  const rcbg17 = './rudecans_layer/bg/dump1.png';
  const rcbg18 = './rudecans_layer/bg/fallen.png';
  const rcbg19 = './rudecans_layer/bg/ghosttown.png';
  const rcbg20 = './rudecans_layer/bg/harbour.png';
  const rcbg21 = './rudecans_layer/bg/hollywood.png';
  const rcbg22 = './rudecans_layer/bg/home.png';
  const rcbg23 = './rudecans_layer/bg/hood.png';
  const rcbg24 = './rudecans_layer/bg/house.png';
  const rcbg25 = './rudecans_layer/bg/kakaberg.png';
  const rcbg26 = './rudecans_layer/bg/moon.png';
  const rcbg27 = './rudecans_layer/bg/nsfw.png';
  const rcbg28 = './rudecans_layer/bg/oilpng';
  const rcbg29 = './rudecans_layer/bg/palace.png';
  const rcbg30 = './rudecans_layer/bg/plane.png';
  const rcbg31 = './rudecans_layer/bg/radioactive.png';
  const rcbg32 = './rudecans_layer/bg/redplanet.png';
  const rcbg33 = './rudecans_layer/bg/red.png';
  const rcbg34 = './rudecans_layer/bg/solana.png';
  const rcbg35 = './rudecans_layer/bg/somewhere.png';
  const rcbg36 = './rudecans_layer/bg/southcentral.png';
  const rcbg37 = './rudecans_layer/bg/square.png';
  const rcbg38 = './rudecans_layer/bg/thorne.png';
  const rcbg39 = './rudecans_layer/bg/trains.png';
  const rcbg40 = './rudecans_layer/bg/grey.png';
  const rcbg41 = './rudecans_layer/bg/invertedsolana.png';
  const rcbgs = [rcbg1, rcbg2, rcbg3, rcbg4, rcbg5, rcbg6, rcbg7, rcbg8, rcbg9, rcbg10, rcbg11, rcbg12, rcbg13, rcbg14, rcbg15, rcbg16, rcbg17, rcbg18, rcbg19, rcbg20, rcbg21, rcbg22, rcbg23, rcbg24, rcbg25, rcbg26, rcbg27, rcbg28, rcbg29, rcbg30, rcbg31, rcbg32, rcbg33, rcbg34, rcbg35, rcbg36, rcbg37, rcbg38, rcbg39, rcbg40, rcbg41]
  const [selectedRudeCansBG, setselectedRudeCansBG] = useState(rcbgs[9])
  const nextRudeCansBG = async () => {
    const currentIndex = rcbgs.indexOf(selectedRudeCansBG);
    const nextRudeCansIndex = (currentIndex + 1) % rcbgs.length;
    setselectedRudeCansBG(rcbgs[nextRudeCansIndex])
  }

  const rcbody1 = './rudecans_layer/body/blue.png';
  const rcbody2 = './rudecans_layer/body/curved.png';
  const rcbody3 = './rudecans_layer/body/green.png';
  const rcbody4 = './rudecans_layer/body/invertedsol.png';
  const rcbody5 = './rudecans_layer/body/purple.png';
  const rcbody6 = './rudecans_layer/body/red.png';
  const rcbody7 = './rudecans_layer/body/silver.png';
  const rcbody8 = './rudecans_layer/body/sol.png';
  const rcbody9 = './rudecans_layer/body/yellow.png';
  const rcbodies = [rcbody1, rcbody2, rcbody3, rcbody4, rcbody5, rcbody6, rcbody7, rcbody8, rcbody9]
  const [selectedRudeCansBody, setselectedRudeCansBody] = useState(rcbodies[8])
  const nextRudeCansBody = async () => {
    const currentIndex = rcbodies.indexOf(selectedRudeCansBody);
    const nextRudeCansIndex = (currentIndex + 1) % rcbodies.length;
    setselectedRudeCansBody(rcbodies[nextRudeCansIndex])
  }

  const rcmouth1 = './rudecans_layer/mouth/fake.png';
  const rcmouth2 = './rudecans_layer/mouth/greendot.png';
  const rcmouth3 = './rudecans_layer/mouth/nevertalk.png';
  const rcmouth4 = './rudecans_layer/mouth/notalking.png';
  const rcmouth5 = './rudecans_layer/mouth/opentetris.png';
  const rcmouth6 = './rudecans_layer/mouth/opened.png';
  const rcmouth7 = './rudecans_layer/mouth/recycle.png';
  const rcmouth8 = './rudecans_layer/mouth/tetris.png';
  const rcmouth9 = './rudecans_layer/mouth/toomuch.png';
  const rcmouths = [rcmouth1, rcmouth2, rcmouth3, rcmouth4, rcmouth5, rcmouth6, rcmouth7, rcmouth8, rcmouth9]
  const [selectedRudeCansMouth, setselectedRudeCansMouth] = useState(rcmouths[8])
  const nextRudeCansMouth = async () => {
    const currentIndex = rcmouths.indexOf(selectedRudeCansMouth);
    const nextRudeCansIndex = (currentIndex + 1) % rcmouths.length;
    setselectedRudeCansMouth(rcmouths[nextRudeCansIndex])
  }

  const fist1 = './rudecans_layer/fists/blood.png';
  const fist2 = './rudecans_layer/fists/fackfinga.png';
  const fist3 = './rudecans_layer/fists/fight.png';
  const fist4 = './rudecans_layer/fists/fist.png';
  const fist5 = './rudecans_layer/fists/fuckfinga.png';
  const fist6 = './rudecans_layer/fists/fuckfingadouble.png';
  const fist7 = './rudecans_layer/fists/none.png';
  const fist8 = './rudecans_layer/fists/rolin.png';
  const fist9 = './rudecans_layer/fists/spliff.png';
  const fist10 = './rudecans_layer/fists/thugfinga.png';
  const fists = [fist1, fist2, fist3, fist4, fist5, fist6, fist7, fist8, fist9, fist10]
  const [selectedRudeCansFists, setselectedRudeCansFists] = useState(fists[0])
  const nextRudeCansFists = async () => {
    const currentIndex = fists.indexOf(selectedRudeCansFists);
    const nextRudeCansIndex = (currentIndex + 1) % fists.length;
    setselectedRudeCansFists(fists[nextRudeCansIndex])
  }

  const rceye1 = './rudecans_layer/eyes/baked.png';
  const rceye2 = './rudecans_layer/eyes/bored.png';
  const rceye3 = './rudecans_layer/eyes/cry.png';
  const rceye4 = './rudecans_layer/eyes/frightend.png';
  const rceye5 = './rudecans_layer/eyes/green.png';
  const rceye6 = './rudecans_layer/eyes/laser.png';
  const rceye7 = './rudecans_layer/eyes/morebored.png';
  const rceye8 = './rudecans_layer/eyes/normal.png';
  const rceye9 = './rudecans_layer/eyes/straight.png';
  const rceye10 = './rudecans_layer/eyes/tee.png';
  const rceyes = [rceye1, rceye2, rceye3, rceye4, rceye5, rceye6, rceye7, rceye8, rceye9, rceye10]
  const [selectedRudeCansEye, setselectedRudeCansEye] = useState(rceyes[8])
  const nextRudeCansEyes = async () => {
    const currentIndex = rceyes.indexOf(selectedRudeCansEye);
    const nextRudeCansIndex = (currentIndex + 1) % rceyes.length;
    setselectedRudeCansEye(rceyes[nextRudeCansIndex])
  }

  const daylight1 = './rudecans_layer/daylight/day.png';
  const daylight2 = './rudecans_layer/daylight/night.png';
  const daylights = [daylight1, daylight2]
  const [selectedRudeCansDaylight, setselectedRudeCansDaylight] = useState(daylights[0])
  const nextRudeCansDaylight = async () => {
    const currentIndex = daylights.indexOf(selectedRudeCansDaylight);
    const nextRudeCansIndex = (currentIndex + 1) % daylights.length;
    setselectedRudeCansDaylight(daylights[nextRudeCansIndex])
  }

  const proberty1 = './rudecans_layer/prob/agenda.png';
  const proberty2 = './rudecans_layer/prob/apec.png';
  const proberty3 = './rudecans_layer/prob/apple.png';
  const proberty4 = './rudecans_layer/prob/balenciaga.png';
  const proberty5 = './rudecans_layer/prob/bearmarket.png';
  const proberty6 = './rudecans_layer/prob/bodybag.png';
  const proberty7 = './rudecans_layer/prob/burn.png';
  const proberty8 = './rudecans_layer/prob/burningearth.png';
  const proberty9 = './rudecans_layer/prob/clown.png';
  const proberty10 = './rudecans_layer/prob/coke.png';
  const proberty11 = './rudecans_layer/prob/disney.png';
  const proberty12 = './rudecans_layer/prob/earth.png';
  const proberty13 = './rudecans_layer/prob/facebook.png';
  const proberty14 = './rudecans_layer/prob/fifa.png';
  const proberty15 = './rudecans_layer/prob/franke.png';
  const proberty16 = './rudecans_layer/prob/frankeCopy.png';
  const proberty17 = './rudecans_layer/prob/granddaddySchwab.png';
  const proberty18 = './rudecans_layer/prob/instagram.png';
  const proberty19 = './rudecans_layer/prob/lidnotfinished.png';
  const proberty20 = './rudecans_layer/prob/magicalparadise.png';
  const proberty21 = './rudecans_layer/prob/moneyman.png';
  const proberty22 = './rudecans_layer/prob/none.png';
  const proberty23 = './rudecans_layer/prob/pfizer.png';
  const proberty24 = './rudecans_layer/prob/rainbow.png';
  const proberty25 = './rudecans_layer/prob/sam.png';
  const proberty26 = './rudecans_layer/prob/silverlidclosed.png';
  const probertys = [proberty1, proberty2, proberty3, proberty4, proberty5, proberty6, proberty7, proberty8, proberty9, proberty10, proberty11, proberty12, proberty13, proberty14, proberty15, proberty16, proberty17, proberty18, proberty19, proberty20, proberty21, proberty22, proberty23, proberty24, proberty25, proberty26]
  const [selectedRudeCansProberty, setselectedRudeCansProberty] = useState(probertys[9])
  const nextRudeCansProberty = async () => {
    const currentIndex = probertys.indexOf(selectedRudeCansProberty);
    const nextRudeCansIndex = (currentIndex + 1) % probertys.length;
    setselectedRudeCansProberty(probertys[nextRudeCansIndex])
  }

  const [upperMsg, setUpperMsg] = useState('')
  const [lowerMsg, setLowerMsg] = useState('')
  // const [NFTImage, setNFTImage] = useState('');
  const [isGenerated, setIsGenerated] = useState(false);
  const [sending, setSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [textColor, setTextColor] = useState(1)
  const nextTextColor = async () => {
    if (textColor < 8) {
      setTextColor(textColor + 1)
    }
    else {
      setTextColor(1)
    }
  }

  const [textFont, setTextFont] = useState(1)
  const nextTextFont = async () => {
    if (textFont < 2) {
      setTextFont(textFont + 1)
    }
    else {
      setTextFont(1)
    }
  }

  const [textBG, setTextBG] = useState(1)
  const nextTextBG = async () => {
    if (textColor < 8) {
      setTextBG(textBG + 1)
    }
    else {
      setTextBG(1)
    }
  }

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

  const saveImg = async () => {
    const canvas = await html2canvas(document.getElementById('canvas')!);
    const img = canvas.toDataURL('image/png');

    downloadjs(img, 'download.png', 'image/png');
  };

  const HandleUpperMsgChange = async (e: any) => {
    setUpperMsg(e.target.value);
    setIsGenerated(false);
    setErrorMsg('');
    setIsSent(false);
  };

  const HandleLowerMsgChange = async (e: any) => {
    setLowerMsg(e.target.value);
    setIsGenerated(false);
    setErrorMsg('');
    setIsSent(false);
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
        external_url: "https://soljunks.io/"
      });
      if (uri) {
        const { nft } = await metaplex.nfts().create({
          name: _name,
          uri: uri,
          sellerFeeBasisPoints: 0,
          tokenOwner: new PublicKey(wallet),
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

  return (
    <div className="">
      <div className="">
        <div className="navbar sticky top-0 z-50 text-neutral-content flex justify-between bg-gray-900">
          <div>
            <MainMenu />
          </div>
          <WalletMultiButton />
        </div>
        <div className='flex justify-center'>
          <div className=" grid grid-cols-5 p-2 text-center">
            <button className="font-pixel sm:text-3xl text-lg btn btn-primary btn-2xl rounded mr-5 col-span-1" onClick={() => prevTheme()}>⏪</button>
            {theme == 1 && <h1 className="font-pixel text-3xl rounded w-auto col-span-3">GEN 2 THEME</h1>}
            {theme == 2 && <h1 className="font-pixel text-3xl rounded w-auto col-span-3">RUDECANS THEME</h1>}
            <button className="font-pixel sm:text-3xl text-lg btn btn-primary rounded h-full ml-5 col-span-1" onClick={() => nextGen2Theme()}>⏩</button>
          </div>
        </div>
        <div className="text-center">
          <div className="">
            {/* MEME CANVAS - START */}
            <div className="flex justify-center mt-4">
              <div className="lg:w-[500px] lg:h-[500px] w-[400px] h-[400px] container" id="canvas">
                <div className="relative">
                  {theme == 1 &&
                    <div>
                      <img src={selectedGen2BG} alt='' />
                      {/* Layer 1 */}
                      <span className="absolute top-0 left-0">
                        <img src={selectedGen2Prob} alt='' />
                      </span>
                      {/* Layer 2 */}
                      <span className="absolute top-0 left-0">
                        <img src={selectedGen2Body} alt='' />
                      </span>
                      {/* Layer 3 */}
                      <span className="absolute top-0 left-0">
                        <img src={selectedGen2DNA} alt='' />
                      </span>
                      {/* Layer 4 */}
                      <span className="absolute top-0 left-0">
                        <img src={selectedGen2Mouth} alt='' />
                      </span>
                      {/* Layer 5 */}
                      <span className="absolute top-0 left-0">
                        <img src={selectedGen2Eye} alt='' />
                      </span>
                      {/* Layer 6 */}
                      <span className="absolute top-0 left-0">
                        <img src={selectedGen2Chain} alt='' />
                      </span>
                      {/* Layer 7 */}
                      <span className="absolute top-0 left-0">
                        <img src={selectedGen2Object} alt='' />
                      </span>
                    </div>
                  }
                  {theme == 2 &&
                    <div>
                      {/* BG */}
                      <img src={selectedRudeCansBG} alt='' />
                      {/* Layer 1 */}
                      <span className="absolute top-0 left-0">
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
                  }
                  {/*UPPER MSG */}
                  {textColor == 1 &&                  
                    <h2 className="font-impact absolute lg:text-6xl text-5xl text-white top-4 left-1/2 -translate-x-1/2 break-words bg-transparent w-[90%] font-outline uppercase"><strong>{upperMsg}</strong></h2>
                  }
                  {textColor == 2 &&
                    <h2 className="font-impact absolute lg:text-6xl text-5xl text-gray-400 top-4 left-1/2 -translate-x-1/2 break-words bg-transparent w-[90%] font-outline uppercase"><strong>{upperMsg}</strong></h2>
                  }
                  {textColor == 3 &&
                    <h2 className="font-impact absolute lg:text-6xl text-5xl text-yellow-400 top-4 left-1/2 -translate-x-1/2 break-words bg-transparent w-[90%] font-outline uppercase"><strong>{upperMsg}</strong></h2>
                  }
                  {textColor == 4 &&
                    <h2 className="font-impact absolute lg:text-6xl text-5xl text-green-600 top-4 left-1/2 -translate-x-1/2 break-words bg-transparent w-[90%] font-outline uppercase"><strong>{upperMsg}</strong></h2>
                  }
                  {textColor == 5 &&
                    <h2 className="font-impact absolute lg:text-6xl text-5xl text-green-300 top-4 left-1/2 -translate-x-1/2 break-words bg-transparent w-[90%] font-outline uppercase"><strong>{upperMsg}</strong></h2>
                  }
                  {textColor == 6 &&
                    <h2 className="font-impact absolute lg:text-6xl text-5xl text-yellow-300 top-4 left-1/2 -translate-x-1/2 break-words bg-transparent w-[90%] font-outline uppercase"><strong>{upperMsg}</strong></h2>
                  }
                  {textColor == 7 &&
                    <h2 className="font-impact absolute lg:text-6xl text-5xl text-pink-300 top-4 left-1/2 -translate-x-1/2 break-words bg-transparent w-[90%] font-outline uppercase"><strong>{upperMsg}</strong></h2>
                  }
                  {textColor == 8 &&
                    <h2 className="font-impact absolute lg:text-6xl text-5xl text-pink-600 top-4 left-1/2 -translate-x-1/2 break-words bg-transparent w-[90%] font-outline uppercase"><strong>{upperMsg}</strong></h2>
                  }

                  {/*LOWER MSG */}
                  {textColor == 1 &&
                    <h2 className="font-impact absolute lg:text-6xl text-5xl text-white bottom-4 left-1/2 -translate-x-1/2 break-words bg-transparent w-[90%] font-outline uppercase"><strong>{lowerMsg}</strong></h2>
                  }
                  {textColor == 2 &&
                    <h2 className="font-impact absolute lg:text-6xl text-5xl text-gray-400 bottom-4 left-1/2 -translate-x-1/2 break-words bg-transparent w-[90%] font-outline uppercase"><strong>{lowerMsg}</strong></h2>
                  }
                  {textColor == 3 &&
                    <h2 className="font-impact absolute lg:text-6xl text-5xl text-yellow-400 bottom-4 left-1/2 -translate-x-1/2 break-words bg-transparent w-[90%] font-outline uppercase"><strong>{lowerMsg}</strong></h2>
                  }
                  {textColor == 4 &&
                    <h2 className="font-impact absolute lg:text-6xl text-5xl text-green-600 bottom-4 left-1/2 -translate-x-1/2 break-words bg-transparent w-[90%] font-outline uppercase"><strong>{lowerMsg}</strong></h2>
                  }
                  {textColor == 5 &&
                    <h2 className="font-impact absolute lg:text-6xl text-5xl text-green-300 bottom-4 left-1/2 -translate-x-1/2 break-words bg-transparent w-[90%] font-outline uppercase"><strong>{lowerMsg}</strong></h2>
                  }
                  {textColor == 6 &&
                    <h2 className="font-impact absolute lg:text-6xl text-5xl text-yellow-300 bottom-4 left-1/2 -translate-x-1/2 break-words bg-transparent w-[90%] font-outline uppercase"><strong>{lowerMsg}</strong></h2>
                  }
                  {textColor == 7 &&
                    <h2 className="font-impact absolute lg:text-6xl text-5xl text-pink-200 bottom-4 left-1/2 -translate-x-1/2 break-words bg-transparent w-[90%] font-outline uppercase"><strong>{lowerMsg}</strong></h2>
                  }
                  {textColor == 8 &&
                    <h2 className="font-impact absolute lg:text-6xl text-5xl text-pink-600 bottom-4 left-1/2 -translate-x-1/2 break-words bg-transparent w-[90%] font-outline uppercase"><strong>{lowerMsg}</strong></h2>
                  }
                </div>
              </div>
            </div>
            {/* MEME CANVAS - END */}
          </div>
          <div className='flex justify-center mt-4'>
            {theme == 1 &&
              <div className=" grid grid-cols-5 p-2">
                <button className="font-pixel sm:text-3xl text-lg btn btn-primary btn-2xl rounded mr-5 col-span-1" onClick={() => prevGen2Page()}>⏪</button>
                {page == 1 &&
                  <button className="btn btn-secondary btn-2xl font-pixel sm:text-3xl text-lg rounded w-auto col-span-3" onClick={() => nextGen2BG()}>
                    <h1 className="font-pixel">Change Background</h1>
                  </button>
                }
                {page == 2 &&
                  <button className="btn btn-secondary btn-2xl font-pixel sm:text-3xl text-lg rounded w-auto col-span-3" onClick={() => nextGen2Body()}>
                    <h1 className="font-pixel col-span-1">Change Body</h1>
                  </button>
                }
                {page == 3 &&
                  <button className="btn btn-secondary btn-2xl font-pixel sm:text-3xl text-lg rounded w-auto col-span-3" onClick={() => nextGen2DNA()}>
                    <h1 className="font-pixel col-span-1">Change DNA</h1>
                  </button>
                }
                {page == 4 &&
                  <button className="btn btn-secondary btn-2xl font-pixel sm:text-3xl text-lg rounded w-auto col-span-3" onClick={() => nextGen2Mouth()}>
                    <h1 className="font-pixel col-span-1">Change Mouth</h1>
                  </button>
                }
                {page == 5 &&
                  <button className="btn btn-secondary btn-2xl font-pixel sm:text-3xl text-lg rounded w-auto col-span-3" onClick={() => nextGen2Eyes()}>
                    <h1 className="font-pixel col-span-1">Change Eyes</h1>
                  </button>
                }
                {page == 6 &&
                  <button className="btn btn-secondary btn-2xl font-pixel sm:text-3xl text-lg rounded w-auto col-span-3" onClick={() => nextGen2Chain()}>
                    <h1 className="font-pixel col-span-1">Change Chain</h1>
                  </button>
                }
                {page == 7 &&
                  <button className="btn btn-secondary btn-2xl font-pixel sm:text-3xl text-lg rounded w-auto col-span-3" onClick={() => nextGen2Object()}>
                    <h1 className="font-pixel col-span-1">Change Object</h1>
                  </button>
                }
                {page == 8 &&
                  <button className="btn btn-secondary btn-2xl font-pixel sm:text-3xl text-lg rounded w-auto col-span-3" onClick={() => nextGen2Prob()}>
                    <h1 className="font-pixel col-span-1">Change Prob</h1>
                  </button>
                }
                <button className="font-pixel sm:text-3xl text-lg btn btn-primary rounded h-full ml-5 col-span-1" onClick={() => nextGen2Page()}>⏩</button>
              </div>
            }
            {theme == 2 &&
              <div className=" grid grid-cols-5 p-2">
                <button className="font-pixel sm:text-3xl text-lg btn btn-primary btn-2xl rounded mr-5 col-span-1" onClick={() => prevRudeCansPage()}>⏪</button>
                {rcpage == 1 &&
                  <button className="btn btn-secondary btn-2xl font-pixel sm:text-3xl text-lg rounded w-auto col-span-3" onClick={() => nextRudeCansBG()}>
                    <h1 className="font-pixel">Change Background</h1>
                  </button>
                }
                {rcpage == 2 &&
                  <button className="btn btn-secondary btn-2xl font-pixel sm:text-3xl text-lg rounded w-auto col-span-3" onClick={() => nextRudeCansBody()}>
                    <h1 className="font-pixel col-span-1">Change Body</h1>
                  </button>
                }
                {rcpage == 3 &&
                  <button className="btn btn-secondary btn-2xl font-pixel sm:text-3xl text-lg rounded w-auto col-span-3" onClick={() => nextRudeCansMouth()}>
                    <h1 className="font-pixel col-span-1">Change Mouth</h1>
                  </button>
                }
                {rcpage == 4 &&
                  <button className="btn btn-secondary btn-2xl font-pixel sm:text-3xl text-lg rounded w-auto col-span-3" onClick={() => nextRudeCansFists()}>
                    <h1 className="font-pixel col-span-1">Change Fists</h1>
                  </button>
                }
                {rcpage == 5 &&
                  <button className="btn btn-secondary btn-2xl font-pixel sm:text-3xl text-lg rounded w-auto col-span-3" onClick={() => nextRudeCansEyes()}>
                    <h1 className="font-pixel col-span-1">Change Eyes</h1>
                  </button>
                }
                {rcpage == 6 &&
                  <button className="btn btn-secondary btn-2xl font-pixel sm:text-3xl text-lg rounded w-auto col-span-3" onClick={() => nextRudeCansProberty()}>
                    <h1 className="font-pixel col-span-1">Change Proberty</h1>
                  </button>
                }
                {rcpage == 7 &&
                  <button className="btn btn-secondary btn-2xl font-pixel sm:text-3xl text-lg rounded w-auto col-span-3" onClick={() => nextRudeCansDaylight()}>
                    <h1 className="font-pixel col-span-1">Change Daylight</h1>
                  </button>
                }
                <button className="font-pixel sm:text-3xl text-lg btn btn-primary rounded h-full ml-5 col-span-1" onClick={() => nextRudeCansPage()}>⏩</button>
              </div>
            }
          </div>
          <div className="flex justify-center p-2 mt-2">
            <input className="font-pixel text-black pl-1 border-1 border-black sm:w-[290px] w-[100%] text-center h-10 rounded mr-5"
              type="text"
              required
              placeholder="Upper Text"
              maxLength={15}
              onChange={HandleUpperMsgChange}
            />
            <input className="font-pixel text-black pl-1 border-1 border-black sm:w-[290px] w-[100%] text-center h-10 rounded"
              type="text"
              required
              placeholder="Lower Text"
              maxLength={30}
              onChange={HandleLowerMsgChange}
            />
          </div>
          <div className="flex justify-center mt-2">
            <button className="font-pixel btn btn-sm mr-2 btn-secondary" onClick={nextTextColor}>Change Text Color</button>
          </div>
          <div className="mt-4 flex justify-center p-2">
            <button className="font-pixel btn mr-2 btn-primary"
              onClick={saveImg}>Download Image
            </button>

            {sending == false &&
              <button className="font-pixel btn btn-primary"
                onClick={CreateAndSendNFT}>Mint as NFT
              </button>}

            {sending == true &&
              <button className="btn btn-primary">
                <svg role="status" className="inline mr-3 w-4 h-4 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                </svg>Minting</button>}

            {errorMsg != '' &&
              <div className="mt-[1%]">❌ Ohoh.. An error occurs: {errorMsg}
              </div>
            }

            {isSent &&
              <div className="font-pixel text-xl mt-[5%]">
                ✅ Successfully minted!
              </div>}
          </div>
        </div>
      </div>
    </div>
  );
};