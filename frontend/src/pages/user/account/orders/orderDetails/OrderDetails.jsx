import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../../../../../context/context';
//Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faLocationDot, faMinus, faPlus, faRotateRight, faXmark, faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-regular-svg-icons';
//Components
import Cropper from 'react-easy-crop';
import Notification from '../../../../../components/Notification';

const OrderDetails = () => {

    const { orderId } = useParams();
    const navigate = useNavigate();
    const addimageref = useRef();
    const reviewTextref = useRef();
    const deliveredbuttonref = useRef();
    const deliveredPopupmenuref = useRef();
    const { profilePicture, name, email, isAuth, setisAuth, setredirect, backend_url } = useContext(AppContext);
    const ratingValues = [0, 1, 2, 3, 4];
    const [isPopup, setisPopup] = useState(false);
    const [popupMessage, setpopupMessage] = useState('');
    const [order, setorder] = useState({});
    const [rating, setrating] = useState(-1);
    const [poster, setposter] = useState('');
    const [active, setactive] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [pictures, setpictures] = useState([]);
    const [files, setfiles] = useState([]);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [cropPopup, setcropPopup] = useState(false);
    const [imagePopup, setimagePopup] = useState(false);
    const [image, setImage] = useState(null);
    const [error, seterror] = useState(false);
    const [loading, setloading] = useState(true);
    const [loading2, setloading2] = useState(false);
    const [reviewText, setreviewText] = useState('');
    const [deliveredPopup, setdeliveredPopup] = useState(false);
    const [isReviewed, setisReviewed] = useState(false);
    const [isUpdatereview, setisUpdatereview] = useState(false);
    const [deleted, setdeleted] = useState(0);
    const [date, setdate] = useState('');

    //Handle login
    const gotologin = () => {
        setredirect(window.location.pathname);
        navigate("/user/login-register");
    };

    //Handle reload
    const handlereload = () => {
        fetchDetails();
        seterror(false);
    };

    //Inputs
    const changereviewText = (e) => {
        const value = e.target.value;
        if (/^[\s\S]{0,1000}$/.test(value)) {
            setreviewText(value);
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
        if (reviewTextref.current) {
            const textarea = reviewTextref.current;
            textarea.style.height = "auto"; // Reset height to auto to calculate the new scrollHeight
            textarea.style.height = `${textarea.scrollHeight + 10}px`;
        };
    }, [reviewText, isUpdatereview]);

    const changeRating = (value) => {
        setrating(value);
    };

    //Add image
    const addimage = () => {
        if (pictures.length < 5) {
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
            setpopupMessage("Cannot add more than 5 images!");
            setisPopup(true);
            cropcancel();
        };
    };

    //Remove image
    const removeimage = (picture) => {
        const index = pictures.indexOf(picture);
        if ((index !== -1) && (isReviewed == false)) {
            pictures.splice(index, 1);
            files.splice(index, 1);
        };
        imagecancel();
    };

    //Remove updating image
    const removeupdateimage = () => {
        setpictures((prevPictures) => prevPictures.slice(0, -1));
        if (files.length > 0) {
            setfiles((prevFiles) => prevFiles.slice(0, -1));
        } else {
            setdeleted((prev) => prev + 1);
        };
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
    }, [pictures, setpictures, active]);

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
        if (!loading && isAuth) {
            addimageref.current.value = "";
            setImage(null);
            setcropPopup(false);
        };
    };

    //Image viewer
    const imagecancel = () => {
        setimagePopup(false);
    };

    const openImageViewer = (picture, index) => {
        setposter(picture);
        setactive(index);
        setimagePopup(true);
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

    useEffect(() => {
        if (imagePopup) {
            window.addEventListener('keydown', handleKeyDown);
        };

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [imagePopup]);

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

    //Fetch order details
    const fetchDetails = async () => {
        try {
            setloading(true);
            const response = await fetch(`${backend_url}/api/users/order-details`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include',
                body: JSON.stringify({
                    orderId: orderId,
                })
            });
            const result = await response.json();
            if (result.status == 200) {
                // console.log(result.data);
                setorder(result.data.order);
            }
            else if (result.status == 201) {
                // console.log(result.data);
                setorder(result.data.order);
                setisReviewed(true);
                setreviewText(result.data.review.description);
                setrating(result.data.review.rating - 1);
                setpictures(result.data.review.images);
                setdate(result.data.review.updatedAt);
            }
            else if (result.status == 469) {
                setisAuth(false);
                setpopupMessage(result.message);
                setisPopup(true);
            }
            else {
                setpopupMessage(result.message);
                setisPopup(true);
                seterror(true);
                console.log(result);
            };
        } catch (error) {
            seterror(true);
            setpopupMessage(error.message);
            setisPopup(true);
            console.log(error);
        } finally {
            setloading(false);
        };
    };

    useEffect(() => {
        fetchDetails();
    }, []);

    //Add review
    const addReview = async () => {
        if (reviewText.trim() == '') {
            setpopupMessage("Description required!");
            setisPopup(true);
        }
        else if (rating < 0 || rating > 4) {
            setpopupMessage("Rating must be between 0 and 5!");
            setisPopup(true);
        }
        else if ((rating != 0) && (rating != 1) && (rating != 2) && (rating != 3) && (rating != 4)) {
            setpopupMessage("Rating must be an integer!");
            setisPopup(true);
        }
        else {
            try {
                setloading2(true);
                const formData = new FormData();
                for (let i = 0; i < files.length; i++) {
                    formData.append('images', files[i]);
                }
                formData.append("orderId", orderId);
                formData.append("description", reviewText);
                formData.append("rating", rating + 1);
                const response = await fetch(`${backend_url}/api/users/add-review`, {
                    method: "POST",
                    credentials: 'include',
                    body: formData,
                });
                const result = await response.json();
                if (result.status == 200) {
                    fetchDetails();
                    setpopupMessage("Review added succesfully!");
                    setisPopup(true);
                }
                else if (result.status == 469) {
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
                setloading2(false);
            };
        };
    };

    //update review
    const updateReview = async () => {
        if (reviewText.trim() == '') {
            setpopupMessage("Description required!");
            setisPopup(true);
        }
        else if (rating < 0 || rating > 5) {
            setpopupMessage("Rating must be between 0 and 5!");
            setisPopup(true);
        }
        else if ((rating != 0) && (rating != 1) && (rating != 2) && (rating != 3) && (rating != 4)) {
            setpopupMessage("Rating must be an integer!");
            setisPopup(true);
        }
        else {
            try {
                setloading2(true);
                const formData = new FormData();
                for (let i = 0; i < files.length; i++) {
                    formData.append('images', files[i]);
                }
                formData.append("orderId", orderId);
                formData.append("description", reviewText);
                formData.append("rating", rating + 1);
                formData.append("deleted", deleted.toString());
                const response = await fetch(`${backend_url}/api/users/update-review`, {
                    method: "POST",
                    credentials: 'include',
                    body: formData,
                });
                const result = await response.json();
                if (result.status == 200) {
                    fetchDetails();
                    setisUpdatereview(false);
                    setreviewText("");
                    setpictures([]);
                    setfiles([]);
                    setrating(-1);
                    setpopupMessage("Review updated succesfully!");
                    setisPopup(true);
                }
                else if (result.status == 469) {
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
                setloading2(false);
            };
        };
    };

    //Handle delivered
    const setOrderRecieved = async () => {
        if (order.deliveryStatus == 'Shipped') {
            try {
                setloading(true);
                const response = await fetch(`${backend_url}/api/users/change-delivery-status`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        orderId: orderId,
                    })
                });
                const result = await response.json();
                if (result.status == 200) {
                    setpopupMessage("Order updated succesfully!");
                    setisPopup(true);
                    fetchDetails();
                }
                else if (result.status == 469) {
                    setpopupMessage(result.message);
                    setisPopup(true);
                    setisAuth(false);
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
        }
        else {
            setpopupMessage("You can only change delivery status when your order is shipped!");
            setisPopup(true);
        };
    };

    const handleDelivered = () => {
        setOrderRecieved();
        cancelDelivered();
    };

    const cancelDelivered = () => {
        setdeliveredPopup(false);
    };

    const deliveredbuttonclick = (e) => {
        e.stopPropagation();
        setdeliveredPopup(true);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                deliveredbuttonref.current &&
                !deliveredbuttonref.current.contains(e.target) &&
                deliveredPopupmenuref.current &&
                !deliveredPopupmenuref.current.contains(e.target)
            ) {
                setdeliveredPopup(false);
            };
        };

        if (deliveredPopup) {
            document.addEventListener('click', handleClickOutside);
        } else {
            document.removeEventListener('click', handleClickOutside);
        };

        // Cleanup event listener on component unmount
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [deliveredPopup]);

    return (
        <>
            {isPopup && <Notification message={popupMessage} onexit={exitPopup} />}
            {deliveredPopup && <div className="fixed backdrop-blur-sm top-0 left-0 z-[80] flex justify-center items-center w-screen h-screen">
                <div ref={deliveredPopupmenuref} className='bg-gradient-to-br mx-2 drop-shadow-lg from-red-400 via-pink-400 to-pink-200 p-2 rounded-3xl'>
                    <div className='flex flex-col bg-white rounded-2xl p-6'>
                        <div className=''>Are you sure you want to change the status to Recieved?</div>
                        <div className=''>(you cannot undo your changes)</div>
                        <div className='flex justify-end mt-6'>
                            <button onClick={cancelDelivered} className='ml-4 bg-gray-200 duration-300 active:scale-95 px-4 py-2 rounded-xl sm:text-base text-sm hover:bg-gray-300'>Cancel</button>
                            <button onClick={handleDelivered} className='ml-4 bg-green-700 duration-300 active:scale-95 px-4 py-2 rounded-xl sm:text-base text-sm text-white hover:bg-green-800'>Recieved</button>
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
                        {(!isReviewed) && <button onClick={() => { removeimage(poster) }} className="flex justify-center items-center w-[8rem] py-2 rounded-md bg-green-700 text-white hover:bg-green-800 duration-200" >
                            <div>Remove image</div>
                        </button>}
                        <button className="mb-1 mt-4 px-6 py-2 rounded-md bg-red-400 text-white hover:bg-red-600 duration-200 " disabled={loading} onClick={imagecancel}> Cancel</button>
                    </div>
                </div>
            </div>}
            {isAuth && !loading && !error && <div className='flex-1 flex flex-col items-center overflow-auto'>
                <div className='sm:w-5/6 w-[100%] px-2'>
                    <Link to={`/user/product/id/${order.product?._id}`} className='flex bg-gray-100 rounded-xl mt-4 p-4'>
                        <div className='shrink-0'><img className='w-[6rem] rounded-xl h-[8rem] md:w-[8rem] md:h-[10rem] object-cover' src={order.product?.images[0]} /></div>
                        <div className='ml-4 w-5/6'>
                            <div className='md:mt-4 mt-1 font-bold text-xl'>{order.product?.name}</div>
                            <div className='text-ellipsis overflow-hidden text-nowrap whitespace-nowrap md:w-[300px] sm:w-[250px] w-[180px] text-sm sm:text-base'>{order.product?.description}</div>
                            <div className='sm:mt-2 mt-1 text-sm sm:text-base'>Rs. {order.product?.price}</div>
                            <div className='sm:mt-2 mt-1 text-sm sm:text-base'>Ordered on : {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
                        </div>
                    </Link>
                    <div className='border-2 items-center border-green-700 rounded-xl mt-6 p-4 font-semibold flex justify-between'>
                        {(order.deliveryStatus == "Packing") && <div className='sm:text-xl'>Status : {order.deliveryStatus}</div>}
                        {(order.deliveryStatus == "Shipped") && <div className='sm:text-xl flex flex-wrap'>
                            <div className='mr-2'>Shipped on </div><div>{new Date(order.shippedOn).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
                        </div>}
                        {(order.deliveryStatus == "Delivered") && <div className='sm:text-xl'>
                            <div>Shipped on {new Date(order.shippedOn).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
                            <div>Delivered on {new Date(order.deliveredOn).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
                        </div>}
                        {(order.deliveryStatus == 'Shipped') && <button onClick={(e) => { deliveredbuttonclick(e) }} className='bg-green-700 text-white px-4 py-3 hover:bg-green-800 active:scale-95 duration-300 rounded-xl text-nowrap'>Order recieved</button>}
                    </div>
                    <div className=' text-sm sm:text-base border-2 items-center border-green-700 rounded-xl mt-6 p-4 font-semibold '>
                        <div className=''>Razorpay order ID : {order.razorpay_order_id}</div>
                        <div className=''>Razorpay payment ID : {order.razorpay_payment_id}</div>
                    </div>
                    <div className='bg-gray-100 rounded-xl p-4 mt-6'>
                        <div className='text-xl font-semibold'><FontAwesomeIcon className='text-red-600 pr-2' icon={faLocationDot} />Shipping address</div>
                        <div className='my-2 text-sm sm:text-base'>{order.address?.name}, {order.address?.localAddress}{((order.address?.landmark !== "") ? ', ' : '')}{order.address?.landmark}, {order.address?.city}, {order.address?.state}</div>
                        <div className=' text-sm sm:text-base'>Pin: {order.address?.pincode}, Phone: {order.address?.contact}</div>
                    </div>
                    <div className='text-xl font-semibold mt-6'>Sold by</div>
                    <div className='flex items-start bg-gray-100 rounded-xl sm:px-4 px-2 py-4'>
                        <div className='flex-shrink-0 rounded-full hover:scale-105 duration-500 overflow-hidden flex justify-center items-center sm:mr-4 mr-2'>
                            <img className='object-cover w-14 h-14' src={order.soldBy.profilePicture} alt="" />
                        </div>
                        <div>
                            <Link to={`/user/seller/${order.soldBy?._id}`} className='text-xl font-bold hover:underline'>{order.soldBy?.brandName}</Link>
                            <div className='italic'>By: {order.soldBy?.name}</div>
                            <div className=' w-fit my-4'>{`Rating: ${order.soldBy?.averageRating}/5★`}</div>
                            <div className='flex items-start '>
                                <FontAwesomeIcon className='mt-1 text-red-600 mr-2' icon={faLocationDot} />
                                <div className=' text-sm sm:text-base'>
                                    <div>{order.soldBy?.address?.localAddress + ((order.soldBy?.address?.landmark !== "") ? (', ' + order.soldBy?.address?.landmark) : "") + ", " + order.soldBy?.address?.city + ", " + order.soldBy?.address?.state}</div>
                                    <div>{'Pin: ' + order.soldBy?.address?.pincode + ' Phone: ' + order.soldBy?.address?.contact}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {(order.deliveryStatus !== 'Delivered') && <div className='border border-red-400 bg-red-50 rounded-xl p-4 text-red-700 mt-6 mb-[5rem]'>Cannot add review until product is delivered.</div>}
                    {!isReviewed && (order.deliveryStatus == 'Delivered') && !loading2 && <div className='text-xl font-semibold mt-6'>Add a review</div>}
                    {!isReviewed && (order.deliveryStatus == 'Delivered') && !loading2 && <div className='flex items-start border-2 border-gray-100 rounded-xl sm:px-4 px-2 py-4 mb-2'>
                        <div className='flex-shrink-0 rounded-full hover:scale-105 duration-500 overflow-hidden flex justify-center items-center sm:mr-4 mr-2'>
                            <img className='object-cover w-14 h-14' src={profilePicture} alt="" />
                        </div>
                        <div className='flex-grow'>
                            <div className='text-xl font-bold '>{name}</div>
                            <div className='italic'>{email}</div>
                            <div className='flex mt-2'>
                                {ratingValues && ratingValues.map((value) => {
                                    return <button onClick={() => { changeRating(value) }} key={value} className='mr-2 text-yellow-400'>
                                        {(value <= rating) ? <FontAwesomeIcon icon={solidStar} /> : <FontAwesomeIcon icon={faStar} />}
                                    </button>
                                })}
                            </div>
                            <div className='flex mt-2 flex-wrap'>
                                {pictures && pictures.map((picture, index) => {
                                    return <button key={picture} onClick={() => { openImageViewer(picture, index) }} className='border-2 overflow-hidden w-[3rem] h-[3rem] rounded-md flex justify-center hover:border-green-700 duration-300 items-center opacity-80 hover:opacity-100 mr-2'>
                                        <img className='object-cover' src={picture} />
                                    </button>
                                })}
                                {(pictures.length < 5) && <label disabled={loading} htmlFor="profileimage" className='border-2 cursor-pointer w-[3rem] text-xl text-gray-300 hover:text-gray-400 h-[3rem] rounded-md flex justify-center hover:border-gray-400 duration-300 items-center'><FontAwesomeIcon icon={faPlus} /></label>}
                                <input disabled={loading} ref={addimageref} onChange={(e) => { onImageChange(e) }} type='file' accept='image/*' id='profileimage' className='hidden'></input>
                            </div>
                            <textarea ref={reviewTextref} value={reviewText} onChange={(e) => { changereviewText(e) }} placeholder='Enter product review (max 1000 letters)' className='border-2 outline-none rounded-lg mt-3 px-1 text-sm sm:text-base addProducttextarea w-full'></textarea>
                            <div className='font-semibold'>Reviewed on : {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
                            <button onClick={addReview} className='bg-green-700 duration-300 active:scale-95 text-white px-4 py-3  text-sm sm:text-base rounded-lg mt-2 hover:bg-green-800'>Add review</button>
                        </div>
                    </div>}
                    {isReviewed && !isUpdatereview && (order.deliveryStatus == 'Delivered') && !loading2 && <div className='text-xl font-semibold mt-6'>Your review</div>}
                    {isReviewed && !isUpdatereview && (order.deliveryStatus == 'Delivered') && !loading2 && <div className='flex items-start border-2 border-gray-100 rounded-xl sm:px-4 px-2 py-4 mb-2'>
                        <div className='flex-shrink-0 rounded-full hover:scale-105 duration-500 overflow-hidden flex justify-center items-center sm:mr-4 mr-2'>
                            <img className='object-cover w-14 h-14' src={profilePicture} alt="" />
                        </div>
                        <div className='flex-grow'>
                            <div className='text-xl font-bold '>{name}</div>
                            <div className='italic'>{email}</div>
                            <div className='flex mt-2' title='4/5'>
                                {ratingValues && ratingValues.map((value) => {
                                    return <div key={value} className='mr-2 text-yellow-400'>
                                        {(value <= rating) ? <FontAwesomeIcon icon={solidStar} /> : <FontAwesomeIcon icon={faStar} />}
                                    </div>
                                })}
                            </div>
                            <div className='flex mt-2 flex-wrap'>
                                {pictures && pictures.map((picture, index) => {
                                    return <button key={picture} onClick={() => { openImageViewer(picture, index) }} className='border-2 overflow-hidden w-[3rem] h-[3rem] rounded-md flex justify-center hover:border-green-700 duration-300 items-center opacity-80 hover:opacity-100 mr-2'>
                                        <img className='object-cover' src={picture} />
                                    </button>
                                })}
                            </div>
                            <div className=' text-sm sm:text-base rounded-lg mt-3 whitespace-pre-wrap w-full'>{reviewText}</div>
                            <div className='font-semibold text-sm sm:text-base'>Reviewed on : {new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
                            <button onClick={() => { setisUpdatereview(true) }} className='bg-green-700 duration-300 active:scale-95 text-white px-4 py-3 rounded-lg mt-2 hover:bg-green-800'>Edit review</button>
                        </div>
                    </div>}
                    {isReviewed && isUpdatereview && (order.deliveryStatus == 'Delivered') && !loading2 && <div className='text-xl font-semibold mt-6'>Update review</div>}
                    {isReviewed && isUpdatereview && (order.deliveryStatus == 'Delivered') && !loading2 && <div className='flex items-start border-2 border-gray-100 rounded-xl sm:px-4 px-2 py-4 mb-2'>
                        <div className='flex-shrink-0 rounded-full hover:scale-105 duration-500 overflow-hidden flex justify-center items-center sm:mr-4 mr-2'>
                            <img className='object-cover w-14 h-14' src={profilePicture} alt="" />
                        </div>
                        <div className='flex-grow'>
                            <div className='text-xl font-bold '>{name}</div>
                            <div className='italic'>{email}</div>
                            <div className='flex mt-2'>
                                {ratingValues && ratingValues.map((value) => {
                                    return <button onClick={() => { changeRating(value) }} key={value} className='mr-2 text-yellow-400'>
                                        {(value <= rating) ? <FontAwesomeIcon icon={solidStar} /> : <FontAwesomeIcon icon={faStar} />}
                                    </button>
                                })}
                            </div>
                            <div className='flex mt-2 flex-wrap'>
                                {pictures && pictures.map((picture, index) => {
                                    return <button key={picture} onClick={() => { openImageViewer(picture, index) }} className='border-2 overflow-hidden w-[3rem] h-[3rem] rounded-md flex justify-center hover:border-green-700 duration-300 items-center opacity-80 hover:opacity-100 mr-2'>
                                        <img className='object-cover' src={picture} />
                                    </button>
                                })}
                                {(pictures.length != 0) && <button onClick={removeupdateimage} disabled={loading} className='border-2 cursor-pointer w-[3rem] text-xl text-red-300 hover:text-red-500 h-[3rem] rounded-md flex justify-center hover:border-red-500 border-red-300 mr-2 hover:bg-red-50 duration-300 items-center'><FontAwesomeIcon icon={faMinus} /></button>}
                                {(pictures.length < 5) && <label disabled={loading} htmlFor="profileimage" className='border-2 cursor-pointer w-[3rem] text-xl border-green-700/40 text-green-700/40 hover:text-green-700 h-[3rem] rounded-md flex justify-center hover:border-green-700 hover:bg-green-50 duration-300 items-center'><FontAwesomeIcon icon={faPlus} /></label>}
                                <input disabled={loading} ref={addimageref} onChange={(e) => { onImageChange(e) }} type='file' accept='image/*' id='profileimage' className='hidden'></input>
                            </div>
                            <textarea ref={reviewTextref} value={reviewText} onChange={(e) => { changereviewText(e) }} placeholder='Enter product review (max 1000 letters)' className='border-2 outline-none rounded-lg mt-3 text-sm sm:text-base px-1 whitespace-pre-wrap addProducttextarea w-full'></textarea>
                            <div className='font-semibold text-sm sm:text-base'>Reviewed on : {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
                            <div className='flex'>
                                <button onClick={updateReview} className='bg-green-700 duration-300 active:scale-95 text-white px-4 py-3 rounded-lg mt-2 hover:bg-green-800'>Update review</button>
                                <button onClick={() => { setisUpdatereview(false); }} className=' duration-300 active:scale-95 text-gray-400 px-4 py-3 rounded-lg mt-2 border-2 ml-4'>Cancel</button>
                            </div>
                        </div>
                    </div>}
                    {loading2 && <div className='text-xl font-semibold mt-6'>Your review</div>}
                    {loading2 && <div className='flex items-start border-2 border-gray-100 rounded-xl sm:px-4 px-2 py-4 mb-2'>
                        <div className='flex-shrink-0 rounded-full hover:scale-105 duration-500 overflow-hidden flex justify-center items-center sm:mr-4 mr-2'>
                            <div className='object-cover w-14 h-14 bg-gray-200 animate-pulse' ></div>
                        </div>
                        <div className='flex-grow'>
                            <div className='text-xl font-bold bg-gray-200 text-gray-200 animate-pulse rounded-lg w-fit'>asjdbhadjbshdahb dasdad</div>
                            <div className='italic bg-gray-200 text-gray-200 mt-1 animate-pulse rounded-lg w-fit'>adsjbhadsbh@ahds.com</div>
                            <div className='flex mt-2' title='4/5'>
                                {ratingValues && ratingValues.map((value) => {
                                    return <div key={value} className='mr-2 text-yellow-400'>
                                        {(value <= 5) ? <FontAwesomeIcon icon={solidStar} /> : <FontAwesomeIcon icon={faStar} />}
                                    </div>
                                })}
                            </div>
                            <div className='flex mt-2 flex-wrap'>
                                <button className='border-2 overflow-hidden w-[3rem] h-[3rem] rounded-md flex justify-center hover:border-green-700 duration-300 items-center opacity-80 hover:opacity-100 mr-2 bg-gray-200 animate-pulse'></button>
                                <button className='border-2 overflow-hidden w-[3rem] h-[3rem] rounded-md flex justify-center hover:border-green-700 duration-300 items-center opacity-80 hover:opacity-100 mr-2 bg-gray-200 animate-pulse'></button>
                                <button className='border-2 overflow-hidden w-[3rem] h-[3rem] rounded-md flex justify-center hover:border-green-700 duration-300 items-center opacity-80 hover:opacity-100 mr-2 bg-gray-200 animate-pulse'></button>
                                <button className='border-2 overflow-hidden w-[3rem] h-[3rem] rounded-md flex justify-center hover:border-green-700 duration-300 items-center opacity-80 hover:opacity-100 mr-2 bg-gray-200 animate-pulse'></button>
                                <button className='border-2 overflow-hidden w-[3rem] h-[3rem] rounded-md flex justify-center hover:border-green-700 duration-300 items-center opacity-80 hover:opacity-100 mr-2 bg-gray-200 animate-pulse'></button>
                            </div>
                            <div className=' text-sm sm:text-base mt-3 whitespace-pre-wrap w-full bg-gray-200 animate-pulse text-gray-200 rounded-lg'>HI</div>
                            <div className=' text-sm sm:text-base mt-1 whitespace-pre-wrap w-full bg-gray-200 animate-pulse text-gray-200 rounded-lg'>HI</div>
                            <div className=' text-sm sm:text-base mt-1 whitespace-pre-wrap w-full bg-gray-200 animate-pulse text-gray-200 rounded-lg'>HI</div>
                            <div className='font-semibold text-sm sm:text-base bg-gray-200 animate-pulse text-gray-200 rounded-lg w-fit mt-1'>Reviewed on : 25 december 2002</div>
                            <button className='bg-green-700 duration-300 active:scale-95 animate-pulse px-4 py-3 rounded-lg mt-2 text-green-700'>Edit review</button>
                        </div>
                    </div>}
                </div>
            </div>}
            {loading && <div className='flex-1 flex flex-col items-center overflow-auto'>
                <div className='sm:w-5/6 w-[100%] px-2'>
                    <div className='flex bg-gray-100 rounded-xl mt-4 p-4'>
                        <div className='shrink-0'><div className='w-[6rem] bg-gray-200 animate-pulse rounded-xl h-[8rem] md:w-[8rem] md:h-[10rem] object-cover'></div></div>
                        <div className='ml-4 w-5/6'>
                            <div className='md:mt-4 mt-1 font-bold text-xl bg-gray-200 text-gray-200 rounded-lg w-fit animate-pulse'>bdhajadjb</div>
                            <div className='bg-gray-200 text-gray-200 rounded-lg animate-pulse text-ellipsis overflow-hidden text-nowrap mt-1 whitespace-nowrap md:w-[300px] sm:w-[250px] w-[180px] text-sm sm:text-base'>dsadadadadadsdasda asdsa</div>
                            <div className='sm:mt-2 mt-1 bg-gray-200 text-gray-200 rounded-lg w-fit animate-pulse text-sm sm:text-base'>Rs. dasd</div>
                            <div className='sm:mt-2 mt-1 bg-gray-200 text-gray-200 rounded-lg w-fit animate-pulse text-sm sm:text-base'>Ordered on : 29 december 2342</div>
                        </div>
                    </div>
                    <div className='border-2 items-center border-green-700 rounded-xl mt-6 p-4 font-semibold flex justify-between'>
                        <div className='sm:text-xl bg-gray-200 text-gray-200 rounded-lg w-fit animate-pulse'>Status : dasdadad</div>
                    </div>
                    <div className='border-2  text-sm sm:text-base items-center border-green-700 rounded-xl mt-6 p-4 font-semibold '>
                        <div className='bg-gray-200 text-gray-200 rounded-lg w-fit animate-pulse'>Razorpay order ID : dadasdadadsdd</div>
                        <div className='bg-gray-200 text-gray-200 rounded-lg w-fit animate-pulse mt-1'>Razorpay payment ID : adasddadadaddads</div>
                    </div>
                    <div className='bg-gray-100 rounded-xl p-4 mt-6'>
                        <div className='text-xl font-semibold'><FontAwesomeIcon className='text-red-600 pr-2' icon={faLocationDot} />Shipping address</div>
                        <div className='my-2 bg-gray-200 text-gray-200 rounded-lg animate-pulse text-sm sm:text-base'>dsa</div>
                        <div className='bg-gray-200 text-gray-200 rounded-lg w-fit animate-pulse text-sm sm:text-base'>asdadasdasdnsmdas dasmd anasdn dasndmad</div>
                    </div>
                    <div className='text-xl font-semibold mt-6'>Sold by</div>
                    <div className='flex items-start bg-gray-100 rounded-xl sm:px-4 px-2 py-4 mb-2'>
                        <div className='flex-shrink-0 rounded-full hover:scale-105 duration-500 overflow-hidden flex justify-center items-center sm:mr-4 mr-2'>
                            <div className='object-cover w-14 h-14 bg-gray-200 text-gray-200 rounded-lg animate-pulse'></div>
                        </div>
                        <div>
                            <div className='text-xl font-bold bg-gray-200 text-gray-200 rounded-lg w-fit animate-pulse '>sjkdank</div>
                            <div className='italic bg-gray-200 text-gray-200 rounded-lg w-fit mt-1 animate-pulse'>By: dasadasdad</div>
                            <div className=' w-fit my-4 bg-gray-200 text-gray-200 rounded-lg animate-pulse'>{`Rating: 1/5★`}</div>
                            <div className='flex items-start '>
                                <FontAwesomeIcon className='mt-1 text-red-600 mr-2' icon={faLocationDot} />
                                <div className=' text-sm sm:text-base'>
                                    <div className='bg-gray-200 text-gray-200 rounded-lg animate-pulse'> dagjkl asjdakd akd askjd djkad ad aj</div>
                                    <div className='bg-gray-200 text-gray-200 rounded-lg mt-1 animate-pulse'>sakd daks kajd jsdakjd ad j </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='text-xl font-semibold mt-6'>Your review</div>
                    <div className='flex items-start border-2 border-gray-100 rounded-xl sm:px-4 px-2 py-4 mb-2'>
                        <div className='flex-shrink-0 rounded-full hover:scale-105 duration-500 overflow-hidden flex justify-center items-center sm:mr-4 mr-2'>
                            <div className='object-cover w-14 h-14 bg-gray-200 animate-pulse' ></div>
                        </div>
                        <div className='flex-grow'>
                            <div className='text-xl font-bold bg-gray-200 text-gray-200 animate-pulse rounded-lg w-fit'>asjdbhadjbshdahb dasdad</div>
                            <div className='italic bg-gray-200 text-gray-200 mt-1 animate-pulse rounded-lg w-fit'>adsjbhadsbh@ahds.com</div>
                            <div className='flex mt-2' title='4/5'>
                                {ratingValues && ratingValues.map((value) => {
                                    return <div key={value} className='mr-2 text-yellow-400'>
                                        {(value <= 5) ? <FontAwesomeIcon icon={solidStar} /> : <FontAwesomeIcon icon={faStar} />}
                                    </div>
                                })}
                            </div>
                            <div className='flex mt-2 flex-wrap'>
                                <button className='border-2 overflow-hidden w-[3rem] h-[3rem] rounded-md flex justify-center hover:border-green-700 duration-300 items-center opacity-80 hover:opacity-100 mr-2 bg-gray-200 animate-pulse'></button>
                                <button className='border-2 overflow-hidden w-[3rem] h-[3rem] rounded-md flex justify-center hover:border-green-700 duration-300 items-center opacity-80 hover:opacity-100 mr-2 bg-gray-200 animate-pulse'></button>
                                <button className='border-2 overflow-hidden w-[3rem] h-[3rem] rounded-md flex justify-center hover:border-green-700 duration-300 items-center opacity-80 hover:opacity-100 mr-2 bg-gray-200 animate-pulse'></button>
                                <button className='border-2 overflow-hidden w-[3rem] h-[3rem] rounded-md flex justify-center hover:border-green-700 duration-300 items-center opacity-80 hover:opacity-100 mr-2 bg-gray-200 animate-pulse'></button>
                                <button className='border-2 overflow-hidden w-[3rem] h-[3rem] rounded-md flex justify-center hover:border-green-700 duration-300 items-center opacity-80 hover:opacity-100 mr-2 bg-gray-200 animate-pulse'></button>
                            </div>
                            <div className=' text-sm sm:text-base mt-3 whitespace-pre-wrap w-full bg-gray-200 animate-pulse text-gray-200 rounded-lg'>HI</div>
                            <div className=' text-sm sm:text-base mt-1 whitespace-pre-wrap w-full bg-gray-200 animate-pulse text-gray-200 rounded-lg'>HI</div>
                            <div className=' text-sm sm:text-base mt-1 whitespace-pre-wrap w-full bg-gray-200 animate-pulse text-gray-200 rounded-lg'>HI</div>
                            <div className='font-semibold text-sm sm:text-base bg-gray-200 animate-pulse text-gray-200 rounded-lg w-fit mt-1'>Reviewed on : 25 december 2002</div>
                            <button className='bg-green-700 duration-300 active:scale-95 animate-pulse px-4 py-3 rounded-lg mt-2 text-green-700'>Edit review</button>
                        </div>
                    </div>
                </div>
            </div>}
            {error && <div className='flex-1 flex justify-center items-center h-full'>
                <div className='backdrop-blur-sm mx-2 shadow-lg text-gray-800 bg-white/50 py-8 px-12 rounded-xl'>
                    <div className='text-2xl text-center my-2'>An error occured while loading order details!</div>
                    <div className='flex justify-center items-center'><button onClick={handlereload} className='hover:scale-105 text-xl backdrop-blur-sm my-2 mx-7 px-4 py-3 rounded-md bg-green-700/60 hover:bg-green-700/80 text-white duration-200'><FontAwesomeIcon className='mr-2' icon={faRotateRight} />Refresh</button></div>
                </div>
                <div className='-z-10 absolute top-0 overflow-hidden'><img className=' h-screen w-screen object-cover' src="/Flowers3.jpg" alt="" /></div>
            </div>}
            {!isAuth && <div className='flex-1 flex justify-center items-center h-full'>
                <div className='backdrop-blur-sm mx-2 shadow-lg text-gray-800 bg-white/50 py-8 px-12 rounded-xl'>
                    <div className='text-2xl text-center my-2'>Please login to continue!</div>
                    <div className='flex justify-center items-center'><button onClick={gotologin} className='hover:scale-105 text-xl backdrop-blur-sm my-2 mx-7 px-4 py-3 rounded-md bg-green-700/60 hover:bg-green-700/80 text-white duration-200'>Log in</button></div>
                </div>
                <div className='-z-10 absolute top-0 overflow-hidden'><img className=' h-screen w-screen object-cover' src="/Flowers1.jpg" alt="" /></div>
            </div>}
        </>
    )
};

export default OrderDetails;