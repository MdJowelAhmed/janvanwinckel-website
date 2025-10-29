import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Search } from 'lucide-react'

const PigeonDatabaseFilter = ({ onFilterChange, onSearch, searchTerm }) => {
  const [filters, setFilters] = useState({
    country: 'all',
    gender: 'all',
    color: 'all',
    year: 'all'
  })

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    
    // Convert to array format expected by API
    const filterArray = Object.entries(newFilters)
      .filter(([_, val]) => val !== '' && val !== 'all')
      .map(([key, value]) => ({ name: key, value }))
    
    onFilterChange(filterArray)
  }

  const handleSearchChange = (e) => {
    onSearch(e.target.value)
  }

  // Generate year options (2020-2025)
  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: 6 }, (_, i) => currentYear - i)

  return (
    <div className="bg-foreground text-white rounded-b-lg">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-8">
          {/* Search */}
          <div className="lg:col-span-6">
            <Label htmlFor="search" className="text-white/50 text-sm font-normal  mb-2 block">
           Search for a pigeon​
            </Label>
            <div className="relative">
              <Search className="absolute  left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="search"
                placeholder="Search by name, ring number,
parents’ names, or other
pigeon details.​"
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10 py-6 w-full border-slate-500 text-white placeholder:text-gray-400 focus:border-teal-400"
              />
            </div>
          </div>
          {/* <div className="lg:col-span-1">
            <Label htmlFor="search" className="text-white/50 text-sm font-normal  mb-2 block">
             Ring Number
            </Label>
            <div className="relative">
              <Input
                id="search"
                placeholder="Search Pigeon Ring Number"
                value={searchTerm}
                onChange={handleSearchChange}
                className=" py-6 w-full border-slate-500 text-white placeholder:text-gray-400 focus:border-teal-400"
              />
            </div>
          </div> */}
          {/* <div className="lg:col-span-1">
            <Label htmlFor="search" className="text-white/50 text-sm font-normal  mb-2 block">
             Mother Name
            </Label>
            <div className="relative">
              <Input
                id="search"
                placeholder="Search Pigeon Mother Name"
                value={searchTerm}
                onChange={handleSearchChange}
                className=" py-6 w-full border-slate-500 text-white placeholder:text-gray-400 focus:border-teal-400"
              />
            </div>
          </div> */}
          {/* <div className="lg:col-span-1">
            <Label htmlFor="search" className="text-white/50 text-sm font-normal  mb-2 block">
            Father Name
            </Label>
            <div className="relative">
              <Input
                id="search"
                placeholder="Search Pigeon Father Name"
                value={searchTerm}
                onChange={handleSearchChange}
                className=" py-6 w-full border-slate-500 text-white placeholder:text-gray-400 focus:border-teal-400"
              />
            </div>
          </div> */}
          {/* <div className="lg:col-span-1">
            <Label htmlFor="search" className="text-white/50 text-sm font-normal  mb-2 block">
            Score Pigeon
            </Label>
            <div className="relative">
              <Input
                id="search"
                placeholder="Search Pigeon Score Pigeon"
                value={searchTerm}
                onChange={handleSearchChange}
                className=" py-6 w-full border-slate-500 text-white placeholder:text-gray-400 focus:border-teal-400"
              />
            </div>
          </div> */}
          {/* <div className="lg:col-span-1">
            <Label htmlFor="search" className="text-white/50 text-sm font-normal  mb-2 block">
            Breeder
            </Label>
            <div className="relative">
              <Input
                id="search"
                placeholder="Search Pigeon Breeder"
                value={searchTerm}
                onChange={handleSearchChange}
                className=" py-6 w-full border-slate-500 text-white placeholder:text-gray-400 focus:border-teal-400"
              />
            </div>
          </div> */}

          {/* Country Filter */}
          {/* <div>
            <Label htmlFor="country" className="text-white text-sm font-medium mb-2 block">
              Country
            </Label>
            <Select value={filters.country} onValueChange={(value) => handleFilterChange('country', value)}>
              <SelectTrigger className=" border-slate-500 text-white focus:border-teal-400">
                <SelectValue placeholder="All Countries" />
              </SelectTrigger>
              <SelectContent className=" border-slate-500">
                <SelectItem value="all">All Countries</SelectItem>
                <SelectItem value="Bangladesh">Bangladesh</SelectItem>
                <SelectItem value="Belgium">Belgium</SelectItem>
                <SelectItem value="Germany">Germany</SelectItem>
                <SelectItem value="Netherlands">Netherlands</SelectItem>
              </SelectContent>
            </Select>
          </div> */}

          {/* Gender Filter */}
          {/* <div>
            <Label htmlFor="gender" className="text-white text-sm font-medium mb-2 block">
              Gender
            </Label>
            <Select value={filters.gender} onValueChange={(value) => handleFilterChange('gender', value)}>
              <SelectTrigger className=" border-slate-500 text-white focus:border-teal-400">
                <SelectValue placeholder="All Genders" />
              </SelectTrigger>
              <SelectContent className=" border-slate-500">
                <SelectItem value="all">All Genders</SelectItem>
                <SelectItem value="Hen">Hen</SelectItem>
                <SelectItem value="Cock">Cock</SelectItem>
              </SelectContent>
            </Select>
          </div> */}

          {/* Color Filter */}
          {/* <div>
            <Label htmlFor="color" className="text-white text-sm font-medium mb-2 block">
              Color
            </Label>
            <Select value={filters.color} onValueChange={(value) => handleFilterChange('color', value)}>
              <SelectTrigger className=" border-slate-500 text-white focus:border-teal-400">
                <SelectValue placeholder="All Colors" />
              </SelectTrigger>
              <SelectContent className=" border-slate-500">
                <SelectItem value="all">All Colors</SelectItem>
                <SelectItem value="Blue">Blue</SelectItem>
                <SelectItem value="White">White</SelectItem>
                <SelectItem value="Red">Red</SelectItem>
                <SelectItem value="Black">Black</SelectItem>
                <SelectItem value="Checkered">Checkered</SelectItem>
              </SelectContent>
            </Select>
          </div> */}

          {/* Year Filter */}
          {/* <div>
            <Label htmlFor="year" className="text-white text-sm font-medium mb-2 block">
              Year
            </Label>
            <Select value={filters.year} onValueChange={(value) => handleFilterChange('birthYear', value)}>
              <SelectTrigger className=" border-slate-500 text-white focus:border-teal-400">
                <SelectValue placeholder="All Years" />
              </SelectTrigger>
              <SelectContent className=" border-slate-500">
                <SelectItem value="all">All Years</SelectItem>
                {yearOptions.map(year => (
                  <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div> */}
        </div>
      </CardContent>
    </div>
  )
}

export default PigeonDatabaseFilter