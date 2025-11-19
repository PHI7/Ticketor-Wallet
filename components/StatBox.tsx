import React from 'react';

interface StatBoxProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  colorClass: string;
}

const StatBox: React.FC<StatBoxProps> = ({ title, value, icon, colorClass }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-2 p-4 text-center bg-card rounded-xl flex-1">
      <div className={colorClass}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{title}</p>
    </div>
  );
};

export default StatBox;