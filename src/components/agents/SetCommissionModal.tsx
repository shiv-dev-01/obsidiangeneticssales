import React, { useEffect, useState } from 'react';
import { DollarSign, Loader2, Percent, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { Agent } from '../../lib/types/agent';

type CommissionType = 'percentage' | 'dollar';

interface SetCommissionModalProps {
  agent: Agent;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (commission: number, commissionType: CommissionType) => void;
}

export function SetCommissionModal({
  agent,
  isSubmitting,
  onClose,
  onSubmit,
}: SetCommissionModalProps) {
  const [commissionType, setCommissionType] = useState<CommissionType>(
    agent.commission_type === 'dollar' ? 'dollar' : 'percentage'
  );
  const [commissionValue, setCommissionValue] = useState(agent.commission);

  useEffect(() => {
    setCommissionType(agent.commission_type === 'dollar' ? 'dollar' : 'percentage');
    setCommissionValue(agent.commission);
  }, [agent]);

  const numericValue = parseFloat(commissionValue);
  const isPercentage = commissionType === 'percentage';
  const isValid =
    commissionValue.trim() !== '' &&
    !Number.isNaN(numericValue) &&
    numericValue >= 0 &&
    (!isPercentage || numericValue <= 100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isSubmitting) return;
    onSubmit(numericValue, commissionType);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl bg-white shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="set-commission-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 id="set-commission-title" className="text-lg font-semibold text-gray-900">
            Set Commission for Admin
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">
              Commission Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setCommissionType('percentage')}
                disabled={isSubmitting}
                className={cn(
                  'flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors',
                  isPercentage
                    ? 'border-violet-700 bg-violet-50 text-violet-900'
                    : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
                )}
              >
                <Percent className="h-4 w-4" />
                Percentage (%)
              </button>
              <button
                type="button"
                onClick={() => setCommissionType('dollar')}
                disabled={isSubmitting}
                className={cn(
                  'flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors',
                  !isPercentage
                    ? 'border-violet-700 bg-violet-50 text-violet-900'
                    : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
                )}
              >
                <DollarSign className="h-4 w-4" />
                Fixed Amount ($)
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="commission-value"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {isPercentage ? 'Commission Percentage (%)' : 'Commission Fixed Amount ($)'}
            </label>
            <div className="relative">
              <input
                id="commission-value"
                type="number"
                min={0}
                max={isPercentage ? 100 : undefined}
                step={isPercentage ? 0.01 : 0.01}
                value={commissionValue}
                onChange={(e) => setCommissionValue(e.target.value)}
                disabled={isSubmitting}
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-3 pr-10 text-sm text-gray-900 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 disabled:opacity-50"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                {isPercentage ? '%' : '$'}
              </span>
            </div>
            <p className="mt-1.5 text-xs text-gray-500">
              {isPercentage
                ? 'Enter a value between 0 and 100'
                : 'Enter a fixed dollar amount (0 or greater)'}
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="inline-flex items-center gap-2 rounded-lg bg-violet-900 px-4 py-2 text-sm font-medium text-white hover:bg-violet-950 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Update Commission
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
