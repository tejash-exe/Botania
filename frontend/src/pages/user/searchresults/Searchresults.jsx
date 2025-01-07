import React, { useContext, useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AppContext } from '../../../context/context';
//Icon
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faRotateRight, faStar, faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
//Components
import Notification from '../../../components/Notification';
import Filterpanel from '../../../components/Filterpanel';
import Bottomfilterpanel from '../../../components/Bottomfilterpanel';

const Searchresults = () => {

    const { search } = useParams();
    const { isAuth, setisAuth, wishlist, setwishlist, backend_url } = useContext(AppContext);
    const [loading, setloading] = useState(true);
    const [error, seterror] = useState(false);
    const [searchby, setsearchby] = useState('Recently added');
    const [products, setproducts] = useState([]);
    const [minPrice, setminPrice] = useState(0);
    const [maxPrice, setmaxPrice] = useState(5000);
    const [prevminPrice, setprevminPrice] = useState(0);
    const [prevmaxPrice, setprevmaxPrice] = useState(5000);
    const [pricechanges, setpricechanges] = useState(false);
    const [isPopup, setisPopup] = useState(false);
    const [popupMessage, setpopupMessage] = useState(" ");
    const [isVisible, setIsVisible] = useState(false);
    const scrollableRef = useRef();

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
        };
        return () => clearTimeout(closeTimeout);
    }, [isPopup]);

    const exitPopup = () => {
        setisPopup(false);
        clearTimeout(closeTimeout);
    };

    //Sort and filter
    const fetchProducts = async () => {
        try {
            setloading(true);
            const response = await fetch(`${backend_url}/api/products/${search}/`,
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        searchBy: searchby,
                        minPrice: minPrice,
                        maxPrice: maxPrice,
                    })
                }
            );
            const data = await response.json();
            // console.log(data);
            if (data.status == 469) {
                // localStorage.clear();
                setisAuth(false);
                setpopupMessage(data.message);
                setisPopup(true);
            }
            else if (data.status == 200) {
                setproducts(data.data);
            }
            else {
                seterror(true);
                setpopupMessage(data.message);
                setisPopup(true);
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
        const checkpriceChanges = () => {
            if (maxPrice != prevmaxPrice || minPrice != prevminPrice) {
                setpricechanges(true);
            }
            else {
                setpricechanges(false);
            };
        };
        checkpriceChanges();
    }, [maxPrice, minPrice, prevmaxPrice, prevminPrice]);

    useEffect(() => {
        fetchProducts();
    }, [search, searchby]);

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
        }
        else {
            setloading(true);
            try {
                const response = await fetch(`${backend_url}/api/users/add-to-wishlist`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        productId: productId,
                    })
                });
                const result = await response.json();
                if (result.status == 200) {
                    // console.log(result);
                    setwishlist(result.data.wishlist);
                    setpopupMessage("Product added to your wishlist!");
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
        <div>
            {isPopup && <Notification message={popupMessage} onexit={exitPopup} />}
            <div className='pt-[4rem] sm:pb-0 pb-[8rem] flex w-screen h-screen overflow-hidden'>
                <Filterpanel setsearchby={setsearchby} searchby={searchby} minPrice={minPrice} setminPrice={setminPrice} maxPrice={maxPrice} setmaxPrice={setmaxPrice} prevminPrice={prevminPrice} setprevminPrice={setprevminPrice} prevmaxPrice={prevmaxPrice} setprevmaxPrice={setprevmaxPrice} pricechanges={pricechanges} setpricechanges={setpricechanges} fetchProducts={fetchProducts} />
                <div ref={scrollableRef} className='flex-1 flex overflow-auto flex-col'>
                    <div className='border-b text-sm pl-2 flex justify-between items-center'>
                        {!loading && !error && <div className='py-2 px-3 sm:text-sm'>
                            Found {products.length} results{(search.trim() == "") ? ', displaying all products' : ` for '${search}',`} sorted by {searchby}
                        </div>}
                        {loading && <div className=' sm:mx-3 mx-4 animate-pulse text-gray-200 bg-gray-200 py-1 my-1 rounded-lg px-3 sm:text-sm'>
                            Found 0 results, displaying all products sorted by Recently added
                        </div>}
                    </div>
                    {!loading && !error && <div className='flex flex-wrap justify-around'>
                        {products && products.map((product) => {
                            return <Link to={`/user/product/id/${product._id}/`} className='rounded-lg cursor-pointer flex flex-col sm:w-[13rem] w-[9rem] h-[15rem] sm:h-[20rem] m-4 overflow-hidden hover:shadow-lg' key={product._id}>
                                <div className='relative'>
                                    <img className={' object-cover sm:w-[13rem] w-[9rem] h-[11rem] sm:h-[15rem] '} src={product.images[0]} alt="" />
                                    <div className='absolute bottom-3 mx-3'>
                                        <div className='flex bg-white rounded-md'>
                                            <div className='my-[2px] pl-2 pr-2 text-xs'>{product.soldBy.averageRating}<span className='text-green-700'> <FontAwesomeIcon icon={faStar}/></span></div>
                                        </div>
                                    </div>
                                    {isAuth && <div onClick={e => { handleLike(e, product._id) }} className='absolute bottom-3 right-0 '>
                                        <button className='mr-3 w-8 h-8 hover:scale-110 active:scale-100 duration-200 bg-white rounded-full'>{(wishlist.includes(product._id)) ? <FontAwesomeIcon className='text-red-600' icon={solidHeart} /> : <FontAwesomeIcon className='' icon={faHeart} />}</button>
                                    </div>}
                                </div>
                                <div className='mt-3 mx-3'>
                                    <div className='font-bold sm:text-base text-sm text-ellipsis text-nowrap overflow-hidden'>{product.name}</div>
                                    <div className='sm:text-sm text-xs'>Rs.{product.price}</div>
                                </div>
                            </Link>
                        })}
                    </div>}
                    {loading && <div className='flex flex-wrap justify-around'>
                        <div className=' rounded-lg cursor-pointer flex flex-col sm:w-[13rem] w-[9rem] h-[15rem] sm:h-[20rem] m-4 overflow-hidden hover:shadow-lg'>
                            <div className='relative'>
                                <div className={'animate-pulse bg-gray-200 object-cover sm:w-[13rem] w-[9rem] h-[11rem] sm:h-[15rem] '}></div>
                                <div className='absolute bottom-3 mx-3'>
                                    <div className='flex bg-white rounded-md'>
                                        <div className='my-[2px] pl-2 pr-2 text-xs'>5<span className='text-green-700'> ★</span></div>
                                    </div>
                                </div>
                                {<div className='absolute bottom-3 right-0 '>
                                    <button className='mr-3 w-8 h-8 hover:scale-110 active:scale-100 duration-200 bg-white rounded-full'><FontAwesomeIcon className='text-red-600' icon={solidHeart} /></button>
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
                                    <button className='mr-3 w-8 h-8 hover:scale-110 active:scale-100 duration-200 bg-white rounded-full'><FontAwesomeIcon className='text-red-600' icon={solidHeart} /></button>
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
                                    <button className='mr-3 w-8 h-8 hover:scale-110 active:scale-100 duration-200 bg-white rounded-full'><FontAwesomeIcon className='text-red-600' icon={solidHeart} /></button>
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
                                    <button className='mr-3 w-8 h-8 hover:scale-110 active:scale-100 duration-200 bg-white rounded-full'><FontAwesomeIcon className='text-red-600' icon={solidHeart} /></button>
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
                                    <button className='mr-3 w-8 h-8 hover:scale-110 active:scale-100 duration-200 bg-white rounded-full'><FontAwesomeIcon className='text-red-600' icon={solidHeart} /></button>
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
                                    <button className='mr-3 w-8 h-8 hover:scale-110 active:scale-100 duration-200 bg-white rounded-full'><FontAwesomeIcon className='text-red-600' icon={solidHeart} /></button>
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
                                    <button className='mr-3 w-8 h-8 hover:scale-110 active:scale-100 duration-200 bg-white rounded-full'><FontAwesomeIcon className='text-red-600' icon={solidHeart} /></button>
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
                                    <button className='mr-3 w-8 h-8 hover:scale-110 active:scale-100 duration-200 bg-white rounded-full'><FontAwesomeIcon className='text-red-600' icon={solidHeart} /></button>
                                </div>}
                            </div>
                            <div className='mt-3 mx-3'>
                                <div className='animate-pulse text-gray-200 bg-gray-200 rounded-lg font-bold sm:text-base text-sm text-ellipsis text-nowrap overflow-hidden'>sdad</div>
                                <div className='animate-pulse text-gray-200 bg-gray-200 rounded-lg w-1/2 mt-1 sm:text-sm text-xs'>hk</div>
                            </div>
                        </div>
                    </div>}
                    {isVisible && <div onClick={scrollToTop} className='fixed z-[101] sm:bottom-10 bottom-[9rem] right-[1rem] sm:right-10 bg-green-700 hover:bg-green-700/90 duration-200 active:scale-95 rounded-full p-3  cursor-pointer flex justify-center items-center'>
                        <FontAwesomeIcon className='w-6 h-6 text-white' icon={faArrowUp} />
                    </div>}
                    {error && <div className='flex justify-center items-center h-screen'>
                        <div className='backdrop-blur-sm mx-2 shadow-lg text-gray-800 bg-white/50 py-8 px-12 rounded-xl'>
                            <div className='text-2xl text-center my-2'>An error occured while loading products!</div>
                            <div className='flex justify-center items-center'><button onClick={handlereload} className='hover:scale-105 text-xl backdrop-blur-sm my-2 mx-7 px-4 py-3 rounded-md bg-green-700/60 hover:bg-green-700/80 text-white duration-200'><FontAwesomeIcon className='mr-2' icon={faRotateRight} />Refresh</button></div>
                        </div>
                        <div className='-z-10 absolute top-0 overflow-hidden'><img className=' h-screen w-screen object-cover' src="/Flowers3.jpg" alt="" /></div>
                    </div>}
                </div>
                <Bottomfilterpanel setsearchby={setsearchby} searchby={searchby} minPrice={minPrice} setminPrice={setminPrice} maxPrice={maxPrice} setmaxPrice={setmaxPrice} prevminPrice={prevminPrice} setprevminPrice={setprevminPrice} prevmaxPrice={prevmaxPrice} setprevmaxPrice={setprevmaxPrice} pricechanges={pricechanges} setpricechanges={setpricechanges} fetchProducts={fetchProducts} />
            </div>
        </div>
    )
};

export default Searchresults;