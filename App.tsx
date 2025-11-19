import React, { useState } from 'react';
import type { NFTTicket } from './types';
import { useWallet } from './hooks/useWallet';
import WalletHeader from './components/WalletHeader';
import TicketCard from './components/TicketCard';
import LoadingSpinner from './components/LoadingSpinner';
import EmptyState from './components/EmptyState';
import TicketDetailModal from './components/TicketDetailModal';

const App: React.FC = () => {
  const {
    tickets,
    isLoading,
    isConnected,
    connectWallet,
    error,
    walletAddress,
    shortenedAddress,
    contractAddress,
    shortenedContract,
    networkName,
    redeemedCount,
    activeCount
  } = useWallet();
  
  const [selectedTicket, setSelectedTicket] = useState<NFTTicket | null>(null);

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-main text-gray-200 font-sans flex flex-col items-center justify-center p-4">
         <div className="text-center">
            <h1 className="text-5xl font-bold mb-2 text-white">Ticketor</h1>
            <p className="text-gray-400 mb-8">Your NFT Ticket Wallet</p>
            <button
                onClick={connectWallet}
                disabled={isLoading}
                className="bg-accent text-white font-bold py-3 px-8 rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center min-w-[180px]"
            >
                {isLoading ? (
                    <div className="w-6 h-6 border-2 border-white rounded-full animate-spin border-t-transparent"></div>
                ) : (
                    'Connect Wallet'
                )}
            </button>
            {error && <p className="text-red-500 mt-4 max-w-sm">{error}</p>}
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-main font-sans">
      <div className="container mx-auto max-w-3xl p-4 flex flex-col min-h-screen">
        <header className="flex justify-between items-center py-4">
          <h1 className="text-3xl font-bold text-white">Ticketor</h1>
        </header>

        <main className="flex flex-col flex-grow gap-6">
          <WalletHeader 
            walletAddress={walletAddress || ''}
            shortenedAddress={shortenedAddress}
            ticketCount={tickets.length}
            redeemedCount={redeemedCount}
            activeCount={activeCount}
          />

          {isLoading && tickets.length === 0 ? (
            <LoadingSpinner />
          ) : tickets.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 pb-8">
              {tickets.map((ticket) => (
                <TicketCard 
                  key={ticket.id} 
                  ticket={ticket} 
                  onClick={() => setSelectedTicket(ticket)} 
                />
              ))}
            </div>
          )}
        </main>
      </div>
      
      {selectedTicket && (
        <TicketDetailModal 
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          shortenedContract={shortenedContract}
          networkName={networkName}
        />
      )}
    </div>
  );
};

export default App;