"use client"

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Bird } from 'lucide-react';
import { useRouter } from 'next/navigation'; // Add this import
import { Input } from '../ui/input';
import { useGetPigeonSearchQuery } from '@/redux/featured/pigeon/pigeonApi';
import Spinner from '@/app/(commonLayout)/Spinner';

// Custom hook for debouncing
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default function PigeonHub() {
  const router = useRouter(); // Add this
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedPigeon, setSelectedPigeon] = useState(null);
  
  // Debounce search term with 500ms delay
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  // Fix the API query - use searchTerm parameter and debounced value
  const { data, isLoading } = useGetPigeonSearchQuery(
    debouncedSearchTerm ? [{ name: 'searchTerm', value: debouncedSearchTerm }] : []
  );
  
  const pigeonData = data?.data;
  console.log(pigeonData);

  useEffect(() => {
    if (debouncedSearchTerm?.length > 0 && pigeonData) {
      setSuggestions(pigeonData);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [debouncedSearchTerm, pigeonData]);

  const handleSuggestionClick = (pigeon) => {
    setSearchTerm(`${pigeon?.name} (${pigeon?.ringNumber})`); // Fixed: use ringNumber
    setSelectedPigeon(pigeon);
    setShowSuggestions(false);
    
    // Navigate to pigeon overview page
    router.push(`/pigeon-overview/${pigeon._id}`);
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setSelectedPigeon(null);
  };

  // Fix the loading state return
  if (isLoading) return <Spinner />;

  return (
    <div className="w-full h-screen bg-cover bg-center bg-no-repeat relative overflow-hidden"
       style={{
        backgroundImage: `url('https://i.ibb.co.com/WpnfSfZb/Log-in.png')`, 
      }}
    >
      <div className="relative z-10 flex flex-col items-center justify-center h-screen px-4">
        {/* Search Section */}
        <div className="w-full max-w-2xl mt-80 relative">
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white">
              <Search className="w-5 h-5" />
            </div>
            <Input
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              placeholder="Search pigeons by name or ring ID..."
              className="w-full px-12 py-4 text-lg rounded-full border-2 bg-black h-14 backdrop-blur-sm placeholder:text-white focus:outline-none focus:ring-2 focus:ring-white shadow-l text-white transition-all duration-300"
            />
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions?.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 max-h-96 overflow-y-auto z-50 backdrop-blur-sm">
              {suggestions?.map((pigeon, index) => (
                <div
                  key={pigeon._id} // Use _id instead of id
                  onClick={() => handleSuggestionClick(pigeon)}
                  className={`px-6 py-4 cursor-pointer hover:bg-blue-50 transition-colors duration-200 flex items-center justify-between ${
                    index !== suggestions?.length - 1 ? 'border-b border-slate-100' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Bird className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">{pigeon?.name}</div>
                      <div className="text-sm text-slate-500">Ring ID: {pigeon?.ringNumber}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No results */}
          {showSuggestions && suggestions?.length === 0 && searchTerm?.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 p-6 text-center backdrop-blur-sm bg-white/95">
              <Bird className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No pigeons found matching your search</p>
            </div>
          )}
        </div>

        {/* Selected Pigeon Display */}
        {selectedPigeon && (
          <div className="mt-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-md w-full border border-slate-200">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bird className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">{selectedPigeon.name}</h3>
              <div className="text-sm text-slate-600 mb-4">
                <div className="bg-slate-100 rounded-full px-3 py-1 inline-block mb-2">
                  Ring ID: {selectedPigeon.ringNumber}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center mt-6">
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-blue-600">12</div>
                  <div className="text-xs text-slate-500">Races</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-green-600">8</div>
                  <div className="text-xs text-slate-500">Wins</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-orange-600">3rd</div>
                  <div className="text-xs text-slate-500">Rank</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}