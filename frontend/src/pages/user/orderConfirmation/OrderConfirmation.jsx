import { React, useState, useEffect, useContext } from 'react';
import { AppContext } from '../../../context/context';
import { useNavigate } from 'react-router-dom';
//Icons
import { faArrowLeft, faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//Components
import Notification from '../../../components/Notification';

const OrderConfirmation = () => {

    const navigate = useNavigate();
    const { isAuth, setisAuth, backend_url } = useContext(AppContext);
    const [isPopup, setisPopup] = useState(false);
    const [popupMessage, setpopupMessage] = useState("");
    const [keyId, setkeyId] = useState("");
    const [user, setuser] = useState({});
    const [loading, setloading] = useState(true);
    const [error, seterror] = useState(false);
    const [orderId, setorderId] = useState(false);

    const handlePayment = () => {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'https://api.razorpay.com/v1/checkout/embedded';

        const fields = {
            key_id: keyId,
            amount: user.totalAmount * 100,
            currency: 'INR',
            order_id: orderId,
            name: 'Botania',
            description: 'A plant selling app',
            image: 'https://res.cloudinary.com/botania/image/upload/v1735389877/mcsfuw2ibvna51qni6wr.png',
            'prefill[name]': user.name,
            'prefill[contact]': user.address?.contact,
            'prefill[email]': user.email,
            'notes[shipping address]':
                `${user.address?.localAddress}${(user.address?.landmark.trim() !== '') ? `, ${user.address?.landmark}` : ''}, ${user.address?.city}, ${user.address?.state} - ${user.address?.pincode}`,
            callback_url: `http://localhost:3000/api/users/confirm-order`,
            cancel_url: 'http://localhost:5173/user/order-confirmation',
        };

        for (const key in fields) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = fields[key];
            form.appendChild(input);
        };

        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    };

    //Fetch data
    const fetchdata = async () => {
        try {
            setloading(true);
            const response = await fetch(`${backend_url}/api/users/order-confirmation`,
                {
                    method: 'POST',
                    credentials: 'include',
                },

            );
            const data = await response.json();
            if (data.status == 200) {
                // console.log(data);
                setuser(data.data.user);
                setorderId(data.data.orderId);
                setkeyId(data.data.keyId);
            }
            else if (data.status == 469) {
                // localStorage.clear();
                setisAuth(false);
                setpopupMessage(data.message);
                setisPopup(true);
            }
            else if (data.status == 468) {
                setpopupMessage(data.message);
                setisPopup(true);
                handleback();
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
        fetchdata();
    }, []);

    //Handle reload
    const handlereload = () => {
        seterror(false);
        fetchdata();
    };

    //Handle back
    const handleback = () => {
        navigate("/user/account/cart");
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

    return (
        <>
            {isPopup && <Notification message={popupMessage} onexit={exitPopup} />}
            <div className='h-[4rem] bg-white z-20 flex w-screen sm:pl-4 pb-3 items-end fixed top-0 left-0 border-b'>
                <div onClick={handleback} className='opacity-70 cursor-pointer hover:opacity-100 duration-200 '><FontAwesomeIcon className='w-8 h-8 ml-4 mr-8' icon={faArrowLeft} /></div>
                <div className='text-green-700 font-bold text-4xl md:block hidden'>Botania</div>
                <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-2xl text-green-700 text-nowrap'>Order confirmation</div>
            </div>
            {isAuth ? <>
                {!loading && !error && <div className='mt-[4rem] flex justify-center pt-8 mx-2'>
                    <div className='md:max-w-[50rem] '>
                        <div className='font-bold mb-2'>Shipping Address :</div>
                        <div className='border-2 border-green-700 rounded-xl p-4 text-[12px] sm:text-base'>
                            <div className='mb-1 '>Deliver to : <span className='font-bold text-black'>{user.name}, {user.address?.pincode}</span></div>
                            <div className='mb-1'>{user.address?.localAddress + ", " + ((user.address?.landmark == "") ? '' : user.address?.landmark + ", ") + user.address?.city + ', ' + user.address?.state}</div>
                            <div>Phone : {user.address?.contact}</div>
                        </div>
                        <div className='font-bold mt-8 mb-2'>Order summary :</div>
                        <div className='flex flex-col sm:text-base text-xs'>
                            {user.cart && user.cart.map(products => {
                                return <div key={products._id} className='flex p-4 border-green-700 border-2 duration-200 rounded-xl mb-4'>
                                    <div className='flex-shrink-0'>
                                        <img className={'sm:w-[8rem] w-[6rem] sm:h-[10rem] h-[7rem] object-cover rounded-md'} src={products.images[0]} />
                                    </div>
                                    <div className='ml-4 flex flex-col justify-between'>
                                        <div className='mt-2'>
                                            <div className='font-bold'>{products.name}</div>
                                            <div className='sm:w-[400px] w-[11rem] overflow-hidden whitespace-nowrap text-ellipsis'>{products.description}</div>
                                            <div>Rs.{products.price}</div>
                                            <div className='mt-4'>Sold by: {products.soldBy.brandName}</div>
                                        </div>
                                    </div>
                                </div>
                            })}
                        </div>
                        <div className='font-bold'>Total {user.cart?.length} {((user.cart?.length == 1) ? 'product' : 'products')}</div>
                        <div className='font-bold mt-8 mb-2'>Price details :</div>
                        <div className='border-2 border-green-700 rounded-xl p-4'>
                            <div className='flex justify-between my-1'>
                                <div>Price: </div>
                                <div>Rs.{user.totalAmount}</div>
                            </div>
                            <div className='flex justify-between my-1 border-b-2 pb-2 border-green-700'>
                                <div>Platform fee: </div>
                                <div>Rs.1</div>
                            </div>
                            <div className='flex justify-between my-1'>
                                <div>Total Amount: </div>
                                <div>Rs.{user.totalAmount + 1}</div>
                            </div>
                        </div>
                        <div className='sm:flex block justify-end mt-8 mb-[5rem]'>
                            <div onClick={handleback} className='mb-4 sm:mb-0 px-5 text-center cursor-pointer py-3 active:scale-95 duration-200 hover:bg-red-700 bg-red-600 text-white rounded-xl sm:mr-5'>Go back to Cart</div>
                            <div onClick={handlePayment} className='px-5 text-center cursor-pointer py-3 active:scale-95 duration-200 hover:bg-green-800 bg-green-700 text-white rounded-xl'>Pay Rs.{user.totalAmount + 1}</div>
                        </div>
                    </div>
                </div>}
                {loading && <div className='mt-[4rem] flex justify-center pt-8 mx-2'>
                    <div className='md:max-w-[50rem]'>
                        <div className='font-bold mb-2'>Shipping Address :</div>
                        <div className='border-2 border-green-700 rounded-xl p-4 text-[12px] sm:text-base'>
                            <div className='mb-1 w-2/3 bg-gray-200 animate-pulse text-gray-200 rounded-lg'>Deliver to : </div>
                            <div className='mb-1 bg-gray-200 animate-pulse text-gray-200 rounded-lg'>sajnasjanskj</div>
                            <div className=' w-1/2 bg-gray-200 animate-pulse text-gray-200 rounded-lg'>Phone : sjkankasj</div>
                        </div>
                        <div className='font-bold mt-8 mb-2'>Order summary :</div>
                        <div className='flex flex-col'>
                            <div className='flex p-4 border-green-700 border-2 duration-200 rounded-xl mb-4'>
                                <div className=''>
                                    <div className={'sm:w-[8rem] w-[6rem] sm:h-[10rem] h-[7rem] object-cover rounded-md bg-gray-200 animate-pulse'} ></div>
                                </div>
                                <div className='ml-4 flex flex-col justify-between'>
                                    <div className='sm:mt-2'>
                                        <div className='font-bold mb-1 w-1/2 rounded-lg bg-gray-200 px-2 text-gray-200 animate-pulse'>ad</div>
                                        <div className='rounded-lg text-gray-200 sm:w-[400px] mb-1 bg-gray-200 animate-pulse w-[11rem] overflow-hidden whitespace-nowrap text-ellipsis'>asdad</div>
                                        <div className='rounded-lg w-1/3 text-gray-200  bg-gray-200 mb-1 animate-pulse'>₹asdasd</div>
                                        <div className='rounded-lg text-gray-200 mt-4 bg-gray-200 animate-pulse'>Sold by: asdad</div>
                                    </div>
                                </div>
                            </div>
                            <div className='flex p-4 border-green-700 border-2 duration-200 rounded-xl mb-4'>
                                <div className=''>
                                    <div className={'sm:w-[8rem] w-[6rem] sm:h-[10rem] h-[7rem] object-cover rounded-md bg-gray-200 animate-pulse'} ></div>
                                </div>
                                <div className='ml-4 flex flex-col justify-between'>
                                    <div className='sm:mt-2'>
                                        <div className='font-bold mb-1 w-1/2 rounded-lg bg-gray-200 px-2 text-gray-200 animate-pulse'>ad</div>
                                        <div className='rounded-lg text-gray-200 sm:w-[400px] mb-1 bg-gray-200 animate-pulse w-[11rem] overflow-hidden whitespace-nowrap text-ellipsis'>asdad</div>
                                        <div className='rounded-lg w-1/3 text-gray-200  bg-gray-200 mb-1 animate-pulse'>₹asdasd</div>
                                        <div className='rounded-lg text-gray-200 mt-4 bg-gray-200 animate-pulse'>Sold by: asdad</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='font-bold text-gray-200 bg-gray-200 rounded-lg animate-pulse'>Total skajnjn</div>
                        <div className='font-bold mt-8 mb-2'>Price details :</div>
                        <div className='border-2 border-green-700 rounded-xl p-4'>
                            <div className='flex text-gray-200 bg-gray-200 animate-pulse rounded-lg justify-between my-1'>
                                <div>Price: </div>
                                <div>Rs.add</div>
                            </div>
                            <div className='flex text-gray-200 bg-gray-200 animate-pulse rounded-lg justify-between my-1 pb-2 '>
                                <div>Platform fee: </div>
                                <div>Rs.20</div>
                            </div>
                            <div className='flex text-gray-200 bg-gray-200 animate-pulse rounded-lg justify-between my-1'>
                                <div>Total Amount: </div>
                                <div>Rs.adad</div>
                            </div>
                        </div>
                        <div className='sm:flex block justify-end mt-8 mb-[5rem]'>
                            <div className='mb-4 sm:mb-0 px-5 text-center cursor-pointer py-3 active:scale-95 duration-200 hover:bg-red-700 bg-red-600 text-red-600 hover:text-red-700 rounded-xl sm:mr-5'>Go back to Cart</div>
                            <div className='px-5 text-center cursor-pointer py-3 active:scale-95 duration-200 hover:bg-green-800 bg-green-700 text-green-700 hover:text-green-800 rounded-xl'>Pay Rs.sadad</div>
                        </div>
                    </div>
                </div>}
                {error && <div className='flex-1 justify-center items-center flex h-screen'>
                    <div className='flex p-6 mx-2 flex-col items-center border-green-700 border-2 rounded-xl'>
                        <div className='text-gray-800 text-xl text-center'>An error occured while loading order details.</div>
                        <div><button onClick={handlereload} className='active:bg-green-800 duration-200 bg-green-700 text-white px-3 py-2 rounded-lg mt-4'><FontAwesomeIcon className='mr-2' icon={faRotateRight} />Refresh</button></div>
                    </div>
                </div>}
            </> : <>
                <div className='flex justify-center items-center h-screen'>
                    <div className='border-2 border-green-700 rounded-xl p-6'>
                        <div className='text-xl'>Please login to continue!</div>
                        <div className='flex justify-center mt-4'>
                            <button onClick={handleback} className='bg-green-700 rounded-lg text-white px-4 py-3 duration-200 active:scale-95'>Go back</button>
                        </div>
                    </div>
                </div>
            </>}
        </>
    )
};

export default OrderConfirmation;