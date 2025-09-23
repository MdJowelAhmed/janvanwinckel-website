import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Search } from 'lucide-react'

const PigeonFilters = ({ onFilterChange, onSearch, searchTerm }) => {
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
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
                className="pl-10  border-slate-500 text-white placeholder:text-gray-400 focus:border-teal-400"
              />
            </div>
          </div>

          {/* Country Filter */}
          <div className='w-full'>
            <Label htmlFor="country" className="text-white text-sm font-medium mb-2 block">
              Country
            </Label>
            <Select value={filters.country} onValueChange={(value) => handleFilterChange('country', value)}>
              <SelectTrigger className=" border-slate-500 text-white focus:border-teal-400 w-full">
                <SelectValue placeholder="All Countries" />
              </SelectTrigger>
              <SelectContent className=" border-slate-500 ">
                <SelectItem value="all">All Countries</SelectItem>
                <SelectItem value="Bangladesh">Bangladesh</SelectItem>
                <SelectItem value="Belgium">Belgium</SelectItem>
                <SelectItem value="Germany">Germany</SelectItem>
                <SelectItem value="Netherlands">Netherlands</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Gender Filter */}
          <div>
            <Label htmlFor="gender" className="text-white text-sm font-medium mb-2 block">
              Gender
            </Label>
            <Select value={filters.gender} onValueChange={(value) => handleFilterChange('gender', value)}>
              <SelectTrigger className=" border-slate-500 text-white focus:border-teal-400 w-full">
                <SelectValue placeholder="All Genders" />
              </SelectTrigger>
              <SelectContent className=" border-slate-500 w-full">
                <SelectItem value="all">All Genders</SelectItem>
                <SelectItem value="Hen">Hen</SelectItem>
                <SelectItem value="Cock">Cock</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Color Filter */}
          <div>
            <Label htmlFor="color" className="text-white text-sm font-medium mb-2 block">
              Color
            </Label>
            <Select value={filters.color} onValueChange={(value) => handleFilterChange('color', value)}>
              <SelectTrigger className=" border-slate-500 text-white focus:border-teal-400 w-full">
                <SelectValue placeholder="All Colors" />
              </SelectTrigger>
              <SelectContent className=" border-slate-500 w-full">
                <SelectItem value="all">All Colors</SelectItem>
                <SelectItem value="Blue">Blue</SelectItem>
                <SelectItem value="White">White</SelectItem>
                <SelectItem value="Red">Red</SelectItem>
                <SelectItem value="Black">Black</SelectItem>
                <SelectItem value="Checkered">Checkered</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Year Filter */}
          <div>
            <Label htmlFor="year" className="text-white text-sm font-medium mb-2 block">
              Year
            </Label>
            <Select value={filters.year} onValueChange={(value) => handleFilterChange('birthYear', value)}>
              <SelectTrigger className=" border-slate-500 text-white focus:border-teal-400 w-full">
                <SelectValue placeholder="All Years" />
              </SelectTrigger>
              <SelectContent className=" border-slate-500 w-full">
                <SelectItem value="all">All Years</SelectItem>
                {yearOptions.map(year => (
                  <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </div>
  )
}

export default PigeonFilters