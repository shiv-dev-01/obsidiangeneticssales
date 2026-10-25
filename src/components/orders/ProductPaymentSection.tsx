import React, { useEffect } from 'react';
import { CreditCard, Loader2 } from 'lucide-react';
import { useOrderStore } from '../../store/orderStore';
import { useProductLineStore } from '../../store/productLineStore';
import { gatewayService } from '../../lib/api/services/gateways';
import { cn } from '../../lib/utils';
import type { Product } from '../../lib/types';
import toast from 'react-hot-toast';

interface ProductPaymentSectionProps {
  product: Product;
}

export function ProductPaymentSection({ product }: ProductPaymentSectionProps) {
  const { selectedLine } = useProductLineStore();
  const { productGateways, setProductGateway } = useOrderStore();
  const [gateways, setGateways] = React.useState<Gateway[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    const loadGateways = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await gatewayService.getGateways(selectedLine);
        if (response.status === 1 && Array.isArray(response.gateway_data)) {
          setGateways(response.gateway_data);
        } else {
          setError('Failed to load payment gateways');
          toast.error('Failed to load payment gateways');
        }
      } catch (err) {
        setError('Failed to load payment gateways');
        toast.error('Failed to load payment gateways');
      } finally {
        setIsLoading(false);
      }
    };

    loadGateways();
  }, [selectedLine]);

  const selectedGateway = productGateways[product.product_id];

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
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          Payment Gateway for {product.product_name}
        </h3>
        <span className="text-sm text-gray-500">
          SKU: {product.product_sku}
        </span>
      </div>

      <div className="space-y-4">
        {gateways.map((gateway) => (
          <label
            key={gateway.gateway_id}
            className={cn(
              'flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all duration-200',
              selectedGateway?.gateway_id === gateway.gateway_id
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-primary-200'
            )}
          >
            <div className="flex items-center">
              <input
                type="radio"
                name={`gateway-${product.product_id}`}
                checked={selectedGateway?.gateway_id === gateway.gateway_id}
                onChange={() => setProductGateway(product.product_id, gateway)}
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

        {gateways.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No payment gateways available
          </div>
        )}
      </div>
    </div>
  );
}