import React from 'react';
import StatBox from './StatBox';
import { WalletIcon, CopyIcon, TicketIcon, CheckCircleIcon, ClockIcon } from './icons';

interface WalletHeaderProps {
  walletAddress: string;
  shortenedAddress: string;
  ticketCount: number;
  redeemedCount: number;
  activeCount: number;
}

const WalletHeader: React.FC<WalletHeaderProps> = ({
  walletAddress,
  shortenedAddress,
  ticketCount,
  redeemedCount,
  activeCount,
}) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4 p-4 bg-card rounded-xl">
        <WalletIcon className="w-10 h-10 text-accent" />
        <div className="flex-grow">
          <p className="text-xs text-gray-400">Meine Wallet</p>
          <p className="font-mono text-sm text-gray-200 font-medium">{shortenedAddress}</p>
        </div>
        <button onClick={handleCopy} className="p-2 text-gray-400 transition-colors rounded-full hover:bg-gray-700 hover:text-accent">
          <CopyIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="flex gap-4">
        <StatBox
          title="Tickets"
          value={ticketCount.toString()}
          icon={<TicketIcon className="w-6 h-6" />}
          colorClass="text-accent"
        />
        <StatBox
          title="Eingelöst"
          value={redeemedCount.toString()}
          icon={<CheckCircleIcon className="w-6 h-6" />}
          colorClass="text-green-500"
        />
        <StatBox
          title="Aktiv"
          value={activeCount.toString()}
          icon={<ClockIcon className="w-6 h-6" />}
          colorClass="text-orange-500"
        />
      </div>
    </div>
  );
};

export default WalletHeader;