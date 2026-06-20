import React from 'react'
import ManageLotList from '../Components/ManageLotList'
import ManageLotHeader from '../Components/ManageLotHeader'

const ManageLot = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
        <ManageLotHeader/>
        <ManageLotList/>
        </div>
  )
}

export default ManageLot