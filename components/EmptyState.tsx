import React from 'react';
import { TicketIcon } from './icons';

const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center flex-grow gap-4 text-center">
      <TicketIcon className="w-20 h-20 text-gray-700" />
      <h2 className="text-xl font-bold text-gray-200">Keine Tickets vorhanden</h2>
      <p className="max-w-xs text-gray-400">Ihre gekauften Tickets werden hier angezeigt.</p>
    </div>
  );
};

export default EmptyState;