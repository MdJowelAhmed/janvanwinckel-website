'use client'
import AddPigeonContainer from '@/components/pigeon/AddPigeon'
import { useSearchParams } from 'next/navigation'
import React, { Suspense } from 'react'

// Inner component that uses useSearchParams
const AddPigeonContent = () => {
  const searchParams = useSearchParams()
  const editId = searchParams.get('edit')
  
  return (
    <div>
      <AddPigeonContainer pigeonId={editId} />
    </div>
  )
}

// Main component with Suspense boundary
const AddPigeon = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddPigeonContent />
    </Suspense>
  )
}

export default AddPigeon