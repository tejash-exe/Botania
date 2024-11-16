import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faUser } from '@fortawesome/free-regular-svg-icons';
import { faBoxOpen, faHeadset, faHouse } from '@fortawesome/free-solid-svg-icons';

const Bottomnavbar = () => {
  return (
    <div className='h-[4rem] sm:hidden flex w-screen fixed bottom-0 justify-around bg-white border-t'>
      <NavLink className={({ isActive }) => "p-4 flex duration-200 rounded-full m-2" + (isActive ? ' bg-pink-600/60 text-white ' : ' hover:bg-green-700/30')} to="/home"><FontAwesomeIcon className='w-4 h-4' icon={faHouse} /></NavLink>
      <NavLink className={({ isActive }) => "p-4 flex duration-200 rounded-full m-2" + (isActive ? ' bg-yellow-300 text-black/user ' : ' hover:bg-green-700/30')} to="/user/orders"><FontAwesomeIcon className='w-4 h-4' icon={faBoxOpen} /></NavLink>
      <NavLink className={({ isActive }) => "p-4 flex duration-200 rounded-full m-2" + (isActive ? ' bg-red-600 text-white ' : ' hover:bg-green-700/30')} to="/user/wishlist"><FontAwesomeIcon className='w-4 h-4' icon={faHeart} /></NavLink>
      <NavLink className={({ isActive }) => "p-4 flex duration-200 rounded-full m-2" + (isActive ? ' bg-green-700 text-white ' : ' hover:bg-green-700/30')} to="/user/profile"><FontAwesomeIcon className='w-4 h-4' icon={faUser} /></NavLink>
      <NavLink className={({ isActive }) => "p-4 flex duration-200 rounded-full m-2" + (isActive ? ' bg-green-700 text-white ' : ' hover:bg-green-700/30')} to="/user/customercare"><FontAwesomeIcon className='w-4 h-4' icon={faHeadset} /></NavLink>
    </div>
  )
};

export default Bottomnavbar;
