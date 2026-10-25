import React, { useState } from 'react';
import { CheckCircle, Copy, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface CheckoutLinkDialogProps {
  checkoutLink: string;
  message: string;
  onClose: () => void;
}

export function CheckoutLinkDialog({
  checkoutLink,
  message,
  onClose,
}: CheckoutLinkDialogProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(checkoutLink);
      setCopied(true);
      toast.success('Link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Could not copy link');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2 pr-2">
            <CheckCircle className="h-6 w-6 text-green-500 shrink-0" />
            <h2 className="text-lg font-semibold text-gray-900">Checkout link ready</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors shrink-0"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-gray-600 text-sm mb-4">{message}</p>

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 mb-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            Checkout URL
          </p>
          <p className="text-sm text-primary-700 break-all font-mono">{checkoutLink}</p>
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors"
          >
            <Copy className="h-4 w-4" />
            {copied ? 'Copied' : 'Copy link'}
          </button>
        </div>
      </div>
    </div>
  );
}
