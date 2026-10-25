import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { State } from '../../lib/addressUtils';

interface StateSelectProps {
  value: string;
  onChange: (value: string, stateName: string) => void;
  states: State[];
  isLoading?: boolean;
  error?: string;
}

export function StateSelect({ value, onChange, states, isLoading, error }: StateSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const closeDropdown = () => {
    setIsOpen(false);
    setSearchTerm('');
  };

  const filteredStates = states.filter(state =>
    state.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    state.state_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedState = states.find(state => state.state_code === value);

  const handleStateSelect = (state: State) => {
    onChange(state.state_code, state.name);
    closeDropdown();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className={cn(
          "relative w-full cursor-pointer border border-gray-300 rounded-md",
          "focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500",
          isOpen && "ring-2 ring-indigo-500/20 border-indigo-500"
        )}
        onClick={() => !isLoading && setIsOpen(!isOpen)}
      >
        <div className="flex items-center px-3 py-2">
          <span className="flex-1">
            {selectedState ? `${selectedState.name} (${selectedState.state_code})` : 'Select state'}
          </span>
          {isLoading ? (
            <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
          ) : isOpen ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </div>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
            <div className="p-2">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  placeholder="Search states..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  autoFocus
                />
              </div>
            </div>

            <div className="max-h-60 overflow-auto">
              {isLoading ? (
                <div className="p-4 text-center text-gray-500">
                  <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
                  Loading states...
                </div>
              ) : error ? (
                <div className="p-4 text-center text-red-500">{error}</div>
              ) : filteredStates.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No states found</div>
              ) : (
                <div className="py-2">
                  {filteredStates.map((state) => (
                    <div
                      key={state.state_code}
                      className={cn(
                        "px-4 py-2 cursor-pointer hover:bg-gray-100",
                        value === state.state_code && "bg-indigo-50"
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStateSelect(state);
                      }}
                    >
                      {state.name} ({state.state_code})
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}