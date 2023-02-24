import Link from 'next/link';
import { FC, useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

import { MainMenu } from "../mainmenu"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

import styled from "styled-components";
import confetti from "canvas-confetti";
import * as anchor from "@project-serum/anchor";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { GatewayProvider } from '@civic/solana-gateway-react';
import Countdown from "react-countdown";
import { Snackbar, Paper, LinearProgress, Chip } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { toDate, AlertState, getAtaForMint } from './utils';
import { MintButton } from './MintButton';
import { MultiMintButton } from './MultiMintButton';
import {
  CandyMachine,
  awaitTransactionSignatureConfirmation,
  getCandyMachineState,
  mintOneToken,
  mintMultipleToken,
  CANDY_MACHINE_PROGRAM,
} from "./candy-machine";
import { randomWallets } from "../wallets"
import { Footer } from '../footer';
import { isValidPublicKeyAddress } from "@metaplex-foundation/js-next";
import { ConnectWallet, SelectAndConnectWalletButton } from "components";

const decimals = process.env.REACT_APP_SPL_TOKEN_TO_MINT_DECIMALS ? +process.env.REACT_APP_SPL_TOKEN_TO_MINT_DECIMALS!.toString() : 9;
const splTokenName = process.env.REACT_APP_SPL_TOKEN_TO_MINT_NAME ? process.env.REACT_APP_SPL_TOKEN_TO_MINT_NAME.toString() : "TOKEN";

const Card = styled(Paper)`
  display: inline-block;
  background-color: var(--countdown-background-color) !important;
  margin: 5px;
  min-width: 40px;
  box-shadow: 0px 5px 0px 0px #000;
  padding: 24px;
  h1{
    margin:0px;
  }
`;

const SolExplorerLink = styled.a`
  color: var(--title-text-color);
  border-bottom: 1px solid var(--title-text-color);
  font-weight: bold;
  list-style-image: none;
  list-style-position: outside;
  list-style-type: none;
  outline: none;
  text-decoration: none;
  text-size-adjust: 100%;

  :hover {
    border-bottom: 2px solid var(--title-text-color);
  }
`;

const MintContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1 1 auto;
  flex-wrap: wrap;
  gap: 20px;
`;

const DesContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  gap: 20px;
`;

const Image = styled.img`
  height: 400px;
  width: auto;
  border-radius: 7px;
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
  justify-content: flex-start;
  box-shadow: 0px 5px 0px 0px #000;
`;

export interface HomeProps {
  candyMachineId: anchor.web3.PublicKey;
  connection: anchor.web3.Connection;
  txTimeout: number;
  rpcHost: string;
}

export const MintView: FC<HomeProps> = (props) => {
  const { publicKey } = useWallet();

  const [message, setMessage] = useState(false)
  var valid = false
  function randomInt(low: number, high: number) {
    return Math.floor(Math.random() * (high - low) + low)
  }

  const [value, setValue] = useState("")
  var randomWallet = randomWallets[randomInt(0, randomWallets.length)].Wallet //start with a random wallet from the list

  const onChange = async (e: any) => {
    setValue(e.target.value)
    valid = isValidPublicKeyAddress(e.target.value)
    setMessage(valid)
  };

  const [balance, setBalance] = useState<number>();
  const [isMinting, setIsMinting] = useState(false); // true when user got to press MINT
  const [isActive, setIsActive] = useState(false); // true when countdown completes or whitelisted
  const [solanaExplorerLink, setSolanaExplorerLink] = useState<string>("");
  const [itemsAvailable, setItemsAvailable] = useState(0);
  const [itemsRedeemed, setItemsRedeemed] = useState(0);
  const [itemsRemaining, setItemsRemaining] = useState(0);
  const [isSoldOut, setIsSoldOut] = useState(false);
  const [payWithSplToken, setPayWithSplToken] = useState(false);
  const [price, setPrice] = useState(0);
  const [priceLabel, setPriceLabel] = useState<string>("SOL");
  const [whitelistPrice, setWhitelistPrice] = useState(0);
  const [whitelistEnabled, setWhitelistEnabled] = useState(false);
  const [isBurnToken, setIsBurnToken] = useState(false);
  const [whitelistTokenBalance, setWhitelistTokenBalance] = useState(0);
  const [isEnded, setIsEnded] = useState(false);
  const [endDate, setEndDate] = useState<Date>();
  const [isPresale, setIsPresale] = useState(false);
  const [isWLOnly, setIsWLOnly] = useState(false);

  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: "",
    severity: undefined,
  });

  const wallet = useAnchorWallet();
  const [candyMachine, setCandyMachine] = useState<CandyMachine>();

  const rpcUrl = props.rpcHost
  const solFeesEstimation = 0.012; // approx of account creation fees

  const refreshCandyMachineState = () => {
    (async () => {
      if (!wallet) return;

      const cndy = await getCandyMachineState(
        wallet as anchor.Wallet,
        props.candyMachineId,
        props.connection
      );

      setCandyMachine(cndy);
      setItemsAvailable(cndy.state.itemsAvailable);
      setItemsRemaining(cndy.state.itemsRemaining);
      setItemsRedeemed(cndy.state.itemsRedeemed);

      var divider = 1;
      if (decimals) {
        divider = +('1' + new Array(decimals).join('0').slice() + '0');
      }

      // detect if using spl-token to mint
      if (cndy.state.tokenMint) {
        setPayWithSplToken(true);
        // Customize your SPL-TOKEN Label HERE
        // TODO: get spl-token metadata name
        setPriceLabel(splTokenName);
        setPrice(cndy.state.price.toNumber() / divider);
        setWhitelistPrice(cndy.state.price.toNumber() / divider);
      } else {
        setPrice(cndy.state.price.toNumber() / LAMPORTS_PER_SOL);
        setWhitelistPrice(cndy.state.price.toNumber() / LAMPORTS_PER_SOL);
      }


      // fetch whitelist token balance
      if (cndy.state.whitelistMintSettings) {
        setWhitelistEnabled(true);
        setIsBurnToken(cndy.state.whitelistMintSettings.mode.burnEveryTime);
        setIsPresale(cndy.state.whitelistMintSettings.presale);
        setIsWLOnly(!isPresale && cndy.state.whitelistMintSettings.discountPrice === null);

        if (cndy.state.whitelistMintSettings.discountPrice !== null && cndy.state.whitelistMintSettings.discountPrice !== cndy.state.price) {
          if (cndy.state.tokenMint) {
            setWhitelistPrice(cndy.state.whitelistMintSettings.discountPrice?.toNumber() / divider);
          } else {
            setWhitelistPrice(cndy.state.whitelistMintSettings.discountPrice?.toNumber() / LAMPORTS_PER_SOL);
          }
        }

        let balance = 0;
        try {
          const tokenBalance =
            await props.connection.getTokenAccountBalance(
              (
                await getAtaForMint(
                  cndy.state.whitelistMintSettings.mint,
                  wallet.publicKey,
                )
              )[0],
            );

          balance = tokenBalance?.value?.uiAmount || 0;
        } catch (e) {
          console.error(e);
          balance = 0;
        }
        setWhitelistTokenBalance(balance);
        setIsActive(isPresale && !isEnded && balance > 0);
      } else {
        setWhitelistEnabled(false);
      }

      // end the mint when date is reached
      if (cndy?.state.endSettings?.endSettingType.date) {
        setEndDate(toDate(cndy.state.endSettings.number));
        if (
          cndy.state.endSettings.number.toNumber() <
          new Date().getTime() / 1000
        ) {
          setIsEnded(true);
          setIsActive(false);
        }
      }
      // end the mint when amount is reached
      if (cndy?.state.endSettings?.endSettingType.amount) {
        let limit = Math.min(
          cndy.state.endSettings.number.toNumber(),
          cndy.state.itemsAvailable,
        );
        setItemsAvailable(limit);
        if (cndy.state.itemsRedeemed < limit) {
          setItemsRemaining(limit - cndy.state.itemsRedeemed);
        } else {
          setItemsRemaining(0);
          cndy.state.isSoldOut = true;
          setIsEnded(true);
        }
      } else {
        setItemsRemaining(cndy.state.itemsRemaining);
      }

      if (cndy.state.isSoldOut) {
        setIsActive(false);
      }
    })();
  };

  const renderGoLiveDateCounter = ({ days, hours, minutes, seconds }: any) => {
    return (
      <div><Card elevation={1}><h1>{days}</h1>Days</Card><Card elevation={1}><h1>{hours}</h1>
        Hours</Card><Card elevation={1}><h1>{minutes}</h1>Mins</Card><Card elevation={1}>
          <h1>{seconds}</h1>Secs</Card></div>
    );
  };

  function displaySuccess(mintPublicKey: any, qty: number = 1): void {
    let remaining = itemsRemaining - qty;
    setItemsRemaining(remaining);
    setIsSoldOut(remaining === 0);
    if (isBurnToken && whitelistTokenBalance && whitelistTokenBalance > 0) {
      let balance = whitelistTokenBalance - qty;
      setWhitelistTokenBalance(balance);
      setIsActive(isPresale && !isEnded && balance > 0);
    }
    setItemsRedeemed(itemsRedeemed + qty);
    if (!payWithSplToken && balance && balance > 0) {
      setBalance(balance - ((whitelistEnabled ? whitelistPrice : price) * qty) - solFeesEstimation);
    }
    setSolanaExplorerLink(("https://solscan.io/token/" + mintPublicKey));
    throwConfetti();
  };

  function throwConfetti(): void {
    confetti({
      particleCount: 400,
      spread: 70,
      origin: { y: 0.6 },
    });
  }

  function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function mintMany(quantityString: number) {

    console.log("STATUS2:")
    if (wallet && candyMachine?.program && wallet.publicKey) {
      const quantity = Number(quantityString);
      const futureBalance = (balance || 0) - ((whitelistEnabled && (whitelistTokenBalance > 0) ? whitelistPrice : price) * quantity);
      const signedTransactions: any = await mintMultipleToken(
        candyMachine,
        wallet.publicKey,
        quantity
      );

      const promiseArray = [];

      for (
        let index = 0;
        index < signedTransactions.length;
        index++
      ) {
        const tx = signedTransactions[index];
        promiseArray.push(
          awaitTransactionSignatureConfirmation(
            tx,
            props.txTimeout,
            props.connection,
            "singleGossip",
            true
          )
        );
      }

      const allTransactionsResult = await Promise.all(promiseArray);
      let totalSuccess = 0;
      let totalFailure = 0;

      for (
        let index = 0;
        index < allTransactionsResult.length;
        index++
      ) {
        const transactionStatus = allTransactionsResult[index];
        if (!transactionStatus?.err) {
          totalSuccess += 1;
        } else {
          totalFailure += 1;
        }
      }

      let retry = 0;
      if (allTransactionsResult.length > 0) {
        let newBalance =
          (await props.connection.getBalance(wallet.publicKey)) /
          LAMPORTS_PER_SOL;


        while (newBalance > futureBalance && retry < 20) {
          await sleep(2000);
          newBalance =
            (await props.connection.getBalance(wallet.publicKey)) /
            LAMPORTS_PER_SOL;
          retry++;
          console.log("Estimated balance (" + futureBalance + ") not correct yet, wait a little bit and re-check. Current balance : " + newBalance + ", Retry " + retry);
        }
      }

      if (totalSuccess && retry < 20) {
        setAlertState({
          open: true,
          message: `Congratulations! Your ${quantity} mints succeeded!`,
          severity: 'success',
        });

        // update front-end amounts
        displaySuccess(wallet.publicKey, quantity);
      }

      if (totalFailure || retry === 20) {
        setAlertState({
          open: true,
          message: `Some mints failed! (possibly ${totalFailure}) Wait a few minutes and check your wallet.`,
          severity: 'error',
        });
      }

      if (totalFailure === 0 && totalSuccess === 0) {
        setAlertState({
          open: true,
          message: `Mints manually cancelled.`,
          severity: 'error',
        });
      }
    }
  }

  async function mintOne() {

    console.log("STATUS1:")
    if (wallet && candyMachine?.program && wallet.publicKey) {
      const mint = anchor.web3.Keypair.generate();
      const mintTxId = (
        await mintOneToken(candyMachine, wallet.publicKey, mint)
      )[0];

      let status: any = { err: true };
      if (mintTxId) {
        status = await awaitTransactionSignatureConfirmation(
          mintTxId,
          props.txTimeout,
          props.connection,
          'singleGossip',
          true,
        );
      }

      console.log("STATUS2:" + status.err)

      if (!status?.err) {
        setAlertState({
          open: true,
          message: 'Congratulations! Mint succeeded!',
          severity: 'success',
        });

        // update front-end amounts
        displaySuccess(mint.publicKey);
      } else {
        setAlertState({
          open: true,
          message: 'Mint failed! Please try again!',
          severity: 'error',
        });
      }
    }
  }

  const startMint = async (quantityString: number) => {
    try {
      setIsMinting(true);
      if (quantityString === 1) {
        await mintOne();
      } else {
        await mintMany(quantityString);
      }
    } catch (error: any) {

      console.log("STATUS:" + error)
      let message = error.msg || 'Minting failed! Please try again!';
      if (!error.msg) {
        if (!error.message) {
          message = 'Transaction Timeout! Please try again.';
        } else if (error.message.indexOf('0x138')) {
        } else if (error.message.indexOf('0x137')) {
          message = `SOLD OUT!`;
        } else if (error.message.indexOf('0x135')) {
          message = `Insufficient funds to mint. Please fund your wallet.`;
        }
      } else {
        if (error.code === 311) {
          message = `SOLD OUT!`;
        } else if (error.code === 312) {
          message = `Minting period hasn't started yet.`;
        }
      }

      setAlertState({
        open: true,
        message,
        severity: "error",
      });
    } finally {
      setIsMinting(false);
    }
  };

  useEffect(() => {
    (async () => {
      if (wallet) {
        const balance = await props.connection.getBalance(wallet.publicKey);
        setBalance(balance / LAMPORTS_PER_SOL);
      }
    })();
  }, [wallet, props.connection]);

  useEffect(refreshCandyMachineState, [
    wallet,
    props.candyMachineId,
    props.connection,
    isEnded,
    isPresale
  ]);

  return (
    <div className="">
      <div className="">
        <div className="navbar sticky top-0 z-50 text-neutral-content flex justify-between bg-gray-900">
          <ul className="space-y-2 bg-gray-900 p-2 lg:hidden block sticky top-0 z-50 w-screen">
            <div className="flex justify-between">
              <div className="flex">
                <div className="font-pixel">
                  <button className="btn btn-primary ml-2" data-tip="Show a random wallet">
                    <Link href={`/showme?wallet=${randomWallet}`}>🤷‍♂️ </Link>
                  </button>
                </div>
                <div className="">
                  <button onClick={onChange} className="btn btn-primary ml-2">
                    👁️
                  </button>
                </div>
              </div>
              <div className='flex'>
                {publicKey &&
                  <button className="btn btn-primary mr-2 block">
                    <Link href={`/showme?wallet=${publicKey?.toBase58()}`}>
                      <img src="./profil.png" className="w-6 h-6" />
                    </Link>
                    <p className="font-pixel text-2xs">{(publicKey?.toBase58()).slice(0, 4)}</p>
                  </button>
                }
              <ConnectWallet />
              </div>
            </div>

            <input
              type="text"
              placeholder="Enter Wallet Address"
              className="font-pixel input input-bordered h-8 w-full bg-base-200"
              value={value}
              onChange={(e) => { setValue(e.target.value) }}
            />
          </ul>
          <div></div>
          <div className="border-2 rounded-lg border-gray-700 bg-gray-700 hidden lg:block">
            <button className="bg-primary hover:bg-gray-800 rounded-l-md tooltip tooltip-left h-10 w-12" data-tip="Show a random wallet">
              <Link href={`/showme?wallet=${randomWallet}`}>🤷‍♂️ </Link>
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
                  <Link href={`/showme?wallet=${value}`}>👁️</Link>
                </button>
              </div>
            ) : (
              <div className="tooltip tooltip-right" data-tip="no valid wallet">
                <button className="bg-gray-700 hover:bg-gray-800 rounded-r-md h-10 w-12">👁️</button>
              </div>
            )
            }
          </div>
          <div className='hidden lg:flex'>
            <div>
              {publicKey ?
                <button className="btn btn-primary mr-2 block">
                  <Link href={`/showme?wallet=${publicKey?.toBase58()}`}>
                    <img src="./profil.png" className="w-6 h-6" />
                  </Link>
                  <p className="font-pixel text-2xs">{(publicKey?.toBase58()).slice(0, 4)}</p>
                </button>
                : null}
            </div>
            <ConnectWallet />
          </div>
        </div>
        <div className="hero min-h-16">
          <div className="text-center hero-content">
            <div className="">
              <MintContainer>
                <DesContainer>
                  <div><img src="mint_banner1.png" alt="NFT To Mint" className='rounded-lg'/></div>
                  {!isActive && !isEnded && candyMachine?.state.goLiveDate && (!isWLOnly || whitelistTokenBalance > 0) ? (
                    <Countdown
                      date={toDate(candyMachine?.state.goLiveDate)}
                      onMount={({ completed }) => completed && setIsActive(!isEnded)}
                      onComplete={() => {
                        setIsActive(!isEnded);
                      }}
                      renderer={renderGoLiveDateCounter}
                    />) : (
                    !wallet ? (
                      <WalletMultiButton />
                    ) : (!isWLOnly || whitelistTokenBalance > 0) ?
                      candyMachine?.state.gatekeeper &&
                        wallet.publicKey &&
                        wallet.signTransaction ? (
                        <GatewayProvider
                          wallet={{
                            publicKey:
                              wallet.publicKey ||
                              new PublicKey(CANDY_MACHINE_PROGRAM),
                            //@ts-ignore
                            signTransaction: wallet.signTransaction,
                          }}
                          // // Replace with following when added
                          // gatekeeperNetwork={candyMachine.state.gatekeeper_network}
                          gatekeeperNetwork={
                            candyMachine?.state?.gatekeeper?.gatekeeperNetwork
                          } // This is the ignite (captcha) network
                          /// Don't need this for mainnet
                          clusterUrl={rpcUrl}
                          options={{ autoShowModal: false }}
                        >
                          <MintButton
                            candyMachine={candyMachine}
                            isMinting={isMinting}
                            isActive={isActive}
                            isEnded={isEnded}
                            isSoldOut={isSoldOut}
                            onMint={startMint}
                          />
                        </GatewayProvider>
                      ) : (
                        <div className="p-5 rounded-box bg-secondary">
                          {wallet && isActive &&
                            <div>
                              <div className="justify-between hidden lg:flex">
                                <p className="rounded-box mx-5 font-pixel text-xl p-3 bg-base-100">MINTED: {itemsRedeemed} / {itemsAvailable}</p>
                                <p className="rounded-box mx-5 font-pixel text-xl p-3 bg-base-100">BRICE: 0.01 $SOL</p>
                                <p className="rounded-box mx-5 font-pixel text-xl p-3 bg-base-100">YOUR WALLET: {(balance || 0).toLocaleString()} SOL</p>
                              </div>

                              <div className="block lg:hidden">
                                <p className="rounded-box mb-2 font-pixel text-md p-1 bg-base-100">MINTED: {itemsRedeemed} / {itemsAvailable}</p>
                                <p className="rounded-box mb-2 font-pixel text-md p-1 bg-base-100">BRICE: 0.01 $SOL</p>
                                <p className="rounded-box font-pixel text-md p-1 bg-base-100">YOUR WALLET: {(balance || 0).toLocaleString()} SOL</p>
                              </div>
                            </div>
                          }
                          <br />
                          <MultiMintButton
                            candyMachine={candyMachine}
                            isMinting={isMinting}
                            isActive={isActive}
                            isEnded={isEnded}
                            isSoldOut={isSoldOut}
                            onMint={startMint}
                            price={whitelistEnabled && (whitelistTokenBalance > 0) ? whitelistPrice : price}
                          />
                        </div>
                      ) :
                      <h1 className='font-pixel '>Mint is private.</h1>
                  )}
                  <br />
                  {wallet && isActive && solanaExplorerLink &&
                    <SolExplorerLink href={solanaExplorerLink} target="_blank">View on Solscan</SolExplorerLink>}
                </DesContainer>
              </MintContainer>
            </div>
          </div>
        </div>
        <Snackbar
          open={alertState.open}
          autoHideDuration={6000}
          onClose={() => setAlertState({ ...alertState, open: false })}
        >
          <Alert
            onClose={() => setAlertState({ ...alertState, open: false })}
            severity={alertState.severity}
          >
            {alertState.message}
          </Alert>
        </Snackbar>
        <Footer />
      </div>
    </div>
  );
};
