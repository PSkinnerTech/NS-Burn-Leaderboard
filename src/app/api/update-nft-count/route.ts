import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabaseClient'
import { countNSBurnNFTs } from '../../../lib/nftCounter'

export async function POST(req: Request) {
  const { walletAddress } = await req.json()

  if (!walletAddress) {
    return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 })
  }

  try {
    const nftCount = await countNSBurnNFTs(walletAddress)

    const { data, error } = await supabase
      .from('users')
      .update({ nft_count: nftCount })
      .eq('wallet_address', walletAddress)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true, nftCount })
  } catch (error) {
    console.error('Error updating NFT count:', error)
    return NextResponse.json({ error: 'Failed to update NFT count' }, { status: 500 })
  }
}