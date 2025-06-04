import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import React from 'react';

function Airdrop() {
    const [sol, setSol] = React.useState<number>(1);
    const { publicKey } = useWallet();
    const { connection } = useConnection();
    const [message, setMessage] = React.useState<string>("");

    async function RequestAirdrop() {
        if (!publicKey || !connection || !sol || sol <= 0) {
            setMessage("Invalid wallet or SOL amount");
            return;
        }

        try {
            setMessage("Requesting airdrop...");
            const signature = await connection.requestAirdrop(
                publicKey,
                sol * LAMPORTS_PER_SOL
            );

            

            setMessage(`✅ Airdrop successful! Signature: ${signature}`);
            console.log("Airdrop confirmed with signature:", signature);
        } catch (error: any) {
            console.error("Error requesting airdrop:", error);
            setMessage(`❌ Airdrop failed: ${error?.message || error.toString()}`);
        }
    }

    return (
        <>
            <div className="text-sm mb-2">{publicKey?.toString()}</div>
            <input
                className="bg-gray-200 text-black px-2 py-1 rounded mr-2"
                type="number"
                value={sol}
                name="sol"
                id="sol"
                min="0.1"
                step="0.1"
                onChange={(e) => setSol(Number(e.target.value))}
            />
            <button
                className="bg-green-500 px-4 py-1 rounded text-white"
                onClick={RequestAirdrop}
                disabled={!publicKey || !sol || sol <= 0}
            >
                Request Airdrop
            </button>
            <div className="mt-4">{message}</div>
        </>
    );
}

export default Airdrop;
