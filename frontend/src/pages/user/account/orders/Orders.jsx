import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../../../../context/context';
//Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faRotateRight } from '@fortawesome/free-solid-svg-icons';
//Components
import Notification from '../../../../components/Notification';

const Orders = () => {

    const navigate = useNavigate();
    const scrollableRef = useRef();
    const { isAuth, setisAuth, setredirect, backend_url } = useContext(AppContext);
    const [orders, setorders] = useState([]);
    const [error, seterror] = useState(false);
    const [loading, setloading] = useState(true);
    const [isPopup, setisPopup] = useState(false);
    const [popupMessage, setpopupMessage] = useState(" ");
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

    //Handle popup
    let closeTimeout;
    useEffect(() => {
        if (isPopup) {
            closeTimeout = setTimeout(() => {
                setisPopup(false);
            }, 3000);
        }
        return () => clearTimeout(closeTimeout);
    }, [isPopup]);

    const exitPopup = () => {
        setisPopup(false);
        clearTimeout(closeTimeout);
    };

    //Fetch products
    const fetchProducts = async () => {
        try {
            setloading(true);
            const response = await fetch(`${backend_url}/api/users/fetch-orders`,
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
                setorders(data.data);
                // console.log(data);
            }
            else {
                setpopupMessage(data.message);
                setisPopup(true);
                console.log(data);
                seterror(true);
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
    }, []);

    //Handle scroll to top
    const toggleVisibility = () => {
        const container = scrollableRef.current;
        // console.log("Scroll position:", container.scrollTop); 
        if (container && container.scrollTop > 100) { // Adjust threshold as needed
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
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
    }, [isAuth, loading, error]);

    return (
        <>
            {isPopup && <Notification message={popupMessage} onexit={exitPopup} />}
            {isAuth && !loading && !error && <div ref={scrollableRef} className='overflow-auto flex-1 '>
                <div className='bg-yellow-300 lg:mx-20 sm:mx-10 mx-2 my-6 p-4 rounded-3xl pl-6 border-b border-l'>{(orders.length !== 0) ? `You made ${orders.length} orders` : `You have not made any orders yet`}</div>
                <div className='flex flex-col lg:mx-20 sm:mx-10 mx-2 md:mb-10'>
                    {(orders.length == 0) && <div className='flex border rounded-3xl md:p-4 px-2 py-4 hover:bg-gray-100 justify-center items-center'>
                        <div>Empty</div>
                    </div>}
                    {orders && orders.map((order) => {
                        return <Link to={`/user/account/orders/${order._id}`} key={order._id} className='flex border-b md:p-4 px-2 py-4 hover:bg-gray-100 hover:rounded-xl duration-200'>
                            <div className='md:w-[8rem] md:h-[10rem] w-[6rem] h-[7.5rem] flex-shrink-0 overflow-hidden rounded-lg'>
                                <img src={order.product.images[0]} alt="" />
                            </div>
                            <div className='overflow-hidden mx-4 md:mt-4 mt-2'>
                                <div className='md:text-base text-sm text-ellipsis overflow-hidden text-nowrap font-bold'>{order.product.name}</div>
                                <div className='md:text-base text-sm'>Rs.<span>{order.product.price}</span></div>
                                <div className='md:text-base text-sm mt-2'>Ordered on {new Date(order.createdAt).toLocaleDateString('en-GB')}</div>
                                {(order.deliveryStatus == "Packing") && <div className='md:text-base  text-green-500 text-sm mt-2'>Packing</div>}
                                {(order.deliveryStatus == "Shipped") && <div className='md:text-base text-green-500 text-sm mt-2'>Shipped on {new Date(order.shippedOn).toLocaleDateString('en-GB')}</div>}
                                {(order.deliveryStatus == "Delivered") && <div className='md:text-base text-sm mt-2'>Delivered on {new Date(order.deliveredOn).toLocaleDateString('en-GB')}</div>}
                            </div>
                        </Link>
                    })}
                </div>
            </div>}
            {isVisible && <div onClick={scrollToTop} className='fixed z-[101] sm:bottom-10 bottom-[5rem] sm:right-10 right-[1rem] bg-green-700 hover:bg-green-700/90 duration-200 active:scale-95 rounded-full p-3  cursor-pointer flex justify-center items-center'>
                <FontAwesomeIcon className='w-6 h-6 text-white' icon={faArrowUp} />
            </div>}
            {loading && <div className='overflow-auto flex-1 flex-col items-center'>
                <div className='bg-yellow-300 text-yellow-300 animate-pulse lg:mx-20 sm:mx-10 mx-2 my-6 p-4 rounded-3xl pl-6 border-b border-l'>You made 0 orders</div>
                <div className='flex flex-col lg:mx-20 sm:mx-10 mx-2 mb-10'>
                    <div className='flex border-b md:p-4 px-2 py-4  duration-200'>
                        <div className='md:w-[8rem] bg-gray-200 animate-pulse md:h-[10rem] w-[6rem] h-[7.5rem] flex-shrink-0 overflow-hidden rounded-lg'>
                            <div ></div>
                        </div>
                        <div className='overflow-hidden mx-4 md:mt-4 mt-2'>
                            <div className='md:text-base bg-gray-200 mb-1 text-gray-200 animate-pulse rounded-lg text-sm text-ellipsis overflow-hidden text-nowrap font-bold'>dsa</div>
                            <div className='md:text-base bg-gray-200 w-1/2 text-gray-200 animate-pulse rounded-lg text-sm'>Rs.57</div>
                            <div className='md:text-base bg-gray-200 text-gray-200 animate-pulse rounded-lg text-sm mt-2'>Ordered on 23 December 2023</div>
                            <div className='md:text-base w-2/3 bg-gray-200 text-gray-200 animate-pulse rounded-lg text-sm mt-2'>asdndad</div>
                        </div>
                    </div>
                    <div className='flex border-b md:p-4 px-2 py-4  duration-200'>
                        <div className='md:w-[8rem] bg-gray-200 animate-pulse md:h-[10rem] w-[6rem] h-[7.5rem] flex-shrink-0 overflow-hidden rounded-lg'>
                            <div ></div>
                        </div>
                        <div className='overflow-hidden mx-4 md:mt-4 mt-2'>
                            <div className='md:text-base bg-gray-200 mb-1 text-gray-200 animate-pulse rounded-lg text-sm text-ellipsis overflow-hidden text-nowrap font-bold'>dsa</div>
                            <div className='md:text-base bg-gray-200 w-1/2 text-gray-200 animate-pulse rounded-lg text-sm'>Rs.57</div>
                            <div className='md:text-base bg-gray-200 text-gray-200 animate-pulse rounded-lg text-sm mt-2'>Ordered on 23 December 2023</div>
                            <div className='md:text-base w-2/3 bg-gray-200 text-gray-200 animate-pulse rounded-lg text-sm mt-2'>asdndad</div>
                        </div>
                    </div>
                    <div className='flex border-b md:p-4 px-2 py-4  duration-200'>
                        <div className='md:w-[8rem] bg-gray-200 animate-pulse md:h-[10rem] w-[6rem] h-[7.5rem] flex-shrink-0 overflow-hidden rounded-lg'>
                            <div ></div>
                        </div>
                        <div className='overflow-hidden mx-4 md:mt-4 mt-2'>
                            <div className='md:text-base bg-gray-200 mb-1 text-gray-200 animate-pulse rounded-lg text-sm text-ellipsis overflow-hidden text-nowrap font-bold'>dsa</div>
                            <div className='md:text-base bg-gray-200 w-1/2 text-gray-200 animate-pulse rounded-lg text-sm'>Rs.57</div>
                            <div className='md:text-base bg-gray-200 text-gray-200 animate-pulse rounded-lg text-sm mt-2'>Ordered on 23 December 2023</div>
                            <div className='md:text-base w-2/3 bg-gray-200 text-gray-200 animate-pulse rounded-lg text-sm mt-2'>asdndad</div>
                        </div>
                    </div>
                    <div className='flex border-b md:p-4 px-2 py-4  duration-200'>
                        <div className='md:w-[8rem] bg-gray-200 animate-pulse md:h-[10rem] w-[6rem] h-[7.5rem] flex-shrink-0 overflow-hidden rounded-lg'>
                            <div ></div>
                        </div>
                        <div className='overflow-hidden mx-4 md:mt-4 mt-2'>
                            <div className='md:text-base bg-gray-200 mb-1 text-gray-200 animate-pulse rounded-lg text-sm text-ellipsis overflow-hidden text-nowrap font-bold'>dsa</div>
                            <div className='md:text-base bg-gray-200 w-1/2 text-gray-200 animate-pulse rounded-lg text-sm'>Rs.57</div>
                            <div className='md:text-base bg-gray-200 text-gray-200 animate-pulse rounded-lg text-sm mt-2'>Ordered on 23 December 2023</div>
                            <div className='md:text-base w-2/3 bg-gray-200 text-gray-200 animate-pulse rounded-lg text-sm mt-2'>asdndad</div>
                        </div>
                    </div>
                    <div className='flex border-b md:p-4 px-2 py-4  duration-200'>
                        <div className='md:w-[8rem] bg-gray-200 animate-pulse md:h-[10rem] w-[6rem] h-[7.5rem] flex-shrink-0 overflow-hidden rounded-lg'>
                            <div ></div>
                        </div>
                        <div className='overflow-hidden mx-4 md:mt-4 mt-2'>
                            <div className='md:text-base bg-gray-200 mb-1 text-gray-200 animate-pulse rounded-lg text-sm text-ellipsis overflow-hidden text-nowrap font-bold'>dsa</div>
                            <div className='md:text-base bg-gray-200 w-1/2 text-gray-200 animate-pulse rounded-lg text-sm'>Rs.57</div>
                            <div className='md:text-base bg-gray-200 text-gray-200 animate-pulse rounded-lg text-sm mt-2'>Ordered on 23 December 2023</div>
                            <div className='md:text-base w-2/3 bg-gray-200 text-gray-200 animate-pulse rounded-lg text-sm mt-2'>asdndad</div>
                        </div>
                    </div>
                </div>
            </div>}
            {error && <div className='flex-1 flex justify-center items-center h-full'>
                <div className='backdrop-blur-sm mx-2 shadow-lg text-gray-800 bg-white/50 py-8 px-12 rounded-xl'>
                    <div className='text-2xl text-center my-2'>An error occured while loading orders!</div>
                    <div className='flex justify-center items-center'><button onClick={handlereload} className='hover:scale-105 text-xl backdrop-blur-sm my-2 mx-7 px-4 py-3 rounded-md bg-green-700/60 hover:bg-green-700/80 text-white duration-200'><FontAwesomeIcon className='mr-2' icon={faRotateRight} />Refresh</button></div>
                </div>
                <div className='-z-10 absolute top-0 overflow-hidden'><img className=' h-screen w-screen object-cover' src="/Flowers3.jpg" alt="" /></div>
            </div>}
            {!isAuth && <div className='flex-1 flex justify-center items-center h-full'>
                <div className='backdrop-blur-sm mx-2 shadow-lg text-gray-800 bg-white/50 py-8 px-12 rounded-xl'>
                    <div className='text-2xl text-center my-2'>Please login to continue!</div>
                    <div className='flex justify-center items-center'><button onClick={gotologin} className='hover:scale-105 text-xl backdrop-blur-sm my-2 mx-7 px-4 py-3 rounded-md bg-green-700/60 hover:bg-green-700/80 text-white duration-200'>Log in</button></div>
                </div>
                <div className='-z-10 absolute top-0 overflow-hidden'><img className=' h-screen w-screen object-cover' src="/Flowers1.jpg" alt="" /></div>
            </div>}
        </>
    )
};

export default Orders;