"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import { getNames } from "country-list";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const PigeonFilters = ({ onFilterChange, onSearch, searchTerm }) => {
  const [filters, setFilters] = useState({
    country: "all",
    gender: "all",
    birthYear: "",
  });
  const [countries, setCountries] = useState([]);
  const [yearSearch, setYearSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  useEffect(() => {
    setCountries(getNames().sort());
  }, []);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    // Convert filters to array for API
    const filterArray = Object.entries(newFilters)
      .filter(([_, val]) => val !== "" && val !== "all")
      .map(([key, value]) => ({ name: key, value }));

    onFilterChange(filterArray);
  };

  const handleSearchChange = (e) => {
    // Trim leading and trailing spaces
    onSearch(e.target.value.trim());
  };

  // Generate last 100 years for dropdown
  const currentYear = new Date().getFullYear();

  const allYears = Array.from(
    { length: 100 + 3 },
    (_, i) => currentYear + 2 - i
  );

  const filteredYears = allYears.filter((year) =>
    year.toString().includes(yearSearch)
  );

  const handleSelectYear = (year) => {
    setYearSearch(year.toString());
    setShowDropdown(false);
    handleFilterChange("birthYear", year.toString());
  };

  const handleYearInputChange = (e) => {
    const value = e.target.value;
    setYearSearch(value);
    setShowDropdown(true);

    // If empty, clear the filter
    if (value === "") {
      handleFilterChange("birthYear", "all");
    }
  };

  const handleCountrySelect = (country) => {
    setCountrySearch(country);
    setShowCountryDropdown(false);
    handleFilterChange("country", country);
  };

  const filteredCountries = countries.filter((country) =>
    country.toLowerCase().includes(countrySearch.toLowerCase())
  );

  return (
    <div className="bg-foreground text-white rounded-b-lg">
      <CardContent className="p-4">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-8">
          {/* Search */}
          <div className="lg:col-span-2">
            <Label
              htmlFor="search"
              className="text-white text-sm font-medium mb-2 block"
            >
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
          <div className="relative">
            <Label
              htmlFor="country"
              className="text-white text-sm font-medium mb-2 block"
            >
              Country
            </Label>
            <Input
              type="text"
              value={countrySearch}
              onChange={(e) => {
                setCountrySearch(e.target.value);
                setShowCountryDropdown(true);
              }}
              placeholder="Search country..."
              className="w-full px-3 py-[25px] border border-slate-500 bg-transparent rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              onFocus={() => setShowCountryDropdown(true)}
              onBlur={() =>
                setTimeout(() => setShowCountryDropdown(false), 200)
              }
            />

            {showCountryDropdown && (
              <ul className="absolute z-10 w-full bg-foreground border border-slate-500 rounded-lg max-h-48 overflow-y-auto shadow-md mt-1">
                <li
                  onClick={() => {
                    setCountrySearch("");
                    setShowCountryDropdown(false);
                    handleFilterChange("country", "all");
                  }}
                  className="px-3 py-2 hover:bg-teal-600 cursor-pointer border-b border-slate-600"
                >
                  All Countries
                </li>
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((country) => (
                    <li
                      key={country}
                      onClick={() => handleCountrySelect(country)}
                      className="px-3 py-2 hover:bg-teal-600 cursor-pointer"
                    >
                      {country}
                    </li>
                  ))
                ) : (
                  <li className="px-3 py-2 text-gray-400">No results found</li>
                )}
              </ul>
            )}
          </div>

          {/* Gender Filter */}
          <div>
            <Label
              htmlFor="gender"
              className="text-white text-sm font-medium mb-2 block"
            >
              Gender
            </Label>

            <Select
              value={filters.gender}
              onValueChange={(value) => handleFilterChange("gender", value)}
              className="h-16  hover:bg-teal-60"
            >
              <SelectTrigger className="w-full border border-slate-500 bg-primary-foreground  text-white focus:border-teal-400 py-[25px] px-2 rounded-md">
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>

              <SelectContent className="bg-primary-foreground text-white border border-slate-600  hover:bg-teal-60">
                <SelectItem value="all">All Genders</SelectItem>
                <SelectItem value="Hen">Hen</SelectItem>
                <SelectItem value="Cock">Cock</SelectItem>
                <SelectItem value="Unspecified">Unspecified</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Birth Year Filter */}
          <div className="relative w-full">
            <Label className="block text-sm font-medium text-white mb-2">
              Birth Year
            </Label>

            <Input
              type="text"
              value={yearSearch}
              onChange={handleYearInputChange}
              placeholder="Enter or select year"
              className="w-full px-3 py-[25px] border border-slate-500 bg-transparent rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
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
