'use client'

import { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabaseClient'
import { fetchAndLogNFTMetadata } from '../lib/nftUtils'

// Example NFT mint address (replace with an actual NS Burn NFT mint address)
const EXAMPLE_NFT_MINT = "SPpCU2d2wE8nA51EqPDzUQZqDDEAP2bGJzzbLio4Pcn";

export default function Home() {
  const { connected, publicKey } = useWallet()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [isNewUser, setIsNewUser] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (connected && publicKey) {
      checkUser()
    }
  }, [connected, publicKey])

  const checkUser = async () => {
    if (publicKey) {
      try {
        const { data, error } = await supabase
          .from('users')
          .select()
          .eq('wallet_address', publicKey.toString())
          .single()

        if (error || !data) {
          setIsNewUser(true)
        } else {
          router.push('/leaderboard')
        }
      } catch (error) {
        console.error('Error checking user:', error)
        setError('Failed to check user status')
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    if (publicKey) {
      try {
        // Fetch metadata for an example NFT
        console.log('Fetching metadata for example NFT...')
        await fetchAndLogNFTMetadata(EXAMPLE_NFT_MINT)

        // Insert user without NFT count for now
        const { error } = await supabase.from('users').insert({
          wallet_address: publicKey.toString(),
          first_name: firstName,
          last_name: lastName,
          nft_count: 0, // Set to 0 for now
        })

        if (error) throw error

        console.log('User inserted successfully')
        router.push('/leaderboard')
      } catch (error) {
        console.error('Error inserting user:', error)
        setError('Failed to register user')
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Solana NFT Leaderboard</h1>
      {!connected ? (
        <WalletMultiButton />
      ) : isNewUser ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="p-2 border rounded"
            required
          />
          <button type="submit" className="p-2 bg-blue-500 text-white rounded" disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Submit'}
          </button>
          {error && <p className="text-red-500">{error}</p>}
        </form>
      ) : (
        <p>Loading...</p>
      )}
    </main>
  )
}