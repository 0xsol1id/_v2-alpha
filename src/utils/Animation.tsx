import { FC, useEffect, useState } from "react";

type Props = {
  images: string[];
  maxFrame: number;
  interval: number;
};

export const Animation: FC<Props> = ({ images, maxFrame, interval }) => {
  const [frame, setFrame] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFrame((frame % maxFrame) + 1);
    }, interval);

    return () => clearTimeout(timer);
  }, [frame, maxFrame, interval]);

  const image = `/static/images/${images[frame - 1]}`;

  return (
    <div id="ani">
      <div>
        <img src={image} alt="ani" className="w-full" />
      </div>
    </div>
  );
};