import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
// import { getTotalNFTCount } from '@/lib/nftUtils'

export async function POST(req: Request) {
  try {
    const { walletAddress } = await req.json()

    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 })
    }

    // const { total, filtered } = await getTotalNFTCount(walletAddress)

    const { error } = await supabase
      .from('users')
      .upsert({ 
        wallet_address: walletAddress, 
        // total_nft_count: total,
        // filtered_nft_count: filtered
      }, 
      { onConflict: 'wallet_address' })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating NFT count:', error)
    return NextResponse.json({ error: 'Failed to update NFT count' }, { status: 500 })
  }
}