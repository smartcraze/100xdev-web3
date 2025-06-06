import React, { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { Keypair, SystemProgram, Transaction, sendAndConfirmTransaction } from '@solana/web3.js';
import {
  createInitializeMint2Instruction,
  getMinimumBalanceForRentExemptMint,
  MINT_SIZE,
  TOKEN_PROGRAM_ID
} from '@solana/spl-token';

const TokenLaunchpad: React.FC = () => {
  const { connection } = useConnection();
  const wallet = useWallet();

  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [url, setUrl] = useState('');
  const [supply, setSupply] = useState('');

  const createToken = async () => {
    if (!wallet.publicKey || !wallet.signTransaction) {
      alert('Please connect your wallet!');
      return;
    }

    const lamports = await getMinimumBalanceForRentExemptMint(connection);
    const mintKeypair = Keypair.generate();
    const decimals = 9;

    const mintAuthority = wallet.publicKey;
    const freezeAuthority = null;

    const transaction = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: mintKeypair.publicKey,
        space: MINT_SIZE,
        lamports,
        programId: TOKEN_PROGRAM_ID,
      }),
      createInitializeMint2Instruction(
        mintKeypair.publicKey,
        decimals,
        mintAuthority,
        freezeAuthority,
        TOKEN_PROGRAM_ID
      )
    );

    transaction.feePayer = wallet.publicKey;
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    transaction.partialSign(mintKeypair);

    const signedTx = await wallet.signTransaction(transaction);
    const txid = await connection.sendRawTransaction(signedTx.serialize());
    await connection.confirmTransaction(txid);

    console.log("Token created:", mintKeypair.publicKey.toBase58());
    alert("Token Created Successfully!");
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4">
      <input type="text" placeholder="Token Name" onChange={(e) => setName(e.target.value)} />
      <input type="text" placeholder="Token Symbol" onChange={(e) => setSymbol(e.target.value)} />
      <input type="text" placeholder="Token URL" onChange={(e) => setUrl(e.target.value)} />
      <input type="text" placeholder="Initial Supply" onChange={(e) => setSupply(e.target.value)} />
      <button
        onClick={createToken}
        className="bg-blue-500 text-white p-2 rounded-md w-1/3 cursor-pointer"
      >
        Create Token
      </button>
    </div>
  );
};

export default TokenLaunchpad;
