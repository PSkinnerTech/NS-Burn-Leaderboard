'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import '@solana/wallet-adapter-react-ui/styles.css';
import { supabase } from '@/lib/supabaseClient';
import UserRegistration from '@/components/UserRegistration';

const WalletMultiButton = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then(mod => mod.WalletMultiButton),
  { ssr: false }
);

export default function Home() {
  const { publicKey } = useWallet();
  const router = useRouter();
  const [isRegistered, setIsRegistered] = useState<boolean | null>(null);

  useEffect(() => {
    const checkUserRegistration = async () => {
      if (publicKey) {
        const { data, error } = await supabase
          .from('users')
          .select('first_name, last_name')
          .eq('wallet_address', publicKey.toString())
          .single();

        if (error || !data) {
          setIsRegistered(false);
        } else {
          setIsRegistered(true);
          router.push('/leaderboard');
        }
      }
    };

    checkUserRegistration();
  }, [publicKey, router]);

  if (isRegistered === false) {
    return <UserRegistration walletAddress={publicKey!.toString()} />;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-center">NS Burn Leaderboard - Metaplex Version</h1>
      <div className="p-4 bg-white rounded-lg shadow-md fade-in-5">
        <WalletMultiButton className="!bg-black hover:!bg-black transition-colors duration-200" />
      </div>
    </main>
  );
}
