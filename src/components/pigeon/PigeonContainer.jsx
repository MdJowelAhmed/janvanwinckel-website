'use client'
import React, { useState } from 'react'
// import { useGetPigeonPackagesQuery } from '@/redux/api/pigeonApi'
import PigeonOverview from './PigeonOverview'
import PigeonFilters from './PigeonFilters'
import PigeonTable from './PigeonTable'
import { Button } from '@/components/ui/button'
import { Plus, FileDown, Upload } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useGetPigeonPackagesQuery } from '@/redux/featured/pigeon/pigeonApi'

const PigeonContainer = () => {
  const router = useRouter()
  const [filters, setFilters] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')

  // Build query parameters
  const queryParams = [
    { name: 'page', value: currentPage },
    { name: 'limit', value: 10 },
    ...(searchTerm ? [{ name: 'search', value: searchTerm }] : []),
    ...filters
  ]

  const { data: pigeonData, isLoading, error } = useGetPigeonPackagesQuery(queryParams)
  console.log(pigeonData?.data)


  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    setCurrentPage(1) // Reset to first page when filters change
  }

  const handleSearch = (term) => {
    setSearchTerm(term)
    setCurrentPage(1)
  }

  const handleAddPigeon = () => {
    router.push('/add-pigeon')
  }

  const handleEditPigeon = (pigeonId) => {
    router.push(`/add-pigeon?edit=${pigeonId}`)
  }

  const handleExportPDF = () => {
    // TODO: Implement PDF export functionality
    console.log('Exporting to PDF...')
  }

  const handleImportExcel = () => {
    // TODO: Implement Excel import functionality
    console.log('Importing from Excel...')
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">Error loading pigeons: {error.message}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Loft Overview</h1>
          <p className="text-gray-600 mt-1">Manage your pigeon collection</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={handleAddPigeon}
            className="bg-blue-900 hover:bg-blue-800 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Pigeon
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleExportPDF}
            className="border-teal-500 text-teal-600 hover:bg-teal-50"
          >
            <FileDown className="w-4 h-4 mr-2" />
            Export as PDF
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleImportExcel}
            className="border-teal-500 text-teal-600 hover:bg-teal-50"
          >
            <Upload className="w-4 h-4 mr-2" />
            Import as Excel
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <PigeonOverview data={pigeonData} />

      {/* Filters */}
      <PigeonFilters 
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        searchTerm={searchTerm}
      />

      {/* Pigeon Table */}
      <PigeonTable 
        data={pigeonData}
        isLoading={isLoading}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onEdit={handleEditPigeon}
      />
    </div>
  )
}

export default PigeonContainer