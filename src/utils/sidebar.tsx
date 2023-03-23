import Link from 'next/link';
import { FC, useState } from "react";

export const SideBar: FC = ({ }) => {
    const [open, setOpen] = useState('');
    const unhover = () => {
        setOpen('')
    }
    return (
        <div id="sidebar" className="grid gap-2 p-2">
            <div onMouseOver={() => setOpen('home')} onMouseOut={unhover} className="hover:cursor-pointer">
                <Link passHref href="/">
                    <img src={open === 'home' ? "/static/images/buttons/home_hover.png" : "/static/images/buttons/home.png"} alt="home" className="w-full" />
                </Link>
            </div>
            <div onMouseOver={() => setOpen('tools')} onMouseOut={unhover} className="hover:cursor-pointer">
                    <img src={open === 'tools' ? "/static/images/buttons/tools_hover.png" : "/static/images/buttons/tools.png"} alt="tools" className="w-full" />
            </div>
            <div onMouseOver={() => setOpen('mint')} onMouseOut={unhover} className="hover:cursor-pointer">
                <Link passHref href="/mint">
                    <img src={open === 'mint' ? "/static/images/buttons/mint_hover.png" : "/static/images/buttons/mint.png"} alt="mint" className="w-full" />
                </Link>
            </div>
        </div>
    );
}; 