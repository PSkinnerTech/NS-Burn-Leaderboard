'use client'

import { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { supabase } from '../../lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { fetchAndLogNFTMetadata, getSlot } from '../../lib/nftUtils'

type User = {
  id: string
  wallet_address: string
  first_name: string
  last_name: string
  nft_count: number
}

// Example NFT mint address (replace with an actual NS Burn NFT mint address)
const EXAMPLE_NFT_MINT = "SPpCU2d2wE8nA51EqPDzUQZqDDEAP2bGJzzbLio4Pcn";

export default function Leaderboard() {
  const [users, setUsers] = useState<User[]>([])
  const [currentSlot, setCurrentSlot] = useState<number | null>(null)
  const [metadataError, setMetadataError] = useState<string | null>(null)
  const { connected, publicKey } = useWallet()
  const router = useRouter()

  useEffect(() => {
    if (!connected) {
      console.log('Wallet not connected, redirecting to home');
      router.push('/')
    } else {
      console.log('Wallet connected, fetching data');
      fetchUsers();
      fetchSlot();
      fetchExampleNFTMetadata();
    }
  }, [connected])

  const fetchUsers = async () => {
    console.log('Fetching users...');
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('nft_count', { ascending: false })

    if (data) {
      console.log(`Fetched ${data.length} users`);
      setUsers(data)
    } else if (error) {
      console.error('Error fetching users:', error)
    }
  }

  const fetchSlot = async () => {
    try {
      const slot = await getSlot();
      setCurrentSlot(slot);
    } catch (error) {
      console.error("Error fetching current slot:", error);
    }
  }

  const fetchExampleNFTMetadata = async () => {
    try {
      await fetchAndLogNFTMetadata(EXAMPLE_NFT_MINT);
    } catch (error) {
      console.error("Error fetching NFT metadata:", error);
      setMetadataError("Failed to fetch NFT metadata. Please check the console for details.");
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">NS Burn NFT Leaderboard</h1>
      {currentSlot && (
        <div className="mb-4">Current Slot: {currentSlot}</div>
      )}
      {metadataError && (
        <div className="text-red-500 mb-4">{metadataError}</div>
      )}
      <div className="w-full max-w-2xl">
        {users.map((user, index) => (
          <div key={user.id} className="flex justify-between items-center py-2 border-b">
            <span>{index + 1}. {user.first_name} {user.last_name}</span>
            <span>{user.nft_count} NFTs</span>
          </div>
        ))}
      </div>
    </main>
  )
}