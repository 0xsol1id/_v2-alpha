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
        </div>
    );
}; 