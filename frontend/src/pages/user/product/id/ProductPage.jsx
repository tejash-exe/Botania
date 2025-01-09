import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../../../../context/context';
//Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateRight, faArrowLeft, faArrowRight, faLocationDot, faShoppingCart, faUser, faHeart as solidHeart, faStar } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
//Components
import Notification from '../../../../components/Notification';

const ProductPage = () => {

  const navigate = useNavigate();
  const { productid } = useParams();
  const { isAuth, setisAuth, cart, setcart, wishlist, setwishlist, setredirect, backend_url } = useContext(AppContext);
  const [product, setproduct] = useState();
  const [poster, setposter] = useState('');
  const [active, setactive] = useState(0);
  const [error, seterror] = useState(false);
  const [loading, setloading] = useState(true);
  const [disable, setdisable] = useState(false);
  const [isPopup, setisPopup] = useState(false);
  const [popupMessage, setpopupMessage] = useState('');
  const [formattedDate, setformattedDate] = useState('');

  //Handle login
  const gotoLogin = () => {
    setredirect(window.location.pathname);
    navigate('/user/login-register');
  };

  //Handle reload
  const handlereload = () => {
    seterror(false);
    fetchProduct();
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

  //Fetch product
  const fetchProduct = async () => {
    try {
      setloading(true);
      const response = await fetch(`${backend_url}/api/products/getproduct/${productid}/`, { 
        method: "POST",
        credentials: 'include',
      });
      const data = await response.json();
      // console.log(data);
      if(data.status == 200){
        setproduct(data.data);
        setposter(data.data.images[0]);
        setformattedDate(formatDateWithMonthName(data.data.createdAt));
      }
      else{
        console.log(data);
        setpopupMessage(data.message);
        setisPopup(true);
        seterror(true);
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
    fetchProduct();
  }, [productid]);

  //Handle date
  const formatDateWithMonthName = (isoDate) => {
    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, '0');
    const monthName = date.toLocaleString('default', { month: 'long' }); // Full month name
    const year = date.getFullYear();
    return `${day} ${monthName} ${year}`; // Format: DD Month YYYY
  };

  //Image viewer
  const handlePosterChange = (image, index) => {
    setposter(image);
    setactive(index);
  };

  const nextImage = () => {
    const totalImages = product?.images?.length;
    setactive((prev) => {
      const newActive = (prev + 1) % totalImages;
      setposter(product.images[newActive]);
      return newActive;
    });
  };

  const prevImage = () => {
    const totalImages = product?.images?.length;
    setactive((prev) => {
      const newActive = (prev - 1 + totalImages) % totalImages;
      setposter(product.images[newActive]);
      return newActive;
    });
  };

  //Handle cart
  const handleCart = async () => {
    if (!cart.includes(productid) && disable == false) {
      try {
        setdisable(true);
        const response = await fetch(`${backend_url}/api/users/add-to-cart`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: 'include',
          body: JSON.stringify({
            productId: productid,
          })
        });
        const result = await response.json();
        if (result.status == 200) {
          // console.log(result);
          setcart(result.data.cart);
          setpopupMessage('Product added to your cart!');
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
        setdisable(false);
      };
    }
    else if (cart.includes(productid) && disable == false) {
      try {
        setdisable(true);
        const response = await fetch(`${backend_url}/api/users/remove-from-cart`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: 'include',
          body: JSON.stringify({
            productId: productid,
          })
        });
        const result = await response.json();
        if (result.status == 200) {
          // console.log(result);
          setcart(result.data.cart);
          setpopupMessage('Product removed from your cart!');
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
        setdisable(false);
      };
    };
  };

  //Handle wishlist
  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (wishlist.includes(productid) && disable == false) {
      setdisable(true);
      try {
        const response = await fetch(`${backend_url}/api/users/remove-from-wishlist`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: 'include',
          body: JSON.stringify({
            productId: productid,
          })
        });
        const result = await response.json();
        if (result.status == 200) {
          // console.log(result);
          setwishlist(result.data.wishlist);
          setpopupMessage("Product removed from your wishlist!");
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
          console.log(error);
        };
      } catch (error) {
        setpopupMessage(error.message);
        setisPopup(true);
        console.log(error);
      } finally {
        setdisable(false);
      };
    }
    else if (!wishlist.includes(productid) && disable == false) {
      setdisable(true);
      try {
        const response = await fetch(`${backend_url}/api/users/add-to-wishlist`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: 'include',
          body: JSON.stringify({
            productId: productid,
          })
        });
        const result = await response.json();
        if (result.status == 200) {
          // console.log(result);
          setwishlist(result.data.wishlist);
          setpopupMessage("Product added to your wishlist!");
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
        setdisable(false);
      };
    };
  };

  // Scroll to top whenever the location (page) loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {isPopup && <Notification message={popupMessage} onexit={exitPopup} />}
      {!loading && !error && <div className='mt-[4rem] sm:mb-0 mb-[4rem] flex justify-center md:flex-row flex-col'>
        <div className='sm:m-8 m-4 flex flex-col items-center'>
          <div className='relative sm:w-[25rem] w-[20rem] mb-4'>
            {(product.images?.length > 1) && <button onClick={() => { prevImage() }} className='absolute top-1/2 left-0 transform -translate-y-1/2'><FontAwesomeIcon className='w-6 h-6 p-2 rounded-full bg-white mx-2 cursor-pointer hover:drop-shadow-lg duration-200 hover:scale-105 active:scale-100' icon={faArrowLeft} /></button>}
            <div><img className='sm:w-[25rem] w-[20rem] h-[25rem] sm:h-[30rem] object-cover border' src={poster} /></div>
            {(product.images?.length > 1) && <button onClick={() => { nextImage() }} className='absolute top-1/2 right-0 transform -translate-y-1/2'><FontAwesomeIcon className='w-6 h-6 p-2 rounded-full bg-white mx-2 cursor-pointer hover:drop-shadow-lg duration-200 hover:scale-105 active:scale-100' icon={faArrowRight} /></button>}
          </div>
          <div className='flex flex-wrap justify-center sm:w-[25rem] w-[20rem]'>
            {product?.images && product?.images.map((image, index) => {
              return <div className={'flex-shrink-0 duration-200 border-2 rounded-md mr-4 mb-4 cursor-pointer overflow-hidden' + ((index == active) ? ' border-green-700 ' : ' opacity-60 hover:opacity-100 hover:border-green-700')} onClick={() => handlePosterChange(image, index)} key={image}>
                <img className='w-[3rem] h-[3rem] object-cover' src={image} />
              </div>
            })}
          </div>
        </div>
        <div className='sm:p-8 p-4 md:w-[40rem] md:pt-[5rem]'>
          <div className='sm:text-3xl text-2xl font-bold mr-5'>{product?.name}</div>
          <div className='italic '>Sold by: {product?.soldBy.brandName}</div>
          {(product.availability == false) && <div className='text-red-600'>(Sold out)</div>}
          <div className='sm:text-3xl text-2xl my-8'>Rs.{product?.price}</div>
          {isAuth && !disable && <div className='flex items-center '>
            {(product.availability == true || cart.includes(productid)) && <button onClick={handleCart} className='sm:px-10 px-6 sm:text-base text-sm py-3 rounded-3xl duration-200 font-bold border-2 border-green-700 mr-2'><FontAwesomeIcon className='pr-2' icon={faShoppingCart} />
              {(!cart.includes(productid) ? "ADD TO CART" : "REMOVE FROM CART")}
            </button>}
            {(product.availability == true || wishlist.includes(productid)) && <div onClick={(e) => handleWishlist(e)} className='border-2 sm:text-base text-sm cursor-pointer active:scale-95 duration-200 rounded-full border-green-700 flex justify-center items-center'>
              {(!wishlist.includes(productid)) ? <FontAwesomeIcon className='sm:p-[0.86rem] p-[0.7rem] w-5 h-5' icon={faHeart} /> :
                <FontAwesomeIcon className='sm:p-[0.86rem] p-[0.7rem] w-5 h-5 text-red-600' icon={solidHeart} />}
            </div>}
          </div>}
          {!isAuth && <div className='flex items-center'>
            <button onClick={gotoLogin} className='sm:px-10 flex items-center text-left px-6 py-3 sm:text-base text-sm rounded-3xl duration-200 font-bold border-2 border-green-700 mr-2'>
              <FontAwesomeIcon className='pr-4' icon={faUser} />
              <div>Login to add products in your cart and wishlist</div>
            </button>
          </div>}
          {disable && <div className='flex items-center'>
            {(product.availability == true || cart.includes(productid)) && <button className='sm:px-10 px-6 py-3 text-gray-200 sm:text-base text-sm animate-pulse rounded-3xl duration-200 font-bold border-2 border-gray-200 mr-2'><FontAwesomeIcon className='pr-2' icon={faUser} />
              Add to cart
            </button>}
            {(product.availability == true || wishlist.includes(productid)) && <div className='border-2 cursor-pointer active:scale-95 duration-200 rounded-full border-gray-200 animate-pulse flex justify-center items-center'>
              <FontAwesomeIcon className='sm:p-[0.86rem] p-[0.7rem] w-5 h-5 text-gray-200' icon={solidHeart} />
            </div>}
          </div>}
          <div className='font-semibold mt-8'>Description:</div>
          <div className='border-2 border-green-700 rounded-xl whitespace-pre-wrap p-4'>{product?.description}</div>
          <div className='font-semibold'>Listed on: {formattedDate}</div>
          <div className='font-semibold mt-8'>Sold by:</div>
          <div className='border-2 border-green-700 rounded-xl py-4 sm:px-4 px-2 flex items-start'>
            <div className='flex-shrink-0 rounded-full hover:scale-105 duration-500 overflow-hidden flex justify-center items-center sm:mr-4 mr-2'>
              <img className='object-cover w-14 h-14' src={product?.soldBy.profilePicture} alt="" />
            </div>
            <div>
              <Link to={`/user/seller/${product?.soldBy?._id}`} className='text-xl font-bold hover:underline'>{product?.soldBy?.brandName}</Link>
              <div className='italic'>By: {product?.soldBy?.name}</div>
              <div className='bg-gray-100 w-fit px-2 rounded-lg my-4'>{`Rating: ${product?.soldBy?.averageRating}/5 `}<FontAwesomeIcon icon={faStar} /></div>
              <div className='flex items-start '>
                <FontAwesomeIcon className='mt-1 text-red-600 mr-2' icon={faLocationDot} />
                <div className='sm:text-base text-sm'>
                  <div>
                    {product?.soldBy?.address?.localAddress + ((product?.soldBy?.address?.landmark !== "") ? (', ' + product?.soldBy?.address?.landmark) : "") + ", " + product?.soldBy?.address?.city + ", " + product?.soldBy?.address?.state}
                  </div>
                  <div>{'Pin: ' + product?.soldBy?.address?.pincode + ' Phone: ' + product?.soldBy?.address?.contact}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>}
      {loading && <div className='mt-[4rem] sm:mb-0 mb-[4rem] flex justify-center md:flex-row flex-col'>
        <div className='sm:m-8 m-4 flex flex-col items-center'>
          <div className='relative sm:w-[25rem] w-[20rem] mb-4'>
            <div className='absolute top-1/2 left-0 transform -translate-y-1/2 z-[10]'><FontAwesomeIcon className='text-gray-200 w-6 h-6 p-2 rounded-full bg-white mx-2 cursor-pointer hover:drop-shadow-lg duration-200 hover:scale-105 active:scale-100' icon={faArrowLeft} /></div>
            <div><div className='sm:w-[25rem] w-[20rem] h-[25rem] sm:h-[30rem] bg-gray-200 animate-pulse border'></div></div>
            <div className='absolute top-1/2 right-0 transform -translate-y-1/2 z-[10]'><FontAwesomeIcon className='text-gray-200 w-6 h-6 p-2 rounded-full bg-white mx-2 cursor-pointer hover:drop-shadow-lg duration-200 hover:scale-105 active:scale-100' icon={faArrowRight} /></div>
          </div>
          <div className='flex'>
            <div className={'flex-shrink-0 duration-200 border-2 rounded-md mr-4 cursor-pointer overflow-hidden' + ' border-gray-200 '}><div className='w-[3rem] h-[3rem] bg-gray-200 animate-pulse rounded-md' ></div></div>
          </div>
        </div>
        <div className='sm:p-8 p-4 md:w-[40rem] md:pt-[5rem]'>
          <div className='text-3xl font-bold bg-gray-200 text-gray-200 animate-pulse rounded-lg py-1'>asjdkjdad</div>
          <div className='italic bg-gray-200 text-gray-200 animate-pulse rounded-lg py-1 w-1/3 mt-1'>ndasjdnadknada</div>
          <div className='text-3xl my-8 bg-gray-200 text-gray-200 animate-pulse rounded-lg py-1 w-1/2'>sdadadsd</div>
          <div className='flex items-center mb-8'>
            <button className='px-10 py-3 bg-gray-200 text-gray-200 animate-pulse rounded-3xl duration-200 font-bold border-2 border-gray-200 mr-2'><FontAwesomeIcon className='pr-2' icon={faUser} />
              Add to cart
            </button>
            <div className='border-2 cursor-pointer active:scale-95 duration-200 rounded-full border-gray-200 animate-pulse flex justify-center items-center'>
              <FontAwesomeIcon className='p-[0.86rem] w-5 h-5 text-gray-200' icon={solidHeart} />
            </div>
          </div>
          <div className='font-semibold  bg-gray-200 text-gray-200 animate-pulse rounded-lg py-1 w-fit px-3'>Description:</div>
          <div className='border-2 mt-1 border-gray-200 flex items-center justify-center rounded-xl p-4 text-gray-200 animate-pulse'>
            <div className='bg-gray-200 rounded-lg'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Harum modi consequatur ex eius necessitatibus, aspernatur voluptates velit corrupti dolor, omnis voluptatem deserunt corporis natus dolores sint culpa facere sapiente vero.
              Vero odit error voluptatum veniam omnis voluptatem ut! Vero, reprehenderit veniam? Placeat numquam corrupti provident, fugiat labore cum adipisci ab eum officiis, commodi quia perspiciatis alias quisquam necessitatibus quo et!
              Expedita impedit delectus ea similique mollitia aperiam ratione ipsum illum consectetur eius consequatur fuga sapiente, modi iusto accusantium voluptas magnam cum. Expedita blanditiis, recusandae eos nihil nisi voluptate repudiandae ipsa!
            </div>
          </div>
          <div className='font-semibold mt-8  bg-gray-200 text-gray-200 animate-pulse rounded-lg py-1 w-fit px-3'>Sold by:</div>
          <div className='border-2 border-gray-200 mt-1 animate-pulse rounded-xl p-4 flex items-start'>
            <div className='flex-shrink-0 rounded-full hover:scale-105 duration-500 overflow-hidden flex justify-center items-center mr-4'>
              <div className='bg-gray-200 w-14 h-14'></div>
            </div>
            <div className='flex flex-col flex-shrink'>
              <div className='text-xl w-fit bg-gray-200 text-gray-200 rounded-lg font-bold hover:underline'>sdakldadadds</div>
              <div className='italic w-fit mt-1 bg-gray-200 text-gray-200 rounded-lg'>By: dadadadadad</div>
              <div className='bg-gray-200 w-fit px-2 text-gray-200 rounded-lg my-4'>{`Rating: 3/5★`}</div>
              <div className='text-gray-200 flex flex-shrink flex-wrap text-wrap bg-gray-200 animate-pulse rounded-lg w-full'>
                <div>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas dicta exercitationem aliquid cumque? Saepe vero, sint repellat fugiat ex tempora ad voluptatum facere ab veritatis dignissimos eius commodi quos unde.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>}
      {error && <div className=' flex-1 flex justify-center items-center h-screen'>
        <div className='backdrop-blur-sm mx-2 shadow-lg text-gray-800 bg-white/50 py-8 px-12 rounded-xl'>
          <div className='text-2xl text-center my-2'>An error occured while loading product!</div>
          <div className='flex justify-center items-center'><button onClick={handlereload} className='hover:scale-105 text-xl backdrop-blur-sm my-2 mx-7 px-4 py-3 rounded-md bg-green-700/60 hover:bg-green-700/80 text-white duration-200'><FontAwesomeIcon className='mr-2' icon={faRotateRight} />Refresh</button></div>
        </div>
        <div className='-z-10 absolute top-0 overflow-hidden'><img className=' h-screen w-screen object-cover' src="/Flowers3.jpg" alt="" /></div>
      </div>}
    </>
  )
};

export default ProductPage;