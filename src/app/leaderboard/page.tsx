'use client'

import { useState, useEffect, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { useWallet } from '@solana/wallet-adapter-react'
import { useRouter } from 'next/navigation'
import { getAssetsByCollectionAddress } from '@/lib/nftUtils'
import '@solana/wallet-adapter-react-ui/styles.css'
import { supabase } from '@/lib/supabaseClient'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

const WalletMultiButton = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then(mod => mod.WalletMultiButton),
  { ssr: false }
)

interface LeaderboardUser {
  id: string
  first_name: string
  last_name: string
  nft_count: number
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function LeaderboardContent() {
  const { publicKey, connected } = useWallet()
  const [nftCount, setNftCount] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!connected) {
      router.push('/')
    }
  }, [connected, router])

  useEffect(() => {
    const checkUserRegistration = async () => {
      if (publicKey) {
        const { data, error } = await supabase
          .from('users')
          .select('first_name, last_name')
          .eq('wallet_address', publicKey.toString())
          .single()

        if (error || !data) {
          router.push('/')
        }
      }
    }

    checkUserRegistration()
  }, [publicKey, router])

  useEffect(() => {
    const fetchNFTCount = async () => {
      if (publicKey) {
        try {
          const { nftCount } = await getAssetsByCollectionAddress(publicKey.toString());
          setNftCount(nftCount);
          setError(null);

          // Update the nft_count in Supabase
          const { error } = await supabase
            .from('users')
            .update({ nft_count: nftCount })
            .eq('wallet_address', publicKey.toString());

          if (error) {
            console.error('Error updating NFT count in Supabase:', error);
          }
        } catch (err) {
          console.error('Error fetching NFT count:', err);
          setError('Failed to fetch NFT count. Please try again later.');
        }
      }
    };

    fetchNFTCount();
  }, [publicKey])

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      await delay(3000); // 3-second delay
      setIsLoading(true)
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, first_name, last_name, nft_count')
          .order('nft_count', { ascending: false })

        if (error) throw error

        setLeaderboardData(data || [])
      } catch (err) {
        console.error('Error fetching leaderboard data:', err)
        setError('Failed to fetch leaderboard data. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchLeaderboardData()
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      <Card className="w-full max-w-2xl shadow-sm rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Network School Burn NFTs Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex justify-center">
            <WalletMultiButton className="!bg-purple-600 hover:!bg-purple-700 transition-colors duration-200" />
          </div>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {publicKey && nftCount !== null && (
            <p className="text-lg text-center mb-6">You have {nftCount} NS Burn NFTs</p>
          )}
          {isLoading ? (
            <p className="text-center animate-pulse font-extrabold">Loading leaderboard data...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Rank</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-right">Total Burn NFTs</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboardData.map((user, index) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{`${user.first_name} ${user.last_name}`}</TableCell>
                    <TableCell className="text-right">{user.nft_count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  );
}

export default function LeaderboardPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LeaderboardContent />
    </Suspense>
  );
}