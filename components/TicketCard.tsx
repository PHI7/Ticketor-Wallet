import React from 'react';
import type { NFTTicket } from '../types';
import { CalendarIcon, MapPinIcon } from './icons';

interface TicketCardProps {
  ticket: NFTTicket;
  onClick: () => void;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket, onClick }) => {
  return (
    <div 
      className="flex flex-col bg-card rounded-2xl overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-300 ring-1 ring-white/10"
      onClick={onClick}
    >
      <div className="relative h-40">
        <img
          src={ticket.imageURL || 'https://picsum.photos/400/300'}
          alt={ticket.eventName}
          className="object-cover w-full h-full"
        />
        <div className={`absolute top-2 right-2 px-2 py-1 text-xs font-bold text-white rounded-md ${ticket.isRedeemed ? 'bg-green-600' : 'bg-orange-600'}`}>
          {ticket.isRedeemed ? 'Eingelöst' : 'Gültig'}
        </div>
      </div>
      <div className="flex flex-col p-4 space-y-2">
        <h3 className="font-bold text-gray-100 truncate">{ticket.eventName}</h3>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <CalendarIcon className="w-4 h-4" />
          <span>{ticket.eventDate}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <MapPinIcon className="w-4 h-4" />
          <span className="truncate">{ticket.venue}</span>
        </div>
        <div className="pt-2">
            <span className="px-2 py-1 text-xs font-semibold text-accent bg-accent/20 rounded-full">
            {ticket.categoryName}
            </span>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;