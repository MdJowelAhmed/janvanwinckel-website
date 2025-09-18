import React, { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Edit, Eye, MoreHorizontal, ChevronLeft, ChevronRight, Phone, Tablet, Monitor, Trash2, GitBranch } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useRouter } from 'next/navigation'
import { useDeletePigeonMutation } from '@/redux/featured/pigeon/pigeonApi'

const ResponsivePigeonTable = ({ data, isLoading, currentPage, onPageChange, onEdit }) => {
  const router = useRouter()
  const [deletePigeon] = useDeletePigeonMutation()
  const [viewMode, setViewMode] = useState('auto') // auto, table, cards
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (isLoading) {
    return <TableSkeleton isMobile={isMobile} />
  }

  if (!data?.data?.data?.length) {
    return (
      <Card className="fade-in">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🐦</span>
            </div>
            <p className="text-gray-500 text-lg font-medium">No pigeons found</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or add a new pigeon</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const pigeons = data.data.data
  const pagination = data.data.pagination

  const shouldShowCards = viewMode === 'cards' || (viewMode === 'auto' && isMobile)

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200'
      case 'racing': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'breeding': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'sold': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'lost': return 'bg-red-100 text-red-800 border-red-200'
      case 'deceased': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getRatingStars = (rating) => {
    const stars = Math.floor(rating / 20) // Convert to 5-star scale
    return '★'.repeat(stars) + '☆'.repeat(5 - stars)
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < pagination?.totalPage) {
      onPageChange(currentPage + 1)
    }
  }

  const handleView = (pigeonId) => {
    router.push(`/pigeon-overview/${pigeonId}`)
  }

  const handlePedigree = (pigeonId) => {
    router.push(`/pedigree-chart/${pigeonId}`)
  }

  const handleDelete = async (pigeonId) => {
    if (window.confirm('Are you sure you want to delete this pigeon? This action cannot be undone.')) {
      try {
        await deletePigeon(pigeonId).unwrap()
        // Optionally show success message
      } catch (error) {
        console.error('Failed to delete pigeon:', error)
        alert('Failed to delete pigeon. Please try again.')
      }
    }
  }

  const ViewToggle = () => (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-sm text-gray-500">View:</span>
      <div className="flex rounded-lg border">
        <Button
          size="sm"
          variant={viewMode === 'auto' ? 'default' : 'ghost'}
          onClick={() => setViewMode('auto')}
          className="rounded-r-none border-r"
        >
          Auto
        </Button>
        <Button
          size="sm"
          variant={viewMode === 'table' ? 'default' : 'ghost'}
          onClick={() => setViewMode('table')}
          className="rounded-none border-r"
        >
          <Monitor className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant={viewMode === 'cards' ? 'default' : 'ghost'}
          onClick={() => setViewMode('cards')}
          className="rounded-l-none"
        >
          <Phone className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )

  const PigeonCard = ({ pigeon, index }) => (
    <Card key={pigeon._id} className="pigeon-mobile-card fade-in hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        {/* Header */}
        <div className="pigeon-mobile-card-header">
          <div className="flex items-center flex-1 min-w-0">
            <Checkbox className="mr-3" />
            <Avatar className="pigeon-mobile-card-avatar flex-shrink-0">
              <AvatarImage 
                src={pigeon.photos?.[0] || '/placeholder-pigeon.jpg'} 
                alt={pigeon.name} 
              />
              <AvatarFallback className="bg-blue-100 text-blue-600 text-sm">
                {pigeon.name?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="pigeon-mobile-card-info">
              <h3 className="pigeon-mobile-card-name text-blue-600 font-medium">
                {pigeon.name}
              </h3>
              <p className="pigeon-mobile-card-ring">
                {pigeon.ringNumber}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xl">🇧🇩</span>
                <Badge 
                  variant="outline" 
                  className={pigeon.gender === 'Male' ? 'border-blue-200 text-blue-700 bg-blue-50' : 'border-pink-200 text-pink-700 bg-pink-50'}
                >
                  {pigeon.gender}
                </Badge>
              </div>
            </div>
          </div>
          <Badge className={getStatusColor(pigeon.status)}>
            {pigeon.verified ? 'Racing' : 'Breeding'}
          </Badge>
        </div>

        {/* Details Grid */}
        <div className="pigeon-mobile-card-details mt-4">
          <div className="pigeon-mobile-card-detail">
            <div className="pigeon-mobile-card-detail-label">Breeder</div>
            <div className="pigeon-mobile-card-detail-value text-blue-600">
              {pigeon.breeder || 'N/A'}
            </div>
          </div>
          
          <div className="pigeon-mobile-card-detail">
            <div className="pigeon-mobile-card-detail-label">Birth Year</div>
            <div className="pigeon-mobile-card-detail-value">
              {pigeon.birthYear}
            </div>
          </div>

          <div className="pigeon-mobile-card-detail">
            <div className="pigeon-mobile-card-detail-label">Color/Pattern</div>
            <div className="pigeon-mobile-card-detail-value">
              <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
                {pigeon.color}
              </Badge>
              <span className="ml-2 text-sm text-gray-500">{pigeon.pattern}</span>
            </div>
          </div>

          <div className="pigeon-mobile-card-detail">
            <div className="pigeon-mobile-card-detail-label">Racing Rating</div>
            <div className="pigeon-mobile-card-detail-value">
              <Badge variant="outline" className="bg-yellow-50 border-yellow-200 text-yellow-700">
                {pigeon.racingRating || pigeon.racerRating || 0}
              </Badge>
            </div>
          </div>

          <div className="pigeon-mobile-card-detail">
            <div className="pigeon-mobile-card-detail-label">Location</div>
            <div className="pigeon-mobile-card-detail-value">
              {pigeon.location}
            </div>
          </div>

          <div className="pigeon-mobile-card-detail">
            <div className="pigeon-mobile-card-detail-label">Rating</div>
            <div className="pigeon-mobile-card-detail-value text-yellow-500">
              {getRatingStars(pigeon.breederRating || pigeon.racherRating || 0)}
            </div>
          </div>
        </div>

        {/* Pedigree Info */}
        {(pigeon.fatherRingId || pigeon.motherRingId) && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="pigeon-mobile-card-detail-label mb-2">Pedigree</div>
            <div className="space-y-1 text-sm">
              {pigeon.fatherRingId && (
                <div>
                  <span className="text-gray-600">Sire:</span> {pigeon.fatherRingId.name} ({pigeon.fatherRingId.ringNumber})
                </div>
              )}
              {pigeon.motherRingId && (
                <div>
                  <span className="text-gray-600">Dam:</span> {pigeon.motherRingId.name} ({pigeon.motherRingId.ringNumber})
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="pigeon-mobile-card-actions">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="w-full"
              >
                <MoreHorizontal className="h-4 w-4 mr-2" />
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={() => onEdit(pigeon._id)}
                className="cursor-pointer"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Pigeon
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleView(pigeon._id)}
                className="cursor-pointer"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handlePedigree(pigeon._id)}
                className="cursor-pointer"
              >
                <GitBranch className="h-4 w-4 mr-2" />
                View Pedigree
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDelete(pigeon._id)}
                className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Pigeon
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-4">
      {/* View Toggle - Hidden on mobile auto mode */}
      {!isMobile && <ViewToggle />}

      {shouldShowCards ? (
        /* Card View */
        <div className="space-y-4">
          {pigeons.map((pigeon, index) => (
            <PigeonCard key={pigeon._id} pigeon={pigeon} index={index} />
          ))}
        </div>
      ) : (
        /* Table View */
        <Card className="fade-in">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table className="pigeon-table">
                <TableHeader className="bg-slate-700">
                  <TableRow className="hover:bg-slate-600">
                    <TableHead className="text-white w-12">
                      <Checkbox className="border-slate-400" />
                    </TableHead>
                    <TableHead className="text-white">Image</TableHead>
                    <TableHead className="text-white">Name</TableHead>
                    <TableHead className="text-white">Country</TableHead>
                    <TableHead className="text-white">Breeder</TableHead>
                    <TableHead className="text-white">Ring Number</TableHead>
                    <TableHead className="text-white">Bird Year</TableHead>
                    <TableHead className="text-white">Sire/Grand Sire</TableHead>
                    <TableHead className="text-white">Dam/Grand Dam</TableHead>
                    <TableHead className="text-white">Racing Rating</TableHead>
                    <TableHead className="text-white">Pattern</TableHead>
                    <TableHead className="text-white">Verified</TableHead>
                    <TableHead className="text-white">Gender</TableHead>
                    <TableHead className="text-white">Rating</TableHead>
                    <TableHead className="text-white">Color</TableHead>
                    <TableHead className="text-white">Location</TableHead>
                    <TableHead className="text-white w-20">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pigeons.map((pigeon, index) => (
                    <TableRow key={pigeon._id} className="hover:bg-gray-50 fade-in">
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      
                      <TableCell>
                        <Avatar className="w-10 h-10">
                          <AvatarImage 
                            src={pigeon.photos?.[0] || '/placeholder-pigeon.jpg'} 
                            alt={pigeon.name} 
                          />
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {pigeon.name?.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>

                      <TableCell className="font-medium text-blue-600">
                        {pigeon.name}
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">🇧🇩</span>
                          {pigeon.country}
                        </div>
                      </TableCell>

                      <TableCell className="text-blue-600">
                        {pigeon.breeder}
                      </TableCell>

                      <TableCell className="font-mono text-sm">
                        {pigeon.ringNumber}
                      </TableCell>

                      <TableCell>{pigeon.birthYear}</TableCell>

                      <TableCell>
                        <div className="text-sm">
                          <div>Sire: {pigeon.fatherRingId?.name || 'N/A'}</div>
                          <div className="text-gray-500">Ring: {pigeon.fatherRingId?.ringNumber || 'N/A'}</div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="text-sm">
                          <div>Dam: {pigeon.motherRingId?.name || 'N/A'}</div>
                          <div className="text-gray-500">Ring: {pigeon.motherRingId?.ringNumber || 'N/A'}</div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge variant="outline" className="bg-yellow-50 border-yellow-200 text-yellow-700">
                          {pigeon.racingRating || pigeon.racerRating || 0}
                        </Badge>
                      </TableCell>

                      <TableCell>{pigeon.pattern}</TableCell>

                      <TableCell>
                        <Badge 
                          variant={pigeon.verified ? "default" : "secondary"}
                          className={pigeon.verified ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}
                        >
                          {pigeon.verified ? 'Racing' : 'Breeding'}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={pigeon.gender === 'Male' ? 'border-blue-200 text-blue-700 bg-blue-50' : 'border-pink-200 text-pink-700 bg-pink-50'}
                        >
                          {pigeon.gender}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div className="text-yellow-500">
                          {getRatingStars(pigeon.breederRating || pigeon.racherRating || 0)}
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className="bg-blue-50 border-blue-200 text-blue-700"
                        >
                          {pigeon.color}
                        </Badge>
                      </TableCell>

                      <TableCell>{pigeon.location}</TableCell>

                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 hover:bg-gray-100"
                            >
                              <MoreHorizontal className="h-4 w-4 text-gray-600" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                              onClick={() => onEdit(pigeon._id)}
                              className="cursor-pointer"
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Pigeon
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleView(pigeon._id)}
                              className="cursor-pointer"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handlePedigree(pigeon._id)}
                              className="cursor-pointer"
                            >
                              <GitBranch className="h-4 w-4 mr-2" />
                              View Pedigree
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(pigeon._id)}
                              className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Pigeon
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {pagination && (
        <Card className="fade-in">
          <CardContent className="pigeon-pagination">
            <div className="pigeon-pagination-info">
              Showing {((currentPage - 1) * pagination.limit) + 1} to {Math.min(currentPage * pagination.limit, pagination.total)} of {pagination.total} entries
            </div>
            
            <div className="pigeon-pagination-controls">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
                disabled={currentPage <= 1}
                className="pigeon-pagination-button"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline ml-1">Prev</span>
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, pagination.totalPage) }, (_, i) => {
                  let page;
                  if (pagination.totalPage <= 5) {
                    page = i + 1;
                  } else if (currentPage <= 3) {
                    page = i + 1;
                  } else if (currentPage >= pagination.totalPage - 2) {
                    page = pagination.totalPage - 4 + i;
                  } else {
                    page = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={page}
                      variant={page === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => onPageChange(page)}
                      className="pigeon-pagination-button"
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage >= pagination.totalPage}
                className="pigeon-pagination-button"
              >
                <span className="hidden sm:inline mr-1">Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

const TableSkeleton = ({ isMobile }) => (
  <div className="space-y-4">
    {isMobile ? (
      // Mobile skeleton - cards
      Array.from({ length: 5 }).map((_, i) => (
        <Card key={i} className="fade-in">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4 mb-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, j) => (
                <div key={j} className="space-y-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-4 pt-4 border-t">
              <Skeleton className="h-8 flex-1" />
              <Skeleton className="h-8 flex-1" />
              <Skeleton className="h-8 w-8" />
            </div>
          </CardContent>
        </Card>
      ))
    ) : (
      // Desktop skeleton - table
      <Card className="fade-in">
        <CardContent className="p-6">
          <div className="space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-8 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )}
  </div>
)

export default ResponsivePigeonTable