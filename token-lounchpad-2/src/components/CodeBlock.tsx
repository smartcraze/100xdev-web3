
function CodeBlock() {
  const exampleMetadata = {
    name: 'Token X',
    symbol: 'TKX',
    description: 'This is an example fungible token for demonstration purposes.',
    image: 'https://example.com/token-image.png'
  };

  return (
    <div className="bg-gray-900 text-white p-6 rounded-xl shadow-lg max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4 text-purple-400">🎯 Example Token Metadata (JSON)</h2>
      <p className="text-sm text-gray-400 mb-2">
        This is how your <code className="text-yellow-400">metadata.json</code> should look like. Host it on IPFS (e.g., NFT.storage, Pinata) and use the link as your token URI.
      </p>
      <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
        <code className="whitespace-pre text-green-400">
{JSON.stringify(exampleMetadata, null, 2)}
        </code>
      </pre>
      <p className="text-sm text-gray-400 mt-4">
        🔗 Hosted URI Example:{" "}
        <code className="text-blue-400 break-all">
          https://gateway.pinata.cloud/ipfs/QmExampleCID/metadata.json
        </code>
      </p>
    </div>
  );
}

export default CodeBlock;
