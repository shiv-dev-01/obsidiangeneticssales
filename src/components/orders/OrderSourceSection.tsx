import React from 'react';
import { Headphones } from 'lucide-react';
import { useOrderStore } from '../../store/orderStore';
import { cn } from '../../lib/utils';

export function OrderSourceSection() {
  const { isCallCenter, setIsCallCenter } = useOrderStore();

  const handleSourceChange = (checked: boolean) => {
    setIsCallCenter(checked);
    console.log('Call Center Selected:', checked); // Log selection change
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Headphones className="h-5 w-5 text-gray-400" />
        <h2 className="text-lg font-medium text-gray-900">Order Source</h2>
      </div>
      
      <label className={cn(
        "flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all duration-200",
        isCallCenter ? "border-primary-500 bg-primary-50" : "border-gray-200 hover:bg-gray-50"
      )}>
        <input
          type="checkbox"
          checked={isCallCenter}
          onChange={(e) => handleSourceChange(e.target.checked)}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <div>
          <span className="font-medium text-gray-900">Call Center</span>
          <p className="text-sm text-gray-500 mt-1">Orders processed through the call center</p>
        </div>
      </label>
    </div>
  );
}