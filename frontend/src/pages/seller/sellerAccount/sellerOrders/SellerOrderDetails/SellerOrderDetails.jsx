import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../../../../../context/context';
//Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faLocationDot, faMinus, faPlus, faRotateRight, faXmark, faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-regular-svg-icons';
//Components
import Notification from '../../../../../components/Notification';

const SellerOrderDetails = () => {

    const { orderId } = useParams();
    const navigate = useNavigate();
    const deliveredbuttonref = useRef();
    const deliveredPopupmenuref = useRef();
    const { issellerAuth, setissellerAuth, setsellerredirect, backend_url } = useContext(AppContext);
    const ratingValues = [0, 1, 2, 3, 4];
    const [isPopup, setisPopup] = useState(false);
    const [popupMessage, setpopupMessage] = useState('');
    const [order, setorder] = useState({});
    const [rating, setrating] = useState(-1);
    const [poster, setposter] = useState('');
    const [active, setactive] = useState(0);
    const [pictures, setpictures] = useState([]);
    const [imagePopup, setimagePopup] = useState(false);
    const [isActivated, setisActivated] = useState(true);
    const [error, seterror] = useState(false);
    const [loading, setloading] = useState(true);
    const [reviewText, setreviewText] = useState('');
    const [deliveredPopup, setdeliveredPopup] = useState(false);
    const [isReviewed, setisReviewed] = useState(false);
    const [date, setdate] = useState('');

    //Handle login
    const gotologin = () => {
        setsellerredirect(window.location.pathname);
        navigate("/seller/login-register");
    };

    //Handle gotoprofile
    const gotoProfile = () => {
        navigate("/seller/account/profile");
    };

    //Handle reload
    const handlereload = () => {
        seterror(false);
        fetchDetails();
    };

    //Image viewer
    const imagecancel = () => {
        setimagePopup(false);
    };

    const openImageViewer = (picture, index) => {
        setposter(picture);
        setactive(index);
        setimagePopup(true);
    };

    const nextImage = () => {
        const totalImages = pictures.length;
        setactive((prev) => {
            const newActive = (prev + 1) % totalImages;
            setposter(pictures[newActive]);
            return newActive;
        });
    };

    const prevImage = () => {
        const totalImages = pictures.length;
        setactive((prev) => {
            const newActive = (prev - 1 + totalImages) % totalImages;
            setposter(pictures[newActive]);
            return newActive;
        });
    };

    // Handle left and right arrow key navigation
    const handleKeyDown = (event) => {
        if (event.key === 'ArrowRight') {
            nextImage();
        } else if (event.key === 'ArrowLeft') {
            prevImage();
        } else if (event.key === 'Escape') {
            imagecancel();
        };
    };

    useEffect(() => {
        if (imagePopup) {
            window.addEventListener('keydown', handleKeyDown);
        };

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [imagePopup]);

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

    //Fetch order details
    const fetchDetails = async () => {
        try {
            setloading(true);
            const response = await fetch(`${backend_url}/api/sellers/order-details`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include',
                body: JSON.stringify({
                    orderId: orderId,
                }),
            });
            const result = await response.json();
            if (result.status == 200) {
                // console.log(result.data);
                setorder(result.data.order);
            }
            else if (result.status == 201) {
                // console.log(result.data);
                setorder(result.data.order);
                setisReviewed(true);
                setreviewText(result.data.review.description);
                setrating(result.data.review.rating - 1);
                setpictures(result.data.review.images);
                setdate(result.data.review.updatedAt);
            }
            else if (result.status == 469) {
                setissellerAuth(false);
                setpopupMessage(result.message);
                setisPopup(true);
            }
            else if (result.status == 468) {
                setisActivated(false);
                setpopupMessage(result.message);
                setisPopup(true);
            }
            else {
                setpopupMessage(result.message);
                setisPopup(true);
                seterror(true);
                console.log(result);
            };
        } catch (error) {
            seterror(true);
            setpopupMessage(error.message);
            setisPopup(true);
            console.log(error);
        } finally {
            setloading(false);
        };
    };

    useEffect(() => {
        fetchDetails();
    }, []);

    //Handle delivered
    const shipOrder = async () => {
        if (order.deliveryStatus == 'Packing') {
            try {
                setloading(true);
                const response = await fetch(`${backend_url}/api/sellers/change-delivery-status`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        orderId: orderId,
                    }),
                });
                const result = await response.json();
                if (result.status == 200) {
                    setpopupMessage("Order updated succesfully!");
                    setisPopup(true);
                    fetchDetails();
                }
                else if (result.status == 469) {
                    setpopupMessage(result.message);
                    setisPopup(true);
                    setisAuth(false);
                }
                else if (result.status == 468) {
                    setisActivated(false);
                    setpopupMessage(result.message);
                    setisPopup(true);
                }
                else {
                    setpopupMessage(result.message);
                    setisPopup(true);
                    console.log(result);
                };
            } catch (error) {
                console.log(error);
                setpopupMessage(error.message);
                setisPopup(true);
            } finally {
                setloading(false);
            };
        }
        else {
            setpopupMessage("You can only ship your order when your order status is packing!");
            setisPopup(true);
        };
    };

    const handleDelivered = () => {
        shipOrder();
        cancelDelivered();
    };

    const cancelDelivered = () => {
        setdeliveredPopup(false);
    };

    const shipOrderclick = (e) => {
        e.stopPropagation();
        setdeliveredPopup(true);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                deliveredbuttonref.current &&
                !deliveredbuttonref.current.contains(e.target) &&
                deliveredPopupmenuref.current &&
                !deliveredPopupmenuref.current.contains(e.target)
            ) {
                setdeliveredPopup(false);
            };
        };

        if (deliveredPopup) {
            document.addEventListener('click', handleClickOutside);
        } else {
            document.removeEventListener('click', handleClickOutside);
        };

        // Cleanup event listener on component unmount
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [deliveredPopup]);

    return (
        <>
            {isPopup && <Notification message={popupMessage} onexit={exitPopup} />}
            {deliveredPopup && <div className="fixed backdrop-blur-sm top-0 left-0 z-[80] flex justify-center items-center w-screen h-screen">
                <div ref={deliveredPopupmenuref} className='bg-gradient-to-br mx-2 drop-shadow-lg from-red-400 via-pink-400 to-pink-200 p-2 rounded-3xl'>
                    <div className='flex flex-col bg-white rounded-2xl p-6'>
                        <div className=''>Are you sure you want to ship your order?</div>
                        <div className=''>(you cannot undo your changes)</div>
                        <div className='flex justify-end mt-6'>
                            <button onClick={cancelDelivered} className='ml-4 bg-gray-200 duration-300 active:scale-95 px-4 py-2 rounded-xl sm:text-base text-sm hover:bg-gray-300'>Cancel</button>
                            <button onClick={handleDelivered} className='ml-4 bg-green-700 duration-300 active:scale-95 px-4 py-2 rounded-xl sm:text-base text-sm text-white hover:bg-green-800'>Recieved</button>
                        </div>
                    </div>
                </div>
            </div>}
            {imagePopup && <div className='fixed backdrop-blur-sm z-[100] flex justify-center items-center w-screen h-screen top-0 right-0'>
                <div className='flex justify-between items-center flex-col w-[40rem] h-[35rem] mx-2 bg-black rounded-2xl relative'>
                    {(pictures.length > 1) && <button onClick={() => { prevImage() }} className='absolute top-1/2 sm:left-10 left-0 transform -translate-y-1/2'><FontAwesomeIcon className='w-6 h-6 p-2 rounded-full bg-white mx-2 cursor-pointer hover:drop-shadow-lg duration-200 hover:scale-105 active:scale-100' icon={faArrowLeft} /></button>}
                    {(pictures.length > 1) && <button onClick={() => { nextImage() }} className='absolute top-1/2 sm:right-10 right-0 transform -translate-y-1/2'><FontAwesomeIcon className='w-6 h-6 p-2 rounded-full bg-white mx-2 cursor-pointer hover:drop-shadow-lg duration-200 hover:scale-105 active:scale-100' icon={faArrowRight} /></button>}
                    <div className='ml-auto mb-2'>
                        <FontAwesomeIcon onClick={imagecancel} className='m-4 cursor-pointer duration-200 hover:text-red-600 p-2 flex-grow text-white h-6 w-6' icon={faXmark} />
                    </div>
                    <div className='flex flex-col justify-center items-center mb-20'>
                        <div className="overflow-hidden sm:w-[15rem] w-[12rem] h-[16rem] sm:h-[20rem] mb-3">
                            <img src={poster} />
                        </div>
                        <button className="mb-1 mt-4 px-6 py-2 rounded-md bg-red-400 text-white hover:bg-red-600 duration-200 " disabled={loading} onClick={imagecancel}> Cancel</button>
                    </div>
                </div>
            </div>}
            {issellerAuth && !loading && !error && isActivated && <div className='my-[4rem] flex flex-col items-center overflow-auto'>
                <div className='sm:w-5/6 w-[100%] px-2'>
                    <Link to={`/seller/account/products/${order.product?._id}`} className='flex bg-gray-100 rounded-xl mt-4 p-4'>
                        <div className='shrink-0'><img className='w-[6rem] rounded-xl h-[8rem] md:w-[8rem] md:h-[10rem] object-cover' src={order.product?.images[0]} /></div>
                        <div className='ml-4 w-5/6'>
                            <div className='md:mt-4 mt-1 font-bold text-xl'>{order.product?.name}</div>
                            <div className='text-ellipsis overflow-hidden text-nowrap whitespace-nowrap md:w-[300px] sm:w-[250px] w-[180px] text-sm sm:text-base'>{order.product?.description}</div>
                            <div className='sm:mt-2 mt-1 text-sm sm:text-base'>Rs. {order.product?.price}</div>
                            <div className='sm:mt-2 mt-1 text-sm sm:text-base'>Ordered on : {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
                        </div>
                    </Link>
                    <div className='border-2 items-center border-green-700 rounded-xl mt-6 p-4 font-semibold flex justify-between'>
                        {(order.deliveryStatus == "Packing") && <div className='sm:text-xl'>Status : {order.deliveryStatus}</div>}
                        {(order.deliveryStatus == "Shipped") && <div className='sm:text-xl flex flex-wrap'>
                            <div className='mr-2'>Shipped on </div><div>{new Date(order.shippedOn).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
                        </div>}
                        {(order.deliveryStatus == "Delivered") && <div className='sm:text-xl'>
                            <div>Shipped on {new Date(order.shippedOn).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
                            <div>Delivered on {new Date(order.deliveredOn).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
                        </div>}
                        {(order.deliveryStatus == 'Packing') && <button onClick={(e) => { shipOrderclick(e) }} className='bg-green-700 text-white px-4 py-3 hover:bg-green-800 active:scale-95 duration-300 rounded-xl text-nowrap'>Ship Order</button>}
                    </div>
                    <div className=' text-sm sm:text-base border-2 items-center border-green-700 rounded-xl mt-6 p-4 font-semibold '>
                        <div className=''>Razorpay order ID : {order.razorpay_order_id}</div>
                        <div className=''>Razorpay payment ID : {order.razorpay_payment_id}</div>
                    </div>
                    <div className='bg-gray-100 rounded-xl p-4 mt-6'>
                        <div className='text-xl font-semibold'><FontAwesomeIcon className='text-red-600 pr-2' icon={faLocationDot} />Shipping address</div>
                        <div className='my-2 text-sm sm:text-base'>{order.address?.name}, {order.address?.localAddress}{((order.address?.landmark !== "") ? ', ' : '')}{order.address?.landmark}, {order.address?.city}, {order.address?.state}</div>
                        <div className=' text-sm sm:text-base'>Pin: {order.address?.pincode}, Phone: {order.address?.contact}</div>
                    </div>
                    {(order.deliveryStatus !== 'Delivered') && <div className='border border-red-400 bg-red-50 rounded-xl p-4 text-red-700 mt-6 mb-[5rem]'>Cannot have review until product is delivered.</div>}
                    {(order.deliveryStatus == 'Delivered') && !isReviewed && <div className='border border-red-400 bg-red-50 rounded-xl p-4 text-red-700 mt-6 mb-[5rem]'>Order is not reviewed by buyer.</div>}
                    {isReviewed && (order.deliveryStatus == 'Delivered') && <div className='text-xl font-semibold mt-6'>Your review</div>}
                    {isReviewed && (order.deliveryStatus == 'Delivered') && <div className='flex items-start border-2 border-gray-100 rounded-xl sm:px-4 px-2 py-4 mb-2'>
                        <div className='flex-shrink-0 rounded-full hover:scale-105 duration-500 overflow-hidden flex justify-center items-center sm:mr-4 mr-2'>
                            <img className='object-cover w-14 h-14' src={order.boughtBy?.profilePicture} alt="" />
                        </div>
                        <div className='flex-grow'>
                            <div className='text-xl font-bold '>{order.boughtBy?.name}</div>
                            <div className='italic'>{order.boughtBy?.email}</div>
                            <div className='flex mt-2' title='4/5'>
                                {ratingValues && ratingValues.map((value) => {
                                    return <div key={value} className='mr-2 text-yellow-400'>
                                        {(value <= rating) ? <FontAwesomeIcon icon={solidStar} /> : <FontAwesomeIcon icon={faStar} />}
                                    </div>
                                })}
                            </div>
                            <div className='flex mt-2 flex-wrap'>
                                {pictures && pictures.map((picture, index) => {
                                    return <button key={picture} onClick={() => { openImageViewer(picture, index) }} className='border-2 overflow-hidden w-[3rem] h-[3rem] rounded-md flex justify-center hover:border-green-700 duration-300 items-center opacity-80 hover:opacity-100 mr-2'>
                                        <img className='object-cover' src={picture} />
                                    </button>
                                })}
                            </div>
                            <div className=' text-sm sm:text-base rounded-lg mt-3 whitespace-pre-wrap w-full'>{reviewText}</div>
                            <div className='font-semibold text-sm sm:text-base'>Reviewed on : {new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
                        </div>
                    </div>}
                </div>
            </div>}
            {!issellerAuth && !loading && !error && <div className="py-[4rem] flex justify-center items-center h-screen">
                <div className='backdrop-blur-sm shadow-lg mx-2 text-gray-800 bg-white/50 py-8 px-12 rounded-xl'>
                    <div className='text-2xl text-center my-2'>Please login to continue!</div>
                    <div className='flex justify-center items-center'><button onClick={gotologin} className='hover:scale-105 text-xl backdrop-blur-sm my-2 mx-7 px-4 py-3 rounded-md bg-green-700/60 hover:bg-green-700/80 text-white duration-200'>Log in</button></div>
                </div>
                <div className='-z-10 absolute top-0 overflow-hidden'><img className=' h-screen w-screen object-cover' src="/Flowers1.jpg" alt="" /></div>
            </div>}
            {!isActivated && !loading && !error && <div className="py-[4rem] flex justify-center items-center h-screen">
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
                    <div className='text-2xl text-center my-2'>An error occured while loading order details!</div>
                    <div className='flex justify-center items-center'><button onClick={handlereload} className='hover:scale-105 text-xl backdrop-blur-sm my-2 mx-7 px-4 py-3 rounded-md bg-green-700/60 hover:bg-green-700/80 text-white duration-200'><FontAwesomeIcon className='mr-2' icon={faRotateRight} />Refresh</button></div>
                </div>
                <div className='-z-10 absolute top-0 overflow-hidden'><img className=' h-screen w-screen object-cover' src="/Flowers3.jpg" alt="" /></div>
            </div>}
        </>
    )
};

export default SellerOrderDetails;