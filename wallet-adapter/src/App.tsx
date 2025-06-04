import "./index.css";
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';

import '@solana/wallet-adapter-react-ui/styles.css';
import Airdrop from "components/Airdrop";

export function App() {

  return (
    <div className="bg-black h-screen w-screen text-white">
      <ConnectionProvider endpoint={"https://solana-devnet.g.alchemy.com/v2/6UGlzjfuJFn3aWQMQWz95"}>
        <WalletProvider wallets={[]} autoConnect>
          <WalletModalProvider>
            <WalletMultiButton />
            <WalletDisconnectButton />
            <Airdrop />
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </div>
  );
}

export default App;
