import React, { useState, useEffect } from 'react';
import { CreditCard, Loader2 } from 'lucide-react';
import axios from 'axios';
import { cn } from '../../lib/utils';

interface Gateway {
  name: string;
  gateway_id: number;
}

interface GatewaySectionProps {
  value?: number;
  onChange?: (gateway: Gateway) => void;
}

export function GatewaySection({ value, onChange }: GatewaySectionProps) {
  const [gateways, setGateways] = useState<Gateway[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGateways = async () => {
      try {
        const response = await axios.get('https://panel.whitelabelmd.com/obsidian/api/get_gateway');
        if (response.data.status === 1) {
          setGateways(response.data.gateway_data);
        } else {
          setError('Failed to load gateways');
        }
      } catch (err) {
        setError('Failed to load gateways');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGateways();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          <span className="ml-2 text-gray-600">Loading payment gateways...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Gateway</h2>

      <div className="space-y-4">
        {gateways.map((gateway) => (
          <label
            key={gateway.gateway_id}
            className={cn(
              'flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all duration-200',
              value === gateway.gateway_id
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-primary-200'
            )}
          >
            <div className="flex items-center">
              <input
                type="radio"
                name="gateway"
                checked={value === gateway.gateway_id}
                onChange={() => onChange?.(gateway)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
              />
              <div className="ml-4">
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="font-medium">{gateway.name}</span>
                </div>
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}