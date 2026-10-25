import React, { useCallback, useEffect, useState } from "react";
import {
  Calendar,
  Copy,
  Eye,
  Link2,
  Loader2,
  User,
} from "lucide-react";
import toast from "react-hot-toast";
import { orderService } from "../../lib/api/services/orders";
import { useProductLineStore } from "../../store/productLineStore";
import { cn } from "../../lib/utils";
import type { CheckoutLinkRecord } from "../../lib/types/checkoutLinks";

function formatCreatedAt(value: string): string {
  const normalized = value.includes("T") ? value : value.replace(" ", "T");
  const d = new Date(normalized);
  if (Number.isNaN(d.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(d);
}

function productCount(row: CheckoutLinkRecord): number {
  const fromUser = row.user_data?.product_id;
  if (Array.isArray(fromUser) && fromUser.length > 0) return fromUser.length;
  if (row.product_id?.trim()) {
    return row.product_id.split(",").map((s) => s.trim()).filter(Boolean).length;
  }
  return 0;
}

function customerName(row: CheckoutLinkRecord): string {
  const fn = row.user_data?.first_name?.trim();
  const ln = row.user_data?.last_name?.trim();
  if (fn || ln) return [fn, ln].filter(Boolean).join(" ");
  return "—";
}

export function GeneratedCheckoutLinksPage() {
  const { selectedLine } = useProductLineStore();
  const [rows, setRows] = useState<CheckoutLinkRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewRow, setViewRow] = useState<CheckoutLinkRecord | null>(null);

  const load = useCallback(async () => {
    if (!selectedLine) return;
    setIsLoading(true);
    try {
      const res = await orderService.getAllCheckoutLinks(selectedLine);
      if (res.status === 1 && Array.isArray(res.data)) {
        setRows(res.data);
      } else {
        setRows([]);
        toast.error(res.message || "Failed to load checkout links");
      }
    } catch {
      setRows([]);
      toast.error("Failed to load checkout links");
    } finally {
      setIsLoading(false);
    }
  }, [selectedLine]);

  useEffect(() => {
    load();
  }, [load]);

  const handleCopy = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Link copied");
    } catch {
      toast.error("Could not copy link");
    }
  };

  const isPending = (status: number) => status === 0;

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-10">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Link2 className="h-6 w-6 text-primary-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Generated checkout links
          </h1>
        </div>
        <p className="text-gray-600">
          View checkout links created from the sales portal.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-gray-600">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600 mr-2" />
          Loading…
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 py-16 text-center text-gray-500">
          No checkout links found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/90">
                <th className="px-5 py-3 font-medium text-xs uppercase tracking-wide text-gray-500">
                  ID
                </th>
                <th className="px-5 py-3 font-medium text-xs uppercase tracking-wide text-gray-500">
                  Customer
                </th>
                <th className="px-5 py-3 font-medium text-xs uppercase tracking-wide text-gray-500">
                  Products
                </th>
                <th className="px-5 py-3 font-medium text-xs uppercase tracking-wide text-gray-500">
                  Status
                </th>
                <th className="px-5 py-3 font-medium text-xs uppercase tracking-wide text-gray-500">
                  Actions
                </th>
                <th className="px-5 py-3 font-medium text-xs uppercase tracking-wide text-gray-500">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((row) => {
                const pending = isPending(row.status);
                const count = productCount(row);
                return (
                  <tr key={row.checkout_link_id} className="hover:bg-gray-50/80">
                    <td className="px-5 py-4 align-top text-gray-900 font-medium whitespace-nowrap">
                      #{row.checkout_link_id}
                    </td>
                    <td className="px-5 py-4 align-top">
                      <div className="flex gap-3 min-w-[200px]">
                        <div className="shrink-0 h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                          <User className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {customerName(row)}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5 break-all">
                            {row.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 align-top text-gray-700 min-w-[140px]">
                      <div>
                        {count} product(s)
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        IDs: {row.product_id}
                      </div>
                    </td>
                    <td className="px-5 py-4 align-top whitespace-nowrap">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                          row.status === 1
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-900"
                        )}
                      >
                        {row.status === 1 ? "Completed" : "Pending"}
                      </span>
                    </td>
                    <td className="px-5 py-4 align-top">
                      {pending ? (
                        <div className="flex flex-wrap gap-1.5">
                          <button
                            type="button"
                            onClick={() => setViewRow(row)}
                            className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCopy(row.checkout_link)}
                            className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                          >
                            <Copy className="h-3.5 w-3.5" />
                            Copy
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 align-top text-gray-700 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4 shrink-0 text-gray-400" />
                        {formatCreatedAt(row.created_at)}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {viewRow && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="presentation"
          onClick={() => setViewRow(null)}
        >
          <div
            className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              Checkout link
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              #{viewRow.checkout_link_id} · {customerName(viewRow)}
            </p>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 mb-4">
              <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                URL
              </p>
              <p className="text-sm text-primary-700 break-all font-mono">
                {viewRow.checkout_link}
              </p>
            </div>
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
              <button
                type="button"
                onClick={() => setViewRow(null)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => handleCopy(viewRow.checkout_link)}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
              >
                <Copy className="h-4 w-4" />
                Copy link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
