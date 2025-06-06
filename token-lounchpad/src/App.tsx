import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import './index.css';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';
import TokenLounchpad from './TokenLounchpad';


export function App() {
  return (
    <ConnectionProvider endpoint={"https://api.devnet.solana.com"}>
        <WalletProvider wallets={[]} autoConnect>
            <WalletModalProvider>
                <div className="flex justify-between items-center p-4 bg-gray-100">
                    <WalletMultiButton />
                    <WalletDisconnectButton />
                </div>
                    <TokenLounchpad />
            </WalletModalProvider>
        </WalletProvider>
    </ConnectionProvider>
);
}

export default App;
