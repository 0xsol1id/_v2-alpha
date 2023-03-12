import Link from 'next/link';
import { FC } from "react";

export const MainMenu: FC = ({ }) => {
    return (
        <div className='flex'>
            <div className="dropdown">
                <div tabIndex={0} className="btn mr-1 bg-green-500 text-xl"><img className="" src="/static/images/button/buy_button.png" alt="cs" /></div>
                <ul tabIndex={0} className="mt-1 text-md shadow menu dropdown-content bg-base-300 rounded border border-gray-500 w-[12rem]">
                    <li>
                        <a href="https://magiceden.io/marketplace/soljunk" target="_blank" rel="noreferrer">
                            <p className="font-pixel text-sm uppercase">BUY SolJunk GEN1</p>
                        </a>
                    </li>
                    <li>
                        <a href="https://magiceden.io/marketplace/solana_money_business" target="_blank" rel="noreferrer">
                            <p className="font-pixel text-sm uppercase">BUY $MB</p>
                        </a>
                    </li>
                    <li>
                        <a href="https://magiceden.io/marketplace/faces_of_solana_money_business" target="_blank" rel="noreferrer">
                            <p className="font-pixel text-sm uppercase">BUY Faces of $MB</p>
                        </a>
                    </li>
                    <li>
                        <a href="https://magiceden.io/marketplace/lil_rektie" target="_blank" rel="noreferrer">
                            <p className="font-pixel text-sm uppercase">BUY Lil Rektie</p>
                        </a>
                    </li>
                    <li>
                        <a href="https://magiceden.io/marketplace/harrddyjunks" target="_blank" rel="noreferrer">
                            <p className="font-pixel text-sm uppercase">BUY HarrddyJunks</p>
                        </a>
                    </li>
                    <li>
                        <button className="btn bg-green-500 mb-2 mx-2">
                            <Link passHref href="/mint">
                                <img src="./button/mint_gen2.png" alt="tmp"/>
                            </Link>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
}; 