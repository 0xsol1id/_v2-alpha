import { FC, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { WalletConnectIcon } from "components";


export const ConnectWallet: FC = () => {
  const { setVisible } = useWalletModal();
  const { wallet, disconnect, connect, connecting, publicKey } = useWallet();

  useEffect(() => {
    if (!publicKey && wallet) {
      try {
        connect();
      } catch (error) {
        console.log("Error connecting to the wallet: ", (error as any).message);
      }
    }
  }, [wallet]);

  const handleWalletClick = () => {
    try {
      if (!wallet) {
        setVisible(true)
      } else {
        if (!publicKey)
          connect()
        else
          disconnect()
      }
    } catch (error) {
      console.log("Error connecting to the wallet: ", (error as any).message);
    }
  };

  return (
    <div>
      {!wallet &&
        <div className="grid items-center">
          <input type="checkbox" className="toggle tooltip tooltip-left font-pixel" data-tip="Connect Wallet" onClick={handleWalletClick} />
        </div>
      }
      {publicKey &&
        <div className="grid items-center">
          <input type="checkbox" className="toggle toggle-secondary tooltip tooltip-left font-pixel" data-tip="Disconnect Wallet" onClick={handleWalletClick} checked />
        </div>
      }
    </div>
  );
};