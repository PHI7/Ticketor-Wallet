import React from 'react';
import type { NFTTicket } from '../types';
import { CalendarIcon, ClockIcon, MapPinIcon, XCircleIcon, CheckCircleIcon } from './icons';
import QRCodeDisplay from './QRCodeDisplay';

interface TicketDetailModalProps {
  ticket: NFTTicket;
  onClose: () => void;
  shortenedContract: string;
  networkName: string;
}

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between items-center text-sm">
    <span className="text-gray-400">{label}</span>
    <span className="font-medium text-gray-200 font-mono">{value}</span>
  </div>
);

const TicketDetailModal: React.FC<TicketDetailModalProps> = ({ ticket, onClose, shortenedContract, networkName }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="relative w-full max-w-md max-h-[90vh] m-4 bg-card rounded-3xl shadow-2xl shadow-black/50 overflow-hidden ring-1 ring-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white z-10 transition-transform hover:scale-110">
          <XCircleIcon className="w-8 h-8" />
        </button>
        <div className="overflow-y-auto max-h-[90vh]">
          <div className="h-48 bg-gray-700">
             <img src={ticket.imageURL || 'https://picsum.photos/400/200'} alt={ticket.eventName} className="object-cover w-full h-full" />
          </div>
          <div className="p-6 space-y-6 bg-card rounded-t-3xl -mt-8">
            <h2 className="text-3xl font-bold text-white">{ticket.eventName}</h2>
            
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center gap-3"><CalendarIcon className="w-5 h-5 text-accent" /><span>{ticket.eventDate}</span></div>
              <div className="flex items-center gap-3"><ClockIcon className="w-5 h-5 text-accent" /><span>{ticket.eventTime}</span></div>
              <div className="flex items-center gap-3"><MapPinIcon className="w-5 h-5 text-accent" /><span>{ticket.venue}</span></div>
            </div>

            <hr className="border-gray-700"/>

            <div className="flex justify-between">
              <div>
                <p className="text-xs text-gray-400">Kategorie</p>
                <p className="font-bold text-lg text-white">{ticket.categoryName}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Ticket ID</p>
                <p className="font-mono font-bold text-lg text-white">#{ticket.tokenId}</p>
              </div>
            </div>
            
            <div className="flex flex-col items-center justify-center p-4 text-center bg-main rounded-xl">
              <p className="font-semibold text-gray-200 mb-2">Ihr Eintrittscode</p>
              {ticket.isRedeemed ? (
                <div className="flex flex-col items-center gap-4 py-8">
                  <CheckCircleIcon className="w-24 h-24 text-green-500"/>
                  <p className="text-2xl font-bold text-green-500">Ticket eingelöst</p>
                  <p className="text-sm text-gray-400">Eingelöst am {ticket.redeemedDate}</p>
                </div>
              ) : (
                <>
                  <QRCodeDisplay value={ticket.qrCodeString} />
                  <p className="mt-3 text-xs text-gray-400">Zeigen Sie diesen Code am Eingang vor.</p>
                </>
              )}
            </div>

            <div className="p-4 space-y-3 bg-main rounded-xl">
              <h3 className="font-semibold text-gray-200">Blockchain-Details</h3>
              <InfoRow label="Contract" value={shortenedContract} />
              <InfoRow label="Token ID" value={ticket.tokenId} />
              <InfoRow label="Network" value={networkName} />
              <InfoRow label="Status" value={ticket.isRedeemed ? 'Eingelöst' : 'Gültig'} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailModal;