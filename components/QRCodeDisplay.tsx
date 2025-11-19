import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeDisplayProps {
  value: string;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ value }) => {
  return (
    <div className="p-2 bg-white rounded-lg">
      <QRCodeSVG 
        value={value} 
        size={220} 
        bgColor={"#ffffff"}
        fgColor={"#000000"}
        level={"H"}
        includeMargin={false}
        className="w-full h-full"
      />
    </div>
  );
};

export default QRCodeDisplay;