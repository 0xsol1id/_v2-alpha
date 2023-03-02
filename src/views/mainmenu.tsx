import Link from 'next/link';
import { FC } from "react";
import { DiscordLogo, TwitterLogo, GithubLogo, GameLogo } from "components"

export const MainMenu: FC = ({ }) => {

    return (
        <div className='flex'>
            <div className="dropdown">
                <div tabIndex={0} className="btn mr-1 bg-green-500 text-xl"><img className="" src="./button/buy_button.png" alt="cs" /></div>
                <ul tabIndex={0} className="mt-1 text-md shadow menu dropdown-content bg-base-300 rounded border border-gray-500 w-[12rem]">
                    <li>
                        <a>
                            <Link href="https://magiceden.io/marketplace/soljunk"><p className="font-pixel text-sm uppercase">BUY SolJunk GEN1</p></Link>
                        </a>
                    </li>
                    <li>
                        <a>
                            <Link href="https://magiceden.io/marketplace/solana_money_business"><p className="font-pixel text-sm uppercase">BUY $MB</p></Link>
                        </a>
                    </li>
                    <li>
                        <a>
                            <Link href="https://magiceden.io/marketplace/faces_of_solana_money_business"><p className="font-pixel text-sm uppercase">BUY Faces of $MB</p></Link>
                        </a>
                    </li>
                    <li>
                        <a>
                            <Link href="https://magiceden.io/marketplace/lil_rektie"><p className="font-pixel text-sm uppercase">BUY Lil Rektie</p></Link>
                        </a>
                    </li>
                    <li>
                        <a>
                            <Link href="https://magiceden.io/marketplace/harrddyjunks"><p className="font-pixel text-sm uppercase">BUY HarrddyJunks</p></Link>
                        </a>
                    </li>
                    <li>
                        <button className="btn bg-green-500 mb-2 mx-2">
                            <Link href="/rarity">
                                RANK TEST
                            </Link>
                        </button>
                    </li>
                    <li>
                        <button className="btn bg-green-500 mb-2 mx-2">
                            <Link href="/mint">
                                <img src="./button/mint_gen2.png" />
                            </Link>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
}; 