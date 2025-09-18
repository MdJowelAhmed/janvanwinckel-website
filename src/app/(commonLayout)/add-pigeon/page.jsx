'use client'
import AddPigeonContainer from '@/components/pigeon/AddPigeon'
import { useSearchParams } from 'next/navigation'
import React from 'react'

const AddPigeon = () => {
  const searchParams = useSearchParams()
  const editId = searchParams.get('edit')
  
  return (
    <div>
      <AddPigeonContainer pigeonId={editId} />
    </div>
  )
}

export default AddPigeon