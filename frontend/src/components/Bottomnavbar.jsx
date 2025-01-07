import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AppContext } from '../context/context';
//Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faUser } from '@fortawesome/free-regular-svg-icons';
import { faB, faBoxOpen, faHeadset } from '@fortawesome/free-solid-svg-icons';

const Bottomnavbar = () => {

  const { wishlist } = useContext(AppContext);

  return (
    <div className='h-[4rem] sm:hidden flex w-screen fixed bottom-0 justify-around bg-white border-t'>
      <NavLink className={({ isActive }) => "p-4 flex duration-200 rounded-full m-2" + ((isActive || window.location.pathname.startsWith("/user/searchresults")) ? ' bg-green-700 text-white ' : ' hover:bg-green-700/30')} to="/user/searchresults/ "><FontAwesomeIcon className='w-4 h-4' icon={faB} /></NavLink>
      <NavLink className={({ isActive }) => "p-4 flex duration-200 rounded-full m-2" + (isActive ? ' bg-yellow-300 text-black/user ' : ' hover:bg-green-700/30')} to="/user/account/orders"><FontAwesomeIcon className='w-4 h-4' icon={faBoxOpen} /></NavLink>
      <NavLink className={({ isActive }) => "p-4 flex duration-200 rounded-full m-2 relative " + (isActive ? ' bg-red-600 text-white ' : ' hover:bg-green-700/30')} to="/user/account/wishlist"><FontAwesomeIcon className='w-4 h-4' icon={faHeart} />
        <div className='bg-red-600 absolute w-3 h-3 rounded-full top-[0.4rem] right-[0.6rem] text-[8px] text-white flex items-center justify-center'><div>{wishlist.length}</div></div>
      </NavLink>
      <NavLink className={({ isActive }) => "p-4 flex duration-200 rounded-full m-2" + (isActive ? ' bg-pink-600/70 text-white ' : ' hover:bg-green-700/30')} to="/user/account/profile"><FontAwesomeIcon className='w-4 h-4' icon={faUser} /></NavLink>
      <NavLink className={({ isActive }) => "p-4 flex duration-200 rounded-full m-2" + (isActive ? ' bg-green-700 text-white ' : ' hover:bg-green-700/30')} to="/user/account/customer-care"><FontAwesomeIcon className='w-4 h-4' icon={faHeadset} /></NavLink>
    </div>
  )
};

export default Bottomnavbar;