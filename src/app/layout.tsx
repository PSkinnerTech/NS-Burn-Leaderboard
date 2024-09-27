import React from 'react';
import './globals.css';
import { Inter } from 'next/font/google';
import dynamic from 'next/dynamic';

const inter = Inter({ subsets: ['latin'] });

const WalletContextProvider = dynamic(
  () => import('@/app/components/WalletContextProvider'),
  { ssr: false }
);

export const metadata = {
  title: 'Solana NFT Leaderboard',
  description: 'Leaderboard for NS Burn NFT holders',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletContextProvider>
          {children}
        </WalletContextProvider>
      </body>
    </html>
  );
}