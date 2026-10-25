import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { getCitiesByState, type City } from '../../lib/addressUtils';

interface CitySelectProps {
  value: string;
  onChange: (value: string) => void;
  stateName: string;
  disabled?: boolean;
}

export function CitySelect({ value, onChange, stateName, disabled }: CitySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadCities() {
      if (!stateName) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const cityData = await getCitiesByState(stateName);
        setCities(cityData);
      } catch (err) {
        setError('Failed to load cities');
      } finally {
        setIsLoading(false);
      }
    }

    if (stateName) {
      loadCities();
    } else {
      setCities([]);
    }
  }, [stateName]);

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

  const filteredCities = cities.filter(city =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (cityName: string) => {
    onChange(cityName);
    closeDropdown();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className={cn(
          "relative w-full cursor-pointer border border-gray-300 rounded-md",
          "focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500",
          isOpen && "ring-2 ring-indigo-500/20 border-indigo-500",
          disabled && "bg-gray-50 cursor-not-allowed"
        )}
        onClick={() => !disabled && !isLoading && setIsOpen(!isOpen)}
      >
        <div className="flex items-center px-3 py-2">
          <input
            type="text"
            className={cn(
              "w-full bg-transparent border-none focus:outline-none p-0",
              disabled && "cursor-not-allowed"
            )}
            placeholder={disabled ? "Select a state first" : "Select city"}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            readOnly={isOpen}
          />
          {isLoading ? (
            <Loader2 className="h-5 w-5 text-gray-400 animate-spin ml-2" />
          ) : isOpen ? (
            <ChevronUp className="h-5 w-5 text-gray-400 ml-2" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400 ml-2" />
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
                  placeholder="Search cities..."
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
                  Loading cities...
                </div>
              ) : error ? (
                <div className="p-4 text-center text-red-500">{error}</div>
              ) : filteredCities.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No cities found</div>
              ) : (
                <div className="py-2">
                  {filteredCities.map((city) => (
                    <div
                      key={city.name}
                      className={cn(
                        "px-4 py-2 cursor-pointer hover:bg-gray-100",
                        value === city.name && "bg-indigo-50"
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(city.name);
                      }}
                    >
                      {city.name}
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