import { FC, useEffect, useState } from "react";

type Props = {
    images: string[]
    maxFrame: number
    intervall: number
  };

export const Animation: FC<Props> = ({
    images,
    maxFrame,
    intervall
  }) => {
    const [frame, setFrame] = useState(1);
    const [image, setImage] = useState<string>("/static/images/" + images[0])

    useEffect(() => {
        const timer = setTimeout(() => {
            const tmp = frame
            if (tmp == maxFrame)
                setFrame(1)
            else                
                setFrame(tmp + 1)
            setImage("/static/images/" + images[frame-1])
        }, intervall);
        return () => clearTimeout(timer);
    }, [frame]);

    return (
        <div id="buybutton" className="">
            <div className="hover:cursor-pointer tooltip tooltip-right" data-tip="BUY NFTs NOW">
                <img src={image} alt="ani" className="w-full" />
            </div>
        </div>
    );
}; 