import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Calendar,
  Loader2,
  Mail,
  Percent,
  Search,
  ShoppingBag,
  User,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { agentService } from '../../lib/api/services/agents';
import { useProductLineStore } from '../../store/productLineStore';
import { SetCommissionModal } from '../../components/agents/SetCommissionModal';
import type { Agent } from '../../lib/types/agent';

function formatCreatedAt(value: string): string {
  const normalized = value.includes('T') ? value : value.replace(' ', 'T');
  const d = new Date(normalized);
  if (Number.isNaN(d.getTime())) return value;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d);
}

function formatCommission(agent: Agent): string {
  if (agent.commission_type === 'dollar') {
    return `$ ${agent.commission}`;
  }
  return `% ${agent.commission}%`;
}

export function AgentsPage() {
  const navigate = useNavigate();
  const { selectedLine } = useProductLineStore();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [commissionAgent, setCommissionAgent] = useState<Agent | null>(null);
  const [isUpdatingCommission, setIsUpdatingCommission] = useState(false);

  const load = useCallback(async () => {
    if (!selectedLine) return;
    setIsLoading(true);
    try {
      const res = await agentService.getAllAgents(selectedLine);
      if (res.status === 1 && Array.isArray(res.data)) {
        setAgents(res.data);
      } else {
        setAgents([]);
        toast.error(res.message || 'Failed to load agents');
      }
    } catch {
      setAgents([]);
      toast.error('Failed to load agents');
    } finally {
      setIsLoading(false);
    }
  }, [selectedLine]);

  useEffect(() => {
    load();
  }, [load]);

  const filteredAgents = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return agents;
    return agents.filter(
      (agent) =>
        agent.name.toLowerCase().includes(q) ||
        agent.email.toLowerCase().includes(q)
    );
  }, [agents, search]);

  const handleViewOrders = (agent: Agent) => {
    navigate(`/agents/${agent.id}/orders`, { state: { agentName: agent.name } });
  };

  const handleUpdateCommission = async (
    commission: number,
    commissionType: 'percentage' | 'dollar'
  ) => {
    if (!selectedLine || !commissionAgent) return;

    setIsUpdatingCommission(true);
    try {
      const res = await agentService.editCommission(selectedLine, {
        id: commissionAgent.id,
        commission,
        commission_type: commissionType,
      });

      if (res.status === 1) {
        toast.success(res.message || 'Commission updated successfully');
        setCommissionAgent(null);
        await load();
      } else {
        toast.error(res.message || 'Failed to update commission');
      }
    } catch {
      toast.error('Failed to update commission');
    } finally {
      setIsUpdatingCommission(false);
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-10">
      <p className="text-gray-600 mb-4">View and manage agent information</p>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search agents by name or email..."
          className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-gray-600">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600 mr-2" />
          Loading…
        </div>
      ) : filteredAgents.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 py-16 text-center text-gray-500">
          {search.trim() ? 'No agents match your search.' : 'No agents found.'}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/90">
                <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wide text-gray-500">
                  Agent
                </th>
                <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wide text-gray-500">
                  Email
                </th>
                <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wide text-gray-500">
                  Commission
                </th>
                <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wide text-gray-500">
                  Created Date
                </th>
                <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wide text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAgents.map((agent) => (
                <tr key={agent.id} className="hover:bg-gray-50/80">
                  <td className="px-5 py-4 align-middle">
                    <div className="flex items-center gap-3 min-w-[180px]">
                      <div className="shrink-0 h-10 w-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-600">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{agent.name}</div>
                        <div className="text-xs text-gray-500 mt-0.5">ID: {agent.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 align-middle">
                    <div className="flex items-center gap-2 text-gray-700 min-w-[200px]">
                      <Mail className="h-4 w-4 shrink-0 text-gray-400" />
                      <span className="break-all">{agent.email}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 align-middle whitespace-nowrap">
                    <span className="inline-flex items-center rounded-md bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-800">
                      {formatCommission(agent)}
                    </span>
                  </td>
                  <td className="px-5 py-4 align-middle whitespace-nowrap">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Calendar className="h-4 w-4 shrink-0 text-gray-400" />
                      {formatCreatedAt(agent.created_at)}
                    </div>
                  </td>
                  <td className="px-5 py-4 align-middle">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleViewOrders(agent)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-violet-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-violet-950 transition-colors"
                      >
                        <ShoppingBag className="h-3.5 w-3.5" />
                        View Orders
                      </button>
                      <button
                        type="button"
                        onClick={() => setCommissionAgent(agent)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-orange-600 transition-colors"
                      >
                        <Percent className="h-3.5 w-3.5" />
                        Set Commission
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {commissionAgent && (
        <SetCommissionModal
          agent={commissionAgent}
          isSubmitting={isUpdatingCommission}
          onClose={() => !isUpdatingCommission && setCommissionAgent(null)}
          onSubmit={handleUpdateCommission}
        />
      )}
    </div>
  );
}
