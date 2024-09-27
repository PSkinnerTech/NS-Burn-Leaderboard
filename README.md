# NS Burn Leaderboard

NS Burn Leaderboard is a web application built with Next.js, TypeScript, and Tailwind CSS that allows users to view a leaderboard of Network School Cryptocredentials NFT holders. The application connects to the Solana blockchain to fetch and display NFT data.

## Features

- Connect Solana wallet (Phantom, Solflare, etc.)
- Display current Solana network slot
- Count and display the number of Network School Cryptocredentials NFTs in the connected wallet
- Show a leaderboard of users ranked by their NFT count
- Fetch and display NFT metadata

## Technologies Used

- Next.js 14
- TypeScript
- Tailwind CSS
- Solana Web3.js
- Metaplex Foundation SDK
- Supabase (for user data storage)
- QuickNode (for Solana RPC connection)

## Prerequisites

- Node.js (v14 or later)
- Bun package manager
- Solana wallet (e.g., Phantom, Solflare)
- Supabase account
- QuickNode account with a Solana endpoint

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/your-username/ns-burn-leaderboard.git
   cd ns-burn-leaderboard
   ```

2. Install dependencies:
   ```
   bun install
   ```

3. Create a `.env.local` file in the root directory and add the following environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_QUICKNODE_RPC=your_quicknode_rpc_endpoint
   ```

4. Update the `NS_COLLECTION_ADDRESS` in `lib/nftUtils.ts` with the correct Network School Cryptocredentials collection address.

5. Run the development server:
   ```
   bun run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. Connect your Solana wallet using the "Connect Wallet" button.
2. Once connected, you'll see the current Solana network slot and the number of Network School Cryptocredentials NFTs in your wallet.
3. The leaderboard displays users ranked by their NFT count.

## Project Structure

- `pages/`: Contains the main pages of the application
- `components/`: Reusable React components
- `lib/`: Utility functions and API calls
- `styles/`: Global styles and Tailwind CSS configuration

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.# NS-Burn-Leaderboard
