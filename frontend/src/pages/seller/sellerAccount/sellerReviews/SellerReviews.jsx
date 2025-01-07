import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../../../../context/context';
//Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import { faArrowLeft, faArrowRight, faArrowUp, faRotateRight, faXmark, faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
//Components
import Notification from '../../../../components/Notification';

const SellerReviews = () => {

    const navigate = useNavigate();
    const scrollableRef = useRef();
    const { issellerAuth, setissellerAuth, setsellerredirect, backend_url } = useContext(AppContext);
    const [searchBy, setsearchBy] = useState("Recently added");
    const [reviews, setreviews] = useState([]);
    const ratingValues = [0, 1, 2, 3, 4];
    const [isPopup, setisPopup] = useState(false);
    const [popupMessage, setpopupMessage] = useState('');
    const [poster, setposter] = useState('');
    const [active, setactive] = useState(0);
    const [pictures, setpictures] = useState([]);
    const [imagePopup, setimagePopup] = useState(false);
    const [isActivated, setisActivated] = useState(true);
    const [expandedItems, setExpandedItems] = useState({});
    const [loading, setloading] = useState(true);
    const [error, seterror] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    //Handle searchBy
    const changeSearchBy = (e) => {
        setsearchBy(e.target.value);
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
        fetchReviews();
    };

    //Read more button
    const toggleReadMore = (index) => {
        setExpandedItems((prevState) => ({
            ...prevState,
            [index]: !prevState[index],
        }));
    };

    //Image viewer
    const imagecancel = () => {
        setimagePopup(false);
    };

    const openImageViewer = (picture, i, index) => {
        setposter(picture);
        setactive(i);
        setimagePopup(true);
        setpictures(reviews[index].images);
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

    // Set up the event listener for keydown events when the component is mounted
    useEffect(() => {
        if (imagePopup) {
            window.addEventListener('keydown', handleKeyDown);
        };

        // Clean up the event listener when the component is unmounted or image viewer is closed
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [imagePopup]);

    //Fetch reviews
    const fetchReviews = async () => {
        try {
            setloading(true);
            const response = await fetch(`${backend_url}/api/sellers/fetch-reviews`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    searchBy: searchBy,
                }),
            });
            const result = await response.json();
            if (result.status == 200) {
                // console.log(result);
                setreviews(result.data);
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
                console.log(result);
                setpopupMessage(result.message);
                setisPopup(true);
                seterror(true);
            };
        } catch (error) {
            console.log(error);
            setpopupMessage(error.message);
            setisPopup(true);
            seterror(true);
        } finally {
            setloading(false);
        };
    };
    useEffect(() => {
        fetchReviews();
    }, [searchBy]);

    //Handle scroll to top
    const toggleVisibility = () => {
        const container = scrollableRef.current;
        console.log("Scroll position:", container.scrollTop);
        if (container && container.scrollTop > 100) { 
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
                        <button className="mb-1 mt-4 px-6 py-2 rounded-md bg-red-400 text-white hover:bg-red-600 duration-200 " onClick={imagecancel}> Cancel</button>
                    </div>
                </div>
            </div>}
            {issellerAuth && (isActivated == true) && !loading && !error && <div className='pt-[4rem] sm:pb-0 pb-[4rem] h-screen overflow-hidden'>
                <div ref={scrollableRef} className='flex justify-center h-full overflow-auto'>
                    <div className='md:w-[50rem] sm:w-[37rem] w-full mx-4 '>
                        <div className='flex justify-between items-center mt-4 rounded-full border-2 border-green-700 px-4 sm:px-10 py-4'>
                            <div className='sm:text-xl font-semibold'>Your Reviews - {reviews.length}</div>
                            <select value={searchBy} onChange={(e) => { changeSearchBy(e); }} className="sm:text-base text-sm pl-3 py-2 text-white rounded-full bg-green-700 outline-none">
                                <option value="Recently added">Recently added</option>
                                <option value="Highest rating first">Highest rating first</option>
                                <option value="Lowest rating first">Lowest rating first</option>
                            </select>
                        </div>
                        <div className='flex flex-col justify-around sm:pb-4 pb-2 mt-2'>
                            {(reviews.length == 0) && <div className='flex justify-center items-center border-2 border-gray-100 rounded-2xl sm:px-4 px-2 py-4'>
                                <div className='py-4'>No reviews</div>
                            </div>}
                            {reviews && reviews.map((review, index) => {
                                return <div key={review._id} className='flex items-start border-2 border-gray-100 rounded-2xl sm:px-4 px-2 py-4 mt-4'>
                                    <div className='flex-shrink-0 rounded-full hover:scale-105 duration-500 overflow-hidden flex justify-center items-center sm:mr-4 mr-2'>
                                        <img className='object-cover w-14 h-14' src={review.madeBy?.profilePicture} alt="" />
                                    </div>
                                    <div className='flex-grow'>
                                        <div className='sm:text-xl text-base font-bold '>{review.madeBy?.name}</div>
                                        <div className='italic sm:text-base text-sm'>{review.madeBy?.email}</div>
                                        <div className=' sm:text-base text-sm'>Bought <Link className='text-blue-500' to={`/seller/account/products/${review.product}`}>this</Link> product</div>
                                        <div className='flex mt-2'>
                                            {ratingValues && ratingValues.map((value) => {
                                                return <div key={value} className='mr-2 text-yellow-400'>
                                                    {(value <= review.rating - 1) ? <FontAwesomeIcon icon={solidStar} /> : <FontAwesomeIcon icon={faStar} />}
                                                </div>
                                            })}
                                        </div>
                                        <div className='flex mt-2 flex-wrap'>
                                            {review.images && review.images.map((picture, i) => {
                                                return <button key={picture} onClick={() => { openImageViewer(picture, i, index) }} className='border-2 overflow-hidden w-[3rem] h-[3rem] rounded-md flex justify-center hover:border-green-700 duration-300 items-center opacity-80 hover:opacity-100 mr-2'>
                                                    <img className='object-cover' src={picture} />
                                                </button>
                                            })}
                                        </div>
                                        <div className={'rounded-lg mt-3 whitespace-pre-wrap w-full' + ((!expandedItems[index] ? ' line-clamp-3 ' : ''))}>{review.description}</div>
                                        <button className='text-gray-800' onClick={() => toggleReadMore(index)}>
                                            {expandedItems[index] ? "Read Less" : "Read More"}
                                        </button>
                                        <div className='font-semibold sm:text-base text-sm'>Reviewed on : {new Date(review?.updatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
                                    </div>
                                </div>
                            })}
                        </div>
                    </div>
                </div>
            </div>}
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
            {(isActivated == false) && <div className="py-[4rem] flex justify-center items-center h-screen">
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
                    <div className='text-2xl text-center my-2'>An error occured while loading reviews!</div>
                    <div className='flex justify-center items-center'><button onClick={handlereload} className='hover:scale-105 text-xl backdrop-blur-sm my-2 mx-7 px-4 py-3 rounded-md bg-green-700/60 hover:bg-green-700/80 text-white duration-200'><FontAwesomeIcon className='mr-2' icon={faRotateRight} />Refresh</button></div>
                </div>
                <div className='-z-10 absolute top-0 overflow-hidden'><img className=' h-screen w-screen object-cover' src="/Flowers3.jpg" alt="" /></div>
            </div>}
        </>
    )
};

export default SellerReviews;