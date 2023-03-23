import { Token, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Connection, PublicKey } from '@solana/web3.js';
import { FC, useEffect, useState } from 'react';

type Props = {
    tokenMintAddress: string;
    toBurn: any;
    publicKey: PublicKey | null;
    connection: Connection;
    isConnectedWallet: boolean;
};

export const SelectBurnButton: FC<Props> = ({
    tokenMintAddress,
    toBurn,
    publicKey,
    connection,
    isConnectedWallet,
}) => {

    const [accountExist, setAccountExist] = useState<boolean>(true);

    useEffect(() => {
        async function BalanceIsNull() {
            const mintPublickey = new PublicKey(tokenMintAddress);
            try {
                if (publicKey && isConnectedWallet) {
                    // get the associated token address
                    const associatedAddress = await Token.getAssociatedTokenAddress(
                        ASSOCIATED_TOKEN_PROGRAM_ID,
                        TOKEN_PROGRAM_ID,
                        mintPublickey,
                        publicKey,
                    );

                    // get the token balance 
                    // if this balance != 0 the ATA is not closed, it's closed otherwise 
                    const getBalance = await connection.getTokenAccountBalance(associatedAddress)
                    const balance = getBalance.value.uiAmount
                    if (balance != 0) {
                        setAccountExist(true)
                    }
                    else {
                        setAccountExist(false)
                    }
                }
            }
            catch (error) {
                setAccountExist(false)
                const err = (error as any)?.message;
                console.log(err)
            }
        }
        //BalanceIsNull();
    }, []);

    const [isSelected, setIsSelected] = useState(false);

    return (
        <div>
            {publicKey && isConnectedWallet &&
                <div className='p-2'>
                    {!isSelected && accountExist == true &&
                        <button className="btn btn-ghost tooltip tooltip-top font-trash uppercase text-2xl bg-base-300 bg-opacity-30" data-tip="Select to burn" onClick={() => { setIsSelected(true); toBurn.push(tokenMintAddress) }}>🔥</button>
                    }
                    {isSelected && accountExist == true &&
                        <button className="btn btn-ghost tooltip tooltip-top text-2xl font-trash uppercase bg-base-300 bg-opacity-30" data-tip="Deselect from burn" onClick={() => { setIsSelected(false); toBurn.splice(toBurn.indexOf(tokenMintAddress), 1) }}>✅</button>
                    }

                    {accountExist == false &&
                        <p className="">🚫</p>
                    }
                </div>
            }
        </div>
    );
};


