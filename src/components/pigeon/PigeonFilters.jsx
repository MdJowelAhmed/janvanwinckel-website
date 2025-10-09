"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import { getNames } from "country-list";

const PigeonFilters = ({ onFilterChange, onSearch, searchTerm }) => {
  const [filters, setFilters] = useState({
    country: "all",
    gender: "all",
    year: "",
  });
  const [countries, setCountries] = useState([]);
  const [yearSearch, setYearSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    setCountries(getNames().sort());
  }, []);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    const filterArray = Object.entries(newFilters)
      .filter(([_, val]) => val !== "" && val !== "all")
      .map(([key, value]) => ({ name: key, value }));

    onFilterChange(filterArray);
  };

  const handleSearchChange = (e) => {
    onSearch(e.target.value);
  };

  // Generate year list (last 50 years)
  const currentYear = new Date().getFullYear();
  const allYears = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const filteredYears = allYears.filter((year) =>
    year.toString().includes(yearSearch)
  );

  const handleSelectYear = (year) => {
    setYearSearch(year.toString());
    setShowDropdown(false);
    handleFilterChange("birthYear", year.toString());
  };

  return (
    <div className="bg-foreground text-white rounded-b-lg">
      <CardContent className="p-4">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-8">
          {/* Search */}
          <div className="lg:col-span-2">
            <Label htmlFor="search" className="text-white text-sm font-medium mb-2 block">
              Search
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="search"
                placeholder="Ring number, name..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10 py-6 border-slate-500 text-white placeholder:text-gray-400 focus:border-teal-400"
              />
            </div>
          </div>

          {/* Country Filter */}
          <div>
            <Label htmlFor="country" className="text-white text-sm font-medium mb-2 block">
              Country
            </Label>
            <select
              value={filters.country}
              onChange={(e) => handleFilterChange("country", e.target.value)}
              className="border border-slate-500 bg-primary-foreground text-white focus:border-teal-400 w-full py-[14px] px-2 rounded-md"
            >
              <option value="all">All Countries</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          {/* Gender Filter */}
          <div>
            <Label htmlFor="gender" className="text-white text-sm font-medium mb-2 block">
              Gender
            </Label>
            <select
              value={filters.gender}
              onChange={(e) => handleFilterChange("gender", e.target.value)}
              className="border border-slate-500 bg-primary-foreground text-white focus:border-teal-400 w-full py-[14px] px-2 rounded-md"
            >
              <option value="all">All Genders</option>
              <option value="Hen">Hen</option>
              <option value="Cock">Cock</option>
            </select>
          </div>

          {/* Birth Year (typeable input with dropdown) */}
          <div className="relative w-full">
            <Label className="block text-sm font-medium text-white mb-2">
              Birth Year
            </Label>

            <input
              type="text"
              value={yearSearch}
              onChange={(e) => {
                setYearSearch(e.target.value);
                setShowDropdown(true);
              }}
              placeholder="Enter or select year"
              className="w-full px-3 py-[14px] border border-slate-500 bg-transparent rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 100)} // delay close for click
            />

            {showDropdown && (
              <ul className="absolute z-10 w-full bg-foreground border border-slate-500 rounded-lg max-h-48 overflow-y-auto shadow-md mt-1">
                {filteredYears.length > 0 ? (
                  filteredYears.map((year) => (
                    <li
                      key={year}
                      onClick={() => handleSelectYear(year)}
                      className="px-3 py-2 hover:bg-teal-600 cursor-pointer"
                    >
                      {year}
                    </li>
                  ))
                ) : (
                  <li className="px-3 py-2 text-gray-400">No results found</li>
                )}
              </ul>
            )}
          </div>
        </div>
      </CardContent>
    </div>
  );
};

export default PigeonFilters;
