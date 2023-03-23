import Link from "next/link";
import React from "react";
import { DiscordLogo, TwitterLogo, GithubLogo, GameLogo } from "components"

export const Footer: React.FC = ({ }) => {
    return (
        <div>
            <div className="fixed bottom-0 left-0 right-0 bg-base-300 p-2 lg:p-1 lg:flex justify-between hidden">
                <h1 className="font-trash uppercase mr-3 text-sm">TrashTalk V0.1_ALPHA</h1>
            </div>
            <div className="fixed bottom-0 left-0 right-0 bg-base-300 p-2 lg:p-1 flex justify-between lg:hidden">
                <button className="btn btn-sm bg-green-500 mx-1">
                    <Link passHref href="/mint">
                        <img src="./button/buy_button.png" alt="tmp" />
                    </Link>
                </button>
                <div className="grid items-center text-center lg:hidden">
                    <h1 className="font-trash uppercase mr-3 mt-2">TrashTalk V0.1_ALPHA</h1>
                </div>
            </div>
        </div>
    )
}