import React, { useContext, useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../../../context/context';
//Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faRotateRight } from '@fortawesome/free-solid-svg-icons';
//Components
import Notification from '../../../components/Notification';

const LinktoRazorpay = () => {

    const navigate = useNavigate();
    const deletebuttonref = useRef();
    const confirmmenuref = useRef();
    const { issellerAuth, setissellerAuth, setsellerredirect, backend_url } = useContext(AppContext);
    const [isPopup, setisPopup] = useState(false);
    const [loading, setloading] = useState(true);
    const [error, seterror] = useState(false);
    const [popupMessage, setpopupMessage] = useState(" ");
    const [incomplete, setincomplete] = useState(false);
    const [seller, setseller] = useState({});
    const [confirm, setconfirm] = useState(false);
    const [sendtoactivate, setsendtoactivate] = useState('');

    //Handle gotologin
    const gotologin = () => {
        setsellerredirect(window.location.pathname);
        navigate('/seller/login-register');
    };

    //Handle back
    const handleback = () => {
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

    //Handle reload
    const handlereload = () => {
        seterror(false);
        fetchProfile();
    };

    //Deletemenu
    const deletebuttonclick = (e) => {
        e.stopPropagation();
        setconfirm(true);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                deletebuttonref.current &&
                !deletebuttonref.current.contains(e.target) &&
                confirmmenuref.current &&
                !confirmmenuref.current.contains(e.target)
            ) {
                setconfirm(false);
            };
        };

        if (confirm) {
            document.addEventListener('click', handleClickOutside);
        } else {
            document.removeEventListener('click', handleClickOutside);
        };

        // Cleanup event listener on component unmount
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [confirm]);

    //Handle cancle
    const handleCancel = () => {
        setconfirm(false);
    };

    //Handle delete
    const deleteLinkedAccount = async () => {
        try {
            setloading(true);
            const response = await fetch(`${backend_url}/api/sellers/delete-linked-account`, {
                method: "POST",
                credentials: 'include',
            });

            const result = await response.json();
            if (result.status == 469) {
                setpopupMessage(result.message);
                setisPopup(true);
                setissellerAuth(false);
                // localStorage.clear();
            }
            else if (result.status == 200) {
                // console.log(result.data.razorpay);
                // setrazorpay(result.data.razorpay);
                setpopupMessage("Linked Account deleted succesfully!");
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
    };

    const handleDelete = () => {
        setconfirm(false);
        deleteLinkedAccount();
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
                setissellerAuth(false);
                // localStorage.clear();
            }
            else if (result.status == 200) {
                // console.log(result);
                setseller(result.data.seller);
                if(result.data.seller?.brandName == "" && result.data.seller?.address?.pincode == "111111"){
                    setincomplete(true);
                };
            }
            else {
                console.log(result);
                setpopupMessage(result.message);
                setisPopup(true);
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
        fetchProfile();
    }, []);

    //Handle verification steps
    const changeSendtoactivateText = () => {
        if (seller.razorpay?.accountId == '') {
            setsendtoactivate('Create a Linked Account');
        } else if (seller.razorpay?.stakeholderId === '') {
            setsendtoactivate('Create a Stakeholder');
        } else if (seller.razorpay?.routeconfigId === '') {
            setsendtoactivate('Request a Route Configuration');
        } else if (seller.razorpay?.activationStatus !== 'activated') {
            setsendtoactivate('Update Route Configuration');
        };
    };

    useEffect(() => {
        changeSendtoactivateText();
    }, [fetchProfile]);

    const handleSendtoactivate = () => {
        if (seller.razorpay?.accountId === '') {
            navigate('/seller/link-to-razorpay/create-linked-account');
        } else if (seller.razorpay?.stakeholderId === '') {
            navigate('/seller/link-to-razorpay/create-stakeholder');
        } else if (seller.razorpay?.routeconfigId === '') {
            navigate('/seller/link-to-razorpay/request-route-configuration');
        } else if (seller.razorpay?.activationStatus !== 'activated') {
            navigate('/seller/link-to-razorpay/update-route-configuration');
        };
    };

    return (
        <>
            {isPopup && <Notification message={popupMessage} onexit={exitPopup} />}
            {confirm && <div className="fixed top-0 left-0 z-40 flex justify-center items-center w-screen h-screen">
                <div ref={confirmmenuref} className='bg-gradient-to-br mx-2 drop-shadow-lg from-red-400 via-pink-400 to-pink-200 p-2 rounded-3xl'>
                    <div className='flex flex-col bg-white rounded-2xl p-6'>
                        <div className=''>Are you sure you want to delete your Linked Account?</div>
                        <div className='flex justify-end mt-6'>
                            <button onClick={handleCancel} className='ml-4 bg-gray-200 duration-300 active:scale-95 px-4 py-2 rounded-xl sm:text-base text-sm hover:bg-gray-300'>Cancel</button>
                            <button onClick={handleDelete} className='ml-4 bg-red-500 duration-300 active:scale-95 px-4 py-2 rounded-xl sm:text-base text-sm text-white hover:bg-red-600'>Delete</button>
                        </div>
                    </div>
                </div>
            </div>}
            {incomplete && <div className="fixed top-0 left-0 z-40 flex justify-center items-center w-screen h-screen">
                <div className='bg-gradient-to-br mx-2 drop-shadow-lg from-red-400 via-pink-400 to-pink-200 p-2 rounded-3xl'>
                    <div className='flex flex-col bg-white rounded-2xl p-6'>
                        <div className=''>Please have a Brandname and address to continue!</div>
                        <div className='flex justify-end mt-6'>
                            <button onClick={handleback} className='ml-4 bg-black duration-300 active:scale-95 px-4 py-2 rounded-xl sm:text-sm text-xs text-nowrap text-white '>Go to Profile</button>
                        </div>
                    </div>
                </div>
            </div>}
            <div className='h-[4rem] bg-white fixed top-0 left-0 w-screen flex sm:pl-4 border-b items-center'>
                <div onClick={handleback} className='opacity-70 cursor-pointer hover:opacity-100 duration-200'><FontAwesomeIcon className='w-8 h-8 m-4' icon={faArrowLeft} /></div>
                <div className='font-bold sm:text-3xl text-2xl'>Botania<span className='text-sm'>.Seller</span>/</div>
                <div className='mt-2'><img className='sm:w-[10rem] w-[6rem]' src="/Razorpay.svg" /></div>
            </div>
            {issellerAuth && !loading && !error && <div className={'mt-[4rem] duration-300 flex justify-center' + ((confirm || incomplete) ? ' blur-sm ' : ' ')}>
                <div className='md:w-[50rem] mt-4 mx-4 flex flex-col '>
                    <div className='mt-[5rem] text-4xl font-semibold'>Link to Razorpay</div>
                    <div className='mt-8 mb-2'>You should link to Razorpay to integrate <Link className='text-blue-500' target='_blank' to="https://razorpay.com/docs/payments/route/">Route</Link> and start transferring accepting payments.</div>
                    <div>Below are the steps to integrate Route.</div>
                    <div className='flex flex-col px-6 mt-4'>
                        <Link to='/seller/link-to-razorpay/create-linked-account' className={'mt-1 w-min text-nowrap duration-200' + ((seller.razorpay?.accountId === '') ? ' text-blue-500 hover:text-black ' : ' ')}>1. Create a Linked Account <span hidden={seller.razorpay?.accountId === ''} className="text-green-600 font-bold">✓</span></Link>
                        <Link to='/seller/link-to-razorpay/create-stakeholder' className={'mt-1 w-min text-nowrap duration-200' + ((seller.razorpay?.stakeholderId === '') ? ' text-blue-500 hover:text-black ' : ' ')} >2. Create a Stakeholder <span hidden={seller.razorpay?.stakeholderId === ''} className="text-green-600 font-bold">✓</span></Link>
                        <Link to='/seller/link-to-razorpay/request-route-configuration' className={'mt-1 w-min text-nowrap duration-200' + ((seller.razorpay?.routeconfigId === '') ? ' text-blue-500 hover:text-black ' : '  ')}>3. Request a Route Configuration <span hidden={seller.razorpay?.routeconfigId === ''} className="text-green-600 font-bold">✓</span></Link>
                        <Link to='/seller/link-to-razorpay/update-route-configuration' className={'mt-1 w-min text-nowrap duration-200' + ((seller.razorpay?.activationStatus !== 'activated') ? ' text-blue-500 hover:text-black ' : '  ')}>4. Update Route Configuration <span hidden={seller.razorpay?.activationStatus !== 'activated'} className="text-green-600 font-bold">✓</span></Link>
                    </div>
                    <div className='mt-6'>Note - Complete all the steps to link your account to Razorpay.</div>
                    {(seller.razorpay?.activationStatus !== 'activated') && <div className='border-2 border-red-600 sm:rounded-full rounded-3xl mt-8 px-10 sm:py-4 py-8 sm:flex-row flex-col flex justify-between sm:items-center'>
                        <div className='text-2xl font-semibold sm:mb-0 mb-4 '>Account not linked yet</div>
                        <button onClick={handleSendtoactivate} className='rounded-full bg-black text-white px-5 py-3 border-2 border-black hover:text-black hover:bg-white duration-200 active:scale-95 font-semibold w-min text-nowrap'>
                            {sendtoactivate}
                        </button>
                    </div>}
                    {(seller.razorpay?.activationStatus === 'activated') && <div className='border-2 border-green-600 sm:rounded-full rounded-3xl mt-8 px-10 sm:py-4 py-8 sm:flex-row flex-col flex justify-between sm:items-center'>
                        <div className='text-2xl font-semibold '>Account linked successfully!</div>
                    </div>}
                    <div className='border-2 border-black rounded-3xl mt-8 px-10 py-8 mb-[4rem]'>
                        <div className='font-semibold text-2xl mb-4'>Razorpay Details</div>
                        <div><span className='font-semibold mb-1'>Razorpay Email ID : </span>{(seller.razorpay?.email == undefined || seller.razorpay?.email === "") ? 'None' : seller.razorpay?.email}</div>
                        <div><span className='font-semibold mb-1'>Account ID : </span>{(seller.razorpay?.accountId === "") ? 'None' : seller.razorpay?.accountId}</div>
                        <div><span className='font-semibold mb-1'>Stakeholder ID : </span>{(seller.razorpay?.stakeholderId === "") ? 'None' : seller.razorpay?.stakeholderId}</div>
                        <div><span className='font-semibold mb-1'>Route Config ID : </span>{(seller.razorpay?.routeconfigId === "") ? 'None' : seller.razorpay?.routeconfigId}</div>
                        <div><span className='font-semibold mb-1'>Route Activation Status : </span>{(seller.razorpay?.activationStatus === "") ? 'Not Activated' : seller.razorpay?.activationStatus}</div>
                        <div><span className='font-semibold mb-1'>Beneficiary Name : </span>{(seller.razorpay?.beneficiary_name === "") ? 'None' : seller.razorpay?.beneficiary_name}</div>
                        <div><span className='font-semibold mb-1'>Account Number : </span>{(seller.razorpay?.account_number === "") ? 'None' : seller.razorpay?.account_number}</div>
                        <div><span className='font-semibold mb-1'>IFSC Code : </span>{(seller.razorpay?.ifsc_code === "") ? 'None' : seller.razorpay?.ifsc_code}</div>
                        <button hidden={seller.razorpay?.accountId === ""} ref={deletebuttonref} onClick={(e) => { deletebuttonclick(e) }} className='rounded-2xl bg-red-600 text-white px-5 py-3 border-2 border-red-600 hover:text-black hover:bg-white duration-200 active:scale-95 font-semibold w-min text-nowrap mt-6'>Delete your Linked Account</button>
                    </div>
                </div>
            </div>}
            {!issellerAuth && <div className="py-[4rem] flex justify-center items-center h-screen">
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

export default LinktoRazorpay;