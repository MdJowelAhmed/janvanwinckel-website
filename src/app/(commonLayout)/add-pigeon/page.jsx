'use client'
import AddPigeonContainer from '@/components/pigeon/AddPigeon'
import { useSearchParams } from 'next/navigation'
import React, { Suspense } from 'react'

const SearchParamsWrapper = () => {
  const searchParams = useSearchParams()
  const editId = searchParams.get('edit')
  
  return <AddPigeonContainer pigeonId={editId} />
}

const AddPigeon = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <SearchParamsWrapper />
      </Suspense>
    </div>
  )
}

export default AddPigeon