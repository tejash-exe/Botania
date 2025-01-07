import React from 'react';
import { Outlet } from 'react-router-dom';
import SellerNavbar from '../../../components/SellerNavbar';
import Sellerbottomnavbar from '../../../components/Sellerbottomnavbar';

const SellerAccount = () => {
  
  return (
    <div className=''>
      <SellerNavbar />
      <Outlet />
      <Sellerbottomnavbar/>
    </div>
  )
};

export default SellerAccount;