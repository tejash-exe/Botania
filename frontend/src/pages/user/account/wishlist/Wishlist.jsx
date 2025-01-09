import React, { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../../../../context/context';
//Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateRight, faHeart, faArrowUp, faStar } from '@fortawesome/free-solid-svg-icons';
//Components
import Notification from '../../../../components/Notification';

const Wishlist = () => {

    const navigate = useNavigate();
    const scrollableRef = useRef();
    const { isAuth, setisAuth, wishlist, setwishlist, setredirect, backend_url } = useContext(AppContext);
    const [loading, setloading] = useState(true);
    const [error, seterror] = useState(false);
    const [isPopup, setisPopup] = useState(false);
    const [popupMessage, setpopupMessage] = useState(" ");
    const [products, setproducts] = useState([]);
    const [isVisible, setIsVisible] = useState(false);

    //Handle login
    const gotologin = () => {
        setredirect(window.location.pathname);
        navigate("/user/login-register");
    };

    //Handle reload
    const handlereload = () => {
        seterror(false);
        fetchProducts();
    };

    //Buy plants
    const handlebuyplants = () => {
        navigate("/user/searchresults/%20");
    };

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

    //Handle wishlist
    const handleLike = async (e, productId) => {
        e.preventDefault();
        e.stopPropagation();
        if (wishlist.includes(productId)) {
            setloading(true);
            try {
                const response = await fetch(`${backend_url}/api/users/remove-from-wishlist`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        productId: productId,
                    })
                });
                const result = await response.json();
                if (result.status == 200) {
                    // console.log(result);
                    setwishlist(result.data.wishlist);
                    setpopupMessage("Product removed from your wishlist!");
                    setisPopup(true);
                }
                else if (result.status == 469) {
                    // localStorage.clear();
                    setisAuth(false);
                    setpopupMessage(result.message);
                    setisPopup(true);
                }
                else {
                    setpopupMessage(result.message);
                    setisPopup(true);
                    console.log(result);
                };
            } catch (error) {
                setpopupMessage(error.message);
                setisPopup(true);
                console.log(error);
            } finally {
                setloading(false);
            };
        };
    };

    //Fetch products
    const fetchProducts = async () => {
        try {
            setloading(true);
            const response = await fetch(`${backend_url}/api/users/wishlist`,
                {
                    method: "POST",
                    credentials: 'include',
                }
            );
            const data = await response.json();
            if (data.status == 469) {
                // localStorage.clear();
                setisAuth(false);
                setpopupMessage(data.message);
                setisPopup(true);
            }
            else if (data.status == 200) {
                // console.log(data);
                setproducts(data.data);
            }
            else {
                setpopupMessage(data.message);
                setisPopup(true);
                seterror(true);
                console.log(data);
            };
        } catch (error) {
            setpopupMessage(error.message);
            setisPopup(true);
            console.log(error);
            seterror(true);
        } finally {
            setloading(false);
        };
    };

    useEffect(() => {
        fetchProducts();
    }, [wishlist]);

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
            }
        };
    }, [isAuth, loading, error]);

    return (
        <>
            {isPopup && <Notification message={popupMessage} onexit={exitPopup} />}
            {isAuth ? <>
                <div ref={scrollableRef} className='flex-1 overflow-auto flex flex-col'>
                    <div className='border-b text-sm pl-2 flex justify-between items-center'>
                        {!loading && !error && <div className='py-2 px-3'>
                            {products && `You have ${products?.length} items in your wishlist`}
                        </div>}
                        {loading && <div className='py-1 my-1 sm:mx-3 mx-4 px-3 bg-gray-200 text-gray-200 rounded-lg animate-pulse'>
                            You have 0 items in your wishlist
                        </div>}
                    </div>
                    {!loading && !error && <div className='flex flex-wrap h-screen justify-around'>
                        {(products?.length == 0) && <div className='justify-center items-center flex '>
                            <div className='flex flex-col items-center'>
                                <div>Explore plants and put them into your wishlist</div>
                                <div><button onClick={handlebuyplants} className='active:bg-green-800 duration-200 bg-green-700 text-white px-3 py-2 rounded-lg mt-2'>Buy plants</button></div>
                            </div>
                        </div>}
                        {products && products.map((product) => {
                            return <Link to={`/user/product/id/${product._id}/`} className='rounded-lg cursor-pointer flex flex-col sm:w-[13rem] w-[9rem] h-[15rem] sm:h-[20rem] m-4 overflow-hidden hover:shadow-lg' key={product._id}>
                                <div className='relative'>
                                    <img className={((product.availability ? ' ' : ' opacity-50 ')) + ' object-cover sm:w-[13rem] w-[9rem] h-[11rem] sm:h-[15rem] '} src={product.images[0]} alt="" />
                                    <div className='absolute bottom-3 mx-3'>
                                        <div className='flex bg-white rounded-md'>
                                            <div className='my-[2px] pl-2 pr-2 text-xs'>{product.soldBy.averageRating}<span className='text-green-700'> <FontAwesomeIcon icon={faStar}/></span></div>
                                        </div>
                                    </div>
                                    {!product.availability && <div className='absolute text-lg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>Sold out</div>}
                                    <div onClick={e => { handleLike(e, product._id) }} className='absolute bottom-3 right-0 '>
                                        <button className='mr-3 w-8 h-8 hover:scale-110 active:scale-100 duration-200 bg-white rounded-full'><FontAwesomeIcon className='text-red-600' icon={faHeart} /></button>
                                    </div>
                                </div>
                                <div className='mt-3 mx-3'>
                                    <div className='font-bold sm:text-base text-sm text-ellipsis text-nowrap overflow-hidden'>{product.name}</div>
                                    <div className='sm:text-sm text-xs'>Rs.{product.price}</div>
                                </div>
                            </Link>
                        })}
                    </div>}
                    {loading && <div className='flex flex-wrap h-screen justify-around'>
                        <div className=' rounded-lg cursor-pointer flex flex-col sm:w-[13rem] w-[9rem] h-[15rem] sm:h-[20rem] m-4 overflow-hidden hover:shadow-lg'>
                            <div className='relative'>
                                <div className={'animate-pulse bg-gray-200 object-cover sm:w-[13rem] w-[9rem] h-[11rem] sm:h-[15rem] '}></div>
                                <div className='absolute bottom-3 mx-3'>
                                    <div className='flex bg-white rounded-md'>
                                        <div className='my-[2px] pl-2 pr-2 text-xs'>5<span className='text-green-700'> ★</span></div>
                                    </div>
                                </div>
                                {<div className='absolute bottom-3 right-0 '>
                                    <button className='mr-3 w-8 h-8 hover:scale-110 active:scale-100 duration-200 bg-white rounded-full'><FontAwesomeIcon className='text-red-600' icon={faHeart} /></button>
                                </div>}
                            </div>
                            <div className='mt-3 mx-3'>
                                <div className='animate-pulse text-gray-200 bg-gray-200 rounded-lg font-bold sm:text-base text-sm text-ellipsis text-nowrap overflow-hidden'>sdad</div>
                                <div className='animate-pulse text-gray-200 bg-gray-200 rounded-lg w-1/2 mt-1 sm:text-sm text-xs'>hk</div>
                            </div>
                        </div>
                        <div className=' rounded-lg cursor-pointer flex flex-col sm:w-[13rem] w-[9rem] h-[15rem] sm:h-[20rem] m-4 overflow-hidden hover:shadow-lg'>
                            <div className='relative'>
                                <div className={'animate-pulse bg-gray-200 object-cover sm:w-[13rem] w-[9rem] h-[11rem] sm:h-[15rem] '}></div>
                                <div className='absolute bottom-3 mx-3'>
                                    <div className='flex bg-white rounded-md'>
                                        <div className='my-[2px] pl-2 pr-2 text-xs'>5<span className='text-green-700'> ★</span></div>
                                    </div>
                                </div>
                                {<div className='absolute bottom-3 right-0 '>
                                    <button className='mr-3 w-8 h-8 hover:scale-110 active:scale-100 duration-200 bg-white rounded-full'><FontAwesomeIcon className='text-red-600' icon={faHeart} /></button>
                                </div>}
                            </div>
                            <div className='mt-3 mx-3'>
                                <div className='animate-pulse text-gray-200 bg-gray-200 rounded-lg font-bold sm:text-base text-sm text-ellipsis text-nowrap overflow-hidden'>sdad</div>
                                <div className='animate-pulse text-gray-200 bg-gray-200 rounded-lg w-1/2 mt-1 sm:text-sm text-xs'>hk</div>
                            </div>
                        </div>
                        <div className=' rounded-lg cursor-pointer flex flex-col sm:w-[13rem] w-[9rem] h-[15rem] sm:h-[20rem] m-4 overflow-hidden hover:shadow-lg'>
                            <div className='relative'>
                                <div className={'animate-pulse bg-gray-200 object-cover sm:w-[13rem] w-[9rem] h-[11rem] sm:h-[15rem] '}></div>
                                <div className='absolute bottom-3 mx-3'>
                                    <div className='flex bg-white rounded-md'>
                                        <div className='my-[2px] pl-2 pr-2 text-xs'>5<span className='text-green-700'> ★</span></div>
                                    </div>
                                </div>
                                {<div className='absolute bottom-3 right-0 '>
                                    <button className='mr-3 w-8 h-8 hover:scale-110 active:scale-100 duration-200 bg-white rounded-full'><FontAwesomeIcon className='text-red-600' icon={faHeart} /></button>
                                </div>}
                            </div>
                            <div className='mt-3 mx-3'>
                                <div className='animate-pulse text-gray-200 bg-gray-200 rounded-lg font-bold sm:text-base text-sm text-ellipsis text-nowrap overflow-hidden'>sdad</div>
                                <div className='animate-pulse text-gray-200 bg-gray-200 rounded-lg w-1/2 mt-1 sm:text-sm text-xs'>hk</div>
                            </div>
                        </div>
                        <div className=' rounded-lg cursor-pointer flex flex-col sm:w-[13rem] w-[9rem] h-[15rem] sm:h-[20rem] m-4 overflow-hidden hover:shadow-lg'>
                            <div className='relative'>
                                <div className={'animate-pulse bg-gray-200 object-cover sm:w-[13rem] w-[9rem] h-[11rem] sm:h-[15rem] '}></div>
                                <div className='absolute bottom-3 mx-3'>
                                    <div className='flex bg-white rounded-md'>
                                        <div className='my-[2px] pl-2 pr-2 text-xs'>5<span className='text-green-700'> ★</span></div>
                                    </div>
                                </div>
                                {<div className='absolute bottom-3 right-0 '>
                                    <button className='mr-3 w-8 h-8 hover:scale-110 active:scale-100 duration-200 bg-white rounded-full'><FontAwesomeIcon className='text-red-600' icon={faHeart} /></button>
                                </div>}
                            </div>
                            <div className='mt-3 mx-3'>
                                <div className='animate-pulse text-gray-200 bg-gray-200 rounded-lg font-bold sm:text-base text-sm text-ellipsis text-nowrap overflow-hidden'>sdad</div>
                                <div className='animate-pulse text-gray-200 bg-gray-200 rounded-lg w-1/2 mt-1 sm:text-sm text-xs'>hk</div>
                            </div>
                        </div>
                        <div className=' rounded-lg cursor-pointer flex flex-col sm:w-[13rem] w-[9rem] h-[15rem] sm:h-[20rem] m-4 overflow-hidden hover:shadow-lg'>
                            <div className='relative'>
                                <div className={'animate-pulse bg-gray-200 object-cover sm:w-[13rem] w-[9rem] h-[11rem] sm:h-[15rem] '}></div>
                                <div className='absolute bottom-3 mx-3'>
                                    <div className='flex bg-white rounded-md'>
                                        <div className='my-[2px] pl-2 pr-2 text-xs'>5<span className='text-green-700'> ★</span></div>
                                    </div>
                                </div>
                                {<div className='absolute bottom-3 right-0 '>
                                    <button className='mr-3 w-8 h-8 hover:scale-110 active:scale-100 duration-200 bg-white rounded-full'><FontAwesomeIcon className='text-red-600' icon={faHeart} /></button>
                                </div>}
                            </div>
                            <div className='mt-3 mx-3'>
                                <div className='animate-pulse text-gray-200 bg-gray-200 rounded-lg font-bold sm:text-base text-sm text-ellipsis text-nowrap overflow-hidden'>sdad</div>
                                <div className='animate-pulse text-gray-200 bg-gray-200 rounded-lg w-1/2 mt-1 sm:text-sm text-xs'>hk</div>
                            </div>
                        </div>
                        <div className=' rounded-lg cursor-pointer flex flex-col sm:w-[13rem] w-[9rem] h-[15rem] sm:h-[20rem] m-4 overflow-hidden hover:shadow-lg'>
                            <div className='relative'>
                                <div className={'animate-pulse bg-gray-200 object-cover sm:w-[13rem] w-[9rem] h-[11rem] sm:h-[15rem] '}></div>
                                <div className='absolute bottom-3 mx-3'>
                                    <div className='flex bg-white rounded-md'>
                                        <div className='my-[2px] pl-2 pr-2 text-xs'>5<span className='text-green-700'> ★</span></div>
                                    </div>
                                </div>
                                {<div className='absolute bottom-3 right-0 '>
                                    <button className='mr-3 w-8 h-8 hover:scale-110 active:scale-100 duration-200 bg-white rounded-full'><FontAwesomeIcon className='text-red-600' icon={faHeart} /></button>
                                </div>}
                            </div>
                            <div className='mt-3 mx-3'>
                                <div className='animate-pulse text-gray-200 bg-gray-200 rounded-lg font-bold sm:text-base text-sm text-ellipsis text-nowrap overflow-hidden'>sdad</div>
                                <div className='animate-pulse text-gray-200 bg-gray-200 rounded-lg w-1/2 mt-1 sm:text-sm text-xs'>hk</div>
                            </div>
                        </div>
                        <div className=' rounded-lg cursor-pointer flex flex-col sm:w-[13rem] w-[9rem] h-[15rem] sm:h-[20rem] m-4 overflow-hidden hover:shadow-lg'>
                            <div className='relative'>
                                <div className={'animate-pulse bg-gray-200 object-cover sm:w-[13rem] w-[9rem] h-[11rem] sm:h-[15rem] '}></div>
                                <div className='absolute bottom-3 mx-3'>
                                    <div className='flex bg-white rounded-md'>
                                        <div className='my-[2px] pl-2 pr-2 text-xs'>5<span className='text-green-700'> ★</span></div>
                                    </div>
                                </div>
                                {<div className='absolute bottom-3 right-0 '>
                                    <button className='mr-3 w-8 h-8 hover:scale-110 active:scale-100 duration-200 bg-white rounded-full'><FontAwesomeIcon className='text-red-600' icon={faHeart} /></button>
                                </div>}
                            </div>
                            <div className='mt-3 mx-3'>
                                <div className='animate-pulse text-gray-200 bg-gray-200 rounded-lg font-bold sm:text-base text-sm text-ellipsis text-nowrap overflow-hidden'>sdad</div>
                                <div className='animate-pulse text-gray-200 bg-gray-200 rounded-lg w-1/2 mt-1 sm:text-sm text-xs'>hk</div>
                            </div>
                        </div>
                        <div className=' rounded-lg cursor-pointer flex flex-col sm:w-[13rem] w-[9rem] h-[15rem] sm:h-[20rem] m-4 overflow-hidden hover:shadow-lg'>
                            <div className='relative'>
                                <div className={'animate-pulse bg-gray-200 object-cover sm:w-[13rem] w-[9rem] h-[11rem] sm:h-[15rem] '}></div>
                                <div className='absolute bottom-3 mx-3'>
                                    <div className='flex bg-white rounded-md'>
                                        <div className='my-[2px] pl-2 pr-2 text-xs'>5<span className='text-green-700'> ★</span></div>
                                    </div>
                                </div>
                                {<div className='absolute bottom-3 right-0 '>
                                    <button className='mr-3 w-8 h-8 hover:scale-110 active:scale-100 duration-200 bg-white rounded-full'><FontAwesomeIcon className='text-red-600' icon={faHeart} /></button>
                                </div>}
                            </div>
                            <div className='mt-3 mx-3'>
                                <div className='animate-pulse text-gray-200 bg-gray-200 rounded-lg font-bold sm:text-base text-sm text-ellipsis text-nowrap overflow-hidden'>sdad</div>
                                <div className='animate-pulse text-gray-200 bg-gray-200 rounded-lg w-1/2 mt-1 sm:text-sm text-xs'>hk</div>
                            </div>
                        </div>
                    </div>}
                    {error && <div className='flex-1 flex justify-center items-center h-full'>
                        <div className='backdrop-blur-sm mx-2 shadow-lg text-gray-800 bg-white/50 py-8 px-12 rounded-xl'>
                            <div className='text-2xl text-center my-2'>An error occured while loading wishlist!</div>
                            <div className='flex justify-center items-center'><button onClick={handlereload} className='hover:scale-105 text-xl backdrop-blur-sm my-2 mx-7 px-4 py-3 rounded-md bg-green-700/60 hover:bg-green-700/80 text-white duration-200'><FontAwesomeIcon className='mr-2' icon={faRotateRight} />Refresh</button></div>
                        </div>
                        <div className='-z-10 absolute top-0 overflow-hidden'><img className=' h-screen w-screen object-cover' src="/Flowers3.jpg" alt="" /></div>
                    </div>}
                </div>
                {isVisible && <div onClick={scrollToTop} className='fixed z-[101] sm:bottom-10 bottom-[5rem] sm:right-10 right-[1rem] bg-green-700 hover:bg-green-700/90 duration-200 active:scale-95 rounded-full p-3  cursor-pointer flex justify-center items-center'>
                    <FontAwesomeIcon className='w-6 h-6 text-white' icon={faArrowUp} />
                </div>}
            </> : <div className='flex-1 flex justify-center items-center h-full'>
                <div className='backdrop-blur-sm mx-2 shadow-lg text-gray-800 bg-white/50 py-8 px-12 rounded-xl'>
                    <div className='text-2xl text-center my-2'>Please login to continue!</div>
                    <div className='flex justify-center items-center'><button onClick={gotologin} className='hover:scale-105 text-xl backdrop-blur-sm my-2 mx-7 px-4 py-3 rounded-md bg-green-700/60 hover:bg-green-700/80 text-white duration-200'>Log in</button></div>
                </div>
                <div className='-z-10 absolute top-0 overflow-hidden'><img className=' h-screen w-screen object-cover' src="/Flowers1.jpg" alt="" /></div>
            </div>}
        </>
    )
};

export default Wishlist;