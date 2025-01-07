import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../../../../context/context';
//Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateRight, faArrowLeft, faArrowRight, faLocationDot, faStar } from '@fortawesome/free-solid-svg-icons';
//Components
import Notification from '../../../../../components/Notification';

const SellerProductPage = () => {

  const { productId } = useParams();
  const navigate = useNavigate();
  const { issellerAuth, setissellerAuth, setsellerredirect, isProductUpdated, setisProductUpdated, backend_url } = useContext(AppContext);
  const [poster, setposter] = useState('');
  const [active, setactive] = useState(0);
  const [error, seterror] = useState(false);
  const [loading, setloading] = useState(true);
  const [seller, setseller] = useState({});
  const [product, setproduct] = useState({});
  const [isPopup, setisPopup] = useState(false);
  const [popupMessage, setpopupMessage] = useState('');
  const [formattedDate, setformattedDate] = useState('');
  const [isActivated, setisActivated] = useState(true);

  //Handle update product
  const updateProduct = () => {
    navigate(`/seller/account/products/update-product/${productId}`);
  };

  //Handle updated popup
  useEffect(() => {
    if (isProductUpdated) {
      setpopupMessage("Product updated succesfully!");
      setisPopup(true);
      setisProductUpdated(false);
    };
  }, []);

  //Handle date
  const formatDateWithMonthName = (isoDate) => {
    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, '0');
    const monthName = date.toLocaleString('default', { month: 'long' }); // Full month name
    const year = date.getFullYear();
    return `${day} ${monthName} ${year}`; // Format: DD Month YYYY
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
    fetchProduct();
  };

  //Image viewer
  const handlePosterChange = (image, index) => {
    setposter(image);
    setactive(index);
  };

  const nextImage = () => {
    const totalImages = product?.images.length;
    setactive((prev) => {
      const newActive = (prev + 1) % totalImages;
      setposter(product?.images[newActive]);
      return newActive;
    });
  };

  const prevImage = () => {
    const totalImages = product?.images.length;
    setactive((prev) => {
      const newActive = (prev - 1 + totalImages) % totalImages;
      setposter(product?.images[newActive]);
      return newActive;
    });
  };

  //Fetch details
  const fetchProduct = async () => {
    try {
      setloading(true);
      const response = await fetch(`${backend_url}/api/sellers/fetch-productdetails/${productId}`, { method: 'POST' });
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
        // console.log(result);
        setproduct(result.data.product);
        setposter(result.data.product.images[0]);
        setactive(0);
        setformattedDate(formatDateWithMonthName(result.data.product.createdAt));
      }
      else if(result.status == 468){
        setisActivated(false);
        setpopupMessage(result.message);
        setisPopup(true);
      }
      else {
        setpopupMessage(result.message);
        setisPopup(true);
        console.log(result.message);
        seterror(true);
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
    fetchProduct();
  }, []);

  return (
    <>
      {isPopup && <Notification message={popupMessage} onexit={exitPopup} />}
      {issellerAuth && isActivated && !loading && !error && <div className={'duration-300 mt-[4rem] sm:mb-0 mb-[4rem] pb-[4rem] flex justify-center md:flex-row flex-col'}>
        <div className='sm:m-8 m-4 flex flex-col items-center'>
          <div className='relative sm:w-[25rem] w-[20rem] mb-4'>
            {(product.images.length > 1) && <div onClick={() => { prevImage() }} className='absolute top-1/2 left-0 transform -translate-y-1/2'><FontAwesomeIcon className='w-6 h-6 p-2 rounded-full bg-white mx-2 cursor-pointer hover:drop-shadow-lg duration-200 hover:scale-105 active:scale-100' icon={faArrowLeft} /></div>}
            <div><img className='sm:w-[25rem] w-[20rem] h-[25rem] sm:h-[30rem] object-cover border' src={poster} /></div>
            {(product.images.length > 1) && <div onClick={() => { nextImage() }} className='absolute top-1/2 right-0 transform -translate-y-1/2'><FontAwesomeIcon className='w-6 h-6 p-2 rounded-full bg-white mx-2 cursor-pointer hover:drop-shadow-lg duration-200 hover:scale-105 active:scale-100' icon={faArrowRight} /></div>}
          </div>
          <div className='flex flex-wrap sm:max-w-[21.3rem] max-w-[20rem]'>
            {product.images && product.images.map((image, index) => {
              return <div className={'flex-shrink-0 duration-200 border-2 rounded-md mr-4 mb-4 cursor-pointer overflow-hidden' + (((index) == active) ? ' border-green-700 ' : ' opacity-60 hover:opacity-100 hover:border-green-700')} onClick={() => handlePosterChange(image, index)} key={image}>
                <img className='w-[3rem] h-[3rem] object-cover' src={image} />
              </div>
            })}
          </div>
        </div>
        <div className='sm:p-8 p-4 md:w-[40rem] md:pt-[5rem]'>
          <div className='flex items-end'>
            <div className='sm:text-3xl text-2xl font-bold outline-none rounded-xl w-full'>{product.name}</div>
          </div>
          <div className='italic '>Sold by: {seller.brandName}</div>
          {(product.availability == false) && <div className='text-red-600'>(Sold out)</div>}
          <div className='sm:text-3xl text-2xl my-8'>Rs.{product.price}</div>
          {(product.availability == true) && <div className='flex items-center mb-8'>
            <button onClick={updateProduct} className='px-6 active:scale-95 py-3 bg-green-700 hover:bg-white hover:text-black text-white rounded-3xl duration-300 font-bold border-2 border-green-700 mr-2'>Change product details</button>
          </div>}
          <div className='font-semibold'>Description:</div>
          <div className='addProducttextarea whitespace-pre-wrap border-2 outline-none w-full h-auto text-wrap border-green-700 rounded-xl p-4'>{product.description}</div>
          <div className='font-semibold'>Listed on: {formattedDate}</div>
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
          <div className='text-2xl text-center my-2'>An error occured while loading product details!</div>
          <div className='flex justify-center items-center'><button onClick={handlereload} className='hover:scale-105 text-xl backdrop-blur-sm my-2 mx-7 px-4 py-3 rounded-md bg-green-700/60 hover:bg-green-700/80 text-white duration-200'><FontAwesomeIcon className='mr-2' icon={faRotateRight} />Refresh</button></div>
        </div>
        <div className='-z-10 absolute top-0 overflow-hidden'><img className=' h-screen w-screen object-cover' src="/Flowers3.jpg" alt="" /></div>
      </div>}
    </>
  )
};

export default SellerProductPage;