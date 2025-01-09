import React, { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../../../../context/context';
//Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateRight, faArrowLeft, faArrowRight, faLocationDot, faXmark, faStar } from '@fortawesome/free-solid-svg-icons';
//Components
import Cropper from 'react-easy-crop';
import Notification from '../../../../../components/Notification';

const AddProduct = () => {

    const navigate = useNavigate();
    const addimageref = useRef();
    const discardPopupmenuref = useRef();
    const addPopupmenuref = useRef();
    const discardbuttonref = useRef();
    const addbuttonref = useRef();
    const descriptionref = useRef();
    const { issellerAuth, setissellerAuth, setsellerredirect, setisProductAdded, backend_url } = useContext(AppContext);
    const [poster, setposter] = useState('');
    const [active, setactive] = useState(0);
    const [error, seterror] = useState(false);
    const [loading, setloading] = useState(true);
    const [isActivated, setisActivated] = useState(true);
    const [seller, setseller] = useState({});
    const [isPopup, setisPopup] = useState(false);
    const [popupMessage, setpopupMessage] = useState('');
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [pictures, setpictures] = useState([]);
    const [files, setfiles] = useState([]);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [cropPopup, setcropPopup] = useState(false);
    const [image, setImage] = useState(null);
    const [discardPopup, setdiscardPopup] = useState(false);
    const [addProductPopup, setaddProductPopup] = useState(false);
    const [productName, setproductName] = useState('');
    const [price, setprice] = useState('');
    const [description, setdescription] = useState('');

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
        fetchProfile();
    };

    //Handle inputs
    const changeproductName = (e) => {
        const value = e.target.value;
        if (/^.{0,70}$/.test(value)) {
            setproductName(value);
        }
        else {
            setpopupMessage("Product name cannot exceed 70 letters!!");
            setisPopup(true);
        };
        const textarea = e.target;
        textarea.style.height = "auto"; // Reset height to auto to calculate the new scrollHeight
        textarea.style.height = `${textarea.scrollHeight + 10}px`;
    };

    const changedescription = (e) => {
        const value = e.target.value;
        if (/^[\s\S]{0,1000}$/.test(value)) {
            setdescription(value);
        }
        else {
            setpopupMessage("Description cannot exceed 1000 letters!!");
            setisPopup(true);
        };
        const textarea = e.target;
        textarea.style.height = "auto"; // Reset height to auto to calculate the new scrollHeight
        textarea.style.height = `${textarea.scrollHeight + 10}px`;
    };

    useEffect(() => {
        if (descriptionref.current) {
            const textarea = descriptionref.current;
            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight + 10}px`;
        };
    }, [description]);

    const changeprice = (e) => {
        const value = e.target.value;
        if (/^(?:[0-9]{0,3}|[1-4][0-9]{3}|5000)$/.test(value)) {
            setprice(value);
        }
        else {
            setpopupMessage("Price cannot exceed Rs.5000!!");
            setisPopup(true);
        };
    };

    //Add image
    const addimage = () => {
        if (pictures.length < 6) {
            if (croppedAreaPixels) {
                const canvas = document.createElement("canvas");
                const img = new Image();
                img.src = image;

                img.onload = () => {
                    // Set canvas dimensions to the cropped area
                    canvas.width = croppedAreaPixels.width;
                    canvas.height = croppedAreaPixels.height;

                    const ctx = canvas.getContext("2d");
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

                    // Convert the cropped canvas to a URL
                    canvas.toBlob((blob) => {
                        const file = new File([blob], `image-${Date.now()}.jpg`, { type: "image/jpeg" });
                        setfiles((prevfiles) => [...prevfiles, file]);

                        const croppedImageUrl = URL.createObjectURL(blob);
                        setpictures((prevPictures) => [...prevPictures, croppedImageUrl]);
                        cropcancel();
                    });
                };
            } else {
                setpopupMessage("Please crop the image before adding!");
                setisPopup(true);
            };
        } else {
            setpopupMessage("Cannot add more than 6 images!");
            setisPopup(true);
            cropcancel();
        };
    };

    //Remove image
    const removeimage = () => {
        setpictures((prevPictures) => prevPictures.slice(0, -1));
        setfiles((prevfiles) => prevfiles.slice(0, -1));
    };

    useEffect(() => {
        if (pictures.length == 1) {
            setposter(pictures[0]);
            setactive(0);
        };
        if (active >= pictures.length) {
            setposter(pictures[pictures.length - 1]);
            setactive(pictures.length - 1);
        };
    }, [pictures, setpictures]);


    //Crop popup
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

    //Handle crop cancel
    const cropcancel = () => {
        if (!loading && issellerAuth) {
            addimageref.current.value = "";
            setImage(null);
            setcropPopup(false);
        };
    };

    //Image viewer
    const handlePosterChange = (image, index) => {
        setposter(image);
        setactive(index);
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

    //Fetch profile details
    const fetchProfile = async () => {
        try {
            setloading(true);
            const response = await fetch(`${backend_url}/api/sellers/fetch-profile`, {
                method: 'POST',
                credentials: 'include',
            });
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
                // console.log(result.data);
            }
            else if (result.status == 468) {
                setpopupMessage(result.message);
                setisPopup(true);
                setisActivated(false);
            }
            else {
                console.log(result);
                seterror(true);
                setpopupMessage(result.message);
                setisPopup(true);
            }
        } catch (error) {
            setpopupMessage(error.message);
            setisPopup(true);
            seterror(true);
            console.log(error);
        } finally {
            setloading(false);
        };
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    //Handle discard
    const handleDiscard = () => {
        navigate('/seller/account/products');
    };

    const cancelDiscard = () => {
        setdiscardPopup(false);
    };

    const discardbuttonclick = (e) => {
        e.stopPropagation();
        setdiscardPopup(true);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                discardbuttonref.current &&
                !discardbuttonref.current.contains(e.target) &&
                discardPopupmenuref.current &&
                !discardPopupmenuref.current.contains(e.target)
            ) {
                setdiscardPopup(false);
            };
        };

        if (discardPopup) {
            document.addEventListener('click', handleClickOutside);
        } else {
            document.removeEventListener('click', handleClickOutside);
        };

        // Cleanup event listener on component unmount
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [discardPopup]);

    //Handle add product
    const addbuttonclick = (e) => {
        e.stopPropagation();
        setaddProductPopup(true);
    };

    const cancelAddProduct = () => {
        setaddProductPopup(false);
    };

    useEffect(() => {
        const handleClickOutside2 = (e) => {
            if (
                addbuttonref.current &&
                !addbuttonref.current.contains(e.target) &&
                addPopupmenuref.current &&
                !addPopupmenuref.current.contains(e.target)
            ) {
                setaddProductPopup(false);
            };
        };

        if (addProductPopup) {
            document.addEventListener('click', handleClickOutside2);
        } else {
            document.removeEventListener('click', handleClickOutside2);
        };

        // Cleanup event listener on component unmount
        return () => {
            document.removeEventListener('click', handleClickOutside2);
        };
    }, [addProductPopup]);

    //Add Product
    const addProduct = async () => {
        if (productName.trim() == '') {
            setpopupMessage("Product name required!!");
            setisPopup(true);
            cancelAddProduct();
        }
        else if (price == "") {
            setpopupMessage("Price required!!");
            setisPopup(true);
            cancelAddProduct();
        }
        else if (description.trim() == "") {
            setpopupMessage("Product description required!!");
            setisPopup(true);
            cancelAddProduct();
        }
        else if (files.length == 0) {
            setpopupMessage("Product images required!!");
            setisPopup(true);
            cancelAddProduct();
        }
        else {
            cancelAddProduct();
            setloading(true);
            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
                formData.append('images', files[i]);
            }
            formData.append("name", productName);
            formData.append("description", description);
            formData.append("price", price);
            try {
                const response = await fetch(`${backend_url}/api/sellers/add-product`, {
                    method: "POST",
                    credentials: 'include',
                    body: formData,
                });
                const result = await response.json();
                if (result.status == 469) {
                    setpopupMessage(result.message);
                    setisPopup(true);
                    // localStorage.clear();
                    setissellerAuth(false);
                }
                else if (result.status == 200) {
                    setpopupMessage("Product added succesfully!");
                    setisPopup(true);
                    setisProductAdded(true);
                    navigate('/seller/account/products');
                }
                else if (result.status == 468) {
                    setpopupMessage(result.message);
                    setisPopup(true);
                    setisActivated(false);
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
                setloading(false);
            };
        };
    };

    return (
        <>
            {isPopup && <Notification message={popupMessage} onexit={exitPopup} />}
            {discardPopup && <div className="fixed top-0 left-0 z-[80] flex justify-center items-center w-screen h-screen">
                <div ref={discardPopupmenuref} className='bg-gradient-to-br mx-2 drop-shadow-lg from-red-400 via-pink-400 to-pink-200 p-2 rounded-3xl'>
                    <div className='flex flex-col bg-white rounded-2xl p-6'>
                        <div className=''>Are you sure you want to discard your progress?</div>
                        <div className='flex justify-end mt-6'>
                            <button onClick={cancelDiscard} className='ml-4 bg-gray-200 duration-300 active:scale-95 px-4 py-2 rounded-xl sm:text-base text-sm hover:bg-gray-300'>Cancel</button>
                            <button onClick={handleDiscard} className='ml-4 bg-red-600 duration-300 active:scale-95 px-4 py-2 rounded-xl sm:text-base text-sm text-white hover:bg-red-700'>Discard</button>
                        </div>
                    </div>
                </div>
            </div>}
            {addProductPopup && <div className="fixed top-0 left-0 z-[80] flex justify-center items-center w-screen h-screen">
                <div ref={addPopupmenuref} className='bg-gradient-to-br mx-2 drop-shadow-lg from-red-400 via-pink-400 to-pink-200 p-2 rounded-3xl'>
                    <div className='flex flex-col bg-white rounded-2xl p-6'>
                        <div className=''>Are you sure you want to add this product?</div>
                        <div className='flex justify-end mt-6'>
                            <button onClick={cancelAddProduct} className='ml-4 bg-gray-200 duration-300 active:scale-95 px-4 py-2 rounded-xl sm:text-base text-sm hover:bg-gray-300'>Cancel</button>
                            <button onClick={addProduct} className='ml-4 bg-green-700 duration-300 active:scale-95 px-4 py-2 rounded-xl sm:text-base text-sm text-white hover:bg-green-800'>Add product</button>
                        </div>
                    </div>
                </div>
            </div>}
            {cropPopup && <div className='fixed backdrop-blur-sm z-[100] flex justify-center items-center w-screen h-screen top-0 right-0'>
                <div className='flex justify-between items-center flex-col w-[40rem] h-[35rem] mx-2 bg-black rounded-2xl relative'>
                    <div className='ml-auto mb-2'>
                        <FontAwesomeIcon onClick={cropcancel} className='m-4 cursor-pointer duration-200 hover:text-red-600 p-2 flex-grow text-white h-6 w-6' icon={faXmark} />
                    </div>
                    <div className='flex flex-col justify-center items-center mb-20'>
                        {/* Display Cropper if an image is selected */}
                        <div className="relative w-[20rem] h-[20rem] ">
                            <Cropper
                                image={image}
                                crop={crop}
                                zoom={zoom}
                                aspect={3 / 4}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                            />
                        </div>
                        <button disabled={loading} onClick={addimage} className="my-3 flex justify-center items-center w-[8rem] py-2 rounded-md bg-green-700 text-white hover:bg-green-800 duration-200" >
                            {(loading) ? <img className='w-5 h-5 invert animate-spin' src="/loading.png" alt="" /> :
                                <div>Add image</div>}
                        </button>
                        <button className="my-1 px-6 py-2 rounded-md bg-red-400 text-white hover:bg-red-600 duration-200 " disabled={loading} onClick={cropcancel}> Cancel</button>
                    </div>
                </div>
            </div>}
            {issellerAuth && isActivated && !loading && !error && <div className={'duration-300 mt-[4rem] sm:mb-0 mb-[4rem] pb-[4rem] flex justify-center md:flex-row flex-col' + ((discardPopup || addProductPopup) ? ' blur-sm ' : ' ')}>
                <div className='sm:m-8 m-4 flex flex-col items-center'>
                    {(pictures.length != 0) && <div className='relative sm:w-[25rem] w-[20rem] mb-4'>
                        {(pictures.length > 1) && <button onClick={() => { prevImage() }} className='absolute top-1/2 left-0 transform -translate-y-1/2'><FontAwesomeIcon className='w-6 h-6 p-2 rounded-full bg-white mx-2 cursor-pointer hover:drop-shadow-lg duration-200 hover:scale-105 active:scale-100' icon={faArrowLeft} /></button>}
                        <div><img className='sm:w-[25rem] w-[20rem] h-[25rem] sm:h-[30rem] object-cover border' src={poster} /></div>
                        {(pictures.length > 1) && <button onClick={() => { nextImage() }} className='absolute top-1/2 right-0 transform -translate-y-1/2'><FontAwesomeIcon className='w-6 h-6 p-2 rounded-full bg-white mx-2 cursor-pointer hover:drop-shadow-lg duration-200 hover:scale-105 active:scale-100' icon={faArrowRight} /></button>}
                    </div>}
                    {(pictures.length == 0) && <div className=''>
                        <label disabled={loading} htmlFor="profileimage" className='mb-4 bg-gradient-to-br from-red-400 via-pink-400 to-pink-200 font-bold text-white flex justify-center items-center text-2xl active:scale-95 cursor-pointer duration-200 sm:w-[25rem] w-[20rem] h-[25rem] sm:h-[30rem] object-cover border' >
                            <div>Add image</div>
                        </label>
                    </div>}
                    <div className='flex flex-wrap justify-center sm:max-w-[25rem] max-w-[20rem]'>
                        {pictures && pictures.map((image, index) => {
                            return <div className={'flex-shrink-0 duration-200 border-2 rounded-md mr-4 mb-4 cursor-pointer overflow-hidden' + (((index) == active) ? ' border-green-700 ' : ' opacity-60 hover:opacity-100 hover:border-green-700')} onClick={() => handlePosterChange(image, index)} key={image}>
                                <img className='w-[3rem] h-[3rem] object-cover' src={image} />
                            </div>
                        })}
                    </div>
                    <div className='sm:w-[25rem] w-[20rem] '>Note - First image will be the cover image of your product.</div>
                    <div className='sm:w-[25rem] w-[20rem] mt-4 flex justify-between flex-wrap'>
                        <input disabled={loading} ref={addimageref} onChange={(e) => { onImageChange(e) }} type='file' accept='image/*' id='profileimage' className='hidden'></input>
                        <label disabled={loading} htmlFor="profileimage" className={' bg-green-700 hover:bg-green-800 ' + ' px-5 text-white  duration-200 active:scale-95 py-3 rounded-xl  cursor-pointer'}>Add image</label>
                        <button onClick={removeimage} className='px-5 hover:bg-gray-100 border duration-200 active:scale-95 py-3 rounded-xl bg-gray-50'>Remove image</button>
                    </div>
                </div>
                <div className='sm:p-8 p-4 md:w-[40rem] md:pt-[5rem]'>
                    <div className='flex items-end'>
                        <textarea type='text' value={productName} onChange={(e) => { changeproductName(e) }} placeholder='Enter product name' className='addProducttextarea sm:text-3xl text-2xl font-bold border outline-none rounded-xl overflow-auto w-full px-1'></textarea>
                    </div>
                    <div className='italic '>Sold by: {seller.brandName}</div>
                    <div className='sm:text-3xl text-2xl my-8'>Rs.<input type='text' value={price} onChange={(e) => { changeprice(e) }} className='w-[10rem] outline-none px-2 border rounded-xl' placeholder='Price' /></div>
                    <div className='font-semibold'>Description:</div>
                    <textarea ref={descriptionref} value={description} onChange={(e) => { changedescription(e) }} placeholder='Enter product description (max 1000 letters)' className='addProducttextarea whitespace-pre-wrap border-2 outline-none w-full h-auto text-wrap border-green-700 rounded-xl p-4'></textarea>
                    <div className='font-semibold'>Listed on: {new Date().getDate()} {new Date().toLocaleString('en-US', { month: 'long' })} {new Date().getFullYear()}</div>
                    <div className='font-semibold mt-8'>Sold by:</div>
                    <div className='border-2 border-green-700 rounded-xl py-4 sm:px-4 px-2 flex items-start'>
                        <div className='flex-shrink-0 rounded-full hover:scale-105 duration-500 overflow-hidden flex justify-center items-center sm:mr-4 mr-2'>
                            <img className='object-cover w-14 h-14' src={seller.profilePicture} alt="" />
                        </div>
                        <div>
                            <div className='text-xl font-bold '>{seller.brandName}</div>
                            <div className='italic'>By: {seller.name}</div>
                            <div className='bg-gray-100 w-fit px-2 rounded-lg my-4'>{`Rating: ${seller.averageRating}/5 `}<FontAwesomeIcon icon={faStar} /></div>
                            <div className='flex items-start '>
                                <FontAwesomeIcon className='mt-1 text-red-600 mr-2' icon={faLocationDot} />
                                <div className='sm:text-base text-sm'>
                                    <div>
                                        {seller.address?.localAddress + ((seller.address?.landmark !== "") ? (', ' + seller.address?.landmark) : "") + ", " + seller.address?.city + ", " + seller.address?.state}
                                    </div>
                                    <div>{'Pin: ' + seller.address?.pincode + ' Phone: ' + seller.address?.contact}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>}
            {issellerAuth && isActivated && !loading && !error && <div className={'h-[4rem] sm:text-base text-sm border-t-2 flex justify-end items-center fixed md:bottom-0 bottom-[4rem] right-0 w-screen bg-white z-[78]' + ((discardPopup) ? ' blur-sm ' : ' ')}>
                <button ref={discardbuttonref} onClick={discardbuttonclick} className='sm:px-5 px-4 py-3 mr-6 hover:bg-gray-100 duration-200 active:scale-95 bg-gray-50 border rounded-xl text-gray-800'>Discard product</button>
                <button ref={addbuttonref} onClick={addbuttonclick} className='sm:px-5 px-4 py-3 sm:mr-16 mr-4 border border-green-700 hover:border-green-800 hover:bg-green-800 duration-200 active:scale-95 bg-green-700 rounded-xl text-white'>Add product</button>
            </div>}
            {!issellerAuth && <div className="py-[4rem] flex justify-center items-center h-screen">
                <div className='backdrop-blur-sm shadow-lg mx-2 text-gray-800 bg-white/50 py-8 px-12 rounded-xl'>
                    <div className='text-2xl text-center my-2'>Please login to continue!</div>
                    <div className='flex justify-center items-center'><button onClick={gotologin} className='hover:scale-105 text-xl backdrop-blur-sm my-2 mx-7 px-4 py-3 rounded-md bg-green-700/60 hover:bg-green-700/80 text-white duration-200'>Log in</button></div>
                </div>
                <div className='-z-10 absolute top-0 overflow-hidden'><img className=' h-screen w-screen object-cover' src="/Flowers1.jpg" alt="" /></div>
            </div>}
            {!isActivated && <div className="py-[4rem] flex justify-center items-center h-screen">
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
                    <div className='text-2xl text-center my-2'>An error occured while loading details!</div>
                    <div className='flex justify-center items-center'><button onClick={handlereload} className='hover:scale-105 text-xl backdrop-blur-sm my-2 mx-7 px-4 py-3 rounded-md bg-green-700/60 hover:bg-green-700/80 text-white duration-200'><FontAwesomeIcon className='mr-2' icon={faRotateRight} />Refresh</button></div>
                </div>
                <div className='-z-10 absolute top-0 overflow-hidden'><img className=' h-screen w-screen object-cover' src="/Flowers3.jpg" alt="" /></div>
            </div>}
        </>
    )
};

export default AddProduct;