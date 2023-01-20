import Link from 'next/link';
import { FC } from "react";
import { DiscordLogo, TwitterLogo, GithubLogo, PIPButtonCustom } from "components"


export const MainMenu: FC = ({ }) => {

    return (
        <div className='flex'>
            <div className="dropdown">
                <div tabIndex={0} className="btn mr-1 btn-primary text-xl"><img className="w-6" src="./heads/8.png" alt="cs" /></div>
                <ul tabIndex={0} className="mt-1 text-md shadow menu dropdown-content bg-base-300 rounded border border-gray-500 w-[19rem]">
                    <p className="card p-2 text-sm rounded-lg bg-base-300 flex justify-between"><img className="w-16 text-center" src="./fudility.png" /> <p className="font-pixel">V0.2.2_alpha</p></p>
                    <li>
                        <a>
                            <Link href="/gallery"><img src="./button/walletstalker.png" /></Link>
                        </a>
                    </li>
                    <li>
                        <a>
                            <Link href="/meme"><img src="./button/mememaker.png" /></Link>
                        </a>
                    </li>
                    <li>
                        <a>
                            <Link href="/grid"><img src="./button/tardinggridz.png" /></Link>
                        </a>
                    </li>
                    <li>
                        <a href="http://mintgame.soljunks.io/" target="_blank"><img src="./button/mintgame.png" />legacy</a>
                    </li>
                    <li>
                        <a><Link href="/about"><img src="./button/about.png" /></Link></a>
                    </li>
                    <li>
                        <div className="flex justify-between p-2">
                            <button className="btn btn-ghost mx-1 text-white">
                                <a href="https://discord.gg/WC6GHBuSMG" target="_blank">
                                    <p className="font-bold">
                                        <DiscordLogo />
                                    </p>
                                </a>
                            </button>
                            <button className="btn btn-ghost mx-1">
                                <a href="https://twitter.com/soljunksNFT" target="_blank">
                                    <p className="font-bold">
                                        <TwitterLogo />
                                    </p>
                                </a>
                            </button>
                            <button className="btn btn-ghost mx-1">
                                <a href="https://github.com/0xsol1id">
                                    <p className="font-bold">
                                        <GithubLogo />
                                    </p>
                                </a>
                            </button>
                        </div>
                    </li>
                </ul>
            </div>

            <PIPButtonCustom />
            <button className="btn bg-green-500 mx-1">
                <Link href="/mint">
                    <img src="./button/mint_gen2.png" />
                </Link>
            </button>
        </div>
    );
}; 