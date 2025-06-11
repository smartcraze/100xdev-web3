import { useState } from 'react';
import {
  Keypair,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';
import {
  useConnection,
  useWallet,
} from '@solana/wallet-adapter-react';
import {
  TOKEN_2022_PROGRAM_ID,
  getMintLen,
  createInitializeMintInstruction,
  createInitializeMetadataPointerInstruction,
  TYPE_SIZE,
  LENGTH_SIZE,
  ExtensionType,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
} from '@solana/spl-token';
import {
  createInitializeInstruction,
  pack,
} from '@solana/spl-token-metadata';
import CodeBlock from './CodeBlock';

export function TokenLaunchpad() {
  const { connection } = useConnection();
  const wallet = useWallet();

  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [uri, setUri] = useState('');
  const [supply, setSupply] = useState('');
  const [loading, setLoading] = useState(false);

  const createToken = async () => {
    if (!wallet.publicKey) {
      alert('Connect your wallet first!');
      return;
    }

    setLoading(true);
    try {
      const mintKeypair = Keypair.generate();
      const decimals = 9;
      const initialAmount = BigInt(Number(supply) * 10 ** decimals);

      const metadata = {
        mint: mintKeypair.publicKey,
        name,
        symbol: symbol.padEnd(8, ' '),
        uri,
        additionalMetadata: [],
      };

      const mintLen = getMintLen([ExtensionType.MetadataPointer]);
      const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;
      const lamports = await connection.getMinimumBalanceForRentExemption(
        mintLen + metadataLen
      );

      const ata = await getAssociatedTokenAddress(
        mintKeypair.publicKey,
        wallet.publicKey,
        false,
        TOKEN_2022_PROGRAM_ID
      );

      const transaction = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: wallet.publicKey,
          newAccountPubkey: mintKeypair.publicKey,
          space: mintLen,
          lamports,
          programId: TOKEN_2022_PROGRAM_ID,
        }),
        createInitializeMetadataPointerInstruction(
          mintKeypair.publicKey,
          wallet.publicKey,
          mintKeypair.publicKey,
          TOKEN_2022_PROGRAM_ID
        ),
        createInitializeMintInstruction(
          mintKeypair.publicKey,
          decimals,
          wallet.publicKey,
          null,
          TOKEN_2022_PROGRAM_ID
        ),
        createInitializeInstruction({
          programId: TOKEN_2022_PROGRAM_ID,
          mint: mintKeypair.publicKey,
          metadata: mintKeypair.publicKey,
          name: metadata.name,
          symbol: metadata.symbol,
          uri: metadata.uri,
          mintAuthority: wallet.publicKey,
          updateAuthority: wallet.publicKey,
        }),
        createAssociatedTokenAccountInstruction(
          wallet.publicKey,
          ata,
          wallet.publicKey,
          mintKeypair.publicKey,
          TOKEN_2022_PROGRAM_ID
        ),
        createMintToInstruction(
          mintKeypair.publicKey,
          ata,
          wallet.publicKey,
          initialAmount,
          [],
          TOKEN_2022_PROGRAM_ID
        )
      );

      transaction.feePayer = wallet.publicKey;
      transaction.recentBlockhash = (
        await connection.getLatestBlockhash()
      ).blockhash;
      transaction.partialSign(mintKeypair);

      await wallet.sendTransaction(transaction, connection);

      alert('🎉 Token created and minted! Check your wallet in Devnet.');
    } catch (err) {
      console.error(err);
      alert('❌ Token creation failed. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-4">
      <h1 className="text-4xl font-bold mb-8">🚀 Solana Token Launchpad</h1>

      <div className="w-full max-w-md flex flex-col gap-4">
        <input
          type="text"
          placeholder="Token Name"
          className="p-3 rounded-lg bg-gray-800 border border-gray-600"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Symbol (max 8 chars)"
          maxLength={8}
          className="p-3 rounded-lg bg-gray-800 border border-gray-600"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
        />
        <input
          type="text"
          placeholder="Metadata URI"
          className="p-3 rounded-lg bg-gray-800 border border-gray-600"
          value={uri}
          onChange={(e) => setUri(e.target.value)}
        />
        <input
          type="number"
          placeholder="Initial Supply (e.g. 1000000)"
          className="p-3 rounded-lg bg-gray-800 border border-gray-600"
          value={supply}
          onChange={(e) => setSupply(e.target.value)}
        />

        <button
          onClick={createToken}
          className="mt-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white font-semibold rounded-lg transition"
          disabled={!wallet.connected || loading}
        >
          {loading ? 'Minting Token...' : 'Create + Mint Token'}
        </button>
      </div>
      <CodeBlock></CodeBlock>
    </div>
  );
}
