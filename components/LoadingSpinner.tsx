import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center flex-grow gap-4">
      <div className="w-12 h-12 border-4 border-accent rounded-full animate-spin border-t-transparent"></div>
      <p className="text-gray-400">Lade Tickets...</p>
    </div>
  );
};

export default LoadingSpinner;