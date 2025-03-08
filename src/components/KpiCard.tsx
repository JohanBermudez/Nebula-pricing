import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { KpiCard as KpiCardType } from '../types';

interface KpiCardProps {
  data: KpiCardType;
}

const KpiCard: React.FC<KpiCardProps> = ({ data }) => {
  const { title, value, change, icon } = data;

  const getChangeIcon = () => {
    switch (change.type) {
      case 'increase':
        return <ArrowUpRight className="h-4 w-4 text-green-500" />;
      case 'decrease':
        return <ArrowDownRight className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getChangeColor = () => {
    switch (change.type) {
      case 'increase':
        return 'text-green-500';
      case 'decrease':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className="bg-indigo-100 p-2 rounded-md">
          <span dangerouslySetInnerHTML={{ __html: icon }} />
        </div>
      </div>
      <div className="flex items-center mt-4">
        {getChangeIcon()}
        <span className={`text-sm ml-1 ${getChangeColor()}`}>{change.value}</span>
        <span className="text-gray-500 text-sm ml-1">vs último período</span>
      </div>
    </div>
  );
};

export default KpiCard;
