import React, { useContext, useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../../../context/context';
import Cropper from 'react-easy-crop';
//Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faUser, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
//Components
import Notification from '../../../../components/Notification';

const Profile = () => {

    const navigate = useNavigate();
    const { setisAuth, isAuth, name, setname, email, setemail, profilePicture, setprofilePicture, address, setredirect, isAddressChanged, setisAddressChanged, backend_url } = useContext(AppContext);
    const profilepictureref = useRef();
    const [updateOption, setupdateOption] = useState("Name");
    const [nameinput, setnameinput] = useState("");
    const [emailinput, setemailinput] = useState("");
    const [newpasswordinput, setnewpasswordinput] = useState("");
    const [confirmpasswordinput, setconfirmpasswordinput] = useState("");
    const [passwordinput, setpasswordinput] = useState("");
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [cropPopup, setcropPopup] = useState(false);
    const [image, setImage] = useState(null);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [loading, setloading] = useState(false);
    const [isPopup, setisPopup] = useState(false);
    const [popupMessage, setpopupMessage] = useState(" ");

    //Update menu
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

    //Handle login
    const gotologin = () => {
        setredirect(window.location.pathname);
        navigate("/user/login-register");
    };

    //Handle crop cancel
    const handlecancel = () => {
        if (!loading) {
            profilepictureref.current.value = "";
            setImage(null);
            setcropPopup(false);
        }
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

    //Handle change address
    useEffect(() => {
        if (isAddressChanged) {
            setpopupMessage("Address changed succesfully!!");
            setisPopup(true);
            setisAddressChanged(false);
        };
    }, []);

    //Handle logout
    const handleLogout = async (e) => {
        e.preventDefault();
        const response = await fetch(`${backend_url}/api/users/logout`, {
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
                setisAuth(false);
                gotologin();
            });
    };

    //Change name
    const handleupdateName = async (e) => {
        e.preventDefault();
        if (nameinput !== "") {
            const data = {
                newName: nameinput,
            };
            try {
                setloading(true);
                const response = await fetch(`${backend_url}/api/users/update-name`, {
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
                            setname(result.data.name);
                            setpopupMessage("Name changed successfully!");
                            setisPopup(true);
                        }
                        else if (result.status == 469) {
                            setpopupMessage(result.message);
                            setisPopup(true);
                            // localStorage.clear();
                            setisAuth(false);
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
                const response = await fetch(`${backend_url}/api/users/update-email`, {
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
                            setemail(result.data.email);
                            setpopupMessage("Email changed successfully!");
                            setisPopup(true);
                        }
                        else if (result.status == 469) {
                            setpopupMessage(result.message);
                            setisPopup(true);
                            // localStorage.clear();
                            setisAuth(false);
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
                const response = await fetch(`${backend_url}/api/users/update-password`, {
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
                            setpopupMessage("Password changed successfully!");
                            setisPopup(true);
                        }
                        else if (result.status == 469) {
                            setpopupMessage(result.message);
                            setisPopup(true);
                            // localStorage.clear();
                            setisAuth(false);
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

    //Change address
    const changeAddress = () => {
        setredirect(window.location.pathname);
        navigate("/user/change-address");
    };

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
        }
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
                        const response = await fetch(`${backend_url}/api/users/update-profilepicture`, {
                            method: 'POST',
                            body: formData,
                        });
                        const result = await response.json();
                        if (result.status == 200) {
                            // console.log(result);
                            setprofilePicture(result.data.profilePicture);
                            setpopupMessage("Profile picture changed successfully!");
                            setisPopup(true);
                            handlecancel();
                        }
                        else if (result.status == 469) {
                            handlecancel();
                            setpopupMessage(result.message);
                            setisPopup(true);
                            // localStorage.clear();
                            setisAuth(false);
                        }
                        else {
                            setpopupMessage(result.message);
                            setisPopup(true);
                            console.log(result);
                        };
                    } catch (error) {
                        console.error(error);
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

    return (
        <>
            {cropPopup && <div className='fixed z-[100] flex justify-center items-center w-screen h-screen top-0 right-0'>
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
                            {(loading) ? <img className='w-5 h-5 invert animate-spin' src="./loading.png" alt="" /> :
                                <div>Upload Cropped Image </div>}
                        </button>
                        <button className="my-1 px-3 py-2 rounded-md bg-red-400 text-white hover:bg-red-600 duration-200 " disabled={loading} onClick={handlecancel}> Cancel upload</button>
                    </div>
                </div>
            </div>}
            {isPopup && <Notification message={popupMessage} onexit={exitPopup} />}
            <div className='overflow-auto flex-1 flex-col items-center'>
                {isAuth ? <>
                    <div className={'lg:mx-20 sm:mx-10 mx-2 duration-300' + ((cropPopup) ? ' blur-sm ' : ' ')}>
                        <div className='font-bold pb-2 mt-6'>Profile info:</div>
                        <div className='bg-gray-100 flex flex-wrap items-center rounded-xl sm:p-10 p-4 box-border'>
                            <div className='overflow-hidden sm:h-[6rem] h-20 w-20 sm:w-[6rem] rounded-full my-2'>
                                <img className='hover:scale-105 object-cover duration-500 sm:h-[6rem] sm:w-[6rem]' src={profilePicture ? profilePicture : './user.png'}></img>
                            </div>
                            <div className='px-4 my-2'>
                                <div className='pb-2'>{name &&
                                    <div className='font-bold sm:text-base text-sm text-nowrap'>Name: <span className='font-normal'>{name}</span></div>
                                }</div>
                                <div>{email &&
                                    <div className='font-bold sm:text-base text-sm text-nowrap'>Email: <span className='font-normal'>{email}</span></div>
                                }</div>
                            </div>
                        </div>
                        <div className='flex items-center sm:justify-end justify-center'>
                            <div className=''>
                                <input disabled={loading} ref={profilepictureref} onChange={(e) => { onImageChange(e) }} type='file' accept='image/*' id='profileimage' className='hidden'></input>
                                <label disabled={loading} htmlFor="profileimage" className={((loading) ? ' text-gray-400 ' : ' bg-green-700 text-white hover:bg-white border-green-700 hover:text-black') + ' cursor-pointer my-3 px-3 py-2 rounded-md  duration-200 border-2  mt-2 active:scale-95 mr-3'}>Change profile picture</label>
                            </div>
                            <button className='my-3 px-3 py-2 rounded-md border-2 border-red-400 hover:border-red-600 bg-red-400 text-white hover:bg-red-600 duration-200 mt-2 active:scale-95' onClick={handleLogout}>Log out</button>
                        </div>
                    </div>
                    <div className='lg:mx-20 sm:mx-10 mx-2 border-2 border-green-700 rounded-xl flex flex-col'>
                        <div className='sm:px-6 px-4 sm:pt-6 pt-4 '>
                            <button disabled={loading} onClick={updateName} className={'border-green-700 border-2 duration-200 px-4 py-2 rounded-xl mr-4 mb-4' + ((updateOption == 'Name') ? ' bg-white hover:bg-white text-black ' : ' hover:bg-green-50 hover:text-black bg-green-700 text-white ')}>Update name</button>
                            <button disabled={loading} onClick={updateEmail} className={'border-green-700 border-2 duration-200 px-4 py-2 rounded-xl mr-4 mb-4' + ((updateOption == 'Email') ? ' bg-white hover:bg-white text-black ' : ' hover:bg-green-50 hover:text-black bg-green-700 text-white ')}>Update email</button>
                            <button disabled={loading} onClick={updatePassword} className={'border-green-700 border-2 duration-200 px-4 py-2 rounded-xl mr-4 mb-4' + ((updateOption == 'Password') ? ' bg-white hover:bg-white text-black ' : ' hover:bg-green-50 hover:text-black bg-green-700 text-white ')}>Update password</button>
                        </div>
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
                    <div className='lg:mx-20 sm:mx-10 mx-2 mb-10'>
                        <div className='font-bold pb-2 mt-6'>My Address:</div>
                        <div className='bg-gray-100 flex flex-col rounded-xl sm:px-10 sm:py-8 p-4 box-border'>
                            {(address.pincode !== '111111') && <div className='flex my-2 border-b-2 bg-white border-l-2 border-gray-200 p-4 rounded-lg'>
                                <div className='sm:mr-6 sm:ml-4 mx-2 mt-1'><FontAwesomeIcon className='sm:h-[2rem] sm:w-[2rem] h-8 w-8 text-red-600' icon={faLocationDot} /></div>
                                <div className='text-ellipsis ml-4'>
                                    <div className='text-sm sm:text-base text-gray-500'>{address?.localAddress + ((address?.landmark !== "") ? (', ' + address?.landmark) : "") + ", " + address?.city + ", " + address?.state}</div>
                                    <div className='text-sm sm:text-base text-gray-500 mr-2'><span className='font-semibold'>Phone:</span> {address?.contact} <span className='font-semibold'>PIN:</span> {address?.pincode}</div>
                                </div>
                            </div>}
                            <div className='sm:mb-4 my-4 flex'>
                                <button onClick={changeAddress} className='px-3 py-2 rounded-md bg-green-700 text-white hover:bg-green-800 duration-200 active:scale-95 '>{((address.pincode == '111111') ? "Add address" : "Update address")}</button>
                            </div>
                        </div>
                    </div> </> : <div className='flex justify-center items-center h-full'>
                    <div className='backdrop-blur-sm shadow-lg mx-2 text-gray-800 bg-white/50 py-8 px-12 rounded-xl'>
                        <div className='text-2xl text-center my-2'>Please login to continue!</div>
                        <div className='flex justify-center items-center'><button onClick={gotologin} className='hover:scale-105 text-xl backdrop-blur-sm my-2 mx-7 px-4 py-3 rounded-md bg-green-700/60 hover:bg-green-700/80 text-white duration-200'>Log in</button></div>
                    </div>
                    <div className='-z-10 absolute top-0 overflow-hidden'><img className=' h-screen w-screen object-cover' src="./Flowers1.jpg" alt="" /></div>
                </div>}
            </div>
        </>
    )
};

export default Profile;