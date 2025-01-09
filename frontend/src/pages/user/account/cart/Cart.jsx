import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../../../../context/context';
//Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSeedling, faRotateRight } from '@fortawesome/free-solid-svg-icons';
//Cpmponents
import Notification from '../../../../components/Notification';

const Cart = () => {

    const navigate = useNavigate();
    const { isAuth, setisAuth, name, address, cart, setcart, setredirect, backend_url } = useContext(AppContext);
    const [isPopup, setisPopup] = useState(false);
    const [popupMessage, setpopupMessage] = useState(" ");
    const [loading, setloading] = useState(true);
    const [error, seterror] = useState(false);
    const [disable, setdisable] = useState(false);
    const [products, setproducts] = useState([]);
    const [sum, setsum] = useState(0);

    //Handle search products
    const startsearch = (e) => {
        e.preventDefault();
        navigate(`/user/searchresults/%20/`);
    };

    //Handle refresh
    const handlerefresh = () => {
        seterror(false);
        fetchProducts();
    };

    //Handle go to login
    const gotologin = () => {
        setredirect(window.location.pathname);
        navigate("/user/login-register");
    };

    //Handle change address
    const changeAddress = () => {
        setredirect(window.location.pathname);
        navigate('/user/change-address');
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

    //Fetch cart
    const fetchProducts = async () => {
        try {
            setdisable(true);
            setloading(true);
            const response = await fetch(`${backend_url}/api/users/cart`,
                {
                    method: "POST",
                    credentials: 'include',
                }
            );
            const data = await response.json();
            if (data.status == 200) {
                // console.log(data);
                setproducts(data.data);
            }
            else if (data.status == 469) {
                // localStorage.clear();
                setisAuth(false);
                setpopupMessage(data.message);
                setisPopup(true);
            }
            else {
                setpopupMessage(data.message);
                setisPopup(true);
                seterror(true);
                console.log(data);
            }
        } catch (error) {
            console.log(error);
            setpopupMessage(error.message);
            setisPopup(true);
            seterror(true);
        } finally {
            setdisable(false);
            setloading(false);
        };
    };

    useEffect(() => {
        fetchProducts();
    }, [cart]);

    //Remove from cart
    const removeFromCart = async (e, productId) => {
        e.preventDefault();
        e.stopPropagation();
        if (disable == false) {
            try {
                setloading(true);
                setdisable(true);
                const response = await fetch(`${backend_url}/api/users/remove-from-cart`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        productId: productId,
                    })
                });
                const result = await response.json();
                if (result.status == 200) {
                    // console.log(result);
                    setcart(result.data.cart);
                    setpopupMessage("Product removed from cart!");
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
                setdisable(false);
            };
        };
    };

    //Handle sum
    useEffect(() => {
        setsum(products?.reduce((x, y) => {
            return x + y.price
        }, 0));
    }, [products]);

    //Handle place order
    const placeOrder = () => {
        fetchProducts();
        if (cart.length == 0) {
            setpopupMessage("Your cart is empty!");
            setisPopup(true);
        }
        else if (disable == true) {
            setpopupMessage("Please wait server to finish other request!");
            setisPopup(true);
        }
        else if (products.some(product => product.availability === false)) {
            setpopupMessage("Please remove sold out items from your cart!");
            setisPopup(true);
        }
        else {
            navigate('/user/order-confirmation');
        };
    };

    return (<>
        {isPopup && <Notification message={popupMessage} onexit={exitPopup} />}
        {isAuth ? <div className='flex-1 overflow-auto pt-4 flex justify-center sm:text-sm text-xs flex-wrap'>
            <div className='flex flex-col sm:w-[500px] w-[350px] mx-2'>
                <div className={'rounded-md text-gray-700 bg-red-100/70 sm:p-4 p-2 flex ' + ((address.pincode == '111111') ? ' justify-center ' : ' justify-between ')}>
                    {(address.pincode !== '111111') && <div className='sm:text-sm text-[10px]'>
                        <div className='mb-1 '>Deliver to : <span className='font-bold text-black'>{name}, {address.pincode}</span></div>
                        <div className='mb-1'>{address.localAddress + ", " + ((address.landmark == "") ? '' : address.landmark + ", ") + address.city + ', ' + address.state}</div>
                        <div>Phone : {address.contact}</div>
                    </div>}
                    <div className='flex justify-center items-center '>
                        <button onClick={changeAddress} className='text-[10px] border-[1.5px] font-bold text-red-600 border-red-600 rounded-md px-3 py-2 bg-red-100/70 hover:bg-red-50 duration-200'>{(address.pincode == '111111') ? "ADD" : "CHANGE"} ADDRESS</button>
                    </div>
                </div>
                {!loading && !error && <div className='flex-col flex pb-4'>
                    {products && products.map((products) => {
                        return <Link to={`/user/product/id/${products._id}/`} className='flex mt-4 border-[1px] p-4' key={products._id}>
                            <div className='relative'>
                                <img className={'sm:w-[8rem] w-[6rem] sm:h-[10rem] object-cover ' + ((products.availability == false) ? " opacity-50 " : " ")} src={products.images[0]} />
                                {(products.availability == false) && <div className='absolute top-1/2 z-10 left-1/2 -translate-x-1/2 -translate-y-1/2'>Sold Out</div>}
                            </div>
                            <div className='ml-4 flex flex-col justify-between'>
                                <div className='mt-2'>
                                    <div className='font-bold'>{products.name}</div>
                                    <div className='sm:w-[300px] w-[9rem] overflow-hidden whitespace-nowrap text-ellipsis'>{products.description}</div>
                                    <div>Rs.{products.price}</div>
                                </div>
                                <div>Sold by: {products.soldBy.brandName}</div>
                                <div className='mt-2'>
                                    <button onClick={(e) => removeFromCart(e, products._id)} className={'border-[1.5px] font-bold rounded-md px-3 py-2 duration-200 ' + ((products.availability == false) ? " bg-red-100/70 border-red-400 hover:bg-red-50 " : ' hover:bg-gray-50 ')}>Remove from cart</button>
                                </div>
                            </div>
                        </Link>
                    })}
                    {(cart.length > 0) && <div className='flex mt-4 border-[1px] p-4 justify-center items-center'>
                        <div className='font-bold'>End of cart</div>
                    </div>}
                    {(cart.length == 0) && <>
                        <div className='flex mt-4 border-[1px] p-4 justify-center items-center'>
                            <div className='font-bold'>Cart is empty</div>
                        </div>
                        <button onClick={(e) => startsearch(e)} className='active:scale-95 duration-200 px-3 py-3 bg-gradient-to-br from-red-400 via-pink-400 to-pink-200 font-bold text-white text-base rounded-lg mt-4 flex flex-col justify-center items-center'>
                            <div className='mt-4'>
                                <div className='flex md:p-4 p-2 items-center justify-center rounded-full bg-white/10 shadow-[0px_0px_15px_1px_rgba(255,255,255,0.2)] '>
                                    <div className='flex p-3 md:p-4 items-center justify-center rounded-full bg-white/10 shadow-[0px_0px_5px_1px_rgba(255,255,255,0.2)] '>
                                        <FontAwesomeIcon className='text-black w-10 h-10 p-4 rounded-full bg-white/10 shadow-[0px_0px_5px_1px_rgba(255,255,255,0.2)] ' icon={faSeedling} />
                                    </div>
                                </div>
                            </div>
                            <div className='text-xl mt-10 mb-6'>Buy plants</div>
                        </button>
                    </>}
                </div>}
                {loading && <div className='flex-col flex pb-4'>
                    <div className='flex mt-4 border-[1px] p-4'>
                        <div>
                            <div className='sm:w-[8rem] w-[8rem] sm:h-[10rem] bg-gray-200 text-gray-200 animate-pulse rounded-md ' ></div>
                        </div>
                        <div className='ml-4 flex flex-col justify-between'>
                            <div className='sm:mt-2'>
                                <div className='font-bold sm:w-[300px] w-[9rem] bg-gray-200 text-gray-200 animate-pulse rounded-md px-2 mb-1'>jhgfd</div>
                                <div className='w-1/2 overflow-hidden whitespace-nowrap text-ellipsis  bg-gray-200 text-gray-200 animate-pulse rounded-md px-2 mb-1'>dadadsd</div>
                                <div className=' bg-gray-200 text-gray-200 animate-pulse rounded-md px-2 w-1/2'>dadadsd</div>
                            </div>
                            <div className=' bg-gray-200 text-gray-200 animate-pulse rounded-md px-2 w-3/4'>Sold by: dasdasdda</div>
                            <div className='mt-2'>
                                <button className='border-[1.5px] font-bold rounded-md px-3 py-2  duration-200 bg-gray-200 text-gray-200 animate-pulse '>Remove from cart</button>
                            </div>
                        </div>
                    </div>
                    <div className='flex mt-4 border-[1px] p-4'>
                        <div>
                            <div className='sm:w-[8rem] w-[8rem] sm:h-[10rem] bg-gray-200 text-gray-200 animate-pulse rounded-md ' ></div>
                        </div>
                        <div className='ml-4 flex flex-col justify-between'>
                            <div className='sm:mt-2'>
                                <div className='font-bold sm:w-[300px] w-[9rem] bg-gray-200 text-gray-200 animate-pulse rounded-md px-2 mb-1'>jhgfd</div>
                                <div className='w-1/2 overflow-hidden whitespace-nowrap text-ellipsis  bg-gray-200 text-gray-200 animate-pulse rounded-md px-2 mb-1'>dadadsd</div>
                                <div className=' bg-gray-200 text-gray-200 animate-pulse rounded-md px-2 w-1/2'>dadadsd</div>
                            </div>
                            <div className=' bg-gray-200 text-gray-200 animate-pulse rounded-md px-2 w-3/4'>Sold by: dasdasdda</div>
                            <div className='mt-2'>
                                <button className='border-[1.5px] font-bold rounded-md px-3 py-2  duration-200 bg-gray-200 text-gray-200 animate-pulse '>Remove from cart</button>
                            </div>
                        </div>
                    </div>
                    <div className='flex mt-4 border-[1px] p-4 justify-center items-center'>
                        <div className='font-bold bg-gray-200 text-gray-200 animate-pulse rounded-md '>End of cart sadad</div>
                    </div>
                </div>}
                {error && <div className='flex-col flex pb-4'>
                    <div className='flex mt-4 border-[1px] p-4 justify-center items-center'>
                        <div className='font-bold '>An error occured while loading the cart</div>
                    </div>
                    <div onClick={handlerefresh} className='hover:bg-white hover:text-black text-white duration-200 cursor-pointer bg-green-700 border-green-700 flex mt-4 border-[1px] p-4 justify-center items-center'>
                        <div className='font-bold '><FontAwesomeIcon className='mr-2' icon={faRotateRight} />Refresh</div>
                    </div>
                </div>}
            </div>
            <div className='flex flex-col xl:w-[300px] sm:w-[500px] w-[350px] mdw-full p-4 mx-2 border-2 rounded-lg border-green-700 h-fit'>
                <div className='flex justify-between items-center mb-4 font-bold'>PRICE DETAILS</div>
                <div className='flex justify-between items-center mb-1'>
                    <div>Total MRP</div>
                    {!loading && !error && <div>Rs.{sum}</div>}
                    {error && <div>Rs.0</div>}
                    {loading && <div className=' bg-gray-200 text-gray-200 animate-pulse rounded-md px-2'>Rs.sdad</div>}
                </div>
                <div className='flex justify-between items-center border-b pb-2'>
                    <div>Platform fee</div>
                    {!loading && !error && <div>Rs.{(sum == 0) ? 0 : 1}</div>}
                    {error && <div>Rs.0</div>}
                    {loading && <div className=' bg-gray-200 text-gray-200 animate-pulse rounded-md px-2'>Rs.20</div>}
                </div>
                <div className='flex justify-between items-center my-2 font-bold'>
                    <div>Total Amount</div>
                    {!loading && !error && <div>Rs.{sum + ((sum == 0) ? 0 : 1)}</div>}
                    {error && <div>Rs.0</div>}
                    {loading && <div className=' bg-gray-200 text-gray-200 animate-pulse rounded-md px-2'>Rs.asdadsd</div>}
                </div>
                <button onClick={placeOrder} disabled={disable} className='active:scale-95 duration-200 bg-green-700 px-4 py-3 rounded-md font-bold text-base text-white flex justify-center items-center'>
                    <div>Place order</div>
                </button>
            </div>
        </div> :
            <div className='flex-1 flex justify-center items-center h-full'>
                <div className='backdrop-blur-sm mx-2 shadow-lg text-gray-800 bg-white/50 py-8 px-12 rounded-xl'>
                    <div className='text-2xl text-center my-2'>Please login to continue!</div>
                    <div className='flex justify-center items-center'><button onClick={gotologin} className='hover:scale-105 text-xl backdrop-blur-sm my-2 mx-7 px-4 py-3 rounded-md bg-green-700/60 hover:bg-green-700/80 text-white duration-200'>Log in</button></div>
                </div>
                <div className='-z-10 absolute top-0 overflow-hidden'><img className=' h-screen w-screen object-cover' src="/Flowers1.jpg" alt="" /></div>
            </div>}
    </>
    )
};

export default Cart;