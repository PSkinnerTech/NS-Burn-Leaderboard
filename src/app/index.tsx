'use client';

import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  const handleGoToLeaderboard = () => {
    router.push('/leaderboard')
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-center">NS Burn Leaderboard</h1>
      <button 
        onClick={handleGoToLeaderboard}
        className="px-6 py-3 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition-colors duration-200 text-lg font-semibold"
      >
        Go to Leaderboard
      </button>
    </main>
  )
}