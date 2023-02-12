import React, { FC, useState } from "react";
import { DiscordLogo, TwitterLogo, GithubLogo } from "components";

export const Footer: FC = ({ }) => {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 p-1 h-6 flex justify-between">
            <div></div>
            <div className="flex">
                <div className="card p-2 text-sm font-bold flex justify-center">
                    <img src="./fudility.png" />
                </div>
                <h1 className="font-pixel text-xs">V0.1_ALPHA</h1>
            </div>
        </div>
    )
}