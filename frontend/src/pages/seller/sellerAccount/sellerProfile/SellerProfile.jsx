import React, { useContext, useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../../../context/context';
//Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faHome, faLock, faRotateRight, faStar, faUser, faXmark } from '@fortawesome/free-solid-svg-icons';
//Components
import Notification from '../../../../components/Notification';
import Cropper from 'react-easy-crop';

const SellerProfile = () => {

    const navigate = useNavigate();
    const profilepictureref = useRef();
    const targetDivRef = useRef();
    const { setsellerredirect, issellerAuth, setissellerAuth, issellerAddressChanged, setissellerAddressChanged, backend_url } = useContext(AppContext);
    const [seller, setseller] = useState({});
    const [orderCount, setorderCount] = useState(0);
    const [isPopup, setisPopup] = useState(false);
    const [loading, setloading] = useState(true);
    const [error, seterror] = useState(false);
    const [popupMessage, setpopupMessage] = useState(" ");
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [cropPopup, setcropPopup] = useState(false);
    const [image, setImage] = useState(null);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [updateOption, setupdateOption] = useState("Brandname");
    const [brandnameinput, setbrandnameinput] = useState("");
    const [nameinput, setnameinput] = useState("");
    const [emailinput, setemailinput] = useState("");
    const [newpasswordinput, setnewpasswordinput] = useState("");
    const [confirmpasswordinput, setconfirmpasswordinput] = useState("");
    const [passwordinput, setpasswordinput] = useState("");

    //Update menu
    const updateBrandname = useCallback(() => {
        setupdateOption("Brandname");
    }, [setupdateOption]);

    const updateName = useCallback(() => {
        setupdateOption("Name");
    }, [setupdateOption]);

    const updateEmail = useCallback(() => {
        setupdateOption("Email");
    }, [setupdateOption]);

    const updatePassword = useCallback(() => {
        setupdateOption("Password");
    }, [setupdateOption]);

    //Inputs
    const changeBrandname = (e) => {
        const value = e.target.value;
        if (/^.{0,70}$/.test(value)) {
            setbrandnameinput(value);
        }
        else {
            setpopupMessage("Brandname cannot exceed 70 letters!!");
            setisPopup(true);
        };
    };

    const changeName = (e) => {
        const value = e.target.value;
        if (/^.{0,70}$/.test(value)) {
            setnameinput(value);
        }
        else {
            setpopupMessage("Name cannot exceed 70 letters!!");
            setisPopup(true);
        };
    };

    const changeEmail = (e) => {
        setemailinput(e.target.value);
    };

    const changeNewpassword = (e) => {
        setnewpasswordinput(e.target.value);
    };

    const changeConfirmpassword = (e) => {
        setconfirmpasswordinput(e.target.value);
    };

    const changePassword = (e) => {
        setpasswordinput(e.target.value);
    };

    //Handle address changed
    useEffect(() => {
        if (issellerAddressChanged) {
            setpopupMessage("Address changed succesfully!");
            setisPopup(true);
            setissellerAddressChanged(false);
        };
    }, []);

    //Handle change address
    const changeAddress = () => {
        setsellerredirect(window.location.pathname);
        navigate('/seller/change-address/');
    };

    //Handle update account
    const updateAccount = () => {
        updateBrandname();
        if (targetDivRef.current) {
            targetDivRef.current.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        };
    };

    //Link to Razorpay
    const linktoRazorpay = () => {
        if (seller.brandName === '') {
            setpopupMessage("Please add a Brandname!");
            setisPopup(true);
        }
        else if (seller.address?.pincode === '111111') {
            setpopupMessage("Please add your Address!");
            setisPopup(true);
        }
        else {
            navigate('/seller/link-to-razorpay/');
        };
    };

    //Handle gotologin
    const gotologin = () => {
        setsellerredirect(window.location.pathname);
        navigate('/seller/login-register');
    };

    //Handle reload
    const handlereload = () => {
        seterror(false);
        fetchProfile();
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

    //Handle crop cancel
    const handlecancel = () => {
        if (!loading && issellerAuth) {
            profilepictureref.current.value = "";
            setImage(null);
            setcropPopup(false);
        };
    };

    //Fetch profile details
    const fetchProfile = async () => {
        try {
            setloading(true);
            const response = await fetch(`${backend_url}/api/sellers/fetch-profile`, { method: 'POST' });
            const result = await response.json();
            if (result.status == 469) {
                // console.log(result.message);
                setpopupMessage(result.message);
                setisPopup(true);
                // localStorage.clear();
                setissellerAuth(false);
            }
            else if (result.status == 200) {
                setseller(result.data.seller);
                setorderCount(result.data.orderCount);
                // console.log(result.data);
            }
            else {
                console.log(result);
                seterror(true);
                setpopupMessage(result.message);
                setisPopup(true);
            };
        } catch (error) {
            seterror(true);
            setpopupMessage(result.message);
            setisPopup(true);
            console.log(error);
        } finally {
            setloading(false);
        };
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    //Profile pic selection and upload
    // This handles image file selection
    const onImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setImage(objectUrl);
        };
    };

    useEffect(() => {
        if (image) {
            setcropPopup(true);
        };
    }, [image]);

    // This is to capture the cropped image area
    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    // Function to handle the image upload after cropping
    const handleUpload = async () => {
        if (croppedAreaPixels) {
            setloading(true);
            const canvas = document.createElement('canvas');
            const img = new Image();
            img.src = image;

            img.onload = () => {
                // Get the cropped section from the image
                const ctx = canvas.getContext('2d');
                canvas.width = croppedAreaPixels.width;
                canvas.height = croppedAreaPixels.height;

                // Draw the cropped section onto the canvas
                ctx.drawImage(
                    img,
                    croppedAreaPixels.x,
                    croppedAreaPixels.y,
                    croppedAreaPixels.width,
                    croppedAreaPixels.height,
                    0,
                    0,
                    croppedAreaPixels.width,
                    croppedAreaPixels.height
                );

                // Convert the canvas to a Blob (base64 encoded string)
                canvas.toBlob(async (blob) => {
                    const formData = new FormData();
                    await formData.append('newProfilepicture', blob, `profilePicture_${Date.now()}.jpg`);
                    // console.log(formData);
                    try {
                        const response = await fetch(`${backend_url}/api/sellers/update-profilepicture`, {
                            method: 'POST',
                            body: formData,
                        });
                        const result = await response.json();
                        if (result.status == 200) {
                            // console.log(result);
                            // handlecancel();
                            setpopupMessage("Profile picture changed successfully!");
                            setisPopup(true);
                            fetchProfile();
                        }
                        else if (result.status == 469) {
                            // handlecancel();
                            setpopupMessage(result.message);
                            setisPopup(true);
                            // localStorage.clear();
                            setissellerAuth(false);
                        }
                        else {
                            setpopupMessage("Error while changing profile picture!");
                            setisPopup(true);
                            console.log(result);
                        };
                    } catch (error) {
                        console.log(error);
                        setpopupMessage(error.message);
                        setisPopup(true);
                    }
                    finally {
                        setloading(false);
                    };
                });
            };
        };
    };

    useEffect(() => {
        if (!loading && issellerAuth && !error) handlecancel();
    }, [loading, setloading]);

    //Handle logout
    const handleLogout = async (e) => {
        e.preventDefault();
        const response = await fetch(`${backend_url}/api/sellers/logout`, {
            method: "POST"
        })
            .then(res => res.json())
            .then(res => {
                // console.log(res);
            })
            .catch(error => {
                console.log(error);
            })
            .finally(() => {
                // localStorage.clear();
                setissellerAuth(false);
                gotologin();
            });
    };

    //Change brandname
    const handleupdateBrandname = async (e) => {
        e.preventDefault();
        if (brandnameinput.length < 4) {
            setpopupMessage("Brandname must contain atleast 4 lettrs!");
            setisPopup(true);
        }
        else if (brandnameinput !== "") {
            const data = {
                newBrandname: brandnameinput
            }
            try {
                setloading(true);
                const response = await fetch(`${backend_url}/api/sellers/update-brandname`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                })
                    .then(res => res.json())
                    .then(result => {
                        if (result.status == 200) {
                            setbrandnameinput("");
                            setpasswordinput("");
                            // console.log(result);
                            fetchProfile();
                            setpopupMessage("Brandname updated successfully!");
                            setisPopup(true);
                        }
                        else if (result.status == 469) {
                            setpopupMessage(result.message);
                            setisPopup(true);
                            // localStorage.clear();
                            setissellerAuth(false);
                        }
                        else {
                            setpopupMessage(result.message);
                            setisPopup(true);
                            console.log(result);
                        }
                    });
            } catch (error) {
                console.log(error);
                setpopupMessage(error.message);
                setisPopup(true);
            }
            finally {
                setloading(false);
            };
        }
        else {
            setpopupMessage("Please fill all the required fields!");
            setisPopup(true);
            console.log("Please fill required fields");
        };
    };

    //Change name
    const handleupdateName = async (e) => {
        e.preventDefault();
        if (nameinput !== "") {
            const data = {
                newName: nameinput
            };
            try {
                setloading(true);
                const response = await fetch(`${backend_url}/api/sellers/update-name`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                })
                    .then(res => res.json())
                    .then(result => {
                        if (result.status == 200) {
                            setnameinput("");
                            setpasswordinput("");
                            // console.log(result);
                            fetchProfile();
                            setpopupMessage("Name updated successfully!");
                            setisPopup(true);
                        }
                        else if (result.status == 469) {
                            setpopupMessage(result.message);
                            setisPopup(true);
                            // localStorage.clear();
                            setissellerAuth(false);
                        }
                        else {
                            console.log(result);
                            setpopupMessage(result.message);
                            setisPopup(true);
                        };
                    });
            } catch (error) {
                console.log(error);
                setpopupMessage(error.message);
                setisPopup(true);
            }
            finally {
                setloading(false);
            };
        }
        else {
            setpopupMessage("Please fill all the required fields!");
            setisPopup(true);
            console.log("Please fill required fields");
        };
    };

    //Change email
    const handleupdateEmail = async (e) => {
        e.preventDefault();
        if (emailinput !== "" && passwordinput !== "") {
            const data = {
                newEmail: emailinput,
                password: passwordinput,
            };
            try {
                setloading(true);
                const response = await fetch(`${backend_url}/api/sellers/update-email`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                })
                    .then(res => res.json())
                    .then(result => {
                        if (result.status == 200) {
                            setemailinput("");
                            setpasswordinput("");
                            // console.log(result);
                            fetchProfile();
                            setpopupMessage("Email updated successfully!");
                            setisPopup(true);
                        }
                        else if (result.status == 469) {
                            setpopupMessage(result.message);
                            setisPopup(true);
                            // localStorage.clear();
                            setissellerAuth(false);
                        }
                        else {
                            console.log(result);
                            setpopupMessage(result.message);
                            setisPopup(true);
                        };
                    });
            } catch (error) {
                console.log(error);
                setpopupMessage(error.message);
                setisPopup(true);
            }
            finally {
                setloading(false);
            };
        }
        else {
            setpopupMessage("Please fill all the required fields!");
            setisPopup(true);
            console.log("Please fill required fields");
        };
    };

    //Change password
    const handleupdatePassword = async (e) => {
        e.preventDefault();
        if (newpasswordinput !== "" && passwordinput !== "" && confirmpasswordinput !== "") {
            if (newpasswordinput !== confirmpasswordinput) {
                setpopupMessage("New password and confirm new password fields are not matching!");
                setisPopup(true);
                return;
            };
            const data = {
                newPassword: newpasswordinput,
                password: passwordinput,
            };
            try {
                setloading(true);
                const response = await fetch(`${backend_url}/api/sellers/update-password`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                })
                    .then(res => res.json())
                    .then(result => {
                        if (result.status == 200) {
                            setnewpasswordinput("");
                            setconfirmpasswordinput("");
                            setpasswordinput("");
                            // console.log(result);
                            fetchProfile();
                            setpopupMessage("Password updated successfully!");
                            setisPopup(true);
                        }
                        else if (result.status == 469) {
                            setpopupMessage(result.message);
                            setisPopup(true);
                            // localStorage.clear();
                            setissellerAuth(false);
                        }
                        else {
                            setpopupMessage(result.message);
                            setisPopup(true);
                            console.log(result);
                        };
                    });
            } catch (error) {
                console.log(error);
                setpopupMessage(error.message);
                setisPopup(true);
            }
            finally {
                setloading(false);
            };
        }
        else {
            setpopupMessage("Please fill all the required fields!");
            setisPopup(true);
            console.log("Please fill required fields");
        };
    };

    //Handle Account activation
    const handlerequestAccountActivation = () => {
        if (seller.brandName === '') {
            setpopupMessage("Enter a Brandname!");
            setisPopup(true);
        }
        else if (seller.address?.pincode === '111111') {
            setpopupMessage("Add your address!");
            setisPopup(true);
        }
        else if (seller.razorpay.activationStatus !== 'activated') {
            setpopupMessage("Link your account to razorpay!");
            setisPopup(true);
        }
        else {
            requestAccountActivation();
        };
    };

    const requestAccountActivation = async () => {
        try {
            setloading(true);
            const response = await fetch(`${backend_url}/api/sellers/request-account-activation`, { method: "POST" });
            const result = await response.json();
            if (result.status == 200) {
                setpopupMessage("Account activated succesfully!");
                setisPopup(true);
                fetchProfile();
            }
            else if (result.status == 469) {
                setpopupMessage(result.message);
                setisPopup(true);
                // localStorage.clear();
                setissellerAuth(false);
            }
            else {
                console.log(result);
                setpopupMessage(result.message);
                setisPopup(true);
            };
        } catch (error) {
            console.log(error);
            setpopupMessage(error.message);
            setisPopup(true);
        } finally {
            setloading(false);
            fetchProfile();
        };
    };

    return (
        <>
            {isPopup && <Notification message={popupMessage} onexit={exitPopup} />}
            {cropPopup && <div className='fixed z-[70] flex justify-center items-center w-screen h-screen top-0 right-0'>
                <div className='flex justify-between items-center flex-col w-[40rem] h-[35rem] mx-2 bg-black rounded-2xl relative'>
                    <div className='ml-auto mb-2'>
                        <FontAwesomeIcon onClick={handlecancel} className='m-4 cursor-pointer duration-200 hover:text-red-600 p-2 flex-grow text-white h-6 w-6' icon={faXmark} />
                    </div>
                    <div className='flex flex-col justify-center items-center mb-20'>
                        {/* Display Cropper if an image is selected */}
                        <div className="relative w-[20rem] h-[20rem] ">
                            <Cropper
                                image={image}
                                crop={crop}
                                zoom={zoom}
                                aspect={1 / 1}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                            />
                        </div>
                        <button disabled={loading} className="my-3 flex justify-center items-center w-[12rem] py-2 rounded-md bg-green-700 text-white hover:bg-green-800 duration-200" onClick={handleUpload}>
                            {(loading) ? <img className='w-5 h-5 invert animate-spin' src="/loading.png" alt="" /> :
                                <div>Upload Cropped Image </div>}
                        </button>
                        <button className="my-1 px-3 py-2 rounded-md bg-red-400 text-white hover:bg-red-600 duration-200 " disabled={loading} onClick={handlecancel}> Cancel upload</button>
                    </div>
                </div>
            </div>}
            {issellerAuth && !loading && !error && <div className={'py-[4rem] flex justify-center mx-2 sm:mx-0 duration-300' + ((cropPopup) ? ' blur-sm ' : '')}>
                <div className='md:w-[50rem] sm:w-[37rem]'>
                    <div className='flex sm:mx-4 sm:mt-8 mt-4 items-center bg-gray-100 rounded-full py-4 md:px-0 px-4'>
                        <div className='sm:mx-8 mx-2 flex-shrink-0'>
                            <img className='drop-shadow-lg hover:scale-105 duration-300 md:w-[8rem] sm:w-[5rem] sm:h-[5rem] h-[4rem] w-[4rem] md:h-[8rem] object-cover rounded-full' src={seller.profilePicture} />
                        </div>
                        <div className='sm:text-base text-[12px] pr-8'>
                            {(seller.brandName !== '') && <div className='mb-1'><span className='font-semibold'>Brandname : </span>{seller.brandName}</div>}
                            <div className=''><span className='font-semibold'>Name : </span>{seller.name}</div>
                            <div><span className='font-semibold'>Email : </span>{seller.email}</div>
                        </div>
                    </div>
                    <div className='flex md:justify-end justify-center items-center mt-4 text-sm sm:text-base'>
                        <div className=''>
                            <input disabled={loading} ref={profilepictureref} onChange={(e) => { onImageChange(e) }} type='file' accept='image/*' id='profileimage' className='hidden'></input>
                            <label disabled={loading} htmlFor="profileimage" className={((loading) ? ' text-gray-400 ' : ' bg-green-700 text-white hover:bg-white border-green-700 hover:text-black') + ' cursor-pointer  md:px-5 px-3 md:py-3 py-2 rounded-xl  duration-200 border-2 ml-4  mt-2 active:scale-95 mr-3'}>Change profile picture</label>
                        </div>
                        <button disabled={loading} onClick={handleLogout} className='md:px-5 px-3 md:py-3 py-2 rounded-xl bg-red-400 duration-300 active:scale-105 border-2 border-red-400 hover:border-red-600 hover:bg-red-600 text-white mx-4 '>Log out</button>
                    </div>
                    <div className='flex justify-between bg-gray-100 rounded-full items-center sm:px-10 px-8 sm:mx-4 py-4 mt-4'>
                        <div className='flex justify-center items-center flex-col'>
                            <div className='bg-green-600 hover:scale-105 duration-300 cursor-pointer text-white rounded-full md:w-[6rem] md:h-[6rem] sm:w-[5rem] w-[4rem] h-[4rem] sm:h-[5rem] mb-2 flex justify-center items-center drop-shadow-lg text-sm sm:text-xl'>
                                <div className='flex items-center justify-center'>
                                    <div>{seller.averageRating}</div>
                                    <FontAwesomeIcon className='sm:w-4 sm:h-4 w-3 h-3 pt-[1px]' icon={faStar} />
                                </div>
                            </div>
                            <div className='text-sm sm:text-base'>Rating</div>
                        </div>
                        <div className='flex justify-center items-center flex-col sm:mx-8'>
                            <div className='bg-yellow-300 hover:scale-105 duration-300 cursor-pointer rounded-full md:w-[6rem] md:h-[6rem] sm:w-[5rem] w-[4rem] h-[4rem] sm:h-[5rem] mb-2 flex justify-center items-center  drop-shadow-lg text-sm sm:text-xl'>{orderCount}</div>
                            <div className='text-sm sm:text-base'>Orders</div>
                        </div>
                        <div className='flex justify-center items-center flex-col'>
                            <div className='rounded-full hover:scale-105 duration-300 cursor-pointer md:w-[6rem] md:h-[6rem] sm:w-[5rem] w-[4rem] h-[4rem] sm:h-[5rem] mb-2 flex justify-center items-center bg-white drop-shadow-lg text-sm sm:text-xl'>{seller.products?.length}</div>
                            <div className='text-sm sm:text-base'>Products</div>
                        </div>
                    </div>
                    {(seller.activated == false) && <div className='sm:mx-4 border-2 border-red-600 rounded-3xl sm:px-16 px-10 mt-6'>
                        <div className='font-bold text-2xl mt-6 mb-2'>Activation required</div>
                        <div>Your account is not activated. Without activation, you cannot sell products. Please complete the following to activate your account - </div>
                        <div className='pl-4 mt-2 mb-2 flex flex-col'>
                            <button onClick={updateAccount} disabled={loading || (seller.brandName !== '')} className={'w-min text-nowrap  hover:text-black ' + ((seller.brandName === '') ? ' text-blue-500 ' : '')}>1. Enter Brandname <span hidden={seller.brandName === ''} className="text-green-600 font-bold">✓</span></button>
                            <button disabled={loading || (seller.address?.pincode !== '111111')} onClick={changeAddress} className={'w-min text-nowrap hover:text-black my-2' + ((seller.address?.pincode === '111111') ? ' text-blue-500 ' : ' ')}>2. Add Address <span hidden={seller.address?.pincode === '111111'} className="text-green-600 font-bold">✓</span></button>
                            <button onClick={linktoRazorpay} disabled={loading || (seller.razorpay.activationStatus === 'activated')} className={'w-min text-nowrap ' + ((seller.razorpay.activationStatus !== 'activated') ? '  text-blue-500 hover:text-black mb-6' : " ")}>3. Link to Razorpay <span hidden={seller.razorpay.activationStatus !== 'activated'} className="text-green-600 font-bold">✓</span></button>
                        </div>
                        {(seller.brandName !== '') && (seller.address?.pincode !== '111111') && (seller.razorpay.activationStatus === 'activated') && <button onClick={handlerequestAccountActivation} className='mb-6 px-5 py-3 bg-green-700 text-white font-semibold rounded-xl duration-300 hover:bg-green-800 active:scale-95'>Request account activation</button>}
                    </div>}
                    {(seller.activated == true) && <div className='sm:mx-4 border-2 border-green-700 rounded-3xl sm:px-16 px-10 mt-6'>
                        <div className='font-semibold text-2xl py-6'>Account Activated Successfully!</div>
                    </div>}
                    <div ref={targetDivRef} className='sm:mx-4 mt-6 border-2 border-green-700 rounded-3xl flex flex-col'>
                        <div className='sm:px-6 px-4 sm:pt-6 pt-4'>
                            <button disabled={loading} onClick={updateBrandname} className={'border-green-700 border-2 duration-200 px-4 py-2 rounded-xl mr-4 mb-4' + ((updateOption == 'Brandname') ? ' bg-white hover:bg-white text-black ' : ' hover:bg-green-50 hover:text-black bg-green-700 text-white ')}>Update brandname</button>
                            <button disabled={loading} onClick={updateName} className={'border-green-700 border-2 duration-200 px-4 py-2 rounded-xl mr-4 mb-4' + ((updateOption == 'Name') ? ' bg-white hover:bg-white text-black ' : ' hover:bg-green-50 hover:text-black bg-green-700 text-white ')}>Update name</button>
                            <button disabled={loading} onClick={updateEmail} className={'border-green-700 border-2 duration-200 px-4 py-2 rounded-xl mr-4 mb-4' + ((updateOption == 'Email') ? ' bg-white hover:bg-white text-black ' : ' hover:bg-green-50 hover:text-black bg-green-700 text-white ')}>Update email</button>
                            <button disabled={loading} onClick={updatePassword} className={'border-green-700 border-2 duration-200 px-4 py-2 rounded-xl mr-4 mb-4' + ((updateOption == 'Password') ? ' bg-white hover:bg-white text-black ' : ' hover:bg-green-50 hover:text-black bg-green-700 text-white ')}>Update password</button>
                        </div>
                        {(updateOption == 'Brandname') &&
                            <form onSubmit={(e) => handleupdateBrandname(e)} className='sm:m-6 m-4 sm:mt-0 mt-0 p-6 bg-gray-200 rounded-xl'>
                                <div>Enter new brandname : </div>
                                <div className='mt-2 mb-4 bg-gray-50 outline-none rounded-xl flex items-center w-fit'>
                                    <FontAwesomeIcon className='p-3' icon={faHome} />
                                    <input disabled={loading} required className='bg-gray-50 outline-none rounded-xl pr-3 py-2' type="text" name='Brandname' placeholder='Brandname' value={brandnameinput} onChange={changeBrandname} />
                                </div>
                                <input disabled={loading} className='bg-green-700 text-white px-3 py-2 rounded-xl cursor-pointer active:scale-95 hover:bg-green-50 hover:text-black duration-200 border-2 border-green-700' type="submit" value={(loading) ? 'Updating' : "Update brandname"} />
                            </form>
                        }
                        {(updateOption == 'Name') &&
                            <form onSubmit={(e) => handleupdateName(e)} className='sm:m-6 m-4 sm:mt-0 mt-0 p-6 bg-gray-200 rounded-xl'>
                                <div>Enter new name : </div>
                                <div className='mt-2 mb-4 bg-gray-50 outline-none rounded-xl flex items-center w-fit'>
                                    <FontAwesomeIcon className='p-3' icon={faUser} />
                                    <input disabled={loading} required className='bg-gray-50 outline-none rounded-xl pr-3 py-2' type="text" name='Name' placeholder='Name' value={nameinput} onChange={changeName} />
                                </div>
                                <input disabled={loading} className='bg-green-700 text-white px-3 py-2 rounded-xl cursor-pointer active:scale-95 hover:bg-green-50 hover:text-black duration-200 border-2 border-green-700' type="submit" value={(loading) ? 'Updating' : "Update name"} />
                            </form>
                        }
                        {(updateOption == 'Email') &&
                            <form onSubmit={(e) => handleupdateEmail(e)} className='sm:m-6 m-4 sm:mt-0 mt-0 p-6 bg-gray-200 rounded-xl'>
                                <div>Enter new email address : </div>
                                <div className='mt-2 mb-4 bg-gray-50 outline-none rounded-xl flex items-center w-fit'>
                                    <FontAwesomeIcon className='p-3' icon={faEnvelope} />
                                    <input disabled={loading} required className='bg-gray-50 outline-none rounded-xl pr-3 py-2' type="email" name='Email' placeholder='Email address' value={emailinput} onChange={changeEmail} />
                                </div>
                                <div>Enter password : </div>
                                <div className='mt-2 mb-6 bg-gray-50 outline-none rounded-xl flex items-center w-fit'>
                                    <FontAwesomeIcon className='p-3' icon={faLock} />
                                    <input disabled={loading} required className='bg-gray-50 outline-none rounded-xl pr-3 py-2' type="password" name='Old password' placeholder='Password' value={passwordinput} onChange={changePassword} />
                                </div>
                                <input disabled={loading} className='bg-green-700 text-white px-3 py-2 rounded-xl cursor-pointer active:scale-95 hover:bg-green-50 hover:text-black duration-200 border-2 border-green-700' type="submit" value={(loading) ? 'Updating' : "Update email"} />
                            </form>
                        }
                        {(updateOption == "Password") &&
                            <form onSubmit={(e) => handleupdatePassword(e)} className='sm:m-6 m-4 sm:mt-0 mt-0 p-6 bg-gray-200 rounded-xl'>
                                <div>Enter new password : </div>
                                <div className='mt-2 mb-4 bg-gray-50 outline-none rounded-xl flex items-center w-fit'>
                                    <FontAwesomeIcon className='p-3' icon={faLock} />
                                    <input disabled={loading} required className='bg-gray-50 outline-none rounded-xl pr-3 py-2' type="password" name='new password' placeholder='New password' value={newpasswordinput} onChange={changeNewpassword} />
                                </div>
                                <div>Confirm new password : </div>
                                <div className={((newpasswordinput === confirmpasswordinput) ? ' bg-gray-50 ' : ' bg-red-200') + ' mt-2 mb-4 outline-none rounded-xl flex items-center w-fit'}>
                                    <FontAwesomeIcon className='p-3' icon={faLock} />
                                    <input disabled={loading} required className={((newpasswordinput === confirmpasswordinput) ? ' bg-gray-50 ' : ' bg-red-200 placeholder:text-red-400') + ' outline-none rounded-xl pr-3 py-2 '} type="password" name='confirm new password' placeholder='Confirm new password' value={confirmpasswordinput} onChange={changeConfirmpassword} />
                                </div>
                                <div>Enter current password : </div>
                                <div className='mt-2 mb-6 bg-gray-50 outline-none rounded-xl flex items-center w-fit'>
                                    <FontAwesomeIcon className='p-3' icon={faLock} />
                                    <input disabled={loading} required className='bg-gray-50 outline-none rounded-xl pr-3 py-2' type="password" name='Old password' placeholder='Current Password' value={passwordinput} onChange={changePassword} />
                                </div>
                                <input disabled={loading} className='bg-green-700 text-white px-3 py-2 rounded-xl cursor-pointer active:scale-95 hover:bg-green-50 hover:text-black duration-200 border-2 border-green-700' type="submit" value={(loading) ? 'Updating' : "Update password"} />
                            </form>
                        }
                    </div>
                    <div className='border-2 border-black p-6 rounded-3xl sm:px-16 px-10 sm:mx-4 mt-6'>
                        <div className='font-bold text-lg mb-2'>Razorpay</div>
                        <div>Razorpay email ID : {(seller.razorpay?.email == undefined || seller.razorpay?.email === "") ? 'None' : seller.razorpay?.email}</div>
                        <div>Account ID : {(seller.razorpay?.accountId === "") ? 'None' : seller.razorpay?.accountId}</div>
                        <div>Route Activation status : {(seller.razorpay?.activationStatus !== "") ? seller.razorpay?.activationStatus : 'Not activated'}</div>
                        <div>Beneficiary Name : {(seller.razorpay?.beneficiary_name !== "") ? seller.razorpay?.beneficiary_name : 'None'}</div>
                        <div>Account Number : {(seller.razorpay?.account_number !== "") ? seller.razorpay?.account_number : 'None'}</div>
                        <div>IFSC Code : {(seller.razorpay?.ifsc_code !== "") ? seller.razorpay?.ifsc_code : 'None'}</div>
                        <button onClick={linktoRazorpay} disabled={loading} className='active:scale-95 text-white bg-gray-800 px-4 py-3 rounded-lg hover:bg-black duration-300 mt-4'>Link to Razorpay</button>
                    </div>
                    {(seller.address?.pincode !== '111111') && <div className='bg-gray-100 mb-6 p-6 rounded-3xl sm:px-16 px-10 sm:mx-4 mt-6'>
                        <div className='font-semibold text-lg mb-2'>My Address :</div>
                        <div>{seller.address?.localAddress + ((seller.address?.landmark !== "") ? (', ' + seller.address?.landmark) : "") + ", " + seller.address?.city + ", " + seller.address?.state}</div>
                        <div className='mt-2'>PIN: {seller.address?.pincode} Contact: {seller.address?.contact}</div>
                        <button onClick={changeAddress} disabled={loading} className=' mt-4 active:scale-95 bg-green-700 px-4 py-3 text-white duration-300 hover:bg-green-800 rounded-lg'>Change address</button>
                    </div>}
                    {(seller.address?.pincode === '111111') && <div className='bg-gray-100 mb-6 p-6 rounded-3xl sm:px-16 px-10 sm:mx-4 mt-6'>
                        <div className='font-semibold text-lg'>My Address :</div>
                        <button onClick={changeAddress} disabled={loading} className=' mt-4 active:scale-95 bg-green-700 px-4 py-3 text-white duration-300 hover:bg-green-800 rounded-lg'>Add address</button>
                    </div>}
                </div>
            </div >}
            {
                !issellerAuth && <div className="py-[4rem] flex justify-center items-center h-screen">
                    <div className='backdrop-blur-sm shadow-lg mx-2 text-gray-800 bg-white/50 py-8 px-12 rounded-xl'>
                        <div className='text-2xl text-center my-2'>Please login to continue!</div>
                        <div className='flex justify-center items-center'><button onClick={gotologin} className='hover:scale-105 text-xl backdrop-blur-sm my-2 mx-7 px-4 py-3 rounded-md bg-green-700/60 hover:bg-green-700/80 text-white duration-200'>Log in</button></div>
                    </div>
                    <div className='-z-10 absolute top-0 overflow-hidden'><img className=' h-screen w-screen object-cover' src="/Flowers1.jpg" alt="" /></div>
                </div>
            }
            {
                error && <div className="py-[4rem] flex justify-center items-center h-screen">
                    <div className='backdrop-blur-sm shadow-lg mx-2 text-gray-800 bg-white/50 py-8 px-12 rounded-xl'>
                        <div className='text-2xl text-center my-2'>An error occured while loading profile!</div>
                        <div className='flex justify-center items-center'><button onClick={handlereload} className='hover:scale-105 text-xl backdrop-blur-sm my-2 mx-7 px-4 py-3 rounded-md bg-green-700/60 hover:bg-green-700/80 text-white duration-200'><FontAwesomeIcon className='mr-2' icon={faRotateRight} />Refresh</button></div>
                    </div>
                    <div className='-z-10 absolute top-0 overflow-hidden'><img className=' h-screen w-screen object-cover' src="/Flowers3.jpg" alt="" /></div>
                </div>
            }
            {
                loading && <div className='py-[4rem] flex justify-center items-center h-screen'>
                    <img className='h-[10rem] w-[10rem] animate-spin' src="/loading.png" alt="" />
                </div>
            }
        </>
    )
};

export default SellerProfile;