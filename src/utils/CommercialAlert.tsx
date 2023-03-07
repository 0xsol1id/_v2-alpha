import { useState } from "react"
import Link from "next/link";

type Props = {
    isDismissed: boolean;
  };

export const CommercialAlert: React.FC<Props> = ({ isDismissed }) => {
    const [dismiss, setDismiss] = useState(isDismissed)
    const dismissAlert = () => {
        setDismiss(true);
        setTimeout(() => {
            setDismiss(false);
        }, 30000);
      }

    return (
        <div>
            {!dismiss &&
                <div className="bg-gray-900 border-2 border-primary rounded-lg shadow text-center p-2 items-center absolute bottom-1 right-1 z-50 lg:h-[270px]">
                    <div className="grid gap-2">
                        <div className="flex justify-between">
                            <div></div>
                            <label className="font-pixel underline">MINT NOW!!!</label>
                            <button className="btn btn-sm btn-secondary font-pixel" onClick={dismissAlert}>X</button>
                        </div>
                        <img src="./mint_banner1.png" className="lg:h-[170px] rounded" />
                        <button className="btn btn-sm btn-secondary font-pixel">
                            <Link href="/mint">Visit</Link>
                        </button>
                    </div>
                </div>
            }
        </div>
    )
}