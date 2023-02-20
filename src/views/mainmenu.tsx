import Link from 'next/link';
import { FC } from "react";
import { DiscordLogo, TwitterLogo, GithubLogo, GameLogo } from "components"

export const MainMenu: FC = ({ }) => {

    return (
        <div className='flex'>
            <button className="btn bg-green-500 mx-1">
                <Link href="/mint">
                    <img src="./button/mint_gen2.png" />
                </Link>
            </button>

            <div className="flex justify-between">
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
                <button className="btn btn-ghost mx-1">
                    <a href="http://mintgame.soljunks.io/" target="_blank">
                        <p className="font-bold tooltip tooltip-right" data-tip="Play Game">
                            <img src="./joystick.png" width="25" height="25" />
                        </p>
                    </a>
                </button>
            </div>
        </div>
    );
}; 