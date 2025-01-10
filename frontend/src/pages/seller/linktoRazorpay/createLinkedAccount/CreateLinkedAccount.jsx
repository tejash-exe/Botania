import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../../../context/context';
//Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faRotateRight } from '@fortawesome/free-solid-svg-icons';
//Components
import Notification from '../../../../components/Notification';

const CreateLinkedAccount = () => {

    const navigate = useNavigate();
    const { issellerAuth, setissellerAuth, setsellerredirect, backend_url } = useContext(AppContext);
    const [isPopup, setisPopup] = useState(false);
    const [loading, setloading] = useState(true);
    const [error, seterror] = useState(false);
    const [popupMessage, setpopupMessage] = useState(" ");
    const [email, setemail] = useState('');
    const [emailerror, setemailerror] = useState(false);
    const [seller, setseller] = useState({});
    const [incomplete, setincomplete] = useState(false);

    //Handle back
    const handleback = () => {
        navigate('/seller/link-to-razorpay');
    };

    //Handle reload
    const handlereload = () => {
        seterror(false);
        fetchProfile();
    };

    //Handle gotologin
    const gotologin = () => {
        setsellerredirect(window.location.pathname);
        navigate('/seller/login-register');
    };

    //Handle gotoprofile
    const gotoprofile = () => {
        navigate('/seller/account/profile');
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

    //Handle email
    const changeEmail = (e) => {
        setemail(e.target.value);
    };

    useEffect(() => {
        if (email.endsWith('@botania.com')) {
            setemailerror(false);
        }
        else {
            setemailerror(true);
        };
    }, [email, setemail]);

    //Handle email submission
    const handleEmailsubmission = () => {
        if (!email.endsWith('@botania.com')) {
            setpopupMessage("Email must ends with '@botania.com'!");
            setisPopup(true);
        }
        else {
            createLinkedAccount();
        };
    };

    //Fetch profile
    const fetchProfile = async () => {
        try {
            setloading(true);
            const response = await fetch(`${backend_url}/api/sellers/fetch-profile`, {
                method: "POST",
                credentials: 'include',
            });
            const result = await response.json();
            if (result.status == 469) {
                setpopupMessage(result.message);
                setisPopup(true);
                // localStorage.clear();
                setissellerAuth(false);
            }
            else if (result.status == 200) {
                // console.log(result.data.razorpay);
                setseller(result.data.seller);
                if (result.data.seller?.brandName == "" || result.data.seller?.address?.pincode == "111111") {
                    setincomplete(true);
                };
            }
            else {
                console.log(result);
                seterror(true);
                setpopupMessage(result.message);
                setisPopup(true);
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
        fetchProfile();
    }, []);

    //Create Linked Account
    const createLinkedAccount = async () => {
        if (email !== "" && (emailerror == false)) {
            const data = {
                email: email,
            };
            try {
                setloading(true);
                const response = await fetch(`${backend_url}/api/sellers/create-linked-account`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: 'include',
                    body: JSON.stringify(data),
                });
                const result = await response.json();
                if (result.status == 469) {
                    setissellerAuth(false);
                    setpopupMessage(result.message);
                    setisPopup(true);
                }
                else if (result.status == 200) {
                    // console.log(result);
                    setpopupMessage("Linked account created succesfully!");
                    setisPopup(true);
                }
                else {
                    console.log(result);
                    setpopupMessage(result.message);
                    setisPopup(true);
                }
            } catch (error) {
                console.log(error);
                setpopupMessage(error.message);
                setisPopup(true);
            } finally {
                setloading(false);
                fetchProfile();
            };
        }
        else {
            setpopupMessage("Please add a email!");
            setisPopup(true);
            console.log("Please add a email!");
        };
    };

    return (
        <>
            {isPopup && <Notification message={popupMessage} onexit={exitPopup} />}
            {incomplete && <div className="fixed top-0 left-0 z-40 flex justify-center items-center w-screen h-screen">
                <div className='bg-gradient-to-br mx-2 drop-shadow-lg from-red-400 via-pink-400 to-pink-200 p-2 rounded-3xl'>
                    <div className='flex flex-col bg-white rounded-2xl p-6'>
                        <div className=''>Please have a Brandname and address to continue!</div>
                        <div className='flex justify-end mt-6'>
                            <button onClick={handleback} className='ml-4 bg-gray-200 duration-300 active:scale-95 px-4 py-2 rounded-xl sm:text-sm text-xs text-nowrap hover:bg-gray-300'>Go Back</button>
                            <button onClick={gotoprofile} className='ml-4 bg-black duration-300 active:scale-95 px-4 py-2 rounded-xl sm:text-sm text-xs text-nowrap text-white '>Go to Profile</button>
                        </div>
                    </div>
                </div>
            </div>}
            <div className='h-[4rem] z-[50] bg-white fixed top-0 left-0 w-screen flex sm:pl-4 border-b items-center'>
                <div onClick={handleback} className='opacity-70 cursor-pointer hover:opacity-100 duration-200'><FontAwesomeIcon className='w-8 h-8 m-4' icon={faArrowLeft} /></div>
                <div className='font-bold sm:text-3xl text-2xl'>Botania<span className='text-sm'>.Seller</span>/</div>
                <div className='mt-2'><img className='sm:w-[10rem] w-[6rem]' src="/Razorpay.svg" /></div>
            </div>
            {issellerAuth && !loading && !error && <div className={'flex mt-[4rem] justify-center' + ((incomplete) ? ' blur-sm ' : ' ')}>
                <div className='md:w-[50rem] mt-4 mx-4 flex flex-col '>
                    <div className='mt-[5rem] text-4xl font-semibold'>Create a Linked Account</div>
                    <div className='text-2xl mt-6 font-semibold'>Enter an email for Linked Account</div>
                    {(seller.razorpay?.accountId === '') && <div className='flex mb-[4rem] flex-col border-2 border-black rounded-3xl p-8 mt-6'>
                        <div className='mb-4 font-semibold'>Enter an email for Razorpay :</div>
                        <input type="email" value={email} onChange={(e) => { changeEmail(e) }} placeholder='example@botania.com' className="bg-gray-200 outline-none px-4 h-10 rounded-xl sm:w-[20rem]" />
                        <div className='text-sm' hidden={!emailerror}>(email must end with '@botania.com')</div>
                        <div className='flex'>
                            <button onClick={handleEmailsubmission} className='text-white bg-black duration-200 active:scale-95 w-min px-5 py-2 rounded-xl text-nowrap mt-4'>Create Linked Account</button>
                        </div>
                    </div>}
                    {(seller.razorpay?.accountId !== "") && <div className='flex mb-[4rem] flex-col border-2 border-black rounded-3xl p-8 mt-6'>
                        <div className='mb-4 font-semibold'>Linked account created succesfully!</div>
                        <div className=''>Email ID :</div>
                        <input type="email" placeholder={seller.razorpay?.email} disabled className="bg-gray-200 outline-none px-4 h-10 rounded-xl sm:w-[20rem]" />
                        <div className='mt-4'>Linked Account ID :</div>
                        <input type="text" placeholder={seller.razorpay?.accountId} disabled className="bg-gray-200 outline-none px-4 h-10 rounded-xl sm:w-[20rem]" />
                        <div className='flex'>
                            <button onClick={handleback} className='text-white text-nowrap bg-green-600 duration-200 w-min px-5 py-2 rounded-xl active:scale-95 mt-4'>Return</button>
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
            {loading && <div className='py-[4rem] flex justify-center items-center h-screen'>
                <img className='h-[10rem] w-[10rem] animate-spin' src="/loading.png" alt="" />
            </div>}
            {error && <div className="py-[4rem] flex justify-center items-center h-screen">
                <div className='backdrop-blur-sm shadow-lg mx-2 text-gray-800 bg-white/50 py-8 px-12 rounded-xl'>
                    <div className='text-2xl text-center my-2'>An error occured while loading details!</div>
                    <div className='flex justify-center items-center'><button onClick={handlereload} className='hover:scale-105 text-xl backdrop-blur-sm my-2 mx-7 px-4 py-3 rounded-md bg-green-700/60 hover:bg-green-700/80 text-white duration-200'><FontAwesomeIcon className='mr-2' icon={faRotateRight} />Refresh</button></div>
                </div>
                <div className='-z-10 absolute top-0 overflow-hidden'><img className=' h-screen w-screen object-cover' src="/Flowers3.jpg" alt="" /></div>
            </div>}
        </>
    )
};

export default CreateLinkedAccount;