import React, { useCallback, useRef, useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/context';
import { Link, useNavigate } from 'react-router-dom';
//Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser, faHeart } from '@fortawesome/free-regular-svg-icons';
import { faCartShopping, faMagnifyingGlass, faUser, faXmark } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  
  const navigate = useNavigate();
  const searchbarref = useRef();
  const profilemenuref = useRef();
  const profilebuttonref = useRef();
  const { isAuth, setisAuth, name, wishlist, cart, setredirect, backend_url } = useContext(AppContext);
  const [profile, setprofile] = useState(false);
  const [plants, setplants] = useState("");

  //Handle search bar
  const changeplants = useCallback((e) => {
    setplants(e.target.value);
  }, [setplants]);

  const clearplants = useCallback((e) => {
    e.preventDefault();
    setplants("");
    searchbarref.current.focus();
  }, []);

  const startsearch = (e) => {
    e.preventDefault();
    searchbarref.current.blur();
    navigate(`/user/searchresults/${plants}/`);
  };

  //Handle login
  const handleLogin = () => {
    setredirect(window.location.pathname);
    navigate('/user/login-register');
  };

  //Profile popup
  const profilebuttonclick = () => {
    setprofile((prevProfile) => !prevProfile);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        profilebuttonref.current &&
        !profilebuttonref.current.contains(e.target) &&
        profilemenuref.current &&
        !profilemenuref.current.contains(e.target)
      ) {
        setprofile(false);
      };
    };

    if (profile) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    };

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [profile]);

  //Handle logout
  const handleLogout = async (e) => {
    e.preventDefault();
    const response = await fetch(`${backend_url}/api/users/logout`, {
      method: "POST",
      credentials: 'include',
    })
      .then(res => res.json())
      .then(res => {
        // console.log(res);
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        // localStorage.clear();
        setisAuth(false);
        handleLogin();
      });
  };

  return (
    <div className='bg-white flex items-center justify-between h-[4rem] overflow-hidden fixed top-0 w-full box-border z-20 border-b'>
      <div className='sm:block hidden'>
        <Link to="/welcome" className='text-green-700 font-bold text-4xl px-5'>Botania</Link>
      </div>
      <div>
        <form onSubmit={startsearch} className='rounded-md sm:ml-0 ml-5 bg-gray-200 flex justify-center items-center'>
          <button disabled={(plants == "")} type='submit' className='bg-gray-200 flex justify-center items-center hover:opacity-100 opacity-50 duration-200'><FontAwesomeIcon className='w-6 p-2' icon={faMagnifyingGlass} /></button>
          <input ref={searchbarref} autoComplete='off' name='search' type="text" placeholder='Search plants here' value={plants} onChange={changeplants} className=' outline-none md:w-[20rem] w-[10rem] min-w-0 placeholder:text-ellipsis h-10 text-gray-800 bg-gray-200' />
          <button style={{ opacity: plants === "" ? 0 : 0.5, cursor: plants === "" ? 'default' : 'pointer' }} className='bg-gray-200 flex justify-center items-center hover:opacity-100 opacity-50 duration-200' onClick={clearplants}><FontAwesomeIcon className='w-6 p-2' icon={faXmark} /></button>
        </form>
      </div>
      {isAuth ?
        <div className='flex items-center h-[4rem]'>
          <Link to="/user/account/wishlist/" className=' hidden relative sm:flex justify-center items-center' >
            <FontAwesomeIcon className='cursor-pointer mx-2 p-3 h-6 w-6 rounded-full hover:bg-gray-200 duration-150' icon={faHeart} />
            <div className='bg-red-600 absolute w-4 h-4 rounded-full top-[0.2rem] right-[0.7rem] text-[13px] text-white flex items-center justify-center '><div>{wishlist.length}</div></div>
          </Link>
          <Link to="/user/account/cart" className='relative flex justify-center items-center'>
            <FontAwesomeIcon className='cursor-pointer mx-2 p-3 h-6 w-6 rounded-full hover:bg-gray-200 duration-150' icon={faCartShopping} />
            <div className='bg-red-600 absolute w-4 h-4 rounded-full top-[0.2rem] right-[0.7rem] text-[13px] text-white flex items-center justify-center'><div>{cart.length}</div></div>
          </Link>
          <div ref={profilebuttonref} onClick={profilebuttonclick} className='flex justify-center items-center relative'><FontAwesomeIcon className='cursor-pointer mx-2 p-3 h-6 w-6 rounded-full hover:bg-gray-200 duration-150 sm:inline hidden' icon={faCircleUser} />
            {profile &&
              <div ref={profilemenuref} onClick={(e) => e.stopPropagation()} className='absolute z-[40] top-full p-4 rounded-xl bg-gray-200 right-4 flex flex-col items-start w-[150px]'>
                <div className='border-b-2 text-left border-gray-300 pb-2 text-gray-600 cursor-default'>Hello, {name}</div>
                <Link to="/user/account/profile" className='pt-2 text-gray-600 hover:text-black hover:font-semibold duration-200'>Profile</Link>
                <Link to="/user/account/orders" className='py-2 text-gray-600 hover:text-black hover:font-semibold duration-200'>Orders</Link>
                <button className='text-white hover:bg-red-500 px-4 py-3 bg-red-400 rounded-md duration-200' onClick={handleLogout}>Log Out</button>
              </div>
            }
          </div>
        </div> : <button className='hover:bg-gray-200 text-nowrap sm:text-base text-sm px-3 py-2 rounded-md mr-2 flex justify-center items-center' onClick={handleLogin}><FontAwesomeIcon className='pr-2' icon={faUser} />
          Log In
        </button>}
    </div>
  )
};

export default Navbar;