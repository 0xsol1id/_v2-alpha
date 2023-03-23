import Link from 'next/link';
import { FC, useState } from "react";

export const BuyButton: FC = ({ }) => {
    const [open, setOpen] = useState('');
    const unhover = () => {
        setOpen('')
    }
    return (
        <div id="buybutton" className="">            
            <div onMouseOver={() => setOpen('buy')} onMouseOut={unhover} className="hover:cursor-pointer tooltip tooltip-right" data-tip="BUY NFTs NOW">
                <a href="https://magiceden.io/creators/soljunk" target="_blank" rel="noreferrer">
                    <img src={open === 'buy' ? "/static/images/buttons/buyButton_hover.png" : "/static/images/buttons/buyButton.png"} alt="home" className="w-full" />
                </a>
            </div>
        </div>
    );
}; 