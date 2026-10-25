import React, { useEffect, useState, useRef } from 'react';
import { Building2, Search, X, ChevronDown, ChevronUp } from 'lucide-react';
import { getCampaigns, type Campaign } from '../../lib/api';
import { useOrderStore } from '../../store/orderStore';
import { cn } from '../../lib/utils';

export function CampaignSection() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { selectedCampaign, setSelectedCampaign } = useOrderStore();

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await getCampaigns();
        setCampaigns(response.campaigns);
      } catch (err) {
        setError('Failed to load campaigns');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.campaign_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsOpen(false);
    setSearchTerm('');
  };

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Campaign Selection</h2>
      
      <div className="relative" ref={dropdownRef}>
        <div
          className={cn(
            "relative w-full cursor-pointer border border-gray-300 rounded-lg",
            "focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-500",
            isOpen && "ring-2 ring-primary-500/20 border-primary-500"
          )}
          onClick={() => !isLoading && setIsOpen(true)}
        >
          {/* Selected Campaign Display */}
          <div className="flex items-center px-3 py-2">
            <Building2 className="h-5 w-5 text-gray-400 mr-2" />
            <span className="flex-1">
              {selectedCampaign ? (
                selectedCampaign.campaign_name
              ) : (
                <span className="text-gray-500">Select a campaign</span>
              )}
            </span>
            {selectedCampaign && (
              <button
                type="button"
                className="p-1 hover:bg-gray-100 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedCampaign(null);
                }}
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            )}
            {isOpen ? (
              <ChevronUp className="h-5 w-5 text-gray-400 ml-2" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400 ml-2" />
            )}
          </div>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
              <div className="p-2">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    placeholder="Search campaigns..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
              
              <div className="max-h-60 overflow-auto">
                {isLoading ? (
                  <div className="p-4 text-center text-gray-500">
                    Loading campaigns...
                  </div>
                ) : filteredCampaigns.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No campaigns found
                  </div>
                ) : (
                  <div className="py-2">
                    {filteredCampaigns.map((campaign) => (
                      <div
                        key={campaign.campaign_id}
                        className={cn(
                          "px-4 py-2 cursor-pointer hover:bg-gray-100",
                          selectedCampaign?.campaign_id === campaign.campaign_id && "bg-primary-50"
                        )}
                        onClick={() => handleSelect(campaign)}
                      >
                        {campaign.campaign_name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}