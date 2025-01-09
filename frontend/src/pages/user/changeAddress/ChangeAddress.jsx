import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../../context/context';
//Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
//Components
import Notification from '../../../components/Notification';

const ChangeAddress = () => {

    const navigate = useNavigate();
    const { address, setaddress, isAuth, setisAuth, redirect, setisAddressChanged, backend_url } = useContext(AppContext);
    const [localAddress, setlocalAddress] = useState((address.pincode == '111111') ? '' : address.localAddress);
    const [landmark, setlandmark] = useState((address.pincode == '111111') ? '' : address.landmark);
    const [pincode, setpincode] = useState((address.pincode == '111111') ? '' : address.pincode);
    const [phone, setphone] = useState((address.pincode == '111111') ? '' : address.contact);
    const [state, setstate] = useState((address.pincode == '111111') ? '' : address.state);
    const [city, setcity] = useState((address.pincode == '111111') ? '' : address.city);
    const [isPopup, setisPopup] = useState(false);
    const [popupMessage, setpopupMessage] = useState(" ");
    const [loading, setloading] = useState(false);
    const [disable, setdisable] = useState(false);
    const [cities, setcities] = useState([]);

    //Input
    const changeLocalAddress = (e) => {
        const value = e.target.value;
        if (/^.{0,100}$/.test(value)) {
            setlocalAddress(value);
        }
        else {
            setpopupMessage("Local address cannot exceed 100 letters!!");
            setisPopup(true);
        };
    };

    const changeLandmark = (e) => {
        const value = e.target.value;
        if (/^.{0,100}$/.test(value)) {
            setlandmark(value);
        }
        else {
            setpopupMessage("Landmark cannot exceed 100 letters!!");
            setisPopup(true);
        };
    };

    const changeCity = (e) => {
        setcity(e.target.value);
    };

    const changepincode = (e) => {
        const value = e.target.value;
        if (/^\d{0,6}$/.test(value)) {
            setpincode(value);
        };
    };

    const changephone = (e) => {
        const value = e.target.value;
        if (/^\d{0,10}$/.test(value)) {
            setphone(value);
        };
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

    //Fetch state & city
    useEffect(() => {
        const fetchPlace = async () => {
            try {
                const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`, {
                    method: "GET",
                })
                const result = await response.json();
                // console.log(result);
                if (result[0].PostOffice != null) {
                    // console.log(result[0].PostOffice);
                    setcities(result[0].PostOffice);
                    setstate(result[0].PostOffice[0].State);
                    setdisable(false);
                }
                else {
                    setcities([]);
                };
            } catch (error) {
                setcities([]);
                setpopupMessage("PostalAPI not working!");
                setisPopup(true);
                setdisable(true);
                console.log(error);
            };
        };
        fetchPlace();
    }, [pincode]);

    //Change address
    const changeAddress = async (e) => {
        e.preventDefault();
        if (localAddress.trim() != "" && (pincode == cities[0]?.Pincode) && (cities.length != 0) && (phone?.length == 10)) {
            const data = {
                localAddress: localAddress,
                landmark: landmark,
                city: city,
                state: state,
                pincode: pincode,
                contact: phone,
            };
            try {
                setloading(true);
                const response = await fetch(`${backend_url}/api/users/update-address`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: 'include',
                    body: JSON.stringify(data),
                });
                const result = await response.json();
                // console.log(result);
                if (result.status == 200) {
                    setaddress(result.data.address);
                    setisAddressChanged(true);
                    handleback();
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
            }
            finally {
                setloading(false);
            };
        }
        else if (cities.length == 0) {
            setpopupMessage("Enter valid Pincode!");
            setisPopup(true);
        }
        else if (pincode != cities[0]?.Pincode) {
            setpopupMessage("Enter valid Pincode!");
            setisPopup(true);
        }
        else if (phone?.length != 10) {
            setpopupMessage("Phone number must have 10 digits!");
            setisPopup(true);
        }
        else {
            setpopupMessage("Please fill all the required details!");
            setisPopup(true);
        };
    };

    //Handle back
    const handleback = () => {
        navigate(redirect);
    };

    return (
        <>
            {isPopup && <Notification message={popupMessage} onexit={exitPopup} />}
            <div className='h-[4rem] flex sm:pl-4 border-b'>
                <div onClick={handleback} className='opacity-70 cursor-pointer hover:opacity-100 duration-200 '><FontAwesomeIcon className='w-8 h-8 m-4' icon={faArrowLeft} /></div>
                <div className='text-green-700 pt-3 font-bold text-4xl '>Botania</div>
            </div>
            <div className='mt-[3rem] flex justify-center items-center '>
                {isAuth && <div>
                    <div className='text-2xl font-bold my-2'>Change address: </div>
                    <form onSubmit={(e) => changeAddress(e)} className='flex flex-col border-2 border-green-700 p-4 rounded-xl'>
                        <div className='my-2'>Local Address:</div>
                        <input required className='bg-gray-100 p-3 rounded-lg outline-none sm:w-[26rem] w-[19rem]' type="text" placeholder='localAddress' value={localAddress} onChange={(e) => changeLocalAddress(e)} />
                        <div className='my-2'>{"Landmark " + "(" + "optional" + ")"}:</div>
                        <input className='bg-gray-100 p-3 rounded-lg outline-none sm:w-[26rem] w-[19rem]' type="text" placeholder='landmark' value={landmark} onChange={(e) => changeLandmark(e)} />
                        <div className='flex justify-between'>
                            <div className='mr-4 flex flex-col mb-4'>
                                <div className='my-2'>Pincode: {(cities.length == 0) ? <span className='text-red-600'>Invalid</span> : <span className='text-green-700'>Valid</span>}</div>
                                <input required className={((cities.length == 0) ? ' border-red-600 text-red-600 ' : ' border-green-700 ') + 'bg-gray-100 border-2 p-3 rounded-lg outline-none sm:w-[12.5rem] w-[9rem]'} type="text" pattern="\d{6}" maxLength={6} placeholder='pincode' value={pincode} onChange={(e) => changepincode(e)} />
                                <select disabled={cities.length == 0} required value={city} onChange={(e) => changeCity(e)} className='h-[3rem] mt-4 outline-none px-2 border-green-700 border-2 rounded-lg' name="city" id="city">
                                    <option value="" >Select a city</option>
                                    {cities && cities.map(((city, index) => {
                                        return <option key={index} value={city.Name}>{city.Name}</option>
                                    }))}
                                </select>
                            </div>
                            <div className='flex-col flex'>
                                <div className='my-2'>Phone: {(phone?.length < 10) ? <span className='text-red-600'>Must be 10 digits</span> : ''}</div>
                                <input required className={((phone?.length < 10) ? ' border-red-600 text-red-600 ' : ' border-green-700 ') + 'bg-gray-100 border-2 p-3 rounded-lg outline-none sm:w-[12.5rem] w-[9rem]'} type="text" pattern="\d{10}" maxLength={10} placeholder='phone' value={phone} onChange={(e) => changephone(e)} />
                                <input required className=' mt-4 bg-gray-100 p-3 rounded-lg outline-none sm:w-[12.5rem] w-[9rem]' type="text" placeholder='state' disabled value={state} readOnly />
                            </div>
                        </div>
                        <button disabled={disable} className='flex justify-center items-center bg-gradient-to-br from-red-400 via-pink-400 to-pink-200 py-3 rounded-lg font-bold text-white active:scale-95 duration-200 cursor-pointer' type="submit" >
                            {(loading) ? <img className='w-5 h-5 invert animate-spin' src="/loading.png" alt="" /> :
                                <div>CHANGE ADDRESS</div>}
                        </button>
                    </form>
                </div>}
                {!isAuth && <div className='border-2 border-green-700 rounded-xl p-6 '>
                    <div className='text-xl'>Please login to continue!</div>
                    <div className='flex justify-center mt-4'>
                        <button onClick={handleback} className='bg-green-700 rounded-lg text-white px-4 py-3 duration-200 active:scale-95'>Go back</button>
                    </div>
                </div>}
            </div>
        </>
    )
};

export default ChangeAddress;