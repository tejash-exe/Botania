import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faUser } from '@fortawesome/free-regular-svg-icons';
import { faBoxOpen, faCartShopping, faHeadset } from '@fortawesome/free-solid-svg-icons';


const Sidenavbar = () => {
  return (
    <div className='md:w-1/5 max-w-[300px] md:min-w-[200px] sm:block hidden border-r h-screen overflow-hidden z-10'>
      <NavLink className={({ isActive }) => "md:px-2 px-4 flex py-4 duration-200 rounded-md mx-4 my-2" + (isActive ? ' bg-green-700 text-white ' : ' hover:bg-green-700/30')} to="/user/profile"><FontAwesomeIcon className='md:mr-4 w-6 h-6' icon={faUser} /><div className='md:block hidden'>Profile</div></NavLink>
      <NavLink className={({ isActive }) => "md:px-2 px-4 flex py-4 duration-200 rounded-md mx-4 my-2" + (isActive ? ' bg-green-700 text-white ' : ' hover:bg-green-700/30')} to="/user/orders"><FontAwesomeIcon className='md:mr-4 w-6 h-6' icon={faBoxOpen} /><div className='md:block hidden'>Orders</div></NavLink>
      <NavLink className={({ isActive }) => "md:px-2 px-4 flex py-4 duration-200 rounded-md mx-4 my-2" + (isActive ? ' bg-green-700 text-white ' : ' hover:bg-green-700/30')} to="/user/cart"><FontAwesomeIcon className='md:mr-4 w-6 h-6' icon={faCartShopping} /><div className='md:block hidden'>Cart</div></NavLink>
      <NavLink className={({ isActive }) => "md:px-2 px-4 flex py-4 duration-200 rounded-md mx-4 my-2" + (isActive ? ' bg-green-700 text-white ' : ' hover:bg-green-700/30')} to="/user/wishlist"><FontAwesomeIcon className='md:mr-4 w-6 h-6' icon={faHeart} /><div className='md:block hidden'>Wishlist</div></NavLink>
      <NavLink className={({ isActive }) => "md:px-2 px-4 flex py-4 duration-200 rounded-md mx-4 my-2" + (isActive ? ' bg-green-700 text-white ' : ' hover:bg-green-700/30')} to="/user/customercare"><FontAwesomeIcon className='md:mr-4 w-6 h-6' icon={faHeadset} /><div className='md:block hidden'>Customer Care</div></NavLink>
    </div>
  )
};

export default Sidenavbar;
