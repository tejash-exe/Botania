import React from 'react'
import { Outlet } from 'react-router-dom'
import SellerNavbar from '../../../components/SellerNavbar'

const SellerDashboard = () => {
  return (
    <div>
      <SellerNavbar/>
      <Outlet/>
    </div>
  )
}

export default SellerDashboard
