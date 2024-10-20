'use client';

import { useState, useEffect } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { getAssetsByCollectionAddress } from '@/lib/nftUtils';
import '@solana/wallet-adapter-react-ui/styles.css';

export default function LeaderboardPage() {
  const { publicKey } = useWallet();
  const [nftCount, setNftCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNFTCount = async () => {
      if (publicKey) {
        try {
          const { nsBurnNFTs } = await getAssetsByCollectionAddress(publicKey.toString());
          setNftCount(nsBurnNFTs);
          setError(null);
        } catch (err) {
          console.error('Error fetching NFT count:', err);
          setError('Failed to fetch NFT count. Please try again later.');
        }
      }
    };

    fetchNFTCount();
  }, [publicKey]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">Leaderboard</h1>
      <div className="p-4 bg-white rounded-lg shadow-md">
        <WalletMultiButton className="!bg-purple-600 hover:!bg-purple-700 transition-colors duration-200" />
      </div>
      {error && <p className="mt-4 text-red-500">{error}</p>}
      {publicKey && nftCount !== null && (
        <p className="mt-4 text-lg">You have {nftCount} NS Burn NFTs</p>
      )}
    </div>
  );
}