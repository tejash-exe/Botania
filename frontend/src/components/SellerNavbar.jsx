import React, { useContext } from 'react'
import { AppContext } from '../context/context';
import { Link, useNavigate } from 'react-router-dom';

const SellerNavbar = () => {

    const navigate = useNavigate();
    const { issellerAuth, setissellerAuth, setsellerredirect, backend_url } = useContext(AppContext);

    //Handle Login
    const handleLogin = () => {
        setsellerredirect(window.location.pathname);
        navigate('/seller/login-register/');
    };
    
    //Handle logout
    const handleLogout = async (e) => {
        e.preventDefault();
        const response = await fetch(`${backend_url}/api/sellers/logout`, {
            method: "POST"
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
                setissellerAuth(false);
                handleLogin();
            })
    };

    return (
        <>
            <div className='sm:px-6 px-3 border-b-2 bg-white z-50 h-[4rem] w-screen fixed top-0 left-0 flex items-center justify-between'>
                <div className='font-bold text-3xl'>Botania<span className='text-sm'>.Seller</span></div>
                <div className='sm:flex hidden'>
                    <Link to='/seller/account/profile' className='mx-4 duration-200 cursor-pointer hover:text-black text-green-700'>Profile</Link>
                    <Link to='/seller/account/products' className='mx-4 duration-200 cursor-pointer hover:text-black text-green-700'>Products</Link>
                    <Link to='/seller/account/orders' className='mx-4 duration-200 cursor-pointer hover:text-black text-green-700'>Orders</Link>
                    <Link to='/seller/account/reviews' className='mx-4 duration-200 cursor-pointer hover:text-black text-green-700'>Reviews</Link>
                </div>
                {issellerAuth ? <button onClick={handleLogout} className=' bg-white/10 hover:scale-105 active:scale-100 duration-200 py-2 px-4 rounded-md'>Logout</button> :
                <button onClick={handleLogin} className=' bg-white/10 hover:scale-105 active:scale-100 duration-200 py-2 px-4 rounded-md'>Login</button>}
            </div>
        </>
    )
};

export default SellerNavbar;