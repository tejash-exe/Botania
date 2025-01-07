import React, { useContext, useEffect, useState, useRef } from 'react';
import { AppContext } from '../../../../context/context';
import { Link, useNavigate } from 'react-router-dom';
//Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faDotCircle, faRotateRight } from '@fortawesome/free-solid-svg-icons';
//Components
import Notification from '../../../../components/Notification';

const SellerProducts = () => {

    const navigate = useNavigate();
    const scrollableRef = useRef();
    const { issellerAuth, setissellerAuth, isProductAdded, setisProductAdded, setsellerredirect, backend_url } = useContext(AppContext);
    const [isPopup, setisPopup] = useState(false);
    const [loading, setloading] = useState(true);
    const [error, seterror] = useState(false);
    const [popupMessage, setpopupMessage] = useState('');
    const [products, setproducts] = useState({});
    const [isVisible, setIsVisible] = useState(false);
    const [isAvailable, setisAvailable] = useState(false);
    const [isActivated, setisActivated] = useState(true);

    //Handle isAvailable
    const changeisAvailable = () => {
        setisAvailable((prev) => !prev);
    };

    //Add product
    const addProduct = () => {
        navigate('/seller/account/products/add-product');
    };

    //Handle go to profile
    const gotoProfile = () => {
        navigate('/seller/account/profile')
    };

    //Handle gotoLogin
    const gotologin = () => {
        setsellerredirect(window.location.pathname);
        navigate('/seller/login-register');
    };

    //Handle reload
    const handlereload = () => {
        seterror(false);
        fetchProducts();
    };

    //Product added popup
    useEffect(() => {
        if (isProductAdded) {
            setpopupMessage("Product added succesfully!!");
            setisPopup(true);
            setisProductAdded(false);
        }
    }, []);

    //Fetch products
    const fetchProducts = async () => {
        try {
            setloading(true);
            const response = await fetch(`${backend_url}/api/sellers/fetch-products`, {
                method: 'POST',
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    isAvailable: isAvailable,
                })
            });
            const result = await response.json();
            if (result.status == 469) {
                // console.log(result.message);
                setpopupMessage(result.message);
                setisPopup(true);
                // localStorage.clear();
                setissellerAuth(false);
            }
            else if (result.status == 468) {
                setisActivated(false);
                setpopupMessage(result.message);
                setisPopup(true);
            }
            else if (result.status == 200) {
                setproducts(result.data);
                // console.log(result.data);
            }
            else {
                setpopupMessage(result.message);
                setisPopup(true);
                console.log(result);
                seterror(true);
            };
        } catch (error) {
            seterror(true);
            console.log(error);
            setpopupMessage(error.message);
            setisPopup(true);
        } finally {
            setloading(false);
        };
    };

    useEffect(() => {
        fetchProducts();
    }, [isAvailable]);

    //Handle popup
    let closeTimeout;
    useEffect(() => {
        if (isPopup) {
            closeTimeout = setTimeout(() => {
                setisPopup(false);
            }, 3000);
        };
        return () => clearTimeout(closeTimeout);
    }, [isPopup]);

    const exitPopup = () => {
        setisPopup(false);
        clearTimeout(closeTimeout);
    };

    //Handle scroll to top
    const toggleVisibility = () => {
        const container = scrollableRef.current;
        // console.log("Scroll position:", container.scrollTop);
        if (container && container.scrollTop > 100) { // Adjust threshold as needed
            setIsVisible(true);
        } else {
            setIsVisible(false);
        };
    };

    const scrollToTop = () => {
        const container = scrollableRef.current;
        if (container) {
            container.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        };
    };

    useEffect(() => {
        const container = scrollableRef.current;
        if (container) {
            // console.log("Attaching scroll event");  // Debugging line
            container.addEventListener('scroll', toggleVisibility);
        };

        return () => {
            const container = scrollableRef.current;
            if (container) {
                // console.log("Removing scroll event");  // Debugging line
                container.removeEventListener('scroll', toggleVisibility);
            };
        };
    }, [loading, issellerAuth, error]);

    return (
        <>
            {isPopup && <Notification message={popupMessage} onexit={exitPopup} />}
            {issellerAuth && isActivated && !loading && !error && <div className='pt-[4rem] sm:pb-0 pb-[4rem] h-screen overflow-hidden'>
                <div ref={scrollableRef} className='justify-center flex h-full overflow-auto px-4'>
                    <div className='md:w-[50rem] w-[40rem] '>
                        <div className='flex justify-between items-center mt-4 rounded-full border-2 border-green-700 px-6 sm:px-10 py-4'>
                            <div className='sm:text-xl font-semibold'>Your Products - {products.length}</div>
                            <button onClick={addProduct} className='rounded-full bg-green-700 text-white px-4 py-2'>Add Product</button>
                        </div>
                        <div className='flex mt-2'>
                            <input className='cursor-pointer mx-2' onChange={changeisAvailable} checked={isAvailable} id='available' type="checkbox" />
                            <label className='cursor-pointer' htmlFor="available">Available products only</label>
                        </div>
                        <div className='flex mt-6 flex-col mb-[4rem]'>
                            {products && products.map((product) => {
                                return <Link to={`/seller/account/products/${product._id}`} key={product._id} className={'flex sm:hover:shadow-[5px_10px_15px_-15px] border overflow-hidden rounded-2xl duration-200 mb-4 bg-gradient-to-l via-white to-white' + ((product.availability) ? " from-green-500/20 " : " from-gray-50 ")}>
                                    <div className='flex-shrink-0 relative overflow-hidden rounded-xl'>
                                        <img className={'md:h-[12rem] sm:h-[10rem] sm:w-[8rem] md:w-[10rem] w-[6rem] h-[8rem] object-cover' + ((product.availability) ? '  ' : ' opacity-50 ')} src={product.images[0]} alt="" />
                                        {(product.availability == false) && <div className="text-nowrap text-sm sm:text-base absolute top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2">Sold out</div>}
                                    </div>
                                    <div className='sm:ml-8 ml-4 text-sm sm:text-base'>
                                        <div className='font-semibold md:text-xl mt-4'>{product.name}</div>
                                        <div className='mb-2 text-nowrap whitespace-nowrap overflow-hidden md:w-[30rem] sm:w-[25rem] w-[10rem] text-ellipsis'>{product.description}</div>
                                        <div>Rs.{product.price}</div>
                                        {(product.availability) ? <div className='md:mt-4 mt-2 w-min text-nowrap rounded-xl'><FontAwesomeIcon className=' text-green-600 pr-2' icon={faDotCircle} />Selling</div> :
                                            <div className='md:mt-4 mt-2 w-min text-nowrap rounded-xl'><FontAwesomeIcon className=' text-gray-600 pr-2' icon={faDotCircle} />Sold Out</div>}
                                    </div>
                                </Link>
                            })}
                            {(products.length == 0) && <button onClick={addProduct} className='bg-gradient-to-br from-red-400 via-pink-400 to-pink-200 font-bold text-white flex justify-center items-center text-2xl active:scale-95 cursor-pointer duration-200 rounded-2xl h-[20rem]'>
                                <div>Add a Product</div>
                            </button>}
                        </div>
                    </div>
                </div></div>}
            {isVisible && <div onClick={scrollToTop} className='fixed z-[101] sm:bottom-10 bottom-[5rem] sm:right-10 right-[1rem] bg-green-700 hover:bg-green-700/90 duration-200 active:scale-95 rounded-full p-3  cursor-pointer flex justify-center items-center'>
                <FontAwesomeIcon className='w-6 h-6 text-white' icon={faArrowUp} />
            </div>}
            {!issellerAuth && <div className="py-[4rem] flex justify-center items-center h-screen">
                <div className='backdrop-blur-sm shadow-lg mx-2 text-gray-800 bg-white/50 py-8 px-12 rounded-xl'>
                    <div className='text-2xl text-center my-2'>Please login to continue!</div>
                    <div className='flex justify-center items-center'><button onClick={gotologin} className='hover:scale-105 text-xl backdrop-blur-sm my-2 mx-7 px-4 py-3 rounded-md bg-green-700/60 hover:bg-green-700/80 text-white duration-200'>Log in</button></div>
                </div>
                <div className='-z-10 absolute top-0 overflow-hidden'><img className=' h-screen w-screen object-cover' src="/Flowers1.jpg" alt="" /></div>
            </div>}
            {!isActivated && <div className="py-[4rem] flex justify-center items-center h-screen">
                <div className='backdrop-blur-sm shadow-lg mx-2 text-gray-800 bg-white/50 py-8 px-12 rounded-xl'>
                    <div className='text-2xl text-center my-2'>Please activate your account to continue!</div>
                    <div className='flex justify-center items-center'><button onClick={gotoProfile} className='hover:scale-105 text-xl backdrop-blur-sm my-2 mx-7 px-4 py-3 rounded-md bg-green-700/60 hover:bg-green-700/80 text-white duration-200'>Go to Profile</button></div>
                </div>
                <div className='-z-10 absolute top-0 overflow-hidden'><img className=' h-screen w-screen object-cover' src="/Flowers5.jpg" alt="" /></div>
            </div>}
            {loading && <div className='py-[4rem] flex justify-center items-center h-screen'>
                <img className='h-[10rem] w-[10rem] animate-spin' src="/loading.png" alt="" />
            </div>}
            {error && <div className="py-[4rem] flex justify-center items-center h-screen">
                <div className='backdrop-blur-sm shadow-lg mx-2 text-gray-800 bg-white/50 py-8 px-12 rounded-xl'>
                    <div className='text-2xl text-center my-2'>An error occured while loading products!</div>
                    <div className='flex justify-center items-center'><button onClick={handlereload} className='hover:scale-105 text-xl backdrop-blur-sm my-2 mx-7 px-4 py-3 rounded-md bg-green-700/60 hover:bg-green-700/80 text-white duration-200'><FontAwesomeIcon className='mr-2' icon={faRotateRight} />Refresh</button></div>
                </div>
                <div className='-z-10 absolute top-0 overflow-hidden'><img className=' h-screen w-screen object-cover' src="/Flowers3.jpg" alt="" /></div>
            </div>}
        </>
    )
};

export default SellerProducts;