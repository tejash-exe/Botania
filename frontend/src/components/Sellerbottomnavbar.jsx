import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faBoxOpen, faSeedling, faStar } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';

const Sellerbottomnavbar = () => {

  return (
    <div className='h-[4rem] fixed w-screen bg-white z-[80] left-0 bottom-0 border-t md:hidden flex justify-around items-center'>
      <NavLink to='/seller/account/profile/' className={(isActive) => ' p-4 flex justify-center items-center rounded-full ' + ((window.location.pathname.startsWith("/seller/account/profile")) ? ' bg-pink-600/70 text-white ' : ' ')}><FontAwesomeIcon className='w-4 h-4' icon={faUser} /></NavLink>
      <NavLink to='/seller/account/products/' className={(isActive) => ' p-4 flex justify-center items-center rounded-full ' + ((window.location.pathname.startsWith("/seller/account/product")) ? ' bg-green-700 text-white ' : ' ')}><FontAwesomeIcon className='w-4 h-4' icon={faSeedling} /></NavLink>
      <NavLink to='/seller/account/orders/' className={(isActive) => ' p-4 flex justify-center items-center rounded-full ' + ((window.location.pathname.startsWith("/seller/account/orders")) ? ' bg-yellow-300 ' : ' ')}><FontAwesomeIcon className='w-4 h-4' icon={faBoxOpen} /></NavLink>
      <NavLink to='/seller/account/reviews/' className={(isActive) => ' p-4 flex justify-center items-center rounded-full ' + ((window.location.pathname.startsWith("/seller/account/reviews")) ? ' bg-yellow-300 ' : ' ')}><FontAwesomeIcon className='w-4 h-4' icon={faStar} /></NavLink>
    </div>
  )
};

export default Sellerbottomnavbar;