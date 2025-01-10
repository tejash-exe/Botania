import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AppContext } from '../../../context/context';
//Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import { faArrowLeft, faArrowRight, faRotateRight, faXmark, faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
//Components
import Notification from '../../../components/Notification';

const SellerDetails = () => {

    const { sellerId } = useParams();
    const { backend_url } = useContext(AppContext);
    const [seller, setseller] = useState({});
    const [reviews, setreviews] = useState([]);
    const [products, setproducts] = useState([]);
    const [error, seterror] = useState(false);
    const [loading, setloading] = useState(true);
    const [productloading, setproductloading] = useState(true);
    const [reviewloading, setreviewloading] = useState(true);
    const ratingValues = [0, 1, 2, 3, 4];
    const [isPopup, setisPopup] = useState(false);
    const [popupMessage, setpopupMessage] = useState('');
    const [poster, setposter] = useState('');
    const [active, setactive] = useState(0);
    const [pictures, setpictures] = useState([]);
    const [imagePopup, setimagePopup] = useState(false);
    const [isReview, setisReview] = useState(false);
    const [orderCount, setorderCount] = useState(0);
    const [isAvailable, setisAvailable] = useState(false);
    const [searchBy, setsearchBy] = useState('Recently added');
    const [reviewsearchBy, setreviewsearchBy] = useState('Recently added');
    const [expandedItems, setExpandedItems] = useState({});

    //Handle isAvailable
    const changeisAvailable = () => {
        setisAvailable((prev) => !prev);
    };

    //Handle searchBy
    const changeSearchBy = (e) => {
        setsearchBy(e.target.value);
    };

    const changeReviewSearchBy = (e) => {
        setreviewsearchBy(e.target.value);
    };

    //Handle reload
    const handlereload = () => {
        seterror(false);
        fetchSeller();
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

    //Fetch seller
    const fetchSeller = async () => {
        try {
            setloading(true);
            const response = await fetch(`${backend_url}/api/users/fetch-seller`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({
                    sellerId: sellerId,
                }),
            });
            const result = await response.json();
            if (result.status == 200) {
                setseller(result.data.seller);
                setreviews(result.data.reviews);
                setproducts(result.data.products);
                setorderCount(result.data.orderCount);
                // console.log(result);
            }
            else {
                seterror(true);
                setpopupMessage(result.message);
                setisPopup(true);
                console.log(result);
            };
        } catch (error) {
            console.log(error);
            seterror(true);
            setpopupMessage(error.message);
            setisPopup(true);
        } finally {
            setloading(false);
        };
    };

    useEffect(() => {
        fetchSeller();
    }, []);

    //Fetch products
    const fetchsellerProducts = async () => {
        try {
            setproductloading(true);
            const response = await fetch(`${backend_url}/api/users/fetch-seller-products`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({
                    sellerId: sellerId,
                    searchBy: searchBy,
                    isAvailable: isAvailable,
                }),
            });
            const result = await response.json();
            if (result.status == 200) {
                setproducts(result.data);
                // console.log(result);
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
            setproductloading(false);
        };
    };

    useEffect(() => {
        fetchsellerProducts();
    }, [isAvailable, searchBy]);

    //Fetch reviews
    const fetchsellerReviews = async () => {
        try {
            setreviewloading(true);
            const response = await fetch(`${backend_url}/api/users/fetch-seller-reviews`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({
                    sellerId: sellerId,
                    searchBy: reviewsearchBy,
                }),
            });
            const result = await response.json();
            if (result.status == 200) {
                setreviews(result.data);
                console.log(result);
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
            setreviewloading(false);
        };
    };

    useEffect(() => {
        fetchsellerReviews();
    }, [reviewsearchBy]);

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
                        <button className="mb-1 mt-4 px-6 py-2 rounded-md bg-red-400 text-white hover:bg-red-600 duration-200 " disabled={loading} onClick={imagecancel}> Cancel</button>
                    </div>
                </div>
            </div>}
            {!loading && !error && <div className={'py-[4rem] flex justify-center mx-2 sm:mx-0 duration-300'}>
                <div className='md:max-w-[50rem] sm:max-w-[37rem]'>
                    <div className='flex sm:mx-4 sm:mt-8 mt-4 items-center bg-gray-100 rounded-full py-4 md:px-0 px-4'>
                        <div className='sm:mx-8 mx-2 flex-shrink-0'>
                            <img className='drop-shadow-lg hover:scale-105 duration-300 md:w-[8rem] sm:w-[5rem] sm:h-[5rem] h-[4rem] w-[4rem] md:h-[8rem] object-cover rounded-full' src={seller.profilePicture} />
                        </div>
                        <div className='sm:text-base text-[12px] sm:pr-8'>
                            {(seller.brandName !== '') && <div className='mb-1'><span className='font-semibold'>Brandname : </span>{seller.brandName}</div>}
                            <div className=''><span className='font-semibold'>Name : </span>{seller.name}</div>
                            <div><span className='font-semibold'>Email : </span>{seller.email}</div>
                        </div>
                    </div>
                    <div className='flex justify-between bg-gray-100 rounded-full items-center sm:px-10 px-8 sm:mx-4 py-4 mt-4'>
                        <div className='flex justify-center items-center flex-col'>
                            <div className='bg-green-600 hover:scale-105 duration-300 cursor-pointer text-white rounded-full md:w-[6rem] md:h-[6rem] sm:w-[5rem] w-[4rem] h-[4rem] sm:h-[5rem] mb-2 flex justify-center items-center drop-shadow-lg text-sm sm:text-xl'>
                                <div className='flex items-center justify-center'>
                                    <div>{seller.averageRating}</div>
                                    <FontAwesomeIcon className='sm:w-4 sm:h-4 w-3 h-3 pt-[1px]' icon={solidStar} />
                                </div>
                            </div>
                            <div className='text-sm sm:text-base'>Rating</div>
                        </div>
                        <div className='flex justify-center items-center flex-col sm:mx-8'>
                            <div className='bg-yellow-300 hover:scale-105 duration-300 cursor-pointer rounded-full md:w-[6rem] md:h-[6rem] sm:w-[5rem] w-[4rem] h-[4rem] sm:h-[5rem] mb-2 flex justify-center items-center  drop-shadow-lg text-sm sm:text-xl'>{orderCount}</div>
                            <div className='text-sm sm:text-base'>Orders</div>
                        </div>
                        <div className='flex justify-center items-center flex-col'>
                            <div className='rounded-full hover:scale-105 duration-300 cursor-pointer md:w-[6rem] md:h-[6rem] sm:w-[5rem] w-[4rem] h-[4rem] sm:h-[5rem] mb-2 flex justify-center items-center bg-white drop-shadow-lg text-sm sm:text-xl'>{products.length}</div>
                            <div className='text-sm sm:text-base'>Products</div>
                        </div>
                    </div>
                    {(seller.address?.pincode !== '111111') && <div className='bg-gray-100 mb-6 p-6 rounded-3xl sm:px-16 px-10 sm:mx-4 mt-4'>
                        <div className='font-semibold mb-2 text-base sm:text-lg'>Address :</div>
                        <div className=' text-sm sm:text-base w-full'>{seller.address?.localAddress + ((seller.address?.landmark !== "") ? (', ' + seller.address?.landmark) : "") + ", " + seller.address?.city + ", " + seller.address?.state}                                                                                                                                                                          .</div>
                        <div className='mt-2 text-sm sm:text-base'>PIN: {seller.address?.pincode} Contact: {seller.address?.contact}</div>
                    </div>}
                    <div className='font-semibold sm:text-xl flex mb-2'>
                        <button onClick={() => { setisReview(false) }} className={'px-5 py-3 rounded-full mr-4 border-2 duration-300' + ((isReview !== true) ? ' bg-green-700 border-green-700  text-white' : ' border-gray-400 text-gray-400 ')}>Products</button>
                        <button onClick={() => { setisReview(true) }} className={'px-5 py-3 rounded-full border-2 duration-300' + ((isReview == true) ? ' bg-green-700 border-green-700  text-white' : ' border-gray-400 text-gray-400 ')}>Reviews</button>
                    </div>
                    {!isReview && !productloading && <div className='flex flex-col justify-around sm:pb-4 pb-2 border-green-700 border-2 rounded-3xl'>
                        <select value={searchBy} onChange={(e) => { changeSearchBy(e); }} className="px-5 py-3 sm:m-4 sm:mb-0 m-2 mb-0 bg-white rounded-2xl border-green-700 border-2 outline-none">
                            <option value="Recently added">Recently added</option>
                            <option value="Price: Low to high">Price: Low to high</option>
                            <option value="Price: High to low">Price: High to low</option>
                        </select>
                        <div className='flex sm:mx-4 mx-2 mt-2'>
                            <input className='cursor-pointer mx-2' onChange={changeisAvailable} checked={isAvailable} id='available' type="checkbox" />
                            <label className='cursor-pointer' htmlFor="available">Available products only</label>
                        </div>
                        {(products.length == 0) && <div className='flex bg-gray-100 rounded-2xl sm:mx-4 mx-2 sm:mt-4 mt-2 p-4 justify-center items-center'>
                            <div className='py-4'>No products</div>
                        </div>}
                        {products && products.map((product) => {
                            return <Link to={`/user/product/id/${product?._id}`} key={product._id} className='flex bg-gray-100 rounded-2xl sm:mx-4 mx-2 sm:mt-4 mt-2 p-4'>
                                <div className='shrink-0 relative'>
                                    <img className={'w-[4rem] rounded-xl h-[5.5rem] sm:h-[8rem] sm:w-[6rem] md:w-[8rem] md:h-[10rem] object-cover ' + ((product.availability) ? ' ' : ' opacity-50 ')} src={product?.images[0]} />
                                    {!product.availability && <div className='text-xs text-nowrap sm:text-base absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>Sold out</div>}
                                </div>
                                <div className='ml-4 w-5/6'>
                                    <div className='md:mt-4 sm:mt-1 font-bold text-base sm:text-xl'>{product?.name}</div>
                                    <div className='text-ellipsis overflow-hidden text-nowrap whitespace-nowrap md:w-[300px] sm:w-[250px] w-[150px] text-sm sm:text-base'>{product?.description}</div>
                                    <div className='sm:mt-2 text-sm sm:text-base '>Rs. {product?.price}</div>
                                    <div className='sm:mt-2 text-sm sm:text-base'>Listed on : {new Date(product?.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
                                </div>
                            </Link>
                        })}
                    </div>}
                    {!isReview && productloading && <div className='flex flex-col justify-around sm:pb-4 pb-2 border-green-700 border-2 rounded-3xl'>
                        <div className="px-5 py-3 sm:m-4 sm:mb-0 m-2 mb-0 bg-white rounded-2xl border-green-700 border-2 outline-none text-white animate-pulse"> dsjk </div>
                        <div className='flex sm:mx-4 mx-2 mt-2'>
                            <input id='available' type="checkbox" className='mx-2' />
                            <label className='bg-gray-200 text-gray-200 rounded-lg animate-pulse w-fit' htmlFor="available">Available products only</label>
                        </div>
                        <div className='flex bg-gray-100 rounded-2xl sm:mx-4 mx-2 sm:mt-4 mt-2 p-4'>
                            <div className='shrink-0 relative'>
                                <div className={'w-[4rem] rounded-xl h-[5.5rem] sm:h-[8rem] sm:w-[6rem] md:w-[8rem] md:h-[10rem] object-cover bg-gray-200 animate-pulse'}></div>
                            </div>
                            <div className='ml-4 w-5/6'>
                                <div className='md:mt-4 sm:mt-1 font-bold text-base sm:text-xl bg-gray-200 text-gray-200 rounded-lg animate-pulse w-fit'>fgv h gbbh jk</div>
                                <div className='text-ellipsis overflow-hidden text-nowrap whitespace-nowrap md:w-[300px] sm:w-[250px] w-[150px] text-sm sm:text-base bg-gray-200 text-gray-200 rounded-lg animate-pulse mt-1'> dskmsdmkdsk dskj s kdj kdssk dj kdsj skdjk djsksj ddsk j</div>
                                <div className='sm:mt-2 text-sm sm:text-base bg-gray-200 text-gray-200 rounded-lg animate-pulse w-fit'>Rs. 69</div>
                                <div className='sm:mt-2 text-sm sm:text-base bg-gray-200 text-gray-200 rounded-lg animate-pulse w-fit'>Listed on : 11/11/1111</div>
                            </div>
                        </div>
                        <div className='flex bg-gray-100 rounded-2xl sm:mx-4 mx-2 sm:mt-4 mt-2 p-4'>
                            <div className='shrink-0 relative'>
                                <div className={'w-[4rem] rounded-xl h-[5.5rem] sm:h-[8rem] sm:w-[6rem] md:w-[8rem] md:h-[10rem] object-cover bg-gray-200 animate-pulse'}></div>
                            </div>
                            <div className='ml-4 w-5/6'>
                                <div className='md:mt-4 sm:mt-1 font-bold text-base sm:text-xl bg-gray-200 text-gray-200 rounded-lg animate-pulse w-fit'>fgv h gbbh jk</div>
                                <div className='text-ellipsis overflow-hidden text-nowrap whitespace-nowrap md:w-[300px] sm:w-[250px] w-[150px] text-sm sm:text-base bg-gray-200 text-gray-200 rounded-lg animate-pulse mt-1'> dskmsdmkdsk dskj s kdj kdssk dj kdsj skdjk djsksj ddsk j</div>
                                <div className='sm:mt-2 text-sm sm:text-base bg-gray-200 text-gray-200 rounded-lg animate-pulse w-fit'>Rs. 69</div>
                                <div className='sm:mt-2 text-sm sm:text-base bg-gray-200 text-gray-200 rounded-lg animate-pulse w-fit'>Listed on : 11/11/1111</div>
                            </div>
                        </div>
                    </div>}
                    {isReview && !reviewloading && <div className='flex flex-col justify-around sm:pb-4 pb-2 border-green-700 border-2 rounded-3xl'>
                        <select value={reviewsearchBy} onChange={(e) => { changeReviewSearchBy(e); }} className="px-5 py-3 sm:m-4 sm:mb-0 m-2 mb-0 bg-white rounded-2xl border-green-700 border-2 outline-none">
                            <option value="Recently added">Recently added</option>
                            <option value="Highest rating first">Highest rating first</option>
                            <option value="Lowest rating first">Lowest rating first</option>
                        </select>
                        {(reviews.length == 0) && <div className='flex justify-center items-center border-2 border-gray-100 rounded-2xl sm:mx-4 mx-2 mt-2 sm:px-4 px-2 py-4'>
                            <div className='py-4'>No reviews</div>
                        </div>}
                        {reviews && reviews.map((review, index) => {
                            return <div key={review._id} className='flex items-start border-2 border-gray-100 rounded-2xl sm:px-4 px-2 py-4 sm:mx-4 mx-2 sm:mt-4 mt-2'>
                                <div className='flex-shrink-0 rounded-full hover:scale-105 duration-500 overflow-hidden flex justify-center items-center sm:mr-4 mr-2'>
                                    <img className='object-cover w-14 h-14' src={review.madeBy?.profilePicture} alt="" />
                                </div>
                                <div className='flex-grow'>
                                    <div className='sm:text-xl text-base font-bold '>{review.madeBy?.name}</div>
                                    <div className='italic sm:text-base text-sm'>{review.madeBy?.email}</div>
                                    <div className=' sm:text-base text-sm'>Bought <Link className='text-blue-500' to={`/user/product/id/${review.product}`}>this</Link> product</div>
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
                    </div>}
                    {isReview && reviewloading && <div className='flex flex-col justify-around sm:pb-4 pb-2 border-green-700 border-2 rounded-3xl'>
                        <div className="px-5 py-3 sm:m-4 sm:mb-0 m-2 mb-0 bg-white rounded-2xl border-green-700 border-2 outline-none text-white animate-pulse"> dsjk </div>
                        <div className='flex items-start border-2 border-gray-100 rounded-2xl sm:px-4 px-2 py-4 sm:mx-4 mx-2 sm:mt-4 mt-2'>
                            <div className='flex-shrink-0 rounded-full hover:scale-105 duration-500 overflow-hidden flex justify-center items-center sm:mr-4 mr-2'>
                                <div className='object-cover w-14 h-14 bg-gray-200 animate-pulse' ></div>
                            </div>
                            <div className='flex-grow'>
                                <div className='sm:text-xl rounded-lg text-base font-bold bg-gray-200 text-gray-200 animate-pulse w-fit'>Aditya Choudhary</div>
                                <div className='italic rounded-lg mt-1 sm:text-base text-sm bg-gray-200 text-gray-200 animate-pulse w-fit'>tejash835274@gmail.com</div>
                                <div className='rounded-lg mt-1 sm:text-base text-sm bg-gray-200 text-gray-200 animate-pulse w-fit'>Bought this product</div>
                                <div className='flex mt-2'>
                                    {ratingValues && ratingValues.map((value) => {
                                        return <div key={value} className='mr-2 text-yellow-400'>
                                            {(value <= 5) ? <FontAwesomeIcon icon={solidStar} /> : <FontAwesomeIcon icon={faStar} />}
                                        </div>
                                    })}
                                </div>
                                <div className='flex mt-2 flex-wrap'>
                                    <button className='border-2 overflow-hidden w-[3rem] h-[3rem] rounded-md flex justify-center hover:border-green-700 duration-300 items-center opacity-80 hover:opacity-100 mr-2 animate-pulse bg-gray-200'></button>
                                    <button className='border-2 overflow-hidden w-[3rem] h-[3rem] rounded-md flex justify-center hover:border-green-700 duration-300 items-center opacity-80 hover:opacity-100 mr-2 animate-pulse bg-gray-200'></button>
                                    <button className='border-2 overflow-hidden w-[3rem] h-[3rem] rounded-md flex justify-center hover:border-green-700 duration-300 items-center opacity-80 hover:opacity-100 mr-2 animate-pulse bg-gray-200'></button>
                                    <button className='border-2 overflow-hidden w-[3rem] h-[3rem] rounded-md flex justify-center hover:border-green-700 duration-300 items-center opacity-80 hover:opacity-100 mr-2 animate-pulse bg-gray-200'></button>
                                    <button className='border-2 overflow-hidden w-[3rem] h-[3rem] rounded-md flex justify-center hover:border-green-700 duration-300 items-center opacity-80 hover:opacity-100 mr-2 animate-pulse bg-gray-200'></button>
                                </div>
                                <div className={'rounded-lg mt-3 whitespace-pre-wrap w-full bg-gray-200 text-gray-200 animate-pulse'}>1bhbj</div>
                                <div className={'rounded-lg mt-1 whitespace-pre-wrap w-full bg-gray-200 text-gray-200 animate-pulse'}>1bhbj</div>
                                <div className={'rounded-lg mt-1 whitespace-pre-wrap w-full bg-gray-200 text-gray-200 animate-pulse'}>1bhbj</div>
                                <button className='bg-gray-200 rounded-lg mt-1 text-gray-200 animate-pulse w-fit'>Read More</button>
                                <div className='font-semibold rounded-lg mt-1 sm:text-base text-sm bg-gray-200 text-gray-200 animate-pulse w-fit'>Reviewed on : 11 11 11</div>
                            </div>
                        </div>
                    </div>}
                </div>
            </div>}
            {loading && <div className={'py-[4rem] flex justify-center mx-2 sm:mx-0 duration-300'}>
                <div className='md:w-[50rem] sm:w-[37rem]'>
                    <div className='flex sm:mx-4 sm:mt-8 mt-4 items-center bg-gray-100 rounded-full py-4 md:px-0 px-4'>
                        <div className='sm:mx-8 mx-2 flex-shrink-0'>
                            <div className='drop-shadow-lg hover:scale-105 duration-300 md:w-[8rem] sm:w-[5rem] sm:h-[5rem] h-[4rem] w-[4rem] md:h-[8rem] object-cover rounded-full bg-gray-200 animate-pulse' ></div>
                        </div>
                        <div className='sm:text-base text-[12px] sm:pr-8'>
                            <div className='mb-1 bg-gray-200 text-gray-200 rounded-lg animate-pulse w-fit'><span className='font-semibold'>Brandname : </span>tejash</div>
                            <div className='bg-gray-200 text-gray-200 rounded-lg animate-pulse w-fit'><span className='font-semibold'>Name : </span>Aditya Choudhary</div>
                            <div className='bg-gray-200 text-gray-200 rounded-lg animate-pulse w-fit mt-1'><span className='font-semibold'>Email : </span>tejash835274@gmail.com</div>
                        </div>
                    </div>
                    <div className='flex justify-between bg-gray-100 rounded-full items-center sm:px-10 px-8 sm:mx-4 py-4 mt-4'>
                        <div className='flex justify-center items-center flex-col'>
                            <div className='bg-green-600 hover:scale-105 duration-300 cursor-pointer rounded-full md:w-[6rem] md:h-[6rem] sm:w-[5rem] w-[4rem] h-[4rem] sm:h-[5rem] mb-2 flex justify-center items-center drop-shadow-lg text-sm sm:text-xl animate-pulse text-green-600'>5★</div>
                            <div className='text-sm sm:text-base bg-gray-200 text-gray-200 rounded-lg animate-pulse w-fit'>Rating</div>
                        </div>
                        <div className='flex justify-center items-center flex-col sm:mx-8'>
                            <div className='bg-yellow-300 hover:scale-105 duration-300 cursor-pointer rounded-full md:w-[6rem] md:h-[6rem] sm:w-[5rem] w-[4rem] h-[4rem] sm:h-[5rem] mb-2 flex justify-center items-center  drop-shadow-lg text-sm sm:text-xl animate-pulse text-yellow-300'>10</div>
                            <div className='text-sm sm:text-base bg-gray-200 text-gray-200 rounded-lg animate-pulse w-fit'>Orders</div>
                        </div>
                        <div className='flex justify-center items-center flex-col'>
                            <div className='rounded-full hover:scale-105 duration-300 cursor-pointer md:w-[6rem] md:h-[6rem] sm:w-[5rem] w-[4rem] h-[4rem] sm:h-[5rem] mb-2 flex justify-center items-center bg-white drop-shadow-lg text-sm sm:text-xl animate-pulse text-white'>7</div>
                            <div className='text-sm sm:text-base bg-gray-200 text-gray-200 rounded-lg animate-pulse w-fit'>Products</div>
                        </div>
                    </div>
                    <div className='bg-gray-100 mb-6 p-6 rounded-3xl sm:px-16 px-10 sm:mx-4 mt-6'>
                        <div className='font-semibold mb-2 text-base sm:text-lg '>Address :</div>
                        <div className=' text-sm sm:text-base bg-gray-200 text-gray-200 rounded-lg animate-pulse w-fit'>vdga dasgh asdag dh asdhg hadvsg ad gsh adhgs ahsgd</div>
                        <div className='mt-2 text-sm sm:text-base bg-gray-200 text-gray-200 rounded-lg animate-pulse w-fit'>PIN: 123456 Contact: 1234567890</div>
                    </div>
                    <div className='font-semibold sm:text-xl flex mb-2'>
                        <button className={'px-5 py-3 rounded-full mr-4 border-2 duration-300 bg-green-700 border-green-700  text-green-700 animate-pulse '}>Products</button>
                        <button className={'px-5 py-3 rounded-full border-2 duration-300 border-gray-400 text-white animate-pulse '}>Reviews</button>
                    </div>
                    <div className='flex flex-col justify-around sm:pb-4 pb-2 border-green-700 border-2 rounded-3xl'>
                        <div className="px-5 py-3 sm:m-4 sm:mb-0 m-2 mb-0 bg-white rounded-2xl border-green-700 border-2 outline-none text-white animate-pulse"> dsjk </div>
                        <div className='flex sm:mx-4 mx-2 mt-2'>
                            <input id='available' type="checkbox" className='mx-2' />
                            <label className='bg-gray-200 text-gray-200 rounded-lg animate-pulse w-fit' htmlFor="available">Available products only</label>
                        </div>
                        <div className='flex bg-gray-100 rounded-2xl sm:mx-4 mx-2 sm:mt-4 mt-2 p-4'>
                            <div className='shrink-0 relative'>
                                <div className={'w-[4rem] rounded-xl h-[5.5rem] sm:h-[8rem] sm:w-[6rem] md:w-[8rem] md:h-[10rem] object-cover bg-gray-200 animate-pulse'}></div>
                            </div>
                            <div className='ml-4 w-5/6'>
                                <div className='md:mt-4 sm:mt-1 font-bold text-base sm:text-xl bg-gray-200 text-gray-200 rounded-lg animate-pulse w-fit'>fgv h gbbh jk</div>
                                <div className='text-ellipsis overflow-hidden text-nowrap whitespace-nowrap md:w-[300px] sm:w-[250px] w-[150px] text-sm sm:text-base bg-gray-200 text-gray-200 rounded-lg animate-pulse mt-1'> dskmsdmkdsk dskj s kdj kdssk dj kdsj skdjk djsksj ddsk j</div>
                                <div className='sm:mt-2 text-sm sm:text-base bg-gray-200 text-gray-200 rounded-lg animate-pulse w-fit'>Rs. 69</div>
                                <div className='sm:mt-2 text-sm sm:text-base bg-gray-200 text-gray-200 rounded-lg animate-pulse w-fit'>Listed on : 11/11/1111</div>
                            </div>
                        </div>
                        <div className='flex bg-gray-100 rounded-2xl sm:mx-4 mx-2 sm:mt-4 mt-2 p-4'>
                            <div className='shrink-0 relative'>
                                <div className={'w-[4rem] rounded-xl h-[5.5rem] sm:h-[8rem] sm:w-[6rem] md:w-[8rem] md:h-[10rem] object-cover bg-gray-200 animate-pulse'}></div>
                            </div>
                            <div className='ml-4 w-5/6'>
                                <div className='md:mt-4 sm:mt-1 font-bold text-base sm:text-xl bg-gray-200 text-gray-200 rounded-lg animate-pulse w-fit'>fgv h gbbh jk</div>
                                <div className='text-ellipsis overflow-hidden text-nowrap whitespace-nowrap md:w-[300px] sm:w-[250px] w-[150px] text-sm sm:text-base bg-gray-200 text-gray-200 rounded-lg animate-pulse mt-1'> dskmsdmkdsk dskj s kdj kdssk dj kdsj skdjk djsksj ddsk j</div>
                                <div className='sm:mt-2 text-sm sm:text-base bg-gray-200 text-gray-200 rounded-lg animate-pulse w-fit'>Rs. 69</div>
                                <div className='sm:mt-2 text-sm sm:text-base bg-gray-200 text-gray-200 rounded-lg animate-pulse w-fit'>Listed on : 11/11/1111</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>}
            {error && <div className='flex justify-center items-center h-screen'>
                <div className='backdrop-blur-sm mx-2 shadow-lg text-gray-800 bg-white/50 py-8 px-12 rounded-xl'>
                    <div className='text-2xl text-center my-2'>An error occured while loading seller details!</div>
                    <div className='flex justify-center items-center'><button onClick={handlereload} className='hover:scale-105 text-xl backdrop-blur-sm my-2 mx-7 px-4 py-3 rounded-md bg-green-700/60 hover:bg-green-700/80 text-white duration-200'><FontAwesomeIcon className='mr-2' icon={faRotateRight} />Refresh</button></div>
                </div>
                <div className='-z-10 absolute top-0 overflow-hidden'><img className=' h-screen w-screen object-cover' src="/Flowers3.jpg" alt="" /></div>
            </div>}
        </>
    )
};

export default SellerDetails;