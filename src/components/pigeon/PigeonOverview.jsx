import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const PigeonOverview = ({ data }) => {
  // Calculate statistics from the data
  const getStats = () => {
    if (!data?.data?.data) return { all: 0, racing: 0, breeding: 0, lost: 0, sold: 0, building: 0, deceased: 0 }

    const pigeons = data.data.data
    const stats = {
      all: data.data.pagination?.total || pigeons.length,
      racing: 0,
      breeding: 0,
      lost: 0,
      sold: 0,
      building: 0,
      deceased: 0
    }

    pigeons.forEach(pigeon => {
      switch (pigeon.status?.toLowerCase()) {
        case 'racing':
          stats.racing++
          break
        case 'breeding':
          stats.breeding++
          break
        case 'lost':
          stats.lost++
          break
        case 'sold':
          stats.sold++
          break
        case 'building':
          stats.building++
          break
        case 'deceased':
          stats.deceased++
          break
      }
    })

    return stats
  }

  const stats = getStats()

  const statItems = [
    { label: 'All', count: stats.all, color: 'bg-gray-500', active: true },
    { label: 'Racing', count: stats.racing, color: 'bg-blue-500' },
    { label: 'Breeding', count: stats.breeding, color: 'bg-green-500' },
    { label: 'Lost', count: stats.lost, color: 'bg-red-500' },
    { label: 'Sold', count: stats.sold, color: 'bg-purple-500' },
    { label: 'Building', count: stats.building, color: 'bg-teal-500' },
    { label: 'Deceased', count: stats.deceased, color: 'bg-orange-500' }
  ]

  return (
    <div className="bg-[#44505E] text-white rounded-t-lg">
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center gap-4 md:gap-6">
          {statItems.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className={`w-3 h-2 rounded-r-2xl ${item.color}`}></div>
              <Badge 
                variant={item.active ? "default" : "secondary"}
                className={`
                  ${item.active 
                    ? 'bg-white text-slate-700 hover:bg-gray-100' 
                    : 'bg-slate-600 text-white hover:bg-slate-500'
                  }
                  px-3 py-1 text-sm font-medium
                `}
              >
                {item.label} ({item.count})
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </div>
  )
}

export default PigeonOverview