import Link from "next/link";
import React from "react";

export const Footer: React.FC = ({ }) => {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 p-2 lg:p-1 h-16 lg:h-7 flex justify-between">
            <button className="btn bg-green-500 mx-1 lg:hidden">
                <Link href="/mint">
                    <img src="./button/mint_gen2.png" />
                </Link>
            </button>
            <div className="grid items-center text-center lg:hidden">
                <h1 className="font-pixel text-xs">DegenBags</h1>
                <h1 className="font-pixel text-xs">V0.2_BETA</h1>
            </div>
            <div className="hidden lg:block" />
            <div className="hidden lg:flex justify-between">
                <h1 className="font-pixel text-xs mr-3">DegenBags V0.2_BETA</h1>
            </div>
        </div>
    )
}