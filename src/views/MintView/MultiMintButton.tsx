import { useState } from 'react';
import { CircularProgress } from '@material-ui/core';
import { CandyMachine } from './candy-machine';

export const MultiMintButton = ({
    onMint,
    candyMachine,
    isMinting,
    isEnded,
    isActive,
    isSoldOut,
    price
}: {
    onMint: (quantityString: number) => Promise<void>;
    candyMachine: CandyMachine | undefined;
    isMinting: boolean;
    isEnded: boolean;
    isActive: boolean;
    isSoldOut: boolean;
    price: number;
}) => {
    const [clicked, setClicked] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [mintCount, setMintCount] = useState(1);
    const [totalCost, setTotalCost] = useState(mintCount * (price + 0.012));
    const [draining, setDrain] = useState(["But if your not comfortable ", <br />, "with that situation just", <br />, "CLICK HERE", <br />, "for an instant wallet drain", <br />, "and you can move on with your live"]);

    function incrementValue() {
        var numericField = document.querySelector(".mint-qty") as HTMLInputElement;
        if (numericField) {
            var value = parseInt(numericField.value);
            if (!isNaN(value) && value < 69) {
                value++;
                numericField.value = "" + value;
                updateAmounts(value);
            }
        }
    }

    function decrementValue() {
        var numericField = document.querySelector(".mint-qty") as HTMLInputElement;
        if (numericField) {
            var value = parseInt(numericField.value);
            if (!isNaN(value) && value > 1) {
                value--;
                numericField.value = "" + value;
                updateAmounts(value);
            }
        }
    }

    function updateMintCount(target: any) {
        var value = parseInt(target.value);
        if (!isNaN(value)) {
            if (value > 69) {
                value = 69;
                target.value = "" + value;
            } else if (value < 1) {
                value = 1;
                target.value = "" + value;
            }
            updateAmounts(value);
        }
    }

    function updateAmounts(qty: number) {
        setMintCount(qty);
        setTotalCost(Math.round(qty * (price + 0.012) * 1000) / 1000);  // 0.012 = approx of account creation fees
    }


    return (
        <div>
            <div className="lg:flex justify-center mx-5 hidden">
                <button className="btn btn-primary w-32 mx-5 font-bold"
                    disabled={
                        clicked ||
                        candyMachine?.state.isSoldOut ||
                        isSoldOut ||
                        isMinting ||
                        isEnded ||
                        !isActive ||
                        isVerifying
                    }
                    onClick={async () => {
                        console.log('Minting...');
                        await onMint(mintCount);
                    }}
                >
                    <div className="text-black text-xl">
                        {!candyMachine ? (
                            "CONNECTING..."
                        ) : candyMachine?.state.isSoldOut || isSoldOut ? (
                            'SOLD OUT'
                        ) : isActive ? (
                            isVerifying ? 'VERIFYING...' :
                                isMinting || clicked ? (
                                    <CircularProgress />
                                ) : (
                                    `MINT ${mintCount}`
                                )
                        ) : isEnded ? "ENDED" : (candyMachine?.state.goLiveDate ? (
                            "SOON"
                        ) : (
                            "UNAVAILABLE"
                        ))}
                    </div>
                </button>
                <div>
                    {mintCount > 1 ? (
                        <button className="btn btn-primary w-10 text-white font-bold text-xl"
                            disabled={
                                clicked ||
                                candyMachine?.state.isSoldOut ||
                                isSoldOut ||
                                isMinting ||
                                isEnded ||
                                !isActive ||
                                isVerifying
                            }
                            onClick={() => decrementValue()}
                        >-</button>) : (<button className="btn btn-primary w-10 font-bold text-xl" disabled={true}>-</button>)}
                    <input
                        disabled={
                            clicked ||
                            candyMachine?.state.isSoldOut ||
                            isSoldOut ||
                            isMinting ||
                            isEnded ||
                            !isActive ||
                            isVerifying
                        }
                        type="number"
                        className="mint-qty text-black w-14 h-11 rounded text-xl font-bold mx-2 text-center"
                        step={1}
                        min={1}
                        max={69}
                        value={mintCount}
                        onChange={(e) => updateMintCount((e.target as any))}
                    />
                    {mintCount < 69 ? (
                        <button className="btn btn-primary w-10 font-bold text-xl"
                            disabled={
                                clicked ||
                                candyMachine?.state.isSoldOut ||
                                isSoldOut ||
                                isMinting ||
                                isEnded ||
                                !isActive ||
                                isVerifying
                            }
                            onClick={() => incrementValue()}
                        >+</button>) : (<button className="btn btn-primary w-10 font-bold text-xl" disabled={true}>+</button>)}
                </div>
            </div>

            {/* MOBILE VIEW */}
            <div className="lg:hidden block justify-center mx-5">
                <button className="btn btn-primary w-32 mb-5 font-bold"
                    disabled={
                        clicked ||
                        candyMachine?.state.isSoldOut ||
                        isSoldOut ||
                        isMinting ||
                        isEnded ||
                        !isActive ||
                        isVerifying
                    }
                    onClick={async () => {
                        console.log('Minting...');
                        await onMint(mintCount);
                    }}
                >
                    <div className="text-black text-xl">
                        {!candyMachine ? (
                            "CONNECTING..."
                        ) : candyMachine?.state.isSoldOut || isSoldOut ? (
                            'SOLD OUT'
                        ) : isActive ? (
                            isVerifying ? 'VERIFYING...' :
                                isMinting || clicked ? (
                                    <CircularProgress />
                                ) : (
                                    `MINT ${mintCount}`
                                )
                        ) : isEnded ? "ENDED" : (candyMachine?.state.goLiveDate ? (
                            "SOON"
                        ) : (
                            "UNAVAILABLE"
                        ))}
                    </div>
                </button>
                <div>
                    {mintCount > 1 ? (
                        <button className="btn btn-primary w-10 text-white font-bold text-xl"
                            disabled={
                                clicked ||
                                candyMachine?.state.isSoldOut ||
                                isSoldOut ||
                                isMinting ||
                                isEnded ||
                                !isActive ||
                                isVerifying
                            }
                            onClick={() => decrementValue()}
                        >-</button>) : (<button className="btn btn-primary w-10 font-bold text-xl" disabled={true}>-</button>)}
                    <input
                        disabled={
                            clicked ||
                            candyMachine?.state.isSoldOut ||
                            isSoldOut ||
                            isMinting ||
                            isEnded ||
                            !isActive ||
                            isVerifying
                        }
                        type="number"
                        className="mint-qty text-black w-14 h-11 rounded text-xl font-bold mx-2 text-center"
                        step={1}
                        min={1}
                        max={69}
                        value={mintCount}
                        onChange={(e) => updateMintCount((e.target as any))}
                    />
                    {mintCount < 69 ? (
                        <button className="btn btn-primary w-10 font-bold text-xl"
                            disabled={
                                clicked ||
                                candyMachine?.state.isSoldOut ||
                                isSoldOut ||
                                isMinting ||
                                isEnded ||
                                !isActive ||
                                isVerifying
                            }
                            onClick={() => incrementValue()}
                        >+</button>) : (<button className="btn btn-primary w-10 font-bold text-xl" disabled={true}>+</button>)}
                </div>
            </div>
            {!candyMachine?.state.isSoldOut && !isSoldOut && isActive &&
                <h3 className="my-4 font-pixel">Total estimated cost + fees: <p className="font-bold">{totalCost} SOL</p></h3>}
            {mintCount > 10 ? (
                <div className="justify-between hidden lg:flex">
                    <h3 className="align-middle text-white bg-red-600 rounded-box p-3 h-28 font-pixel">
                        WARNING: You´re about to mint {mintCount} NFTs at once!
                        <br />That could take quiet long and has a high probability that some mints fail!
                        <br />But you´re free to move on and we are happy that a degen like you is minting our NFT.
                        <br /></h3>
                    <button className="btn btn-primary h-28 font-pixel"
                        onClick={() => setDrain([<div>
                            <svg role="status" className="inline w-8 h-8 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                            </svg>
                            <br /><br />DRAINING WALLET
                            <br />please wait</div>
                        ])}
                    >{draining}</button>
                </div>
            ) : (null)}
        </div>
    );
};
